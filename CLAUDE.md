# CLAUDE.md

Credit card recommender. Engine, profile persistence, onboarding flows, and
the recommendation panel are all wired against the real card database.

Architecture deep-dive: `docs/ARCHITECTURE.md`. Design intent: `docs/DESIGN_BRIEF.md`.
NotebookLM-derived sweet spots and credit capture rates: `docs/NOTEBOOKLM_NOTES.md`.

## Commands

```bash
npm run dev        # :3000  (predev rebuilds the card DB)
npm run build      # prebuild rebuilds the card DB
npm run lint
npm run typecheck  # tsc --noEmit
npm test           # pretest rebuilds the card DB; vitest run
npm run cards:build  # standalone — recompile data/*.json from cards/*.md
```

## Card data pipeline

Source of truth lives in `cards/{card_id}.md`. Each markdown file contains six
labeled JSON blocks (`cards.json entry`, `programs.json entry`,
`issuer_rules.json entry`, `perks_dedup.json entries`,
`destination_perks.json entries`) plus free-form research notes.

`scripts/build-card-db.ts` reads every markdown, validates against
`scripts/lib/schemas.ts`, and writes `data/*.json` + `data/manifest.json` +
`data/RESEARCH_NOTES.md`. The whole `data/` directory is gitignored — the
markdown is canonical, the JSON is derived.

`lib/data/loader.ts` reads + re-validates and exports a typed `CardDatabase`
with O(1) lookup Maps, cached in module scope.

When adding a card or a field: edit the markdown, add to the schema if needed,
run `npm run cards:build`. Don't write to `data/*.json`.

## Non-obvious commitments

- **Engine is a pure function.** `(profile, wallet, db, options) → CardScore`
  / `RankResult`. No I/O, no `Date.now()` (today is injected). Lives in
  `lib/engine/{eligibility,scoring,ranking}.ts`. Re-runs on every UI change —
  don't add side effects.
- **Conservative cpp.** `scoring.ts` looks up each program's
  `portal_redemption_cpp` (or `fixed_redemption_cpp`, or 1) and uses it as
  the headline rec valuation. Peak transfer-partner sweet spots (Hyatt at 2¢,
  ANA biz at 4¢) are the why-sentence story, not the score, so the headline
  number stays defensible.
- **Auth is account name + password,** not email + password. No verification,
  no magic links, no MFA. Account names are letters/numbers/dots/dashes/
  underscores, 3–64 chars. Passwords are scrypt'd. Sessions are 30-day
  cookies, only the SHA-256 hash of the token is stored in `perks_sessions`.
- **Postgres (Neon), not Supabase.** `lib/db.ts` is a thin postgres-js wrapper
  around `DATABASE_URL`. Auth is server-side only; every query is scoped by
  the cookie session, so we don't run RLS. Tables are namespaced `perks_*`
  so the project can share an instance with other apps.
- **`app/(app)/layout.tsx` is the auth gate** for everything under `(app)/`.
  It calls `getCurrentUser()` and redirects to `/login` when there's no
  session. Per-page `getCurrentProfile()` calls reuse the cached user via
  `React.cache` so it's still one DB lookup per request.
- **Card data is static JSON, Zod-validated** at load time. Engine consumes
  `CardDatabase`, never raw JSON.
- **Server → client serialization** of the database goes through
  `lib/data/serialized.ts` (`toSerialized` / `fromSerialized`). Maps are
  reconstructed in a client useMemo so we don't depend on the React flight
  serializer's Map handling.
- **TypeScript strict.** Path alias `@/*` → repo root. Server components by
  default; `"use client"` only where needed. Mobile/desktop share routes —
  switch via Tailwind responsive classes (`hidden md:block`), never fork
  routes.

## Tests

`npm test` runs Vitest against the engine. The integration test loads the real
compiled card database, so a malformed `cards/*.md` will fail at the prebuild
stage before tests start. Auth, profile, and React-render layers are
intentionally untested — wire them up if you change the flow.
