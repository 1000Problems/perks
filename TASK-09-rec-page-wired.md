# TASK: Wire the recommendation page to the engine and profile

> Replace stub data in the recommendation panel with real engine output computed from the user's profile and the compiled card database.

## Context

The recommendation page (`app/(app)/recommendations/page.tsx`) currently renders `<RecPanelDesktop />` reading stub data from `lib/data/stub.ts`. After TASK-01 (done) through TASK-05, we have a real card database, a real engine, and a real profile layer. This task wires them together.

## Requirements

1. Modify `app/(app)/recommendations/page.tsx` (server component):
   - Read the profile via `getCurrentProfile()`
   - Load the database via `loadCardDatabase()`
   - If profile has zero `spend_profile` data and zero `cards_held`, redirect to `/onboarding/spend`
   - Otherwise pass `{ profile, db }` to `<RecPanelDesktop>`
2. Modify `components/recommender/RecPanelDesktop.tsx`:
   - Accept `{ profile, db }` props
   - Replace stub data: call `rankCards(profile, profile.cards_held, db, options)` from TASK-04 for the middle column
   - Resolve `profile.cards_held` against `db.cardById` for the left-column wallet display
   - Compute best earning rates per category live from the user's wallet (use the same logic as TASK-03's `spendImpact`)
3. Toggling "Year 1 / Ongoing" updates which delta is shown.
4. Toggling "Realistic credits / Face value" passes the corresponding `creditsMode` to the engine and triggers a re-rank.
5. Clicking a card in the middle column updates `selectedId`. The right-column drill-in renders that card's score breakdown using the engine's `breakdown` array (not the hard-coded `MathRow` calls in the current `DrillIn.tsx`).

## Implementation Notes

- The engine returns enough data to render the entire rec panel — don't reach back into raw cards from the UI. The drill-in math comes from `score.breakdown`. Spend impact comes from `score.spendImpact`. New perks come from `score.newPerks`. Duplicated perks come from `score.duplicatedPerks`.
- Keep visual layout exactly as-is. This task is data-source replacement, not redesign.
- The "destination" line currently hard-coded in `DrillIn.tsx` ("For your Phoenix trip in March: ..."): replace with logic that picks the user's first `trips_planned` entry and matches against `db.destinationPerks` for the selected card's `currency_earned` program. Hide the line if no match.
- Re-rank when `view`, `credits`, or `filter` changes — `useMemo` keyed on those plus `profile`. Engine is fast enough.
- If the user has zero held cards, render the cold-start empty state in the wallet column (TASK-12 polishes; for v1 just render a small "No cards yet" note).
- Card art: same placeholder mapping as TASK-08 (issuer/currency → variant). Real art is a separate effort.

## Do Not Change

- `lib/engine/**` — call it, don't modify
- `lib/data/**`, `lib/profile/**`, `scripts/**` — settled
- `components/perks/**` — primitives stay
- `components/recommender/Header.tsx` — fine as-is
- Auth, onboarding, middleware

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Visiting `/recommendations` with a populated profile shows real cards from `data/cards.json`, not stub names like "Voyager Reserve"
- [ ] Visiting `/recommendations` with empty profile redirects to `/onboarding/spend`
- [ ] Year 1 / Ongoing toggle changes displayed delta values
- [ ] Realistic / Face toggle changes delta values (face higher when card has hard-to-use credits)
- [ ] Filter modes (Total / Pay-self / No-fee / Premium) reorder the list correctly
- [ ] Clicking a card updates the right pane drill-in to that card's score
- [ ] The "Phoenix trip" destination line either shows a real match or is hidden
- [ ] `git diff` shows changes mainly in `app/(app)/recommendations/page.tsx`, `components/recommender/RecPanelDesktop.tsx`, `components/recommender/DrillIn.tsx`

## Verification

1. `npm run typecheck && npm run build`
2. Sign in, complete onboarding, land on `/recommendations`
3. Confirm the cards shown are real cards (Sapphire Preferred, Amex Gold, Venture X, etc.)
4. Edit `spend_profile` in Neon to bump dining 10x, refresh — dining-heavy cards (Amex Gold, Sapphire family) should jump in rank
5. Toggle every UI control and confirm rank/values update
