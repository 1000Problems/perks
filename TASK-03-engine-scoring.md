# TASK: Per-card scoring engine

> Pure function that computes the marginal annual value of adding a candidate card to a user's wallet, with realistic credit valuation and perk dedup.

## Context

The headline number on every recommendation row is "+$X/year net." It's the dollars this card would add to the user's annual position after annual fee, after dedup against perks the wallet already has, after valuing statement credits at what the user would actually use. This number drives the entire ranking. The drill-in detail panel shows the line-item math, so the breakdown must be auditable.

## Requirements

1. Create `lib/engine/scoring.ts` exporting:
   ```ts
   export function scoreCard(
     card: Card,
     userProfile: UserProfile,
     wallet: WalletCardHeld[],
     db: CardDatabase,
     options: ScoringOptions,
   ): CardScore;

   export interface CardScore {
     deltaOngoing: number;
     deltaYear1: number;
     breakdown: ScoreLineItem[];
     spendImpact: Record<SpendCategoryId, { current: number; new: number }>;
     newPerks: { name: string; value: number | "unlocks"; note?: string }[];
     duplicatedPerks: string[];
   }
   ```
2. `ScoringOptions` includes `creditsMode: "realistic" | "face"` and `subAmortizeMonths: number` (default 24).
3. Realistic credit valuation: each `annual_credit` in a card record has an `ease_of_use` grade. Apply a multiplier in realistic mode: `easy=1.0`, `medium=0.75`, `hard=0.40`, `coupon_book=0.20`. In face mode, multiplier is always `1.0`.
4. Dedup logic: for each entry in `db.perksDedup` whose `card_ids` intersect with the user's `cards_held`, that perk is "already covered." If the candidate card claims that same perk in its `ongoing_perks`, count it as $0 in the breakdown and add it to `duplicatedPerks`.
5. Add unit tests in `tests/engine/scoring.test.ts` covering: a no-AF card on minimal spend, a premium card on heavy travel spend, a card whose perks fully overlap with the existing wallet.

## Implementation Notes

- Pure function. Same purity rules as TASK-02.
- `Card`, `CardDatabase`, `PerksDedupEntry` types from `@/lib/data/loader`.
- The `breakdown` array drives the drill-in "Show calculation" view. Each line item:
  ```ts
  interface ScoreLineItem {
    label: string;
    value: number;
    kind: "earning" | "credit" | "fee" | "perk" | "sub" | "other";
    note?: string;
  }
  ```
- For `spendImpact`, compute the user's best earning rate per category before and after adding this card. Walk `userProfile.cards_held` for "current" and `cards_held + candidate` for "new." This powers the heatmap delta in the drill-in.
- Year-1 delta = ongoing delta + (`signup_bonus.estimated_value_usd` × 12 / `subAmortizeMonths`). Skip the SUB if `signup_bonus` is null or if the user's wallet history shows ineligibility (TASK-02's eligibility result feeds in via TASK-04, so for now compute optimistically and let ranking gate it).
- Spend caps: a 5% category capped at $1,500/year only earns 5% on the first $1,500, then drops to the card's `everything_else` rate. Honor `cap_usd_per_year` on each `EarningRule`.
- Issuer portal multipliers: when an `EarningRule` has notes mentioning a specific portal (e.g., "Chase Travel"), only count that earning if the user's profile suggests they'd use that portal. For v1, assume 100% of `airfare`/`hotels` spend goes through the issuer's portal for cards that have a portal rate. Flag this in `data/RESEARCH_NOTES.md`-style comments as a known simplification.
- Don't throw on missing data — return `deltaOngoing: 0` with a single breakdown line `{ label: "Insufficient data", value: 0, kind: "other" }` if a critical field is missing. The card stays in the candidate pool; ranking will demote it.

## Do Not Change

- `lib/engine/eligibility.ts` — TASK-02 owns it; call it if needed
- `lib/engine/ranking.ts` — TASK-04
- `lib/data/**`, `scripts/**` — settled
- `app/**`, `components/**` — UI wiring is TASK-09
- `lib/auth/**`, `lib/db.ts` — settled
- Card markdown files — only edit on real data errors

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build && npm run test` all pass
- [ ] `scoreCard` is a pure function
- [ ] Three test scenarios in Requirement 5 pass
- [ ] Spend caps are respected (test case: $5,000 dining at 5% capped at $1,500 returns $75 + base-rate × $3,500)
- [ ] Realistic vs face credit modes return different totals (face is higher when `ease_of_use` < easy)
- [ ] Dedup: a card whose perks all overlap with the wallet returns no value from `newPerks`
- [ ] `git diff` shows changes only in `lib/engine/scoring.ts` and `tests/engine/scoring.test.ts`

## Verification

1. `npm run typecheck && npm run build && npm run test`
2. Manually score Chase Sapphire Reserve against a fixture wallet that already holds Sapphire Preferred — expect a meaningful number of `duplicatedPerks` (trip protections, etc.) and a small ongoing delta because most of CSR's perks are already covered.
3. Toggle credits mode in a test — face-value should be higher than realistic on premium cards.
