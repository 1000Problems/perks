# TASK: Update `docs/ARCHITECTURE.md` to match the post-pivot reality

> Refresh the architecture doc end-to-end. The current version describes a JSON-in-repo card database, in-engine eligibility, JSONB-only user state, no image system, and a pure browser-side engine. Post-pivot the catalog lives in Neon, eligibility runs server-side, user wallet is relational, and there's a real image pipeline. The doc is a contract — it has to lead the work, not lag it.

## Context

`docs/ARCHITECTURE.md` was written when the design assumed JSON-bundled card data, browser-side engine, and a single JSONB profile row. Several TASKs have shifted the architecture:

- `TASK-db-schema-foundation` moves the catalog into Neon (~30 tables across catalog / eligibility / user state / image system).
- `TASK-data-migrate-cards-md-to-db` ports the markdown corpus into those tables, with the JSON output path preserved as a transitional cache.
- `TASK-image-pipeline` introduces R2-backed real images, a synthetic SVG fallback, an admin upload UI, and a new resolver that replaces the CSS-variant `lib/cardArt.ts`.
- `TASK-rules-engine-server` moves eligibility to a catalog-driven server evaluator; the in-engine path stays as a fallback gated by `RULES_ENGINE`.
- `TASK-cutover-cards-held-to-relational` ports `perks_profiles.cards_held` JSONB into a relational `user_cards` table with closed-card support, dual-write, then read flip.

Anyone reading the architecture doc today gets a misleading picture. This TASK is the rewrite that makes the doc accurate.

This is a docs-only TASK. No code changes. No new dependencies. The diff is `docs/ARCHITECTURE.md` and possibly a new sibling doc or two.

## Requirements

1. **Rewrite the "Stack at a glance" table.** Replace any ambiguity around card data and image hosting:
   - Card catalog → Neon Postgres (Postgres tables, ~30, defined in `db/migrations/`).
   - User state → Neon Postgres (`user_cards`, `user_self_reported`, `user_memberships`, `user_brokerage_assets`, `user_existing_status` plus the legacy `perks_profiles` JSONB columns retained for non-cards-held data).
   - Image hosting → Cloudflare R2 (`R2_*` env vars), public read, processed via `sharp`.
   - Eligibility → server-side evaluator (`lib/rules/`), catalog-driven, in-engine version retained behind `RULES_ENGINE` flag during cutover.
   - Schema validation → Zod for the markdown source pipeline; the DB itself enforces shape via columns + CHECK constraints.

2. **Rewrite the "What runs where" section.** The browser-does-everything claim is no longer true:
   - **Browser:** spend profile UI, scoring, ranking, "why" sentence generation. Reads card metadata from a slim server-rendered payload, not a bundled JSON file. Eligibility verdicts come down with the page (computed server-side).
   - **Vercel server (App Router):** marketing pages, app shell, all auth, profile reads/writes, the rules engine evaluator, image resolver. Calls Neon directly via `lib/db.ts` postgres-js client.
   - **Neon:** single Postgres for catalog + user state. No RLS. Queries scoped to the session-derived `user_id` at the application layer.
   - **Cloudflare R2:** card image bytes. Public-read bucket, served at a custom subdomain.

3. **Rewrite the "Folder layout" tree.** Reflect what actually exists post-cutover:
   ```
   perks/
   ├── app/
   │   ├── (marketing)/
   │   ├── (app)/
   │   ├── (admin)/                  card-art admin UI
   │   ├── login/
   │   ├── signup/
   │   └── api/
   ├── components/
   │   ├── perks/                    primitives (CardArt, EligibilityChip, …)
   │   ├── recommender/
   │   └── onboarding/
   ├── lib/
   │   ├── auth/
   │   ├── db.ts                     postgres-js client
   │   ├── data/                     legacy JSON loader + Zod (transitional)
   │   ├── engine/                   pure scoring + ranking
   │   ├── rules/                    server-side eligibility
   │   ├── images/                   resolver, synthetic renderer, storage shim
   │   └── profile/                  read/write split across JSONB and relational
   ├── db/
   │   └── migrations/               raw SQL, run by node-pg-migrate or equivalent
   ├── cards/                        markdown source-of-truth (read-only at runtime)
   ├── data/                         compiled JSON (transitional cache; gitignored)
   ├── scripts/                      build-card-db, migrate-cards-to-db, image processor, backfills
   ├── public/
   └── tests/
   ```
   Add a one-line note above the tree saying which directories are runtime concerns and which are build-time artifacts.

