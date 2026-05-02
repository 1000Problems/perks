# TASK: Data migration — cards/*.md → Postgres catalog

> Parse the 241 markdown source files, transform the embedded JSON blocks into the new normalized schema, and insert into the catalog tables created by `TASK-db-schema-foundation`. Idempotent, re-runnable, with a written report of what landed and what didn't.

## Context

`cards/{card_id}.md` is the human-edited source of truth — 241 files as of writing, 136 of which compile into `data/*.json` cleanly today (per `data/manifest.json`). The remaining ~105 either fail Zod validation in `scripts/build-card-db.ts` or aren't fully authored. The existing pipeline writes JSON; this TASK writes Postgres rows against the schema from `TASK-db-schema-foundation`.

The shape mismatch is real. The old `CardSchema` in `scripts/lib/schemas.ts` carries roughly 25 fields per card; the new schema (per the soul doc and the schema TASK) splits those across `cards`, `card_earning`, `card_signup_bonuses`, `card_annual_credits`, `card_program_access`, `card_co_brand_perks`, `card_insurance`, `card_absent_perks`. Most of the new fields (`ease_score`, `realistic_redemption_pct`, structured insurance, transfer-partner sweet spots, network-inherited resolution, absent-perk explanations) aren't in the markdown at all yet. Migration NULLs them; enrichment is a separate editorial pass.

**Order of operations matters.** Catalog tables have FKs: cards → issuers, networks, programs (currency_earned). The markdown blocks are denormalized — every co-brand card duplicates the program row. The script has to dedupe to single rows in `issuers`, `networks`, `programs`, `transfer_partners` before card rows can land.

## Requirements

1. Create `scripts/migrate-cards-to-db.ts` that:
   - Globs `cards/*.md` and parses each file's six JSON blocks using the existing Zod schemas from `scripts/lib/schemas.ts`.
   - Builds an in-memory plan: a deduped set of `issuers`, `networks`, `programs`, `transfer_partners` rows; then per-card a flattened set of inserts across the eight `card_*` child tables.
   - Inserts in dependency order inside one transaction per card. Cards that fail validation or violate a CHECK constraint are caught, logged, and skipped — they do NOT abort the run.
   - Writes a summary report to `scripts/migrate-cards-to-db.report.md` listing: counts inserted/updated/skipped per table, the full list of skipped cards with the failure reason, and a diff against the previous run (if one exists).

2. Idempotent. Re-running the script against the same DB:
   - Updates rows where the markdown changed (matched by primary key — `cards.id` = the slug).
   - Leaves untouched rows alone (no UPDATE if the JSONB content hash matches).
   - Never duplicates child rows. Each `card_earning` / `card_annual_credits` / etc. is a full replace per card: delete-then-insert inside the per-card transaction.

3. Issuer / network / program seed step:
   - Build an `issuers` row for every unique `issuer` string across the corpus. Slug it (e.g., "Bank of America" → `bank_of_america`).
   - Same for `networks` (Visa Signature, Visa Infinite, World Elite Mastercard, Amex Proprietary, Discover, etc.).
   - Same for `programs` — but here, prefer the canonical entry from the anchor card per `scripts/build-card-db.ts`'s existing anchor semantics. If two cards declare the same `program.id` with different fields, the anchor wins and the diff goes to the report's "conflicts" section.

4. Transfer partners:
   - The current markdown stores transfer partners inside `program.transfer_partners[]` as a JSON array. Migrate them to rows in `transfer_partners` (deduped by partner slug) and rows in `program_transfer_partners` (the join with ratio + sweet_spots).
   - `sweet_spots` in the current shape is `{description, value_estimate_usd, source}`. Map to the new `sweet_spots` lookup table: insert one row per unique description; reference by ID from `program_transfer_partners.sweet_spots[]` (text array) or a junction table per the schema TASK's final shape — confirm against `0001_init_catalog.sql` before coding.

5. Card-level fields that don't have a target column yet (because enrichment hasn't happened):
   - `ease_score`, `realistic_redemption_pct` — NULL on insert.
   - Insurance specifics — NULL/absent rows in `card_insurance`.
   - `card_absent_perks` — populate ONLY where the markdown explicitly says "no transfer partners," "no FX fee," etc.; otherwise leave empty (absence-by-omission, not absence-by-claim).
   - `card_co_brand_perks` — populate from the `co_brand_partner` field if present; otherwise empty.
   - Network resolution — leave to the engine; this script does not denormalize network defaults onto the card row.

