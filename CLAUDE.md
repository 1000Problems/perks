# CLAUDE.md

Credit card recommender. **Scaffolding stage** — engine, Supabase persistence, and real card data (`data/*.json`) don't exist yet. Stub data: `lib/data/stub.ts`.

Full architecture: `docs/ARCHITECTURE.md`. Read it when working on the engine, data layer, or auth.

## Commands

```bash
npm run dev        # :3000
npm run build
npm run lint
npm run typecheck  # tsc --noEmit
```

No test runner wired up. Pick one when adding the first test.

## Non-obvious commitments

- **Engine is a pure function**: `(profile, cards) → ranked[]`. Browser-only, no async, no network. Re-runs on every UI change — don't add side effects.
- **No custom backend.** Supabase JS client talks to Postgres directly via RLS. API routes only when something genuinely requires server execution.
- **Card data is static JSON**, Zod-validated at app start. Engine consumes a validated `CardDatabase`, never raw JSON.
- **`app/(app)/layout.tsx` is intentionally a passthrough** — auth-gating is a planned task, not a bug.
- **Auth is email + password, verification disabled.** No magic links / social / MFA without checking — explicitly deferred.
- TypeScript strict; path alias `@/*` → repo root. Server components by default; `"use client"` only where needed. Mobile/desktop share routes — switch via Tailwind responsive classes, never fork routes.