4. **Rewrite the "Data layer" section** to cover three concerns separately:
   - **Card catalog (Neon, Postgres tables).** Source of truth for v2+ is the catalog tables. Markdown in `cards/` remains the human-edited input that flows into Postgres via `npm run db:migrate-cards`. Engine reads from the DB through a thin loader; the JSON cache (`data/*.json`) is preserved during cutover and removed in a follow-on once the loader switch is verified.
   - **User state (Neon, Postgres tables).** `user_cards` is relational and the source of truth for held + closed cards. `perks_profiles` retains JSONB for `spend_profile`, `brands_used`, `trips_planned`, `preferences` — those have not been ported. The `cards_held` JSONB column is preserved through one release cycle as a safety net post-flip; a follow-on drops it.
   - **Card images (Cloudflare R2 + Postgres metadata).** R2 holds the bytes. Postgres holds `card_image_assets`, `card_image_files`, `card_image_default`, `card_synthetic_specs`. Resolver in `lib/images/resolve.ts` returns a real image URL or an inline synthetic SVG; admin UI uploads new bytes; processor generates seven size × format variants.

5. **Add a new "Eligibility" section** between "User state" and "The recommendation engine":
   - Catalog-driven: rules live in `issuer_rules` and `card_specific_rules`, JSONB config typed by `rule_type` and CHECK-constrained.
   - Server-side evaluator (`lib/rules/evaluate.ts` is pure; `lib/rules/load.ts` does the DB read).
   - Batch path for the rec panel evaluates dozens of cards in one round-trip.
   - Verdict shape: `{verdict: green|yellow|red, reasons: Reason[]}`. Severity aggregation rule.
   - Cutover toggle: `RULES_ENGINE=server|client`.

6. **Rewrite the "The recommendation engine" section** to reflect that eligibility is no longer in-engine:
   - Engine still pure, still reactive to UI input.
   - Engine receives eligibility verdicts as **input**, not as something it computes. Verdicts come from the server with the page.
   - Five passes shrink to four (filter / score / dedup-perks / rank). Eligibility is the upstream concern.

7. **Add a new "Image rendering" section.**
   - Resolution order: real default → real most-recent active → synthetic from spec → throw.
   - Format negotiation: AVIF → WebP → JPEG by Accept header.
   - Synthetic SVG is rendered fresh per request, cached at the CDN edge by URL.
   - Admin UI for uploads is gated by `ADMIN_ACCOUNT_NAME`.

8. **Update "Environment variables"** to add:
   - `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE` — image storage.
   - `RULES_ENGINE` — `server` (default) or `client` (legacy fallback).
   - `CARDS_HELD_DUAL_WRITE` — `on` (default during cutover) or `off`.
   - `CARDS_HELD_READ_SOURCE` — `jsonb` (default until verified) or `relational`.
   - `ADMIN_ACCOUNT_NAME` — single account name allowed into the admin UI.
   Names only; no values, ever.

9. **Rewrite "What we're deliberately leaving out"** to reflect the new deferred list:
   - `eligibility_verdicts` cache table (the rules engine computes fresh; cache later if needed).
   - `card_value_estimates` materialized cache (engine computes fresh; cache later).
   - Generic `change_log` audit table.
   - Image processing job queue (current upload path is synchronous in the admin UI; a queue is overkill).
   - Marketing/lifestyle/OG image roles (only `front` is wired in v1).
   - Statement upload / Plaid (still deferred).

10. **Rewrite "Risks worth naming"** to reflect post-pivot risks:
    - Bundle size is no longer the top risk because the catalog isn't in the bundle. Replace with: data freshness on the curation side (the editorial enrichment pass per soul-doc fields).
    - Image budget on R2 — model what 5,000 monthly active visitors hitting a marketing page costs.
    - Verification window during the `cards_held` cutover — quantify how long dual-write needs to run before flipping reads.
    - Catalog write contention is not a real risk (single-writer admin, no multi-tenant editing) but worth a sentence so readers don't worry about it.

11. **Rewrite "Build order"** to be the actual current sequence:
    1. Catalog schema migrations (`TASK-db-schema-foundation`).
    2. Markdown → Postgres ingest (`TASK-data-migrate-cards-md-to-db`).
    3. Image system: synthetic seed + R2 setup + processor + admin UI (`TASK-image-pipeline`).
    4. Server-side rules engine (`TASK-rules-engine-server`).
    5. `cards_held` cutover (`TASK-cutover-cards-held-to-relational`).
    6. Editorial enrichment pass for soul-doc fields (top-50 cards first; ongoing).
    7. Loader switch: `lib/data/loader.ts` reads from Postgres instead of `data/*.json`. Drop the JSON path.
    8. JSONB column drop (`perks_profiles.cards_held`) once the relational path runs cleanly for one release.