6. Broken-card handling:
   - Run a pre-flight pass that calls `CardSchema.safeParse` on every markdown's `cards.json entry` block. The ~105 that fail get listed in the report under "Skipped — schema validation failed" with the Zod error path.
   - For each skipped card, the script also checks whether the file exists but contains no JSON blocks (drafted but empty) vs. malformed JSON — distinguished in the report so the editorial fix list is actionable.
   - Skipped cards are NOT inserted as stubs. The catalog stays clean; fixing the markdown is the path to landing them.

7. Add three npm scripts to `package.json`:
   - `db:migrate-cards` — runs the migration against `DATABASE_URL` (or whichever env var the catalog DB uses; see "DB connection" below).
   - `db:migrate-cards:dry-run` — same but rolls back the outer transaction; used in CI to catch shape drift.
   - `db:migrate-cards:report` — re-prints the last report without re-running.

8. A small Vitest test in `tests/scripts/migrate-cards-to-db.test.ts` that:
   - Spins up a temp Postgres (via `pg-mem` or a docker test container — pick whichever the project already has; if neither, `pg-mem` is lighter).
   - Runs the migration against three fixture markdown files representing the three card archetypes (transferable Amex, Chase co-brand, no-AF Visa Signature).
   - Asserts the resulting rows match expected snapshots in `tests/scripts/__fixtures__/expected/*.json`.
   - Re-runs the migration and asserts no change to row counts, no duplicates.

## Implementation Notes

### DB connection

Neon Postgres, single DB for catalog and user state. Connection via `DATABASE_URL` using the existing `lib/db.ts` postgres-js client — same client the rest of the app uses. No service-role keys, no RLS. Queries are scoped at the application layer per `CLAUDE.md`.

Reuse the existing `lib/db.ts` exported `sql` template tag. The migration runs with the same privileges the app runs with — there's no separate "admin" connection, and there doesn't need to be. If a constraint trips, the per-card transaction rolls back and the failure goes in the report.

Don't introduce a second postgres client (`pg`, `Pool`, etc.). Don't ship a `.env.local` with `DATABASE_URL` filled in — env var name only.

### Slug generation

Issuers, networks, programs need slugs. Use the existing convention in markdown (`amazon_prime_visa`, `chase_ur`) — lowercase, underscore-separated, ASCII-only. For new derivations, write a tiny `slugify()` in `scripts/lib/slugify.ts` and import. Test cases: `"Bank of America"` → `bank_of_america`, `"Visa Signature"` → `visa_signature`, `"World Elite Mastercard"` → `world_elite_mastercard`, `"Membership Rewards"` → `membership_rewards`.

### Anchor card resolution

