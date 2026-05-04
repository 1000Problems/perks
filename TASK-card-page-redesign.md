# TASK: Card detail page redesign — value-thesis hero, pill unification, credits group

> Replace the cold-prompts panel with a brief value-thesis hero, unify all per-row chips to one tristate vocabulary (Got it / On my list / Not for me), reorder sections (Earning → Credits → Hotels → Airlines → Travel services → Shopping → Niche), and introduce a "credits" group for things with annual deadlines. Launch on `cards/citi_strata_premier.md`; other cards get a follow-up TASK.

## Context

The `/wallet/cards/[id]` page (`CardHero` → `HeroAdaptive` → `MoneyFindRow` → `CatalogGroup`) currently opens with three "cold prompts" that duplicate data already captured on the Brands & Trips settings page (`profile.trips_planned`, brand prefs). Per-row chip vocabulary is fragmented — five chip-label sets for what `CardPlayState.state` stores as a single `using` / `going_to` / `skip` / `unset` enum. Section ordering puts Earning fifth, even though for an already-held card it's the highest-frequency value driver. Annual credits are scattered across Hotels and Shopping when they share a distinct urgency rhythm.

This TASK ships the agreed redesign (Cowork conversation 2026-05-03): kill cold prompts, add a value-thesis hero anchored to concrete dollar figures, unify chips, move Earning to the top, group annual credits.

## Requirements

1. **Stop rendering cold prompts.** In `components/wallet-v2/HeroAdaptive.tsx`, the `ColdHero` component must not appear on any code path. Do NOT delete the existing CardPlayState write path for `play_id: cold:*` — leave it dormant for backward compat. A follow-up TASK will migrate the data.

2. **Add `value_thesis` to the Card schema** in `scripts/lib/schemas.ts`, optional during rollout:

   ```ts
   value_thesis: z.object({
     headline: z.string(),
     net_af_line: z.string(),
     structural_edge: z.string(),
     ecosystem_line: z.object({
       text: z.string(),
       show_if_holds_any: z.array(z.string()),
     }).optional(),
   }).optional()
   ```

3. **New `ValueThesisHero` component** at `components/wallet-v2/ValueThesisHero.tsx`. Renders an eyebrow headline, three lines of body copy, then a single horizontal row of non-interactive section chips showing `{group_label} {$total}` for each non-empty group. Conditional render of `ecosystem_line` based on whether `profile.cards_held` includes any card_id from `show_if_holds_any`. When `value_thesis` is undefined on the card, render the existing post-cold-prompt header (no hero) — do not crash.

4. **Unify chip vocabulary** in `components/wallet-v2/MoneyFindRow.tsx`. Replace the five `chips` arrays inside `QUESTION_LABELS` with a single shared chip set used for all question types:

   ```ts
   const CHIPS = [
     { value: "using" as FindStatus, label: "Got it" },
     { value: "going_to" as FindStatus, label: "On my list" },
     { value: "skip" as FindStatus, label: "Not for me" },
   ];
   ```

   Keep the `question` strings inside `QUESTION_LABELS[type]` — the per-row prompt above the chips ("Spending here regularly?", "Filed a trip-delay claim?", etc.) still varies by domain. Only the chips collapse. Preserve the `data-tone={c.value}` attribute on each chip — CSS styling depends on it.

5. **Update the "FOR YOUR WALLET / We need a few more answers" footer copy** to reference `Got it`, `On my list`, `Not for me` instead of the current `using, going to, not for me` mismatch. The string lives in `components/wallet-v2/CardHero.tsx` (or one of its descendants — grep for "more answers above").

6. **Add `"credits"` to the `PlayGroup` enum** in `scripts/lib/schemas.ts`. Update group order and labels in `lib/engine/moneyFind.ts`:

   ```ts
   GROUP_ORDER = ["cash", "credits", "hotels", "airlines", "travel_services", "shopping", "niche"]
   GROUP_LABELS["credits"] = "Credits to burn this year"
   ```

   `cash` is already labeled "Earning" — keep that label, do not rename the key.

7. **Re-tag Citi Strata Premier annual credits** in `cards/citi_strata_premier.md`:
   - `hotel_credit_100`: group `"hotels"` → `"credits"`
   - `dashpass_trial`: group `"shopping"` → `"credits"`
   - `instacart_plus`: group `"shopping"` → `"credits"`
   - **Add a new play `lyft_monthly_credit`** in group `"credits"`. Value model `fixed_credit` $60/yr (calendar_year). Question `set_up`. Signal_id `rideshare_user`. Mechanism: enroll the Strata Premier at mastercard.com/lyft; $5 credit each month after 3+ Lyft rides. The data already exists in `ongoing_perks` — promote it to a play.
   - Leave `luxury_hotels_breakfast` in `"hotels"` (per-stay, not annual reset).

8. **Author `value_thesis` on Citi Strata Premier** in `cards/citi_strata_premier.md` inside the cards.json block, using exactly this copy:

   ```json
   "value_thesis": {
     "headline": "Why this card earns its keep",
     "net_af_line": "$95 annual fee minus the $100 hotel credit = effectively pays for itself.",
     "structural_edge": "One of two cards in America that transfers points 1:1 to American AAdvantage — turning 60,000 points into a JAL business seat to Tokyo that retails for $4,000+.",
     "ecosystem_line": {
       "text": "Pool points from your Double Cash and Custom Cash into this card and your 2% / 5% cashback becomes 1:1 transferable points — about a 30% value boost on every dollar.",
       "show_if_holds_any": ["citi_double_cash", "citi_custom_cash"]
     }
   }
   ```

