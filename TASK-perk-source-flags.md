# TASK: Perk source flagging — let users report bad URLs and stale perks

> Add a per-perk "report a problem" affordance to the inline ⓘ source link. Users open a small popover, pick a reason (link broken / info outdated / perk removed / other), optionally add a note, and submit. Flags persist per (user, card, perk) in `perks_source_flags`. CLI scripts list and resolve open flags. No public flag count yet.

## Context

`TASK-per-perk-source-urls` shipped a one-way trust signal: the ⓘ link on every perk row points at the canonical citation. The `cards:check-sources` validator catches HTTP failures proactively. What it can't catch is the case where the URL still returns 200 but the page no longer matches what we say — issuer rewrites the perk, drops the credit, changes the cap. Users are the highest-fidelity detector for that drift.

This TASK adds the user side of the loop. Anyone holding the card and clicking ⓘ can flag the source; we (the team) triage via CLI and fix the markdown. No admin UI — CLI is enough until volume justifies one.

Flags also seed the system that eventually displays "verified May 2026 / re-verified by N users since" trust signals, but that public surface is out of v1 scope.

## Requirements

### 1. Migration `db/migrations/0008_perk_source_flags.sql`

```sql
-- 0008_perk_source_flags.sql
-- User reports for bad perk source URLs and stale perks.
-- Composite key (user_id, card_id, perk_name) — one open flag per
-- user per perk; refiling overwrites the previous reason/note.
-- The `perks_source_flags_open_idx` partial index supports the most
-- common query: "list open flags for this card / for this perk."

create type perk_flag_reason as enum (
  'link_broken',
  'info_outdated',
  'perk_removed',
  'other'
);

create table perks_source_flags (
  user_id uuid not null references perks_users(id) on delete cascade,
  card_id text not null,
  perk_kind text not null check (perk_kind in ('annual_credit', 'ongoing_perk')),
  perk_name text not null,
  reason perk_flag_reason not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolution_note text,
  primary key (user_id, card_id, perk_name)
);

create index perks_source_flags_open_idx
  on perks_source_flags(card_id, perk_name)
  where resolved_at is null;

create trigger trg_perks_source_flags_updated
  before update on perks_source_flags
  for each row execute function set_updated_at();
```

`set_updated_at()` is reused from earlier migrations.

### 2. Loader and types in `lib/profile/server.ts`

```ts
export type PerkFlagReason =
  | "link_broken"
  | "info_outdated"
  | "perk_removed"
  | "other";

export interface PerkFlag {
  card_id: string;
  perk_kind: "annual_credit" | "ongoing_perk";
  perk_name: string;
  reason: PerkFlagReason;
  note: string | null;
  created_at: string; // ISO
  resolved_at: string | null;
}

export const getPerkFlagsForCard = cache(
  async (
    userId: string,
    cardId: string,
  ): Promise<{ myFlags: Map<string, PerkFlag>; openFlagCounts: Map<string, number> }> => { ... }
);
```

`myFlags` keyed by `perk_name` — lets the popover render the user's existing flag immediately. `openFlagCounts` keyed by `perk_name` — used internally for analytics; not surfaced in v1 UI but already plumbed for future use.

Soft-fail on missing table the same way `getProgramCppOverrides` does (`isUndefinedTableError` → empty maps).

### 3. Server actions in `lib/profile/actions.ts`

```ts
export async function flagPerkSource(input: {
  cardId: string;
  perkKind: "annual_credit" | "ongoing_perk";
  perkName: string;
  reason: PerkFlagReason;
  note?: string;
}): Promise<UpdateResult>

export async function unflagPerkSource(
  cardId: string,
  perkName: string,
): Promise<UpdateResult>
```

`flag` UPSERTs on `(user_id, card_id, perk_name)`. Server validates: reason must be in the enum; when reason is `"other"`, note must be non-empty (≥ 3 chars after trim). When the user re-flags an already-resolved perk, `resolved_at` clears (the new flag is open).

`unflag` DELETEs the user's row. The flag history is intentionally not preserved — if the user changes their mind, we want a clean slate.

Both `revalidatePath("/wallet/cards/[id]", "page")` so the Card Hero re-renders with the updated `myFlags` map.

Soft-fail on missing table.

### 4. Stateful `PerkSourceLink` component

