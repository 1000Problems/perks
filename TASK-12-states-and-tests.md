# TASK: Empty/loading/error states + engine integration tests

> Polish the moments when there's no data, the data is still computing, or something failed. Add an integration test that runs the engine end-to-end against a known fixture.

## Context

By this point the app is functional. This task is about the edges: cold-start (zero cards), loading skeletons during onboarding redirects, and a stale-data warning when the card database is more than 90 days old. Plus an integration test that locks in the rec ranking against a fixture so we don't regress when the engine is tweaked later.

## Requirements

1. **Cold start** — when a user has zero cards held, the rec panel still works (already true after TASK-09) but the left "Your wallet today" column shows a friendly empty state with a "Add cards →" link to `/onboarding/cards`.
2. **Loading skeleton** — when the rec page is rendering server-side and the engine is computing, show a skeleton layout for ~200ms minimum to avoid a flash. Reuse the `.skel` class from `app/globals.css`. Apply to the rank list area only; the surrounding chrome can render normally.
3. **Stale data warning** — at the bottom of the rec panel, render a small note: "Card data verified YYYY-MM-DD." Read the date from a top-level `data_freshness` field in `data/cards.json` (or derive from the latest `data_freshness` across all cards if there's no top-level field). If the date is older than 90 days, change the color to `var(--warn-ink)` and prefix with "⚠️ Card data may be stale —".
4. **Error state** — if the loader (TASK-01) throws on bad JSON in production, show a graceful error page: "We're having trouble loading our data. Try again in a few minutes." with a retry button. Don't expose the underlying Zod error to users (do log it server-side).
5. **Integration test** — `tests/engine/integration.test.ts` that:
   - Loads a fixture profile (representative US household, ~$30k annual spend, holds 2 cards)
   - Loads a fixture card database (10 cards, hand-curated)
   - Calls `rankCards(...)` with each filter mode
   - Asserts the top 3 by `total` filter match expected ids
   - Re-runs with a modified profile (spend doubled on dining) and asserts the rank shifts toward dining-heavy cards

## Implementation Notes

- For the empty wallet state, render inside the existing left-column container. Use the `.placeholder-stripe` style that exists in `globals.css` (or replace with a cleaner empty state — small icon, one-line message, link).
- Loading skeleton: use Suspense boundaries and a `loading.tsx` next to `app/(app)/recommendations/page.tsx`. Next.js handles the rest.
- Stale data warning: a small footer element below the recommendations list, before the disclosure paragraph.
- Error state: an `error.tsx` next to `app/(app)/recommendations/page.tsx`. Catches errors thrown by the loader. Doesn't catch component render errors (those are different — leave them to the framework default).
- Integration test fixture: hand-write a `tests/fixtures/profile.json` and `tests/fixtures/cards.json`. Don't auto-generate from the real data — fixtures should be stable and small.
- Add an `npm run test:integration` script if it makes sense, or fold into `npm run test`. Either is fine.

## Do Not Change

- `lib/engine/**` — no changes to the engine itself
- `lib/data/**`, `lib/profile/**` — settled
- Onboarding pages — TASK-06/07/08 own them
- Auth, middleware
- The rec panel's main visual layout — only adds states around it

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build && npm run test` pass
- [ ] Visiting `/recommendations` with zero held cards renders the cold-start empty state in the wallet column
- [ ] Visiting `/recommendations` shows the skeleton briefly, then the real content
- [ ] The bottom of the rec panel shows a date string from the card data
- [ ] If `data/cards.json` is corrupted, the error page renders (manually break the file to test, then restore)
- [ ] Integration test passes with the fixture, fails if the engine is broken (verify by temporarily breaking `scoreCard`)
- [ ] `git diff` shows changes in `components/recommender/**`, `app/(app)/recommendations/loading.tsx` (new), `app/(app)/recommendations/error.tsx` (new), `tests/engine/integration.test.ts` (new), `tests/fixtures/**` (new)

## Verification

1. `npm run typecheck && npm run build && npm run test`
2. Sign up a fresh user, complete onboarding without adding cards, land on `/recommendations` — confirm cold-start state
3. Manually corrupt `data/cards.json`, refresh — confirm error page
4. Break `scoreCard` to return 0 for everything, run integration tests — they should fail loudly