9. **Rebuild the card DB.** `npm run cards:build` must regenerate `data/cards.json` and `data/manifest.json` without schema errors.

## Implementation Notes

- The route is `app/(app)/wallet/cards/[id]/page.tsx`. It hydrates `CardHero` with serialized DB + profile + initial play state. Don't touch the route file unless prop wiring requires it.
- `CardHero` composes (in order): `DeadlinesStrip`, `HeroAdaptive`, `CatalogGroup` per group, `MechanicsZone`, `CrossCardTile`, `ManageCardDisclosure`. Replace only the `ColdHero` branch in `HeroAdaptive` — `WarmHero` and `HotHero` are out of scope.
- `HeroAdaptive` decides which hero variant based on how many CardPlayState rows exist. After this TASK: when `card.value_thesis` is defined, render `ValueThesisHero` instead of any cold/warm variant. The Hot variant (high-state-count user) can remain — a returning user with lots of state still benefits from a recap. Final logic:

  ```
  if (card.value_thesis && stateCount < HOT_THRESHOLD) → ValueThesisHero
  else if (stateCount >= HOT_THRESHOLD) → HotHero
  else → null (no hero, just go straight to catalog groups)
  ```

- The section chip row inside `ValueThesisHero` should pull totals from the same `findsByGroup()` output that `CatalogGroup` consumes downstream — pass it down as a prop from `CardHero`. Don't recompute.
- Conditional render for `ecosystem_line`: `profile.cards_held.some(h => show_if_holds_any.includes(h.card_id))`.
- After collapsing chip vocabularies, `data-tone` values stay `using` / `going_to` / `skip` — existing CSS in `app/wallet-edit-v2.css` should still apply. Verify by visual inspection; no rule rename should be needed.
- Engine signal-reading (replacing the cold-prompts data with reads from `profile.trips_planned` etc.) is OUT of scope for this TASK. The page will simply not have those gating questions for now. A follow-up TASK adds inline microlinks ("Add Japan to your trips →") on rows that need profile signals we don't yet have.

## Do Not Change

- `lib/db.ts` — DB connection layer
- `lib/profile/server.ts`, `lib/profile/types.ts` — profile contract is stable
- `app/(app)/layout.tsx` — auth gate
- `lib/engine/eligibility.ts`, `lib/engine/scoring.ts`, `lib/engine/ranking.ts` — pure engine, no UI coupling
- `data/*.json` — generated artifacts (gitignored), derived from `cards/*.md` via `npm run cards:build`
- All `cards/*.md` files **except** `cards/citi_strata_premier.md`
- `components/onboarding/BrandsForm.tsx` — settings page is separate
- `CardPlayState.state` enum in `lib/engine/types.ts` — keep `using` / `going_to` / `skip` / `unset` literals exactly as they are
- The cold-prompt CardPlayState write path (`play_id: cold:*`) — leave dormant
- `components/wallet-v2/HeroAdaptive.tsx` — `WarmHero` and `HotHero` variants
- The Citi Strata Premier `card_plays` entries other than the four listed in Requirement 7

## Acceptance Criteria

- [ ] `npm run cards:build` succeeds; `data/cards.json` contains the new `value_thesis` field on `citi_strata_premier` and `"group": "credits"` on the four credit plays.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Visiting `/wallet/cards/citi_strata_premier` (logged in, card held) shows: top alert strip → header card → **ValueThesisHero with three body lines + section chip row** (no cold-prompts panel) → groups in order Earning → Credits to burn this year → Hotels → Airlines → Travel services → Shopping → Niche → Calendar → Manage card.
- [ ] Every per-row chip across every group on the page reads exactly one of: **Got it**, **On my list**, **Not for me**. No other chip vocabulary appears anywhere.
- [ ] The "FOR YOUR WALLET / We need a few more answers" footer copy references `Got it`, `On my list`, `Not for me` (matches the chips above it).
- [ ] With test profile holding neither `citi_double_cash` nor `citi_custom_cash`, the hero `ecosystem_line` is hidden. With either held, it appears.
- [ ] Browser console shows no errors on the redesigned page.
- [ ] `git diff --name-only` shows changes only in: `cards/citi_strata_premier.md`, `scripts/lib/schemas.ts`, `lib/engine/moneyFind.ts`, `components/wallet-v2/HeroAdaptive.tsx`, `components/wallet-v2/MoneyFindRow.tsx`, `components/wallet-v2/CardHero.tsx`, new file `components/wallet-v2/ValueThesisHero.tsx`, and (optionally) `app/wallet-edit-v2.css`. No other files modified.

## Verification

1. Run in sequence: `npm run cards:build && npm run typecheck && npm run lint && npm test && npm run build`. Each must succeed.
2. `npm run dev`, log in, ensure the test user holds `citi_strata_premier`, navigate to `/wallet/cards/citi_strata_premier`, and visually verify each acceptance criterion.
3. Toggle the test profile's `cards_held` to add then remove `citi_double_cash`; confirm the ecosystem_line in the hero appears and disappears accordingly.
4. `git diff --name-only` and confirm the file list matches the acceptance criteria.
5. Open the browser DevTools console on the redesigned page; confirm zero errors and zero React warnings.
