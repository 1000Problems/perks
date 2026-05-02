# Architecture — Credit Card Recommender (Perks)

## Stack at a glance

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| UI primitives | shadcn/ui |
| Auth | Custom: account name + password, scrypt-hashed, cookie sessions |
| Database | Neon Postgres (catalog + user state in one DB) |
| Image storage | Cloudflare R2 (S3-compatible, public read) |
| Image processor | `sharp` |
| Hosting | Vercel |
| Card-data source of truth | `cards/*.md` markdown → Postgres catalog (transitional JSON cache in `data/`) |
| Recommendation engine | Pure TypeScript, runs in browser |
| Eligibility engine | Catalog-driven, server-side (`lib/rules/`); legacy in-engine path retained behind a flag |
| Schema validation | Zod for the markdown pipeline; column types + CHECK constraints in Postgres |
| Repo | GitHub, 1000Problems org |

## What runs where

**Browser** runs the recommendation engine (pure function over a slim server-rendered card payload). Spend profile, wallet, and trip plans live in React state and persist via server actions. The engine sees eligibility verdicts as **input**, not as something it computes — verdicts come down with the page.

**Vercel server (App Router)** handles auth, profile reads/writes, the rules engine, the image resolver, and SSR of the marketing pages and app shell. Talks directly to Neon and R2.

**Neon Postgres** holds the catalog (issuers, networks, programs, cards and their child tables, eligibility rules, image metadata) plus user state (`user_cards` relational rows + the legacy `perks_profiles` JSONB row for everything not yet ported). One DB, single tenant, no RLS — every query is scoped by the cookie-session-derived `user_id` in `lib/db.ts` callers.

**Cloudflare R2** holds card-image bytes. Public read at a custom subdomain. Writes go through a service-role API token used only by the image processor and the admin upload route.

## Folder layout

Runtime concerns live under `app/`, `components/`, `lib/`. Build-time and operational concerns live under `cards/`, `data/`, `db/`, `scripts/`, `tests/`.

```
perks/
├── app/
│   ├── (marketing)/                 public pages, SSR
│   ├── (app)/                       auth-gated user app
│   ├── (admin)/                     image admin UI (gated by ADMIN_ACCOUNT_NAME)
│   ├── login/, signup/
│   └── api/                         thin handlers, used sparingly
├── components/
│   ├── perks/                       primitives (CardArt, CardImage, EligibilityChip, …)
│   ├── recommender/                 rec panel and its parts
│   └── onboarding/
├── lib/
│   ├── auth/                        cookie-session auth
│   ├── db.ts                        postgres-js client
│   ├── data/                        legacy JSON loader + Zod (transitional)
│   ├── engine/                      pure scoring + ranking
│   ├── rules/                       server-side eligibility evaluator
│   ├── images/                      synthetic renderer, resolver, R2 storage shim
│   └── profile/                     read/write split across JSONB and relational
├── db/
│   └── migrations/                  raw SQL files, applied by scripts/db-migrate.ts
├── cards/                           markdown source-of-truth (read-only at runtime)
├── data/                            compiled JSON cache (transitional; gitignored)
├── scripts/                         build, migrate, image-process, backfill, verify
├── public/
└── tests/
```

## Data layer

### Card catalog (Neon)

Source of truth: `cards/*.md` (one file per card; embedded JSON blocks plus research notes). Compiled into `data/*.json` by `scripts/build-card-db.ts` for the legacy loader (`lib/data/loader.ts`), and ingested into Postgres by `scripts/migrate-cards-to-db.ts` via the catalog tables.

Catalog tables (per `db/migrations/0001_init_catalog.sql`):

- `issuers`, `networks`, `programs`, `transfer_partners` — deduped reference rows.
- `cards` — primary entity. Plus child tables for earning, signup bonuses, annual credits, program access, co-brand perks, insurance, absent perks, and category tags.
- `program_transfer_partners` — join with ratios and sweet-spot tags.
- `network_default_perks` — resolves Visa Signature LHC, World Elite portfolio, etc., at read time so the recommender can surface network-inherited benefits without per-card duplication (per soul-doc §2.8).

