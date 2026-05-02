# TASKS — handoff to Claude Code

Eleven TASK files split the remaining work to complete the perks app into mergeable, sequential units. Each is self-contained: Code can run against any one of them with no prior session memory.

## Read this first — what's already done

The auth layer, the design tokens and primitives, the recommendation panel UI, and the **card database pipeline** are already built. Code's job is to wire the engine, persistence, and onboarding flows on top.

### The card database

Card data lives in `cards/{card_id}.md` — one markdown file per card, with six labeled JSON fenced sections (`cards.json entry`, `programs.json entry`, `issuer_rules.json entry`, `perks_dedup.json entries`, `destination_perks.json entries`, plus a free-form `RESEARCH_NOTES.md entries` section).

A compiler at `scripts/build-card-db.ts` reads every card markdown, validates with Zod, merges with anchor-card semantics, and writes:

- `data/cards.json`
- `data/programs.json`
- `data/issuer_rules.json`
- `data/perks_dedup.json`
- `data/destination_perks.json`
- `data/manifest.json` (compile timestamp + counts)
- `data/RESEARCH_NOTES.md` (concatenated)

The compiler runs automatically before `npm run dev` and `npm run build` (via the `predev` and `prebuild` hooks). `data/` is gitignored — markdown is the single source of truth.

**To use the data in your code:**

```ts
import { loadCardDatabase } from "@/lib/data/loader";
import type { Card, Program, IssuerRules, PerksDedupEntry, DestinationPerk } from "@/lib/data/loader";

const db = loadCardDatabase();
db.cards;                    // Card[]
db.programs;                 // Program[]
db.issuerRules;              // IssuerRules[]
db.perksDedup;               // PerksDedupEntry[]
db.destinationPerks;         // Record<string, DestinationPerk>
db.manifest.compiled_at;     // ISO string
db.cardById.get("chase_sapphire_preferred");
db.programById.get("chase_ur");
db.issuerRulesByIssuer.get("Chase");
```

The loader caches in module scope — call it freely.

**Schemas:** `scripts/lib/schemas.ts`. Both the compiler and the loader import from there. If the engine needs new fields, add them to the schema, then to the markdown source files. Don't edit `data/*.json` directly — your changes will get blown away on the next build.

**Cards currently in the database:** 50+ as of this writing, growing toward 80. Run `npm run cards:build` to see the current count, or read `cards/AllCards.md`.

### What's already wired

- **Auth:** Custom Postgres-backed sessions via `lib/auth/*` and `lib/db.ts`. Don't touch unless a TASK explicitly says to.
- **Layout and design tokens:** `app/globals.css`, `tailwind.config.ts`, all `components/perks/*` primitives (CardArt, EligibilityChip, Segmented, HeatRow, Money, Eyebrow). Reuse these.
- **Recommendation panel UI:** `components/recommender/RecPanelDesktop.tsx`, `DrillIn.tsx`, `Header.tsx`. Currently reads stub data from `lib/data/stub.ts`. Wired to the real engine in TASK-09.

## Order

Run these in order. Each task may assume earlier tasks are complete.

1. ~~`TASK-01-card-data-loader.md`~~ — **DONE.** Data loader is already at `lib/data/loader.ts`. Schemas are at `scripts/lib/schemas.ts`. Skip this file or read it for historical context.
2. `TASK-02-engine-eligibility.md` — issuer rules engine (5/24, once-per-lifetime, etc.)
3. `TASK-03-engine-scoring.md` — per-card net annual value with realistic credits + perk dedup
4. `TASK-04-engine-ranking.md` — top-N selection, filter modes, "why" sentence generator
5. `TASK-05-profile-persistence.md` — Neon Postgres profile read/write hooks
6. `TASK-06-onboarding-spend.md` — sliders + live total + persist
7. `TASK-07-onboarding-brands.md` — brand and trip chip selection
8. `TASK-08-onboarding-cards.md` — search-and-add wallet builder, search powered by `db.cards`
9. `TASK-09-rec-page-wired.md` — replace stub data with engine output
10. `TASK-10-trip-planner.md` — destination → bookable today vs unlocked-by-new-card
11. `TASK-11-mobile-rec-panel.md` — three-tab compress, default to top 5
12. `TASK-12-states-and-tests.md` — empty/loading/error states + engine unit tests

## Working agreement

Each task lists a **Do Not Change** section. Honor it.

The recommendation engine in `lib/engine/` is a pure function. It accepts the user's profile and the loaded `CardDatabase` as inputs. It does not call APIs, does not touch Postgres, does not log to disk.

When work on a task is complete, run `npm run typecheck` and `npm run build`. Both must pass. The build runs `cards:build` first via prebuild hook, so a malformed card file will fail loud at that stage.

## Adding or fixing card data

If the engine implementation reveals that a card's markdown is missing a field or has a typo, fix the markdown (`cards/{card_id}.md`), run `npm run cards:build`, and you're done. If the schema needs to change, edit `scripts/lib/schemas.ts` and run typecheck — the schema is the contract between the markdown and the engine.

## Environment

- Node 22, Next.js 15.5.x, React 19.2.x stable, TypeScript 5.6, Tailwind 3
- `DATABASE_URL` is set in Vercel and `.env.local` for the auth/profile Postgres connection. Never paste real values into TASK output, commits, or comments — env var names only.
- Sessions are 30-day cookies, stored hashed in `perks_sessions`. Auth UX is "account name + password," no email verification.
