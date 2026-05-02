# TASK: Cutover — `perks_profiles.cards_held` JSONB → relational `user_cards`

> Phase the user's wallet from a JSONB column to relational rows without breaking any existing code path. Three steps: dual-write the new relational table alongside the existing JSONB, backfill historical rows, flip the read source. The JSONB column stays in place as a safety net for one release after flip.

## Context

`perks_profiles.cards_held` is a JSONB array of `{card_id, opened_at, bonus_received}` objects. Today, every read path goes through `getCurrentProfile()` in `lib/profile/server.ts` and every write goes through `updateProfile()` in `lib/profile/actions.ts`. The shape has worked, but it can't represent closed cards (the schema TASK introduces `user_card_status: held | closed_in_past_year | closed_long_ago`), it can't be queried efficiently for cross-user analytics, and the rules engine TASK assumes relational `user_cards` for its loader.

`TASK-db-schema-foundation` migration `0003_init_user_state.sql` creates `user_cards` and explicitly notes: "profiles.cards_held (jsonb) is preserved as-is and remains the source of truth for user-held cards until a separate migration ports it into user_cards. New code should write to BOTH during the transition; the eventual TASK 'data-migrate-profiles-to-relational' will flip the source of truth."

This is that TASK.

The DB is Neon, single tenant, no RLS. Per `CLAUDE.md`, queries are scoped server-side via the cookie session. The relational table follows the same pattern: every query is `WHERE user_id = $current_user_id`.

## Requirements

1. **Dual-write phase.**
   - Modify `lib/profile/actions.ts` `updateProfile()` so that whenever `partial.cards_held` is provided:
     - Write the JSONB column as it does today (keep working).
     - Also reconcile `user_cards` rows for the same user: delete-then-insert all current `cards_held` entries as `status='held'` rows in one transaction.
     - Both writes happen inside one DB transaction. If the relational write fails, the JSONB write is rolled back too.
   - Add a new server action `updateUserCard({ card_id, status, opened_at, closed_at, bonus_received })` for granular updates that the new UI flows can call directly. This action ONLY writes to `user_cards`, not to JSONB — once the cutover flips, JSONB stops getting updated for new actions.
   - Add a feature flag env `CARDS_HELD_DUAL_WRITE=on|off` (default `on`). When `off`, the JSONB write is skipped and only `user_cards` is updated. This lets us toggle behavior per environment without redeploying.

2. **Backfill script.**
   - Create `scripts/backfill-user-cards-from-jsonb.ts`. Reads every row from `perks_profiles`. For each row, decomposes `cards_held` JSONB into one `user_cards` row per array entry, all at `status='held'`.
   - Idempotent: per-user, a `DELETE FROM user_cards WHERE user_id = $1 AND status='held'` followed by inserts inside a single transaction. Closed-status rows (added by the new action) are untouched.
   - Reports: prints `(users_processed, total_held_rows_inserted, conflicts)` to stdout and to `scripts/backfill-user-cards.report.md`. A "conflict" is any case where the JSONB entry references a `card_id` that doesn't exist in `cards` — those entries are skipped and listed in the report.
   - Runs against `DATABASE_URL` using the existing `lib/db.ts` postgres-js client. No new connection setup.
   - Add `npm run db:backfill-user-cards` to `package.json`.

3. **Verification step (must run before flipping reads).**
   - Create `scripts/verify-cards-held-parity.ts`. For every user, compares `cards_held` JSONB against the user's `user_cards` rows where `status='held'`. Asserts: same `card_id` set, same `opened_at`, same `bonus_received`. Any mismatch is reported with the user_id and the diff.
   - Exit code 0 only if zero mismatches across all users. Non-zero on any drift.
   - Add `npm run db:verify-user-cards` to `package.json`.
   - Production rollout gate: this script runs in CI on every deploy during the dual-write phase. If it ever exits non-zero, the deploy halts.