Extract the inline ⓘ from `MoneyFindRow.tsx` into `components/wallet-v2/PerkSourceLink.tsx`. The new component manages popover state and the flag form locally.

Three states:

**A. Closed.** Just the ⓘ icon (matches today). Click opens the popover.

**B. Popover with link + report button.**

```
┌──────────────────────────────────┐
│  Source                           │
│  Citi Strata Premier card page →  │  → opens URL in new tab
│  Verified May 2026                │
│  ────────                         │
│  ⚑ Report a problem               │  → switches to state C
└──────────────────────────────────┘
```

When the user already has a flag on this perk, replace the "Report" button with:

```
│  ⚑ You flagged this — undo        │
```

clicking which calls `unflagPerkSource` and collapses the popover.

**C. Form.**

```
┌──────────────────────────────────┐
│  What's wrong?                    │
│  ○ Link doesn't work              │
│  ○ Page says something different  │
│  ○ Perk no longer offered         │
│  ○ Something else                 │
│  ┌──────────────────────────┐     │
│  │ Optional details…         │    │
│  └──────────────────────────┘     │
│  [ Submit ]   [ Cancel ]          │
└──────────────────────────────────┘
```

Behavior:
- Default reason: `info_outdated` (the most common case in practice).
- "Something else" promotes the note field to required (client-side validation; submit button disabled until ≥ 3 chars).
- On submit, calls `flagPerkSource`, then collapses to state B with the user's flag visible.
- Cancel returns to state B.
- The link in state B still navigates to the URL on click. Reporting is the secondary action.

Closing behavior:
- Click anywhere outside the popover → close.
- Press Escape → close.
- Click the ⓘ again → toggle close.

Accessibility:
- Popover is a `<div role="dialog" aria-modal="false">`.
- Focus moves to the first interactive element on open.
- Escape closes.
- Trigger button has `aria-expanded`.

Props:

```ts
interface Props {
  source: PerkSource;
  cardId: string;
  perkKind: "annual_credit" | "ongoing_perk";
  perkName: string;
  myFlag: PerkFlag | null;
  /** Optional. UI hides report option when not authenticated. */
  /** isLoggedIn is implicit on /wallet/cards/[id] (auth gate) so we can */
  /** assume true; kept as an explicit prop in case the component is */
  /** reused elsewhere later. */
  isLoggedIn?: boolean;
}
```

### 5. Wire `MoneyFindRow` to the new component

`MoneyFindRow` accepts `source`, `cardId`, `perkKind`, `perkName`, `myFlag`. Renders `<PerkSourceLink ... />` when `source` is set. The card hero builds a `myFlags: Map<perkName, PerkFlag>` once and passes via `playSourceMap`'s sibling.

Two new fields needed at the row level: `perkKind` and `perkName`. Derive them in `buildPlaySourceMap` (we already walk the catalog there) and return a richer shape:

```ts
export interface ResolvedSource {
  source: PerkSource;
  perkKind: "annual_credit" | "ongoing_perk";
  perkName: string;
}
export function buildPlaySourceMap(card: Card): Map<string, ResolvedSource>
```

`MoneyFindRow` then has everything to identify the perk on a flag action.

### 6. Page wire-up

In `app/(app)/wallet/cards/[id]/page.tsx`:
- Call `getPerkFlagsForCard(userId, id)` alongside the existing loaders.
- Serialize `myFlags` via `Object.fromEntries(...)`.
- Pass to `CardHero` as a new optional prop `perkFlags?: Record<string, PerkFlag>`.
- `CardHero` reconstructs the Map and threads to `CatalogGroup` → `MoneyFindRow` next to the source map.

### 7. CLI scripts

`scripts/flags-list.ts` — `npm run flags:list`. Reads from the database, walks open flags, prints grouped output:

```
[flags] 4 open across 2 cards

citi_strata_premier
  [info_outdated] Trip Delay Protection — 3 open
    ↳ 2026-05-12 user_abc: "page says max claim is $250 not $500"
    ↳ 2026-05-14 user_xyz: (no note)
    ↳ 2026-05-15 user_def: "couldn't find this on the page"
  [link_broken] Citi Concierge — 1 open
    ↳ 2026-05-15 user_ghi: "404"

amex_gold
  [perk_removed] $10 Uber Cash — 1 open
    ↳ 2026-05-13 user_jkl: "Amex removed this in 2026"
```

