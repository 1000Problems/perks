# TASK: Empty/loading/error states + engine integration tests

> Polish the moments when there's no data, the data is still computing, or something failed. Add an integration test that runs the engine end-to-end against a known fixture.

## Context

By this point the app is functional. This task handles edges: cold-start (zero cards), loading skeletons during onboarding redirects, and a stale-data warning if the database is more than 90 days old. Plus an integration test that locks in rec ranking against a fixture so we don't regress when the engine is tweaked.

## Requirements

1. **Cold start** — when a user has zero cards held, the rec panel still works (already true after TASK-09) but the left "Your wallet today" column shows a friendly empty state with a "Add cards →" link to `/onboarding/cards`.
2. **Loading skeleton** — when the rec page is rendering server-side and the engine is computing, show a skeleton layout for ~200ms minimum to avoid a flash. Use the `.skel` class from `app/globals.css`. Apply to the rank list area only; surrounding chrome renders normally. Use Next.js `loading.tsx` next to the page.
3. **Stale data warning** — at the bottom of the rec panel, render "Card data verified YYYY-MM-DD" using `db.manifest.compiled_at`. If the date is older than 90 days, change the color to `var(--warn-ink)` and prefix with "⚠️ Card data may be stale —".
4. **Error state** — if `loadCardDatabase()` throws (e.g., `data/cards.json` missing or malformed because someone forgot to run `npm run cards:build`), show a graceful page: "We're having trouble loading our data. Try again in a few minutes." with a retry button. Use Next.js `error.tsx`. Don't expose Zod errors to users; do log them server-side.
5. **Integration test** — `tests/engine/integration.test.ts` that:
   - Loads a fixture profile (representative US household, ~$30k annual spend, holds 2 cards from the real database)
   - Loads the actual `loadCardDatabase()` (real card data)
   - Calls `rankCards(...)` with each filter mode
   - Asserts the top 3 by `total` filter match expected ids (use real card IDs from the data)
   - Re-runs with profile dining doubled — asserts rank shifts toward dining-heavy cards (Amex Gold should rise)

## Implementation Notes

- Empty wallet state: render inside the existing left-column container. Small icon + one-line message + link. Don't introduce new design tokens.
- Loading skeleton: Suspense boundary + `loading.tsx`. Next.js handles the rest.
- Stale data warning: small footer element below the rec list, before the disclosure paragraph.
- Error state: `error.tsx` next to the page. Catches loader errors. Doesn't catch component render errors — leave those to the framework default.
- Integration test fixture: hand-write `tests/fixtures/profile.json` referencing real card IDs from `data/cards.json` (run `npm run cards:build` first to ensure the file exists). The test loads the real database, not a stubbed one — this catches data-vs-engine mismatches.
- Add `npm run test` script if not already present.

## Do Not Change

- `lib/engine/**` — no engine changes
- `lib/data/**`, `scripts/**`, `lib/profile/**` — settled
- Onboarding pages — TASK-06/07/08 own them
- Auth + db
- The rec panel's main visual layout — only adds states around it

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build && npm run test` all pass
- [ ] Visiting `/recommendations` with zero held cards renders the cold-start empty state in the wallet column
- [ ] Visiting `/recommendations` shows the skeleton briefly, then real content
- [ ] The bottom of the rec panel shows a date string from `db.manifest.compiled_at`
- [ ] If `data/cards.json` is corrupted, the error page renders (test by manually breaking the file then restoring)
- [ ] Integration test passes against the real database; fails if the engine is broken (verify by temporarily breaking `scoreCard`)
- [ ] `git diff` shows changes in `components/recommender/**`, `app/(app)/recommendations/loading.tsx` (new), `app/(app)/recommendations/error.tsx` (new), `tests/engine/integration.test.ts` (new), `tests/fixtures/**` (new)

## Verification

1. `npm run typecheck && npm run build && npm run test`
2. Sign up a fresh user, complete onboarding without adding cards, land on `/recommendations` — confirm cold-start state
3. Manually corrupt `data/cards.json`, refresh — confirm error page (then run `npm run cards:build` to restore)
4. Break `scoreCard` to return 0 for everything, run integration tests — they should fail loudly