Audit columns on every catalog table: `data_freshness`, `last_verified`, `sources` (JSONB), `created_at`, `updated_at`. An `updated_at` trigger fires on every UPDATE.

### User state (Neon)

`user_cards` is the relational replacement for the JSONB array that used to live at `perks_profiles.cards_held`. Status enum: `held | closed_in_past_year | closed_long_ago` plus `opened_at`, `closed_at`, `bonus_received`. Unique on `(user_id, card_id)`.

`perks_profiles` keeps its other JSONB columns (`spend_profile`, `brands_used`, `trips_planned`, `preferences`). The `cards_held` JSONB column is preserved through the cutover as a safety net; a follow-on TASK drops it once the relational path runs cleanly for one release cycle.

Other user-state tables: `user_self_reported` (credit band, household income), `user_memberships`, `user_brokerage_assets`, `user_existing_status`. All keyed on `perks_users.id`, scoped server-side via `getCurrentUser()`.

### Card images

Bytes in R2 under `cards/{card_id}/{role}/{size_label}.{format}`. Metadata in Postgres: `card_image_assets` (one per uploaded source), `card_image_files` (size × format variants, with `sha256`, `bytes`, `url`), `card_image_default` (per-card pinned defaults), `card_synthetic_specs` (universal-fallback config for the SVG renderer).

## Eligibility

Catalog-driven. Rules live in `issuer_rules` (issuer-wide) and `card_specific_rules` (per-card overrides), JSONB `config` typed by `rule_type` and CHECK-constrained for the three highest-volume variants (`x_in_y`, `max_apps_per_period`, `once_per_product_family`). `card_rule_refs` joins cards to issuer rules; `product_families` + `product_family_members` capture once-per-family logic (Sapphire family, Plat family, etc.).

The evaluator is pure. `lib/rules/evaluate.ts` exports `evaluate(ctx) → {verdict, reasons[]}`. The thin loader `lib/rules/load.ts` fetches user state + applicable rules + product-family memberships in a few parallel queries and packs them into a `RulesContext`. A batch entry point `evaluateBatch({userId, cardIds[]})` returns a `Record<card_id, EligibilityResult>` for the rec panel.

Verdict aggregation: `block` reasons → red, `warn` → yellow, `inform` → green. Verdict is the highest severity present; every reason is returned regardless so the UI can render details.

Toggle: `RULES_ENGINE=server` (default) uses the catalog evaluator. `RULES_ENGINE=client` falls back to `lib/engine/eligibility.ts` (the legacy in-engine path) — kept around until the server path is verified in production.

## The recommendation engine

Pure function. Reactive to UI input. Receives the card payload + eligibility verdicts as inputs.

```ts
function recommend(
  user: UserProfile,
  cards: CardDatabase,
  verdicts: Record<string, EligibilityResult>,
  options: ScoringOptions,
): RankedRecommendation[]
```

Four passes:

1. **Filter.** Drop cards with red verdicts (or surface them as "you're not eligible right now," depending on UI mode).
2. **Score.** For each candidate, compute marginal annual value: rewards on the user's spend with the new card, minus annual fee, minus unredeemed credits valued realistically (`ease_score` + `realistic_redemption_pct` from the catalog), minus already-covered perks discounted via the dedup taxonomy.
3. **"Why" sentence.** Look at where the delta came from; produce a one-line plain-English explanation.
4. **Rank and return top N** by configurable criterion (delta value, no-AF only, premium tier).

Each pass is its own file in `lib/engine/`. Pure functions, explicit inputs and outputs, unit-tested against fixtures. The engine remains side-effect-free.

## Image rendering

`lib/images/resolve.ts` `resolveCardImage(cardId, size, role, format='auto')` returns either `{type: 'real', url, ...}` or `{type: 'synthetic', svg}`. Resolution order: pinned default → most-recent active asset for `(card, role)` → synthetic from `card_synthetic_specs` → throw (every card should have a spec post-seed).