12. **Add a new section: "Editorial workflow."** Per the soul doc, much of the value isn't engineering — it's curation. Document:
    - Markdown remains the human-edit surface.
    - Top-50 cards by recommendation frequency get the first enrichment pass: `ease_score`, `realistic_redemption_pct`, structured insurance from Guide-to-Benefits PDFs, transfer partner sweet spots, network LHC resolution, absent-perk explanations.
    - Long-tail cards stay sparse; engine downweights via `data_freshness`.
    - LLM-assisted insurance extraction from PDFs is the recommended workflow per the soul doc; manual review every entry.

13. **Optional split-out:** if the doc balloons past ~300 lines, factor out the editorial workflow and the image-pipeline detail into sibling docs:
    - `docs/EDITORIAL_WORKFLOW.md`
    - `docs/IMAGE_PIPELINE.md` (already created in `TASK-image-pipeline`; reference from here, don't duplicate)
    
    Keep `ARCHITECTURE.md` as the high-level map; let the sub-docs carry the detail.

## Implementation Notes

### Voice and length

The current `ARCHITECTURE.md` is direct, sectioned, and roughly 200 lines. Stay in that voice. No marketing prose, no buzzwords. Concrete file paths, table names, env var names. Where there's a tradeoff, name it; where there's a deferred decision, name what triggers it.

### What to keep verbatim

The "Auth" section is fine as-is — auth wasn't touched by the pivot. The "Mobile vs desktop IA" section is fine — the layout primitives didn't change. The "Deployment" section needs only minor edits (mention R2 alongside Vercel + Neon).

### What to be honest about

Two things deserve a candid line each:
- The cutover from JSON to DB is mid-flight at the time of this rewrite. Document the **current** state (probably "DB-backed with JSON cache as fallback"), not the eventual state. Note the trigger that retires the JSON path.
- Soul-doc fields (the rich perk taxonomy) are mostly NULL today. The schema supports them; the data isn't there yet. Don't oversell the catalog as if it's already enriched.

### Cross-links

Every TASK referenced should link by filename. Every section that has a sub-doc (image pipeline, editorial workflow) should link to it. Don't re-explain in the architecture doc what lives in a sub-doc.

### Diagrams

If a diagram helps, a Mermaid block is fine — Markdown renders it on GitHub. One useful diagram: the request path for the rec page, showing browser → Vercel server → Neon (catalog + user state) → server returns page with verdicts. Maybe also a second diagram for the image resolver path. Both are optional; don't add filler.

## Do Not Change

- Nothing outside `docs/`. This TASK is documentation only.
- Code paths described in the doc — the doc must match what the code does, not the other way around. If a discrepancy is found, file it as a bug; don't paper over it in the doc.
- The `Auth`, `Mobile vs desktop IA`, and `Deployment` sections except for the minor edits above.
- TASK files themselves — those are historical artifacts; they don't change retroactively.

## Acceptance Criteria

- [ ] `docs/ARCHITECTURE.md` reflects every requirement above. No section claims behavior that isn't in the code.
- [ ] Folder tree matches `ls -R` output for the relevant directories at the time of the rewrite.
- [ ] Every env var named in `lib/`, `scripts/`, or migration files appears in the env-vars section.
- [ ] Every TASK referenced exists at the named path.
- [ ] If sub-docs were factored out, they're referenced from `ARCHITECTURE.md` and don't duplicate content.
- [ ] No mention of Supabase anywhere in the doc (the pivot to Neon is final).
- [ ] No mention of RLS as a live mechanism — RLS appeared in earlier drafts via the schema TASK; the actual auth model is server-side scoping per session.
- [ ] `git diff --stat` shows changes only in `docs/ARCHITECTURE.md` and any new sibling docs created in `docs/`.

## Verification

1. Read the doc end-to-end with no other context. It should make sense as a standalone description of how the app works today.
2. Pick five arbitrary file paths from the doc — confirm each exists in the repo.
3. Pick three env vars from the doc — confirm each is referenced in code (`grep -r "process.env.<NAME>"` finds at least one site).
4. Confirm the build-order list maps to actual TASK files — every step has either a TASK file or a clear "ongoing" tag.
5. Confirm the architecture's claims about what the engine does match the code. If the doc says "engine takes verdicts as input" and the engine still computes them, that's a doc bug or a code bug — surface which.
6. Have one person who hasn't been in the recent design discussions read it. If they ask "where do card images come from?" or "what computes eligibility?" — those answers should be findable in the doc within 60 seconds. If not, the relevant section needs sharpening.

The doc is the contract for the next round of contributors. It's worth getting right.
