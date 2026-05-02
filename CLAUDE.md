# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Credit card recommendation engine — given a user's spend profile and current cards, returns the single best next card to add. Read `ARCHITECTURE.md` for the full picture; it is current and load-bearing. `DESIGN_BRIEF_FOR_CLAUDE_DESIGNER.md` and `RESEARCH_PROMPT_FOR_CODE.md` describe parallel tasks for design and data work.

The project is **scaffolding-stage**. The recommendation engine, Supabase persistence, and the real card database (`data/*.json`) do not exist yet. Stub data lives in `lib/data/stub.ts` and mirrors the shape the production data will have.

## Commands

```bash
npm run dev        # Next.js dev server on :3000
npm run build      # production build
npm run lint       # next lint (eslint-config-next)
npm run typecheck  # tsc --noEmit
```

No test runner is wired up yet. `ARCHITECTURE.md` plans `tests/engine/` once the engine is built — pick a runner when adding the first test rather than assuming one.

## Environment

Copy `.env.local.example` to `.env.local`. The Supabase clients (`lib/supabase/server.ts`, `lib/supabase/client.ts`) throw with a helpful message if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing — preserve that behavior.

## Architecture worth knowing before editing

- **The recommendation engine is a pure function**, runs in the browser, no network. `(userProfile, cardData) → rankedRecommendations`. This is the core architectural commitment — re-runs on every UI input change. Don't add async, side effects, or server round-trips to it. Five passes (eligibility filter → score → delta → "why" sentence → rank), each its own file under `lib/engine/`.
- **Card data is static JSON in the repo**, loaded once and Zod-validated at app start. Engine consumes a validated `CardDatabase`, never raw JSON. Updates are PRs, not an admin panel.
- **No custom backend.** Supabase JS client talks to Postgres directly from the browser, gated by RLS. Reach for Next.js API routes only when something genuinely needs server-side execution.
- **User data is one `profiles` row** with JSON columns (`spend_profile`, `brands_used`, `cards_held`, `trips_planned`, `preferences`). Schema enforcement is in TypeScript via Zod, not the DB — the JSON shape can evolve without migrations during early dev.
- **Auth is email + password with email verification disabled** (Supabase dashboard setting). UI labels the email field as "Account". Don't add magic links / social / MFA without checking — they're explicitly deferred.
- **Route groups gate access**: `(marketing)/` is public SSR, `(app)/` is auth-gated and reads the session via `lib/supabase/server.ts`. The current `app/(app)/layout.tsx` is an intentional passthrough — wiring auth-gating there is a planned task.
- **Mobile and desktop share routes and data**, only layout primitives differ via Tailwind responsive classes. Don't fork routes for mobile.

## Conventions

- TypeScript strict mode. Path alias `@/*` → repo root.
- React 19 RC + Next.js 15 App Router. Server components by default; mark `"use client"` only where needed.
- Stub data in `lib/data/stub.ts` is the temporary source of truth for UI work. When real data lands, types in `lib/data/types.ts` should match — keep them in sync.
- Card art is hosted in-repo under `public/card-art/` (not external URLs).

## Deliberately out of scope (per ARCHITECTURE.md)

Statement upload / Plaid, affiliate links, automated card data updates, email verification flows, analytics, server-side recommendation API. Don't add scaffolding for these unless the user asks.