4. **Read flip.**
   - After `db:verify-user-cards` exits 0 in production for at least 3 consecutive days, switch `lib/profile/server.ts` `getCurrentProfile()`:
     - Replaces the `cards_held` field on the returned object by querying `user_cards` for `status='held'` rows.
     - Maps each row back to the `WalletCardHeld` shape the engine expects: `{card_id, opened_at, bonus_received}`. Status enum is dropped at the boundary — the existing engine only knows about held cards.
     - Adds a new `getCurrentUserCards()` function that returns the full relational shape including `closed_at` and `status`, for the new UI flows that need it (e.g., a "previously held" history view).
   - Change is gated by `CARDS_HELD_READ_SOURCE=jsonb|relational` (default `jsonb` until flipped). Same gate pattern as the dual-write flag.

5. **Engine and consumers stay shape-stable.**
   - `lib/engine/types.ts` `WalletCardHeld` is unchanged. The boundary at `getCurrentProfile()` is where the relational rows get mapped to the shape the engine consumes.
   - `lib/rules/load.ts` (from `TASK-rules-engine-server`) reads `user_cards` directly, not via `getCurrentProfile()`. That's the one place the new richer shape (`status`, `closed_at`) is meaningful.

6. **Tests.**
   - `tests/profile/dual-write.test.ts` — fixture test against `pg-mem` (or a test container). Insert a profile with three cards via `updateProfile`. Assert: JSONB column has three entries; `user_cards` has three `status='held'` rows. Mutate one card. Assert both stay in sync.
   - `tests/scripts/backfill-user-cards.test.ts` — seed three users with various JSONB shapes (one empty, one with 5 cards, one with a card_id that doesn't exist in `cards`). Run the backfill. Assert: empty user has 0 rows; 5-card user has 5 rows; the bad card_id is in the conflict report and not inserted.
   - `tests/scripts/verify-parity.test.ts` — seed a user where the JSONB and `user_cards` agree → exit 0. Seed a user where `bonus_received` differs → exit non-zero with the expected diff message.

## Implementation Notes

### Why dual-write instead of one-shot

The one-shot approach is tempting (single deploy: backfill + flip reads + drop JSONB). It's also the approach that takes the site down when it goes wrong. Dual-write gives:
- Time to verify the relational table is correct (the verify script runs continuously during the dual-write phase).
- Free rollback: if the relational path is broken, set `CARDS_HELD_READ_SOURCE=jsonb` and the site is back. JSONB has stayed current the whole time.
- Independent timing of backfill vs flip — backfill is one-time, flip is a config change.

### Status mapping during backfill

Today's `cards_held` JSONB has no concept of closed cards. Every entry maps to `status='held'`. The new closed-card paths (when a user marks a card as closed in the UI) write directly to `user_cards` via `updateUserCard()` and never touch JSONB. So the JSONB column will diverge from `user_cards` over time once `closed_in_past_year` rows start landing — that's intentional and is the reason the `verify` script only checks the held subset.

### Transaction shape for dual-write

```
BEGIN;
  UPDATE perks_profiles SET cards_held = $1, updated_at = now() WHERE user_id = $u;
  DELETE FROM user_cards WHERE user_id = $u AND status = 'held';
  INSERT INTO user_cards (user_id, card_id, status, opened_at, bonus_received)
    SELECT $u, x.card_id, 'held', x.opened_at, x.bonus_received
      FROM jsonb_to_recordset($1::jsonb) AS x(card_id text, opened_at date, bonus_received boolean);
COMMIT;
```

`jsonb_to_recordset` is the cleanest way to do this in one statement. Postgres-js handles the parameterization; no string concat.

### What happens if a `card_id` in JSONB doesn't exist in `cards`

This is surprisingly common — the JSONB has accumulated cards over months, some of which (e.g., discontinued products) may have been removed from the catalog by the migration TASK. Three options:
1. FK to `cards.id` strictly, fail backfill on missing references.
2. FK with `ON DELETE SET NULL`, allow orphan-card history.
3. No FK; trust application validation.

Recommendation: **option 1** with a clear error path. Missing card_ids are a data-quality problem worth surfacing, not silencing. The backfill report lists them; the editorial pass adds the missing card to `cards` (perhaps `closed_to_new_apps=true`) or removes the entry from the user's wallet. Don't let bad data leak into the relational layer.

### `bonus_received` column

The existing `WalletCardHeld` carries `bonus_received: boolean`. The schema TASK's `user_cards` should have this column — confirm in `0003_init_user_state.sql` before coding. If it's missing, this is a fix-the-schema-first issue, not a workaround-in-app.

### `opened_at` precision

JSONB stores `opened_at` as `"YYYY-MM-DD"`. `user_cards.opened_at` should be `DATE` (not `TIMESTAMPTZ`) — date-precision is the natural unit for "when did you open this card." The eligibility evaluator does month-arithmetic; sub-day precision adds nothing.

### Don't drop the JSONB column in this TASK

After the read flip lands and runs cleanly for one release cycle (~2 weeks), a follow-on TASK can `ALTER TABLE perks_profiles DROP COLUMN cards_held`. Out of scope here. Cleanup is its own decision.

## Do Not Change

- `perks_profiles` schema: keep `cards_held` JSONB as-is. The other JSONB columns (`spend_profile`, `brands_used`, `trips_planned`, `preferences`) are not touched by this TASK — different cutovers, different tradeoffs.
- `lib/engine/**` — engine doesn't see relational rows. The mapping happens at the profile boundary.
- `lib/auth/**`, `lib/db.ts`, `middleware.ts` — auth is settled.
- `cards/*.md`, `data/*.json`, `scripts/build-card-db.ts` — card source-of-truth flow is unrelated to user state.
- `TASK-db-schema-foundation` migrations — applied as-is; this TASK reads `user_cards` as-built.
- The recommendation panel UI surface — closed-card history is a future UI; this TASK only wires the write path for it.

## Acceptance Criteria

- [ ] `lib/profile/actions.ts` dual-writes when `CARDS_HELD_DUAL_WRITE=on`. Setting it `off` skips the JSONB write.
- [ ] `updateUserCard()` server action exists and writes only to `user_cards`.
- [ ] `npm run db:backfill-user-cards` runs against a populated DB and produces the report. Re-running is a no-op for users with no JSONB changes.
- [ ] `npm run db:verify-user-cards` exits 0 against a freshly-backfilled DB with dual-write on.
- [ ] After 1 minute of activity exercising `updateProfile()` on a few users, `db:verify-user-cards` still exits 0.
- [ ] Setting `CARDS_HELD_READ_SOURCE=relational` and reloading the rec page produces identical eligibility verdicts and recommendations to `=jsonb`. The shape returned by `getCurrentProfile()` is identical between modes.
- [ ] All three test files pass.
- [ ] `npm run typecheck && npm run build && npm run test` all pass.
- [ ] `git diff --stat` shows changes only in: `lib/profile/server.ts`, `lib/profile/actions.ts`, `scripts/backfill-user-cards-from-jsonb.ts`, `scripts/verify-cards-held-parity.ts`, `tests/profile/`, `tests/scripts/`, `package.json`, optionally `package-lock.json`.

## Verification

1. Local DB with three test users: one with empty JSONB, one with 3 cards in JSONB, one with 5 cards in JSONB and one bad card_id.
2. `npm run db:backfill-user-cards` — confirm report shows `users_processed: 3, total_held_rows_inserted: 8, conflicts: 1` and the bad card_id is named.
3. `psql`: `SELECT user_id, count(*) FROM user_cards GROUP BY user_id;` — confirms 0, 3, 5 (the bad row is not counted).
4. `npm run db:verify-user-cards` — exit code 0, no diff output.
5. As one of the test users in the running app, add a card via the existing UI. Confirm both `perks_profiles.cards_held` and `user_cards` reflect the new card.
6. Set `CARDS_HELD_DUAL_WRITE=off`, restart, add another card. Confirm only `user_cards` was updated; JSONB stayed flat.
7. `npm run db:verify-user-cards` — now exits non-zero (intentional drift), with the diff naming the user and the missing card from JSONB. Re-enable dual-write, sync up the row manually, re-verify → 0.
8. Set `CARDS_HELD_READ_SOURCE=relational`. Reload the rec page. Verdicts and recommendations match what they showed under `=jsonb`. Toggle back, confirm no observable difference.
9. With dual-write off and read source on `relational`, mark a card as closed in the new UI flow (when present). Confirm `user_cards.status='closed_in_past_year'` and `closed_at` populated; rec page no longer shows the card as held; eligibility verdicts shift accordingly.

If any user shows a parity mismatch that isn't explained by the dual-write-off branch, halt and surface the specific user_id and diff before declaring complete.
