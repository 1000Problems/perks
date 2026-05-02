# TASK: Supabase Schema Foundation — Catalog, Eligibility, User State, Images

> Stand up the Postgres schema for the recommendation engine's data layer. DDL, RLS, and generated TypeScript types only — no data migration, no engine, no UI changes.

## Context

The repo currently keeps card data as JSON files (`data/*.json` per `docs/ARCHITECTURE.md`) plus 230+ markdown source-of-truth files in `cards/`. We've decided to pivot the catalog into Postgres so the recommendation engine can query structured, indexable data. The schema design has been discussed and locked in. This is the first of several TASKs implementing the pivot.

This TASK creates the schema only. Data migration, the rules engine, the image processing pipeline, and UI rewiring are separate TASKs that depend on this one. The existing engine + UI keep working off `lib/data/stub.ts` until the migration TASK lands.

Key design decisions baked in (locked from prior discussion):
- JSONB for genuinely-variable fields (insurance conditions, rule configs, card-specific overrides); normal columns for queryable scalars
- Server-side rules engine — schema captures rule definitions; engine runs in a separate TASK
- No card-history precision — user state has held / closed_in_past_year / closed_long_ago plus self-reported facts (no open dates, no credit-report integration)
- Controlled vocabulary for sweet spots and categories (lookup tables, not free text)
- Image system needs full asset/file/default/synthetic-spec model with CDN-backed delivery (storage bucket setup is a separate TASK; this one just defines the tables)

## Requirements

1. Create `supabase/migrations/0001_init_catalog.sql` with all catalog tables and enums: issuers, networks, programs, transfer_partners, sweet_spots, destinations, cards, card_categories, card_earning, card_signup_bonuses, card_annual_credits, card_program_access, card_co_brand_perks, card_insurance, card_absent_perks, perks_dedup, program_transfer_partners, destination_relevance. RLS policies allow anonymous SELECT on all of them.

2. Create `supabase/migrations/0002_init_eligibility.sql` with: issuer_rules, card_rule_refs, card_specific_rules, product_families, product_family_members, card_credit_score, card_membership_requirements, card_business_requirements, card_invite_pathways, card_prequal, card_geographic_restrictions. Add a CHECK constraint on `issuer_rules` and `card_specific_rules` that validates `config jsonb` matches the shape implied by `rule_type` for at least the three most common variants (`x_in_y`, `max_apps_per_period`, `once_per_product_family`).

3. Create `supabase/migrations/0003_init_user_state.sql` with: user_cards, user_self_reported, user_memberships, user_brokerage_assets, user_existing_status. Preserve the existing `profiles` table — do not drop or alter its existing columns. Document in a SQL comment at the top of the file how the new relational tables relate to `profiles.cards_held` (the JSONB column it replaces over time).

4. Create `supabase/migrations/0004_init_image_system.sql` with: card_image_assets, card_image_files, card_image_default, card_synthetic_specs. RLS allows anonymous SELECT.

5. Add a `db:gen-types` script to `package.json` that runs `supabase gen types typescript --linked > lib/supabase/schema.ts`. Run it locally against a clean DB after migrations apply. Confirm `lib/supabase/schema.ts` exists, contains generated types for every new table, and `npm run typecheck` passes cleanly.

## Implementation Notes

### Project structure to create

```
supabase/
├── config.toml                    (only if not already present; run `supabase init` if needed)
├── migrations/
│   ├── 0001_init_catalog.sql
│   ├── 0002_init_eligibility.sql
│   ├── 0003_init_user_state.sql
│   └── 0004_init_image_system.sql
└── seed.sql                       (empty for now; placeholder file)
lib/supabase/
└── schema.ts                      (generated; whether to gitignore is your call — recommend committing for CI typechecks)
```

### Enums to create up front (in `0001`)

| Enum name | Values |
|---|---|
| `card_type` | `personal`, `business` |
| `program_type` | `transferable`, `cobrand_airline`, `cobrand_hotel`, `luxury_hotel`, `dining`, `lounge_network`, `entertainment`, `advisor` |
| `credit_score_band` | `building`, `fair`, `good`, `very_good`, `excellent`, `unknown` |
| `membership_type` | `military_eligible`, `costco_member`, `sams_club_member`, `bjs_member`, `aaa_member`, `rei_co_op_member`, `schwab_brokerage`, `morgan_stanley_cashplus`, `robinhood_gold`, `amazon_prime`, `bilt_eligible`, `nfcu_eligible`, `usaa_eligible`, `penfed_member`, `alliant_member` |
| `image_role` | `front`, `back`, `marketing`, `lifestyle` |
| `image_size_label` | `thumb`, `card`, `hero`, `og`, `retina_thumb`, `retina_card`, `retina_hero` |
| `image_format` | `avif`, `webp`, `jpeg`, `png` |
| `image_status` | `active`, `superseded`, `broken` |
| `rule_type` | `x_in_y`, `max_apps_per_period`, `max_open_cards_with_issuer`, `once_per_lifetime`, `once_per_product_family`, `velocity_2_3_4`, `credit_score_floor`, `invite_only`, `existing_relationship_required`, `informal` |
| `verdict` | `green`, `yellow`, `red` |
| `user_card_status` | `held`, `closed_in_past_year`, `closed_long_ago` |
| `credit_period` | `calendar_year`, `anniversary_year`, `monthly`, `quarterly`, `split_h1_h2`, `every_4_years`, `every_5_years` |

