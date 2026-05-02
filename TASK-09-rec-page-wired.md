# TASK: Wire the recommendation page to the engine and profile

> Replace stub data in the recommendation panel with real engine output computed from the user's profile and the card database. This is the moment the app stops being a static design and starts being a tool.

## Context

The recommendation page (`app/(app)/recommendations/page.tsx`) currently renders `<RecPanelDesktop />` which reads stub data from `lib/data/stub.ts`. After TASK-01 through TASK-05, we have real card data, a real engine, and a real profile layer. This task wires them together.

## Requirements

1. Modify `app/(app)/recommendations/page.tsx` (server component) to:
   - Read the user's profile via `getCurrentProfile()`
   - Load the card database via the loader
   - If profile is empty (no spend_profile, no cards), redirect to `/onboarding/spend`
   - Otherwise pass `{ profile, db }` to `<RecPanelDesktop>`
2. Modify `components/recommender/RecPanelDesktop.tsx` (client component) to:
   - Accept `{ profile, db }` props
   - Call `rankCards(db.cards, profile, profile.cards_held, db, options)` from `lib/engine/ranking.ts`
   - Use the result for the middle column instead of `RECOMMEND_CARDS`
   - Use the user's actual `cards_held` (resolved against `db.cards`) for the left-column wallet display
   - Compute `WALLET_BEST_RATES` live from the user's wallet rather than reading from stub
3. Toggling "Year 1" / "Ongoing" updates which delta is shown in the rank list and drill-in (already a state — wire `view` mode through the engine call so the right value is rendered).
4. Toggling "Realistic credits" / "Face value" passes the corresponding `creditsMode` to the engine and triggers a re-rank.
5. Clicking a card in the middle column updates `selectedId`, the right-column drill-in renders the selected card's score breakdown using the engine's `breakdown` array (not the hard-coded `MathRow` calls in TASK-09 baseline).

## Implementation Notes

- The engine returns enough data to render the entire rec panel — don't reach back into raw cards from the UI. The drill-in math comes from `score.breakdown`. The spend-impact heatmap comes from `score.spendImpact`. The new perks list comes from `score.newPerks`. Duplicated perks come from `score.duplicatedPerks`.
- Keep the visual layout exactly as-is. This task is about replacing the data source, not redesigning.
- The "destination" line ("For your Phoenix trip in March") is currently hard-coded in `DrillIn.tsx`. Replace it with logic that picks the user's first `trips_planned` entry and matches it against `db.destinationPerks` for the selected card's transfer partners. If no match, hide the line.
- Re-rank when `view`, `credits`, or `filter` changes — do this with `useMemo` keyed on those values plus `profile`. The engine is fast enough that recomputing on every toggle is fine.
- If the user has zero cards held, render the cold-start state (TASK-12 polishes it; for now an empty wallet column is acceptable but the rank list should still show).

## Do Not Change

- `lib/engine/**` — call it, don't modify
- `lib/data/**`, `lib/profile/**` — settled
- `components/perks/**` — primitives stay as-is
- `components/recommender/Header.tsx` — fine as-is
- Auth pages, onboarding pages, middleware

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Visiting `/recommendations` with a populated profile shows real ranked cards from `data/cards.json`, not stub names like "Voyager Reserve"
- [ ] Visiting `/recommendations` with an empty profile redirects to `/onboarding/spend`
- [ ] Toggling Year 1 / Ongoing changes the displayed delta values
- [ ] Toggling Realistic / Face changes the delta values (typically face is higher)
- [ ] Toggling filter modes (Total / Pay-self / No-fee / Premium) reorders the list correctly
- [ ] Clicking a card in the middle column updates the right pane drill-in to that card's score
- [ ] The "Phoenix trip" destination line either shows a real match or is hidden
- [ ] `git diff` shows changes mainly in `app/(app)/recommendations/page.tsx` and `components/recommender/RecPanelDesktop.tsx` and `components/recommender/DrillIn.tsx`

## Verification

1. `npm run typecheck && npm run build`
2. Sign in, complete onboarding, land on `/recommendations`
3. Confirm the cards shown are real cards from the research data
4. Edit `spend_profile` directly in Supabase to bump dining 10x, refresh — Sapphire-tier-equivalents should jump in the rank
5. Toggle every UI control and confirm the rank/values update