User ids printed as a short anonymized prefix (`user_abc` = first 8 chars of the UUID). No emails or names.

Exit 0 always — informational tool.

`scripts/flags-resolve.ts` — `npm run flags:resolve -- --card <id> --perk "<name>" [--user <id>] [--note "..."]`. Marks one or more flags resolved.

Without `--user`, resolves every open flag matching `(card_id, perk_name)` (the typical case after the team fixes the markdown). With `--user`, resolves only that user's flag (rare, used for false-positive triage).

`--note` populates `resolution_note`. Optional but recommended.

Confirms before running:

```
[flags] resolve all 3 open flags on citi_strata_premier → "Trip Delay Protection"?
        resolution_note: "Updated max claim to $500 in markdown"
        proceed? [y/N]
```

### 8. CSS in `app/wallet-edit-v2.css`

Popover positioning, form styles, button styles. Popover is absolutely positioned beneath the ⓘ, anchored on click. Mobile: full-width sheet at the bottom of the viewport.

## Implementation Notes

- **Soft-fail patterns** mirror `perks_user_signals` and `perks_point_value_overrides` exactly.
- **`isUndefinedTableError`** import already in `lib/profile/server.ts`.
- **No engine changes.** Flag data never enters the recommendation engine. UI/admin-only.
- **No card markdown changes.** Adding flag support doesn't touch the catalog.
- **Existing `cards:check-sources` validator** is untouched. It writes its own report to `data/source-validation.json`; flags live in Postgres. We can collapse them into a single admin view later but keep the storage separate for now.
- **Popover library** — none. Roll a small custom popover with `useRef` + outside-click handler. Adding a dependency for one component is overkill.
- **Authorization** — actions check `getCurrentUser()`. Anonymous → `not_authenticated`. The card detail page is behind the `(app)/layout.tsx` auth gate already, so the action is only callable from logged-in sessions.

## Do Not Change

- `lib/engine/*` — no engine read of flag data.
- `cards/*.md` — schema is unchanged.
- `scripts/check-sources.ts` — existing validator stays.
- `data/source-validation.json` — generated file; flags live in Postgres.
- The `Source` schema on credits/perks — unchanged.
- `CurrencyPanel`, `CardHero` header, `FeederPairBlock`, `ValueThesisHero` — out of scope.
- Existing migrations 0001–0007 — append only.

## Acceptance Criteria

- [ ] `npm run typecheck`, `npm run lint`, `npm test` all pass.
- [ ] On `/wallet/cards/citi_strata_premier`, clicking ⓘ on any perk row opens a popover with the link + "Report a problem" button.
- [ ] Submitting a flag persists across reload — the popover shows "You flagged this — undo" on the next visit.
- [ ] "Undo" removes the flag and restores the "Report a problem" button.
- [ ] The popover closes on Escape, on outside click, and on a second ⓘ click.
- [ ] Selecting "Something else" disables submit until the note has ≥ 3 characters.
- [ ] `npm run flags:list` prints all open flags grouped by card → perk with reason and age.
- [ ] `npm run flags:resolve -- --card citi_strata_premier --perk "Trip Delay Protection" --note "fixed"` resolves every open flag on that perk.
- [ ] `git diff` is scoped to: the new migration, `lib/profile/server.ts`, `lib/profile/actions.ts`, `components/wallet-v2/PerkSourceLink.tsx` (new), `components/wallet-v2/MoneyFindRow.tsx`, `components/wallet-v2/CatalogGroup.tsx`, `components/wallet-v2/CardHero.tsx`, `components/wallet-v2/perkSource.ts`, `app/(app)/wallet/cards/[id]/page.tsx`, `app/wallet-edit-v2.css`, `scripts/flags-list.ts` (new), `scripts/flags-resolve.ts` (new), `package.json`.

## Verification

1. Apply migration `0008_perk_source_flags.sql` to dev DB.
2. `npm run cards:build`, `npm run typecheck`, `npm run lint`, `npm test` — all green.
3. In dev app, walk through the popover flows on Strata Premier — submit → reload → undo → submit again with a different reason.
4. From a second user account, flag the same perk; `npm run flags:list` shows both.
5. `npm run flags:resolve -- --card citi_strata_premier --perk "Trip Delay Protection"` clears both. `npm run flags:list` shows zero open.
6. `git diff --stat` matches scope.
