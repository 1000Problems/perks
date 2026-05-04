# TASK: Recommendations — consume `feeder_pair` from held cards

> Surface missing feeders as ranked recommendations on `/recommendations`. For every card the user holds that has `card.feeder_pair`, the cards in `feeder_card_ids` not yet held should appear pinned at the top of the list, ordered by `recommendation_priority`, with the why-line replaced by `value_when_missing`.

## Context

The card detail page (`/wallet/cards/[id]`) used to render a `FeederPairBlock` panel labeled "YOUR HIGHEST-LEVERAGE NEXT CARD". TASK-program-cpp-overrides.md removed that inline render — cross-card recs don't belong on the detail page. The `feeder_pair` data on every relevant `cards/*.md` is the source of truth and stays untouched; this TASK wires it into the recommendations engine.

The `recommendation_priority` field on `feeder_pair` (`"first" | "high" | "normal"`, default `"normal"`) was authored months ago specifically for this consumer. The TASK-card-page-redesign-v2 spec said it would be wired on `/recommendations` in a follow-up — that's now.

The engine path: `rankCards` already has a brand-pin pass that lifts cobrand cards (Costco, Hilton) ahead of the regular sorted list. The feeder-pin pass mirrors that pattern, runs *before* the brand-pin pass for `"first"` priority, *after* for `"high"`, and stays unpinned for `"normal"`. Why-line override is independent of pin order — any feeder candidate gets `value_when_missing` regardless of priority.

## Requirements

### 1. Feeder-candidate computation in `lib/engine/ranking.ts`

Add a pure helper at the top of the ranker:

```ts
interface FeederCandidate {
  cardId: string;
  priority: "first" | "high" | "normal";
  whyOverride: string;        // value_when_missing
  sourceCardId: string;       // the held card whose pair this feeder belongs to
  pairRole: "currency_pooler" | "category_specialist" | "annual_credit_stacker";
}

function computeFeederCandidates(
  wallet: WalletCardHeld[],
  db: CardDatabase,
): Map<string, FeederCandidate>
```

Walk every held card. For each card with `feeder_pair`, take every id in `feeder_card_ids` that is NOT in the wallet's held set. Emit a `FeederCandidate` keyed by the missing card id.

**Tiebreak when multiple held cards reference the same feeder:** keep the one with the highest `recommendation_priority` (`first > high > normal`). When priorities are equal, keep the first one encountered (deterministic by wallet iteration order).

### 2. Pinning in `rankCards`

In the existing pin block (currently brand-only), build two lists:

```ts
// Cards in the candidate set whose id appears in feederCandidates.
const feederFirst: Row[]   = [];  // priority === "first"
const feederHigh: Row[]    = [];  // priority === "high"
// "normal" priority feeders DON'T pin — they fall through to the
// regular sorted list. They still get the why-override.
```

Final pinned order, top to bottom:

1. `feederFirst` — feeders the held card flagged as `recommendation_priority: "first"`. These are completion-of-trifecta plays (e.g. Strata Premier → Custom Cash).
2. `pinned` (existing brand-pinned cobrand) — Costco / Hilton / United style.
3. `feederHigh` — `recommendation_priority: "high"`.
4. `rest` — the regular sorted list.

Skip the pin entirely under category sort and specialization sort, matching the brand-pin behavior — the user has chosen a single ranking axis and feeder pinning would override that signal.

### 3. Why-line override in `generateWhy`

`generateWhy` accepts the existing `WhyContext` plus an optional `feederWhy?: string`. When provided, return it directly (after `clip()`). The feeder copy already reads as a complete sentence (e.g. "Pools cashback into Strata Premier — converts 1¢ to 1.9¢ on every dollar."), no opener needed.

Wire-up: in `rankCards`, when iterating candidates, look up `feederCandidates.get(card.id)?.whyOverride` and pass it as `feederWhy` to `generateWhy`.

### 4. Thread `programOverrides` through the recommendations page

The same TASK-program-cpp-overrides change that landed `programOverrides` on the per-card page should also hit `/recommendations`. Wire it:

- `app/(app)/recommendations/page.tsx`: call `getProgramCppOverrides(userId)` alongside `getUserSignals`, serialize, pass as `programOverrides` prop.
- `components/recommender/RecPanelDesktop.tsx` and `RecPanelMobile.tsx`: accept `programOverrides?: Record<string, ProgramCppOverride>`, reconstruct as `Map`, pass to `rankCards` as the 7th argument.

### 5. Test coverage

Extend `tests/engine/integration.test.ts` (or `tests/engine/ranking.test.ts`) with a feeder-pair test:

- Profile holds Strata Premier; no Double Cash, no Custom Cash.
- Run `rankCards` over the real db.
- Assert at least one of `citi_double_cash` / `citi_custom_cash` lands in `r.visible` with rank 1 (or close to top), and that its `why` matches the `value_when_missing` text from the Strata Premier markdown.

## Implementation Notes

- **Schema is unchanged.** All authored data already exists in the markdown.
- **`generateWhy` signature change** is additive — make `feederWhy` optional so other callers don't break.
- **Eligibility still applies.** A feeder card that's red-listed (e.g. churn rule) shouldn't pin. Drop the candidate from the feeder pin lists if `eligibility.status === "red"` and let it fall through into the `denied` bucket on its normal path.
- **Self-reference loop guard.** If a card's `feeder_pair.feeder_card_ids` includes its own id (it shouldn't, but defensively), skip — never recommend a held card.
- **No fixture changes.** The integration test loads the real card db; Strata Premier already has `feeder_card_ids: ["citi_double_cash", "citi_custom_cash"]` in `cards/citi_strata_premier.md`.

## Do Not Change

- **`scripts/lib/schemas.ts`** — `feeder_pair` shape stays.
- **`cards/*.md`** — no markdown edits.
- **Brand-pin logic** — the new feeder-pin pass sits alongside, not inside.
- **`components/wallet-v2/FeederPairBlock.tsx`** — leave alone. May be reused later for an inline "missing feeder" tile inside a rec card.

## Acceptance Criteria

- [ ] `npm run typecheck`, `npm run lint`, `npm test` all pass.
- [ ] On `/recommendations`, with Strata Premier held and Double Cash + Custom Cash NOT held, at least one of those two cards appears at rank 1 with a why-line drawn from the Strata Premier's `value_when_missing`.
- [ ] Removing Strata Premier from the wallet drops the pin — the feeders no longer appear at the top.
- [ ] Editing Citi TY transfer cpp via the Strata page also moves rankings on `/recommendations` (programOverrides threading).
- [ ] `git diff` is scoped to: `lib/engine/ranking.ts`, `app/(app)/recommendations/page.tsx`, `components/recommender/RecPanel*.tsx`, the new test.
