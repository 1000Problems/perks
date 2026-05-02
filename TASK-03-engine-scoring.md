# TASK: Per-card scoring engine

> Pure function that computes the marginal annual value of adding a candidate card to a user's wallet, with realistic credit valuation and perk dedup.

## Context

The headline number on every recommendation row is "+$X/year net." That's the number of dollars this card would add to the user's annual position after annual fee, after dedup with their existing wallet, after valuing statement credits at what they'd actually use. This number drives the entire ranking. It must be auditable — the drill-in detail panel shows the line-item math.

## Requirements

1. Create `lib/engine/scoring.ts` exporting:
   ```ts
   export function scoreCard(
     card: Card,
     userProfile: UserProfile,
     wallet: WalletCardHeld[],
     perksDedup: PerksDedup,
     options: ScoringOptions,
   ): CardScore;

   export interface CardScore {
     deltaOngoing: number;       // net annual value added in steady-state
     deltaYear1: number;         // includes amortized SUB
     breakdown: ScoreLineItem[]; // for the drill-in math view
     spendImpact: Record<SpendCategoryId, { current: number; new: number }>;
     newPerks: { name: string; value: number | "unlocks"; note?: string }[];
     duplicatedPerks: string[];
   }
   ```
2. `ScoringOptions` includes `creditsMode: "realistic" | "face"` and `subAmortizeMonths: number` (default 24).
3. Realistic credit valuation: each `annual_credit` in the card data has an `ease_of_use` grade (`easy`/`medium`/`hard`/`coupon_book`). Apply a multiplier: easy=1.0, medium=0.75, hard=0.40, coupon_book=0.20.
4. Dedup logic: if the user already has a perk listed in `perksDedup.json` from any held card, count the new card's version of that perk as $0 toward the delta and add it to `duplicatedPerks`.
5. Add unit tests in `tests/engine/scoring.test.ts` covering: a no-AF card on minimal spend, a premium card on heavy travel spend, a card whose perks fully overlap with the existing wallet.

## Implementation Notes

- Pure function. Same purity rules as TASK-02.
- The `breakdown` array drives the drill-in "Show calculation" view. Each line item has a label, a value (with sign), and an optional note. Example shape:
  ```ts
  { label: "Dining $4,200 × 5%", value: 210, kind: "earning" }
  { label: "Travel credit (realistic)", value: 280, kind: "credit" }
  { label: "Annual fee", value: -550, kind: "fee" }
  { label: "SUB amortized over 24mo", value: 875, kind: "sub" }
  ```
- For `spendImpact`, compute the user's best earning rate per category before and after adding this card — this powers the heatmap delta in the drill-in.
- Year-1 delta = ongoing delta + (`signup_bonus.estimated_value_usd` × 12 / `subAmortizeMonths`). Year-1 bonus is one-time so amortizing over 24 months gives the realistic ongoing-equivalent.
- Spend caps matter: a 5% category capped at $1,500/year only earns 5% on the first $1,500 of that category, then drops to the base rate. Honor the `cap_usd_per_year` field on each `EarningRule`.
- Issuer portal multipliers: when an `EarningRule` has `notes: "Through Chase Travel"` (or similar), only count that earning if the user spends through that portal. For now, assume 100% of `airfare`/`hotels` spend goes through the issuer portal if the card has a portal-specific rule. Flag this in `RESEARCH_NOTES.md` as a future refinement.
- Do not throw on missing data — return `deltaOngoing: 0` and an empty breakdown with a note line "Insufficient data" if a critical field is missing.

## Do Not Change

- `lib/engine/eligibility.ts` — TASK-02 owns it
- `lib/engine/ranking.ts` — TASK-04
- `lib/data/**` — schemas are settled
- `app/**`, `components/**` — UI wiring is TASK-09
- `lib/auth/**`, `lib/supabase/**` — settled

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build && npm run test` all pass
- [ ] `scoreCard` is a pure function — no I/O
- [ ] Three test scenarios in Requirement 5 pass
- [ ] Spend caps are respected (test case: $5,000 dining at 5% capped at $1,500 returns $75 + base-rate × $3,500)
- [ ] Realistic vs face credit modes return different totals
- [ ] `git diff` shows changes only in `lib/engine/scoring.ts` and `tests/engine/scoring.test.ts`

## Verification

1. `npm run typecheck && npm run build && npm run test`
2. Manually score Voyager Reserve against the stub wallet — delta should be in the ballpark of the existing stub value ($612 ongoing)
3. Toggle credits mode in a test — face-value should be higher than realistic
