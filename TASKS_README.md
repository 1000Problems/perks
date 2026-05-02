# TASKS — handoff to Claude Code

Twelve TASK files split the work of completing the perks app into mergeable, sequential units. Each is self-contained: Code can run against any one of them with no prior session memory.

## Order

Run these in order. Each task may assume earlier tasks are complete; the dependencies are noted in each spec.

1. `TASK-01-card-data-loader.md` — Zod schemas + loader for `data/*.json`, replace `lib/data/stub.ts`
2. `TASK-02-engine-eligibility.md` — issuer rules engine (5/24, once-per-lifetime, etc.)
3. `TASK-03-engine-scoring.md` — per-card net annual value with realistic credits + perk dedup
4. `TASK-04-engine-ranking.md` — top-N selection, filter modes, "why" sentence generator
5. `TASK-05-profile-persistence.md` — Supabase profile read/write hooks
6. `TASK-06-onboarding-spend.md` — sliders + live total + persist
7. `TASK-07-onboarding-brands.md` — brand and trip chip selection
8. `TASK-08-onboarding-cards.md` — search-and-add wallet builder with open-date and SUB-received
9. `TASK-09-rec-page-wired.md` — replace stub data with engine output
10. `TASK-10-trip-planner.md` — destination → bookable today vs unlocked-by-new-card
11. `TASK-11-mobile-rec-panel.md` — three-tab compress, default to top 5
12. `TASK-12-states-and-tests.md` — empty/loading/error states + engine unit tests

## Working agreement

Each task lists a **Do Not Change** section. Honor it. Scaffolding is intentional — if a file isn't listed under Implementation Notes for the task you're on, leave it alone.

The recommendation engine in `lib/engine/` is a pure function. It does not call APIs, does not touch Supabase, does not log to disk. The component that hosts it does I/O; the engine does math.

When work is complete, run `npm run typecheck` and `npm run build`. Both must pass with zero errors before the task is done.

## Inputs you'll receive alongside this folder

- `data/cards.json`, `data/programs.json`, `data/issuer_rules.json`, `data/perks_dedup.json`, `data/destination_perks.json` — produced by the research pass per `RESEARCH_PROMPT_FOR_CODE.md`
- `data/RESEARCH_NOTES.md` — ambiguities and conflicts flagged during research

If any data file is missing, fall back to the existing `lib/data/stub.ts` shape and flag it in your output. Do not invent data.

## Environment

- Node 22, Next.js 15, React 19 RC, TypeScript 5.6, Tailwind 3
- Supabase URL and anon key live in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Never paste real keys into TASK output, commits, or comments — env var names only.
- Supabase email verification is OFF. The auth flow uses "account name" UX with a silent transform to email shape (see `lib/auth/account.ts`). Don't change this.

## When stuck

Read `ARCHITECTURE.md` first. It explains why decisions were made. If the architecture and a TASK spec disagree, surface the conflict before coding — don't pick one silently.