Synthetic renderer (`lib/images/synthetic.ts`) is a pure function. Inline SVG, deterministic output, no external font loads — snapshot tests pin the bytes. Rendered fresh per request; cached at the edge by URL.

`<CardImage cardId={...} size="md" />` is the new server component. It calls the resolver and emits either `<img>` (real) or inline `<svg>` (synthetic). Existing `<CardArt variant={...}>` (CSS variants) stays as the client-component fallback during migration.

Format negotiation: AVIF → WebP → JPEG. The resolver picks based on caller intent; for a `<picture>` setup, callers can request multiple formats explicitly.

Admin UI at `/admin/cards/{card_id}/images` lets an operator drag a PNG/JPG, run the seven-size × three-format processing pipeline, and pin a default. Gated by `ADMIN_ACCOUNT_NAME` env. Mismatch returns 404.

## Auth

**Account name + password.** No email verification, no magic links, no MFA. Account names are letters/numbers/dots/dashes/underscores, 3–64 chars. Passwords are scrypt-hashed.

Login flow:
1. User enters account name + password on `/login` or `/signup`.
2. A server action validates and (for signup) creates the row in `perks_users`.
3. On success, a 30-day session: random token in an HTTP-only cookie, SHA-256 hash stored in `perks_sessions`.
4. `app/(app)/layout.tsx` calls `getCurrentUser()` to gate the `(app)/` route group; unauthenticated visitors redirect to `/login`.
5. Server components and server actions reuse the cached user via `React.cache` — one DB lookup per request.

`app/(admin)/layout.tsx` adds the admin gate: same session check plus an `account_name === ADMIN_ACCOUNT_NAME` check. Mismatch → 404.

## Cutover state (May 2026)

Three flags govern the in-flight migrations:

- **`RULES_ENGINE=server|client`** — server (default) uses the catalog-driven evaluator; client falls back to the in-engine path.
- **`CARDS_HELD_DUAL_WRITE=on|off`** — on (default) writes wallet changes to both `perks_profiles.cards_held` JSONB and `user_cards`; off skips the JSONB write.
- **`CARDS_HELD_READ_SOURCE=jsonb|relational`** — jsonb (default until verified) reads wallet from JSONB; relational reads from `user_cards` and maps to the engine's shape.

Verification gate: `npm run db:verify-user-cards` compares the JSONB and relational held-card sets per user. Exits 0 only on full parity. Runs in CI during the dual-write phase.

Order of flips: backfill (one-time) → verify exits 0 for several days → flip read source to relational → keep dual-write on for one release as safety net → drop the JSONB column in a separate TASK.

## Mobile vs desktop IA

Same routes, same data, different layout primitives via Tailwind responsive classes. Desktop is a three-column rec panel; mobile collapses to a horizontal swipe or bottom-sheet. No separate mobile codebase, no separate routes.

## Deployment

GitHub repo at `github.com/1000Problems/perks`. Vercel project linked to the repo. Pushes to `main` deploy to production; PRs deploy preview environments.

Neon Postgres is provisioned per environment via the Neon console. Production branch for the live site, dev branch for local development.

Cloudflare R2 bucket: `perks-card-art-prod` (and `…-dev` for previews). Public-read URL served from `https://card-art.<perks-domain>/<key>`. Setup is documented in `docs/IMAGE_PIPELINE.md`.

## Environment variables

Names only. Values live in Vercel project settings (production), `.env.local` (local dev, gitignored), and never in committed files.

- `DATABASE_URL` — Neon Postgres pooled connection string.
- `SESSION_COOKIE_SECRET` — server-only, derives the SHA-256 session-token hash.
- `RULES_ENGINE` — `server` (default) or `client`.
- `CARDS_HELD_DUAL_WRITE` — `on` (default during cutover) or `off`.
- `CARDS_HELD_READ_SOURCE` — `jsonb` (default until verified) or `relational`.
- `ADMIN_ACCOUNT_NAME` — single account allowed into the admin UI.
- `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_PUBLIC_BASE` — image storage targets.
- `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` — image storage credentials (service-role).

