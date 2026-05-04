# TASK: User signals table + dual-write (Phase 3 of signal-first architecture)

> Create `perks_user_signals`, dual-write from the existing play-state writer, backfill from existing `user_card_play_state` rows. No engine wiring, no UI changes.

## Context

Phase 1 shipped the catalog. Phase 2 made plays declare `reveals_signals` / `requires_signals`. Phase 3 is the persistence layer that turns those declarations into actual user data.

Today, `MoneyFindRow.tsx` "Got it" / "On my list" / "Not for me" clicks call `updateCardPlayState` (`lib/profile/actions.ts`), which writes one row to `user_card_play_state` keyed by `(user_id, card_id, play_id)`. That row is per-card-per-play and is read only by the per-card hero page for chip styling — the recommender and `computeFoundMoneyV2` ignore it (Phase 4 fixes that).

Phase 3 introduces a parallel `perks_user_signals` table keyed by `(user_id, signal_id)`. Same click writes both — `updateCardPlayState` continues to fire for the per-card chip state, AND `updateUserSignalsForPlay` fires to translate the click into global signal facts via the play's `reveals_signals`. Dual-writing through Phase 4 lets the engine continue running on the legacy data while we validate the new path.

Phase 4 will be the cutover: `computeCardValue` reads `perks_user_signals` instead of `user_card_play_state`. After that, `user_card_play_state` shrinks to its actual job — per-card calendar facts (`claimed_at` for this year's hotel credit) — and the state field gets deprecated.

Three design decisions Angel signed off on (recap):
- Table prefix is `perks_*` (per CLAUDE.md convention; the legacy `user_card_play_state` is unprefixed because the wallet_v2 migration didn't follow the rule. Phase 3 follows it.)
- `signal_state` is a separate Postgres enum (`confirmed` / `interested` / `dismissed`), distinct from the existing `play_state` enum.
- "Latest click wins" — when two plays both reveal the same signal and the user clicks one then the other, the most recent state replaces the earlier one. No ladder logic in Phase 3.

## Requirements

1. **SQL migration `db/migrations/0006_user_signals.sql`** — creates `signal_state` enum and `perks_user_signals` table per the schema below. Idempotent (re-runs cleanly).

2. **Server action `updateUserSignalsForPlay(cardId, playId, status)`** in `lib/profile/actions.ts`:
   - `status` is the existing UI tristate (`"using"` | `"going_to"` | `"skip"` | `"unset"`)
   - Loads the card from `loadCardDatabase()`, finds the play, reads `reveals_signals`
   - For each signal in `reveals_signals`:
     - If `status === "unset"`: DELETE the `(user_id, signal_id)` row (toggle-off semantics)
     - Else: UPSERT with translated state (`using` → `confirmed`, `going_to` → `interested`, `skip` → `dismissed`), tagging `source_card_id` + `source_play_id` for traceability
   - Returns `UpdateResult` matching the existing convention. Tolerates `isUndefinedTableError` the same way `updateCardPlayState` does.

3. **Wire it alongside `updateCardPlayState`** at every call site. Currently one site: wherever `MoneyFindRow.tsx` `onMark` flows into a server action (find via grep). Both writes happen in sequence; if one fails the other still attempts; both errors surface to the caller.

4. **Backfill script `scripts/backfill-user-signals.ts`** — walks all existing `user_card_play_state` rows (state in `('got_it','want_it','skip')`), looks up each play's `reveals_signals` from the compiled card database, and inserts the corresponding `perks_user_signals` rows. Idempotent; safe to re-run. Reports counts (rows scanned, signals written, plays skipped because they no longer exist or have empty `reveals_signals`).

5. **Read helper `getUserSignals(userId): Promise<Map<string, SignalState>>`** in `lib/profile/server.ts`. Cached via `React.cache` per request (same pattern as `getCurrentProfile`). No engine call sites yet — Phase 4 will use it. Phase 3 ships the helper so Phase 4 can wire in one focused change.

## Implementation Notes

**SQL migration** — `db/migrations/0006_user_signals.sql`:

```sql
-- 0006_user_signals.sql
-- Phase 3 of signal-first architecture. Global per-user signal table:
-- one row per (user, signal) regardless of which card revealed it. Phase
-- 1 catalog (signals/*.md) defines the valid signal_id values; the build
-- script enforces references at compile time, so we don't add a foreign
-- key here (signals are static markdown, not a DB table).
--
-- Dual-write target through Phase 4: writes happen alongside
-- user_card_play_state. After Phase 4 cutover, user_card_play_state
-- keeps claimed_at / notes for per-card calendar facts only; the state
-- field becomes deprecated.

create type signal_state as enum ('confirmed', 'interested', 'dismissed');

create table perks_user_signals (
  user_id uuid not null references perks_users(id) on delete cascade,
  signal_id text not null,
  state signal_state not null,
  -- Traceability: which card+play caused the most recent write. Helps
  -- explain "where did this fact come from?" in the future signals
  -- dashboard. Both nullable to leave room for non-play sources later
  -- (auto-confirmed holdings, system-derived intents from trips_planned).
  source_card_id text,
  source_play_id text,
  recorded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, signal_id)
);

create index perks_user_signals_user_idx
  on perks_user_signals(user_id);

create trigger trg_perks_user_signals_updated
  before update on perks_user_signals
  for each row execute function set_updated_at();
```

The `set_updated_at()` trigger function already exists from earlier migrations — verify before adding `or replace`.

**State translation** — UI status to `signal_state`:

```ts
const UI_TO_SIGNAL_STATE: Record<FindStatus, SignalState | null> = {
  using:    "confirmed",
  going_to: "interested",
  skip:     "dismissed",
  unset:    null,  // delete row
};
```

`FindStatus` comes from `lib/engine/moneyFind.ts:24`; `SignalState` is the new TS type derived from the enum.

**Server action skeleton** — `lib/profile/actions.ts`:

```ts
export async function updateUserSignalsForPlay(
  cardId: string,
  playId: string,
  status: FindStatus,
): Promise<UpdateResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const db = loadCardDatabase();
  const card = db.cardById.get(cardId);
  if (!card) return { ok: false, error: "unknown_card" };
  const play = (card.card_plays ?? []).find((p) => p.id === playId);
  if (!play) return { ok: false, error: "unknown_play" };

  if (play.reveals_signals.length === 0) return { ok: true }; // no-op

  const targetState = UI_TO_SIGNAL_STATE[status];

  try {
    if (targetState === null) {
      await sql`
        delete from perks_user_signals
        where user_id = ${user.id} and signal_id in ${sql(play.reveals_signals)}
      `;
    } else {
      for (const sig of play.reveals_signals) {
        await sql`
          insert into perks_user_signals (
            user_id, signal_id, state, source_card_id, source_play_id
          ) values (
            ${user.id}, ${sig}, ${targetState}::signal_state, ${cardId}, ${playId}
          )
          on conflict (user_id, signal_id) do update set
            state = excluded.state,
            source_card_id = excluded.source_card_id,
            source_play_id = excluded.source_play_id,
            updated_at = now()
        `;
      }
    }
    return { ok: true };
  } catch (e) {
    if (isUndefinedTableError(e)) {
      // Migration 0006 not applied — same tolerance pattern as
      // updateCardPlayState. UI still works via the legacy table.
      console.warn("[profile:update_user_signals] table missing — skipping persist");
      return { ok: true };
    }
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}
```

**Wire point.** Find `updateCardPlayState` callers via grep. The site that flows from `MoneyFindRow.tsx` `onMark` is the one to dual-write. Pattern:

```ts
// before
await updateCardPlayState(cardId, playId, { state: ..., ... });

// after
await Promise.all([
  updateCardPlayState(cardId, playId, { state: ..., ... }),
  updateUserSignalsForPlay(cardId, playId, uiStatus),
]);
```

`Promise.all` so both writes run concurrently and a failure in one doesn't silently swallow the other. Surface both errors if both fail.

**Backfill script** — `scripts/backfill-user-signals.ts`:

```ts
// Pseudocode
import { loadCardDatabase } from "@/lib/data/loader";
import { getMigrationDb } from "./lib/db-migrate-conn";

const db = loadCardDatabase();
const sql = getMigrationDb();

// Per-play reveals lookup
const reveals = new Map<string, string[]>(); // key: `${cardId}:${playId}`
for (const card of db.cards) {
  for (const play of card.card_plays ?? []) {
    reveals.set(`${card.id}:${play.id}`, play.reveals_signals);
  }
}

const STATUS_MAP = { got_it: "confirmed", want_it: "interested", skip: "dismissed" };

const rows = await sql`
  select user_id, card_id, play_id, state, updated_at
  from user_card_play_state
  where state in ('got_it', 'want_it', 'skip')
`;

let written = 0, skipped = 0, missingPlay = 0;
for (const row of rows) {
  const sigs = reveals.get(`${row.card_id}:${row.play_id}`);
  if (!sigs) { missingPlay++; continue; }
  if (sigs.length === 0) { skipped++; continue; }
  const state = STATUS_MAP[row.state as keyof typeof STATUS_MAP];
  for (const sig of sigs) {
    await sql`
      insert into perks_user_signals (user_id, signal_id, state, source_card_id, source_play_id, recorded_at, updated_at)
      values (${row.user_id}, ${sig}, ${state}::signal_state, ${row.card_id}, ${row.play_id}, ${row.updated_at}, ${row.updated_at})
      on conflict (user_id, signal_id) do update set
        -- Backfill discipline: if a row already exists, prefer the more recent updated_at.
        -- Don't downgrade confirmed → interested; let upserts of equal-or-newer state win.
        state = case
          when excluded.updated_at >= perks_user_signals.updated_at then excluded.state
          else perks_user_signals.state
        end,
        updated_at = greatest(excluded.updated_at, perks_user_signals.updated_at)
    `;
    written++;
  }
}

console.log(`Backfill: ${written} signal rows written, ${skipped} plays with empty reveals_signals, ${missingPlay} plays no longer exist in catalog.`);
await sql.end();
```

Add `"backfill:user-signals": "tsx scripts/backfill-user-signals.ts"` to `package.json` scripts.

**Read helper** — `lib/profile/server.ts`:

```ts
import { cache } from "react";

export type SignalState = "confirmed" | "interested" | "dismissed";

export const getUserSignals = cache(async (userId: string): Promise<Map<string, SignalState>> => {
  try {
    const rows = await sql<{ signal_id: string; state: SignalState }[]>`
      select signal_id, state from perks_user_signals where user_id = ${userId}
    `;
    return new Map(rows.map((r) => [r.signal_id, r.state]));
  } catch (e) {
    if (isUndefinedTableError(e)) return new Map();
    throw e;
  }
});
```

Phase 4 will call this from the engine. Phase 3 ships it but doesn't wire it.

**State conflicts.** Latest write wins. If user clicks "Got it" on play A (which reveals `claims.dining_credit.standard`) and later "Not for me" on play B (which also reveals `claims.dining_credit.standard`), the second click overwrites — signal becomes `dismissed`. This is intentional for Phase 3 simplicity. Phase 4 will discuss whether to add a ladder (confirmed > interested > dismissed) once we have real usage data.

## Do Not Change

- `lib/engine/*` — no engine wiring this phase. Phase 4 reads `perks_user_signals`. Today's `computeFoundMoneyV2` and `scoreCard` continue running on the legacy data path.
- `signals/*.md` — Phase 1 catalog. Phase 3 doesn't add or modify signals.
- `cards/*.md` — Phase 2 added the `reveals_signals` data. Phase 3 only reads them.
- `user_card_play_state` table — keep writing to it. Don't migrate or alter the schema. Phase 4 will deprecate the `state` column after the engine cuts over.
- The legacy `requires_signal_id` field inside `value_model.fixed_credit` — leave as-is.
- `components/wallet-v2/MoneyFindRow.tsx` — the chip UI is unchanged. The dual-write happens in the server action layer, not in the component.
- `lib/auth/*`, session/cookie code — orthogonal.
- `scripts/build-card-db.ts`, `lib/data/loader.ts`, `scripts/lib/schemas.ts` — Phase 1 + 2 territory. Phase 3 reads what they expose.
- `data/*.json` — derived. Don't edit.

## Acceptance Criteria

- [ ] `db/migrations/0006_user_signals.sql` exists; `npm run db:migrate -- --status` lists it; `npm run db:migrate` applies cleanly
- [ ] `\d perks_user_signals` in psql shows the table with the columns and types specified
- [ ] `\dT signal_state` shows the enum with the three values
- [ ] `npm run typecheck` clean — `updateUserSignalsForPlay`, `getUserSignals`, `SignalState` all typed
- [ ] `npm run build` passes
- [ ] `npm test` green (existing 95 tests still pass; engine ignores the new table)
- [ ] Manual: in the running app, click "Got it" on Strata Premier's `hyatt_park_tokyo` play. Confirm three rows appear in `perks_user_signals` (`transfers.to_hyatt`, `intents.aspires_japan`, `intents.aspires_premium_hotel`), all with state `confirmed`, `source_card_id = "citi_strata_premier"`, `source_play_id = "hyatt_park_tokyo"`.
- [ ] Manual: click "On my list" on the same play. Same three rows now have state `interested`.
- [ ] Manual: click the "Got it" chip again to toggle off (status returns to `unset`). The three rows are DELETED.
- [ ] Manual: click "Got it" on `hotel_credit_100` (reveals `claims.hotel_credit.portal`). One row inserted. Click "Not for me" on the same play — same row's state flips to `dismissed`.
- [ ] Backfill: with the dev DB containing existing `user_card_play_state` rows, run `npm run backfill:user-signals`. Verify the report counts are sensible. Re-run; verify it's idempotent (no duplicates, no errors).
- [ ] Negative test: temporarily comment out the `isUndefinedTableError` handler, drop `perks_user_signals`, click a chip in the app — the action returns an error rather than silently swallowing. Restore.
- [ ] `git diff --stat` touches only: `db/migrations/0006_user_signals.sql`, `lib/profile/actions.ts`, `lib/profile/server.ts`, `scripts/backfill-user-signals.ts`, `package.json`, plus the file containing the dual-wire (probably a server action elsewhere — name it in the PR).

## Verification

1. `npm run db:migrate -- --status` — `[ ] 0006_user_signals.sql` listed pending
2. `npm run db:migrate` — applies, exits 0
3. `npm run db:migrate -- --status` — now `[x] 0006_user_signals.sql`
4. `npm run typecheck && npm run build && npm test` — all green
5. Walk through the manual chip-click scenarios listed in acceptance criteria, querying `perks_user_signals` after each click via `psql $DATABASE_URL -c "select * from perks_user_signals where user_id = '<uuid>' order by signal_id"`
6. Run `npm run backfill:user-signals` against the dev DB, eyeball the row counts, confirm the second run is a no-op
7. Verify `getUserSignals(userId)` works in isolation: write a one-off `tsx -e` snippet that calls it and prints the Map size

## Handoff back to Cowork

PR description should cover:
- Where the dual-write call site lives (which file, which server action)
- The backfill script's actual report numbers from the dev DB run
- Any unexpected friction with the postgres-js `IN (...)` syntax in the delete branch (some versions need `${sql(arr)}` vs `IN ${sql(arr)}` — confirm what worked)
- A short note on whether the `react.cache` wrapper on `getUserSignals` plays nice with the existing `getCurrentProfile` cache

Phase 4 (engine reads signals — `computeCardValue` rewrite + recommender signal-awareness) is the next TASK and the largest of the series. After Phase 3 lands, ping Cowork to spec it.