### Discriminated union enforcement (Requirement 2)

Postgres pattern for the CHECK constraint:

```sql
ALTER TABLE issuer_rules ADD CONSTRAINT issuer_rule_config_shape CHECK (
  CASE rule_type
    WHEN 'x_in_y' THEN
      config ? 'limit' AND config ? 'window_months' AND config ? 'counts' AND config ? 'scope'
    WHEN 'max_apps_per_period' THEN
      config ? 'limit' AND config ? 'scope'
    WHEN 'once_per_product_family' THEN
      config ? 'family' AND config ? 'lookback_months' AND config ? 'condition'
    ELSE TRUE
  END
);
```

Repeat for `card_specific_rules` with the same shape. The `ELSE TRUE` lets us add new rule types later without breaking the constraint; we tighten as we add them.

### Generated columns

- `card_annual_credits.realistic_value_usd` — generated as `face_value_usd * realistic_redemption_pct` (numeric type, stored)
- `card_signup_bonuses.is_current` — generated boolean: `effective_to IS NULL OR effective_to > now()`

### RLS policy patterns

Catalog and image tables (world-readable):
```sql
ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon read <name>" ON <name> FOR SELECT TO anon, authenticated USING (true);
-- writes restricted to service_role only (default deny for anon/authenticated)
```