The existing compiler at `scripts/build-card-db.ts` already implements anchor semantics (the first card to declare a `program` becomes the canonical source; subsequent cards' `program` blocks are checked for consistency). Reuse that logic — extract it to `scripts/lib/anchor.ts` if it isn't already a separate module, then import from both the JSON compiler and the DB migration. Don't fork.

### Conflict policy

When two cards disagree on a `program` row's fields:
- Same `id`, different `fixed_redemption_cpp` → log a conflict, use the anchor's value.
- Same `id`, different `transfer_partners[]` → union the partners (a card declaring a partner is evidence the partner exists; a card omitting one isn't evidence of absence).
- Same `partner_id`, different `ratio` across cards → conflict; anchor wins; report.

These rules need to match the existing `build-card-db.ts` compiler's behavior so the JSON output and the Postgres rows agree until the JSON path is retired.

### Audit columns

Every catalog table has the audit columns from the schema TASK (`data_freshness`, `last_verified`, `sources`, `created_at`, `updated_at`). Populate from the markdown:
- `data_freshness` ← markdown's `data_freshness:` frontmatter line
- `sources` ← the `sources` array from the JSON block, as JSONB
- `last_verified` ← `data_freshness` if present, else `CURRENT_DATE`
- Timestamps ← let the DB defaults handle them

### Scale and time

241 cards × ~10 child-table inserts each ≈ 2,400 inserts plus deduped seed rows. With per-card transactions and a single connection, end-to-end runtime should be under 30 seconds against a local DB. Don't bother with batched COPY; the readability of per-card transactions is worth more than the speed.

## Do Not Change

- `cards/*.md` — read-only here. If the script reveals a card has bad data, the fix is to edit the markdown, not the script's tolerance.
- `scripts/build-card-db.ts` — keep the JSON compilation path working until the cutover TASK retires it. This TASK adds a sibling, doesn't replace.
- `scripts/lib/schemas.ts` — Zod schemas stay. The migration USES them for validation; it doesn't redefine them.
- `data/*.json`, `data/manifest.json`, `data/RESEARCH_NOTES.md` — the JSON output path is preserved.
- `lib/data/loader.ts` — engine still loads from JSON until the loader switch TASK lands.
- `lib/engine/**` — engine is unchanged by this TASK.
- The Neon migrations directory (wherever `TASK-db-schema-foundation` finalized — likely `db/migrations/` or similar). This TASK assumes those have already applied; it does not add or alter DDL.
- `package.json` runtime dependencies — only devDeps may be added (postgres-js if not present, pg-mem for tests).

## Acceptance Criteria

- [ ] `npm run db:migrate-cards:dry-run` against a fresh DB exits 0 with a report listing every successfully-validated card under "would insert" and every broken card under "skipped".
- [ ] `npm run db:migrate-cards` against the same fresh DB lands the rows; the report's counts match what `SELECT count(*)` returns for each table.
- [ ] Re-running `npm run db:migrate-cards` immediately after produces a report with `inserted: 0, updated: 0, skipped: <same>`. No duplicates created.
- [ ] Editing one card's markdown (change a single earn rate), re-running, produces a report with `updated: 1` and the corresponding `card_earning` rows reflect the change.
- [ ] At least 130 cards land successfully in `cards` (matches or beats the current `data/manifest.json` count of 136).
- [ ] The 105 broken cards are all enumerated in the report with concrete failure reasons, no silent drops.
- [ ] `tests/scripts/migrate-cards-to-db.test.ts` passes locally and in CI.
- [ ] `npm run typecheck` and `npm run build` still pass — this TASK touches only `scripts/`, never imports from `app/` or `components/`.

## Verification

1. Reset the catalog DB to a clean schema-only state (run the migration runner against an empty Neon branch — see `TASK-db-schema-foundation` for the exact script).
2. Run `npm run db:migrate-cards`. Read the report.
3. `psql` into the DB and run a few sanity queries:
   - `SELECT count(*) FROM cards;` — expect ≥130.
   - `SELECT id FROM issuers ORDER BY id;` — expect ~12 (Chase, Amex, Citi, Capital One, BoA, Wells Fargo, US Bank, Bilt, Synchrony, Comenity, NFCU, USAA roughly).
   - `SELECT count(*) FROM card_earning WHERE card_id = 'amazon_prime_visa';` — expect 4 (the four earn tiers in that card's markdown).
   - `SELECT id FROM cards WHERE issuer_id = 'chase' AND card_type = 'business';` — expect the Ink family + Marriott Business + United Business etc.
4. Edit `cards/amazon_prime_visa.md` — change the Whole Foods rate to 6 instead of 5. Re-run `npm run db:migrate-cards`. Verify the report shows `updated: 1` and the corresponding `card_earning.rate_pts_per_dollar` is now 6.
5. Re-run `npm run db:migrate-cards` once more. Confirm `inserted: 0, updated: 0, skipped: <unchanged>`.
6. `git status` — expect changes only in `scripts/migrate-cards-to-db.ts`, `scripts/lib/slugify.ts` (new), `scripts/lib/anchor.ts` (extracted, may already exist), `tests/scripts/migrate-cards-to-db.test.ts`, `tests/scripts/__fixtures__/`, `package.json`, `package-lock.json`, `scripts/migrate-cards-to-db.report.md` (gitignore this — it's an output artifact).

If any acceptance criterion fails, do not consider the task complete. Surface the specific failure with the report excerpt.