## What we're deliberately leaving out

- **`eligibility_verdicts` cache table.** The evaluator is fast enough fresh; cache only if metrics show it's needed.
- **`card_value_estimates` materialized cache.** Same reasoning.
- **Generic `change_log` audit table.** Per-table audit columns plus migration history are sufficient for now.
- **Image processing job queue.** Admin uploads are synchronous; a queue is overkill at one operator.
- **Marketing/lifestyle/OG image roles.** Schema supports them; only `front` is wired in v1.
- **Statement upload / Plaid.** Architecture supports adding it later as a separate route + module. No engine changes needed.
- **Affiliate links and disclosure UX.** Deferred until monetization. `cards.sources` already accommodates affiliate URLs alongside research links.
- **Per-cardholder Amex/Chase Offer scraping.** Soul-doc §2.2 makes the case for capability-on-card + offers-in-ephemeral-store. v1 captures only the capability.

## Editorial workflow

Most of the value isn't engineering — it's curation. The engine and the schema are scaffolding for a curation problem.

Markdown stays the human-edit surface. `cards/*.md` is the input; `npm run db:migrate-cards` flows the changes into Postgres. Edits go through PR review; the catalog is regenerated idempotently.

Top-50 cards (by recommendation frequency) get the first enrichment pass: structured `ease_score` + `realistic_redemption_pct` per credit, structured insurance from each card's Guide-to-Benefits PDF, transfer-partner sweet-spot tags, network-inherited benefit resolution, and `absent_perks_explicit` entries with one-line explanations for the most-confused absences (see Amazon Prime Visa for the canonical example).

Long-tail cards stay sparse. The engine downweights via `data_freshness`. As secondary sources flag updates (Frequent Miler weekly, Doctor of Credit, OMAAT), the curator updates markdown and re-runs the migration.

LLM-assisted PDF extraction is the recommended workflow per soul doc §4 — every entry is reviewed manually before landing.

## Risks worth naming

1. **Editorial freshness.** The catalog supports rich soul-doc fields; most are still NULL. The schema doesn't make the data better — it makes it possible to capture better data. Investment in curation is the bottleneck.
2. **R2 bandwidth.** Marketing pages will hammer card-art URLs. R2's zero egress puts a ceiling on cost; AVIF + lazy loading keep payloads small. Watch Cloudflare metrics; if a page goes viral, double-check `Cache-Control` is hitting.
3. **Cutover window.** Dual-write is robust but has a non-zero parity-drift risk if a code path forgets to update both sides. Keep `db:verify-user-cards` in CI for the entire dual-write phase.
4. **Catalog write contention.** Effectively single-writer (one admin maintains markdown). Not a real concern.
5. **Neon pricing tiers.** Storage growth with 241+ cards × image metadata × user state is well under the free-tier ceiling. Re-check at 10× scale.

## Build order (current state, May 2026)

1. ✅ **Schema migrations** — `db/migrations/0001..0004`, applied via `npm run db:migrate`.
2. **Markdown → Postgres ingest** — `npm run db:migrate-cards`, populates the catalog from `cards/*.md`.
3. **Image system** — `npm run images:seed-synthetic` populates `card_synthetic_specs`; R2 setup; `npm run images:process` for real card art; admin UI at `/admin/cards/{id}/images`.
4. **Server-side rules engine** — `lib/rules/{evaluate,load}.ts`. Toggle in via `RULES_ENGINE=server`.
5. **`cards_held` cutover** — backfill (`db:backfill-user-cards`) → verify (`db:verify-user-cards`) → flip `CARDS_HELD_READ_SOURCE=relational`.
6. **Editorial enrichment pass** — top-50 cards first; ongoing.
7. **Loader switch** — `lib/data/loader.ts` reads from Postgres instead of `data/*.json`. Drop the JSON path.
8. **Drop `cards_held` JSONB column** — once the relational path runs cleanly for one release.

Each step is mergeable on its own. The engine being a pure function — and the rules evaluator being a pure function over an explicit context — means we can build, test, and deploy any one of these without breaking the others.