User state tables:
```sql
ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own <name>" ON <name>
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

### Foreign-key relationships

- `cards.issuer_id` → `issuers.id`
- `cards.network_id` → `networks.id`
- `cards.currency_earned` → `programs.id`
- `card_earning.card_id` → `cards.id` ON DELETE CASCADE
- `card_program_access.card_id` → `cards.id`, `card_program_access.program_id` → `programs.id`
- `program_transfer_partners.program_id` → `programs.id`, `program_transfer_partners.partner_id` → `transfer_partners.id`
- `card_rule_refs.card_id` → `cards.id`, `card_rule_refs.rule_id` → `issuer_rules.id`
- `product_family_members.family_id` → `product_families.id`, `product_family_members.card_id` → `cards.id`
- `card_image_files.asset_id` → `card_image_assets.id` ON DELETE CASCADE
- `card_image_default.card_id` → `cards.id`, `card_image_default.front_asset_id` → `card_image_assets.id`, `card_image_default.hero_asset_id` → `card_image_assets.id`
- `user_cards.user_id` → `auth.users.id` ON DELETE CASCADE, `user_cards.card_id` → `cards.id`
- All other `user_*.user_id` → `auth.users.id` ON DELETE CASCADE
- `destination_relevance` is polymorphic — use a CHECK constraint enforcing `applies_to_type IN ('card', 'program', 'transfer_partner')` and rely on application-level integrity for the `applies_to_id` (Postgres can't FK into one of multiple tables natively without polymorphic patterns we're avoiding for v1)

### Indexes (start minimal)

```sql
CREATE INDEX cards_issuer_idx ON cards(issuer_id);
CREATE INDEX cards_network_idx ON cards(network_id);
CREATE INDEX cards_currency_idx ON cards(currency_earned);
CREATE INDEX card_earning_card_idx ON card_earning(card_id);
CREATE INDEX card_program_access_card_idx ON card_program_access(card_id);
CREATE INDEX card_program_access_program_idx ON card_program_access(program_id);
CREATE INDEX card_rule_refs_card_idx ON card_rule_refs(card_id);
CREATE UNIQUE INDEX user_cards_user_card_uniq ON user_cards(user_id, card_id);
CREATE INDEX card_image_assets_card_role_idx ON card_image_assets(card_id, role, status);
CREATE UNIQUE INDEX card_image_default_card_uniq ON card_image_default(card_id);
```

Add more later as queries demand.

### Audit columns

Every catalog table gets:
```sql
data_freshness DATE,
last_verified DATE DEFAULT CURRENT_DATE,
sources JSONB DEFAULT '[]'::jsonb,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
```

Add a trigger function `set_updated_at()` that fires on UPDATE for every catalog table. Define once at the top of `0001`, attach to each table.

### `profiles` table relationship (Requirement 3)

The existing `profiles` table per `docs/ARCHITECTURE.md` has JSONB columns: `spend_profile`, `brands_used`, `cards_held`, `trips_planned`, `preferences`. **Keep all five columns intact.** The new `user_cards` table will eventually replace the relational data inside `cards_held`, but during this TASK the JSONB column stays untouched — the migration that ports JSONB → relational is a separate TASK.

In `0003`, add a SQL block-comment at the top:

```sql
-- 0003_init_user_state.sql
-- Adds relational user-state tables alongside the existing `profiles` table.
-- profiles.cards_held (jsonb) is preserved as-is and remains the source of truth
-- for user-held cards until a separate migration ports it into user_cards.
-- New code should write to BOTH during the transition; the eventual TASK
-- "data-migrate-profiles-to-relational" will flip the source of truth.
```

### What NOT to define yet (deferred to later TASKs)

- `eligibility_verdicts` cache table
- `card_value_estimates` cache table
- `recommendation_runs` history
- Ephemeral tables: `dynamic_offers`, `transfer_bonuses`, `card_signup_bonus_offers`, `program_promo_properties`, `program_property_index`
- Generic `change_log` audit table
- Image processing job queue tables

These all build on the catalog being settled. Defer.

### Supabase CLI setup

If `supabase` CLI isn't already in devDependencies, add it: `npm install -D supabase`. The `--linked` flag in `db:gen-types` requires `supabase link --project-ref <ref>` to have been run once with the dev project ref — document in a comment in `package.json` or a brief note in the migration folder README.

Don't expose `SUPABASE_SERVICE_ROLE_KEY` or any project ref in committed files. The link is in `.supabase/` which is gitignored by default.

## Do Not Change

- `cards/*.md` — 230+ source-of-truth markdown files. Read-only here. Migration into the schema is a separate TASK.
- `data/*.json` — JSON catalog files referenced by `lib/data/loader.ts`. Untouched in this TASK.
- `lib/data/stub.ts` — placeholder stub data the engine currently uses. Stays.
- `lib/data/types.ts` — existing TypeScript types for the JSON shape. Will eventually be deprecated in favor of `lib/supabase/schema.ts`, but not in this TASK.
- `lib/data/loader.ts`, `lib/data/schema.ts` — Zod schemas for JSON validation. Stay.
- `lib/engine/` — recommendation engine code. Continues to operate on the JSON-loaded data path.
- `app/`, `components/` — UI code. No imports of the new tables yet. The `CardArt.tsx` component specifically should not be updated to use the new image system in this TASK.
- `docs/ARCHITECTURE.md` — references the JSON-in-repo design. The architectural pivot to Postgres is real but documenting it is a separate TASK.
- The `profiles` table's existing columns and RLS policies — preserve as-is.
- `package.json` — only one new script (`db:gen-types`) and (if needed) one new devDependency (`supabase`). No version bumps, no other script changes, no new runtime dependencies.
- `.env.local`, `.env.example` — no new env vars in this TASK. The migrations work against whatever Supabase project is already linked.

## Acceptance Criteria

- [ ] `npx supabase db reset` (or `supabase db push --linked` against a clean dev project) applies all four migrations with zero errors and zero warnings.
- [ ] `npm run db:gen-types` produces `lib/supabase/schema.ts` that contains generated types for every new table named in Requirements 1-4.
- [ ] `npm run typecheck` passes cleanly with the new generated types in place.
- [ ] `npm run build` passes cleanly.
- [ ] The CHECK constraint on `issuer_rules.config` rejects `INSERT INTO issuer_rules (id, issuer_id, rule_type, config) VALUES ('test', 'chase', 'x_in_y', '{"foo":"bar"}'::jsonb);` and accepts the same insert with valid `x_in_y` config.
- [ ] An anonymous client (no auth) can `SELECT` from every catalog and image table.
- [ ] An anonymous client cannot `SELECT` from any `user_*` table.
- [ ] An authenticated user with `auth.uid() = X` can read/write their own `user_cards` rows but not another user's rows.
- [ ] The `profiles` table is unchanged: same columns, same RLS policies, same JSONB shape.
- [ ] `git diff` shows changes only in: `supabase/migrations/0001_init_catalog.sql`, `supabase/migrations/0002_init_eligibility.sql`, `supabase/migrations/0003_init_user_state.sql`, `supabase/migrations/0004_init_image_system.sql`, `supabase/seed.sql` (empty), `supabase/config.toml` (only if `supabase init` had to run), `lib/supabase/schema.ts`, `package.json`, optionally `package-lock.json` if `supabase` was added as a devDependency.

## Verification

1. Run `npx supabase start` to ensure local Supabase is running. If not initialized, run `npx supabase init` first.
2. Run `npx supabase db reset` — confirm migrations apply, no errors, no warnings.
3. Run `npm run db:gen-types` — open `lib/supabase/schema.ts` and grep for representative table names: `issuer_rules`, `card_image_assets`, `user_self_reported`, `program_transfer_partners`, `destination_relevance`. All should appear with proper TypeScript types.
4. Run `npm run typecheck && npm run build` — both pass.
5. Open `psql` against the local DB (`npx supabase db url` to get the connection string). Run the CHECK-constraint test from the acceptance criteria.
6. Test RLS: with the anon key, query `cards`, `card_image_assets`, `programs` — should return rows (or empty set, but no permission error). Query `user_cards` — should fail or return empty under RLS for anon.
7. Run `git status` and `git diff --stat` — verify only the listed files are touched.
8. Verify `profiles` table is intact: `SELECT column_name FROM information_schema.columns WHERE table_name='profiles';` returns the same columns as before.

If any acceptance criterion fails, do not consider the task complete. Pause and surface the specific failure.
