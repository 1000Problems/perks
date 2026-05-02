# TASK: Cash vs points split — engine + data foundation

> Split the rewards-from-spend bucket into two streams (cash, points) so the recommendation engine can tell statement-credit dollars apart from loyalty currency. Engine + data layer only; UI lands in a follow-up TASK.

## Context

Today the scoring engine collapses cashback and points into a single `spendOngoing` dollar number via `cppForCurrency` (`lib/engine/scoring.ts:82-89`). Amex BCP's 6% on groceries (cash, 1.0 cpp) and CSP's 3x on dining (UR points at 1.25 cpp portal) both surface as identical "$/yr" deltas in the same SPEND pillar. The user can't see which dollars hit their account as statement credit and which sit as loyalty currency they'll need to redeem.

There's also a paired-mode case the engine ignores entirely: Chase Freedom Unlimited's `currency_earned` is `chase_ur`, but the card earns plain cashback unless the user holds a Sapphire/Ink Preferred. Same for Citi Double Cash + Strata Premier. The engine reads `currency_earned: chase_ur` and applies portal cpp regardless of wallet — overstating value for users who don't hold the unlocking card.

This TASK introduces a structured cash/loyalty classification at the program level, a per-wallet effective-mode resolver in the engine, and a split `CardScoreComponents` shape. A back-compat `spendOngoing` derived field keeps the existing UI rendering unchanged. The follow-up TASK (`TASK-cash-points-split-ui.md`, not yet written) replaces the two-pillar `ValuePillars` with three pillars (CASH / POINTS / PERKS) and updates the spend-coverage heatmap.

There are no production wallets to migrate — the database is pre-launch. Score outputs may shift for any test fixture once paired-mode resolution lands; that's the intended behavior, not a regression.

## Requirements

1. **Program schema gains two fields.** In `scripts/lib/schemas.ts`, extend `ProgramSchema`:
   ```ts
   kind: z.enum(["cash", "loyalty"]).optional(),
   transfer_unlock_card_ids: z.array(z.string()).default([]),
   ```
   Both fields surface on the runtime `Program` type via `z.output`.

2. **Build script derives `kind` when missing.** In `scripts/build-card-db.ts`, after parsing each program, set `program.kind` if absent:
   - `kind = "loyalty"` when `program.type === "transferable"` OR `program.type` starts with `"cobrand_"` OR `program.transfer_partners.length > 0`.
   - `kind = "cash"` otherwise (covers `fixed_value` programs with no transfer partners — Amex cashback, Discover cashback, Capital One Quicksilver Rewards, PayPal cashback, etc.).

   The build writes the populated `kind` into `data/programs.json` so the loader sees a fully-populated field every time. After this TASK, `kind` may be authored explicitly in markdown to override the derivation; existing markdown does not need editing for the derivation to work.

3. **Editorial: populate `transfer_unlock_card_ids` on the five transferable programs.** Edit the five card markdown files that own transferable program definitions. Add the field inside each `programs.json entry` JSON block:

   - `cards/chase_sapphire_preferred.md` (`chase_ur`):
     ```json
     "transfer_unlock_card_ids": [
       "chase_sapphire_preferred",
       "chase_sapphire_reserve",
       "chase_ink_business_preferred"
     ]
     ```
   - `cards/amex_gold.md` (`amex_mr`):
     ```json
     "transfer_unlock_card_ids": [
       "amex_gold",
       "amex_platinum",
       "amex_green",
       "amex_business_gold",
       "amex_business_platinum",
       "amex_blue_business_plus",
       "amex_schwab_investor",
       "amex_platinum_schwab",
       "amex_platinum_morgan_stanley"
     ]
     ```
   - `cards/citi_strata_premier.md` (`citi_thankyou`):
     ```json
     "transfer_unlock_card_ids": [
       "citi_strata_premier",
       "citi_strata_elite"
     ]
     ```
   - `cards/capital_one_venture_x.md` (whatever its program id is — check the file; likely `capital_one_miles`): list the Capital One cards that grant transfer access (Venture, Venture X, Venture X Business, Spark Miles, Spark Miles Select, VentureOne — confirm by scanning the program's existing `earning_cards` and removing any cobrand-only or no-transfer cards).
   - `cards/bilt_blue.md` (`bilt_rewards`): list the Bilt cards that grant transfer access (Bilt Blue, Bilt Obsidian, Bilt Palladium — confirm via the program's `earning_cards`).

   Cobrand programs (`united_miles`, `delta_skymiles`, `hilton_honors`, `marriott_bonvoy`, `hyatt_points`, etc.) get an empty `transfer_unlock_card_ids: []` (or omit; the schema default is `[]`). Their classifier behavior is "always loyalty mode" regardless of wallet — see Requirement 5.

4. **New engine helper `classifyEarning`.** In `lib/engine/scoring.ts`, replace the private `cppForCurrency` with:

   ```ts
   export interface EarningMode {
     mode: "cash" | "loyalty";
     cpp: number;             // dollar value per point. 1.0 in cash mode.
     programId: string | null;
     programName: string | null;
   }

   export function classifyEarning(
     card: Card,
     contextCards: Card[],   // wallet ∪ candidate. Must include `card`.
     db: CardDatabase,
   ): EarningMode;
   ```

   Logic:
   - If `card.currency_earned` is null → `{ mode: "cash", cpp: 1, programId: null, programName: null }`.
   - Look up `program = db.programById.get(card.currency_earned)`. If missing → same cash fallback.
   - If `program.kind === "cash"` → `{ mode: "cash", cpp: 1, programId: program.id, programName: program.name }`.
   - If `program.kind === "loyalty"`:
     - Compute `effectiveCpp = Math.max(program.portal_redemption_cpp ?? 0, program.fixed_redemption_cpp ?? 0) || 1`. Same conservative resolution as today.
     - If `program.transfer_unlock_card_ids.length === 0` → `{ mode: "loyalty", cpp: effectiveCpp, programId, programName }`. (Cobrand currencies always loyalty.)
     - Else: if `contextCards.some(c => program.transfer_unlock_card_ids.includes(c.id))` → `{ mode: "loyalty", cpp: effectiveCpp, programId, programName }`.
     - Else → `{ mode: "cash", cpp: 1, programId, programName }`. (CFU / CDC sitting alone — earns plain cashback.)

   The `contextCards` argument lets the caller decide whether the candidate counts toward unlocking (it should, when scoring a candidate against the user's wallet — adding CSP unlocks UR for itself).

5. **`normalizeEarning` consumes `classifyEarning`.** Replace the existing `normalizeEarning(card, db)` with `normalizeEarning(card, contextCards, db)`. The cpp lookup goes through the new helper. The per-card memoization cache in `normalizeCache` (currently keyed on `card.id`) must key on `card.id + "::" + classifyEarning(...).mode + ":" + cpp` so a CFU-without-Sapphire result doesn't poison a later CFU-with-Sapphire computation. Cache stays per-process.

   The normalized rule shape gains a `mode` field:
   ```ts
   interface NormalizedRule {
     category: SpendCategoryId;
     rate: number;            // dollar value per dollar spent (unchanged)
     cap_usd_per_year: number | null;
     mode: "cash" | "loyalty"; // NEW
     ptsPerDollar: number;     // NEW — raw pts/$ before cpp conversion. equals `rate / cpp * 100` in loyalty mode; equals `rate * 100` in cash mode.
   }
   ```

6. **`CardScoreComponents` and `CardScore` extend with the split.** In `lib/engine/types.ts`:

   ```ts
   export interface PointsBucket {
     pts: number;             // raw points/yr
     valueUsd: number;        // pts × cpp / 100, rounded
     programId: string;
     programName: string;
     cpp: number;
   }

   export interface SubBucket {
     mode: "cash" | "loyalty";
     pts: number;             // 0 in cash mode
     valueUsd: number;        // amortized per options.subAmortizeMonths
     programId: string | null;
     programName: string | null;
   }

   export interface CardScoreComponents {
     // NEW split. cashOngoing replaces the cash portion of today's spendOngoing.
     cashOngoing: number;                  // statement-credit $/yr from spend
     pointsOngoing: PointsBucket | null;   // null when no points earned
     // Back-compat field — existing UI reads this. Equals cashOngoing + (pointsOngoing?.valueUsd ?? 0).
     // Will be removed once the UI migrates in the follow-up TASK.
     spendOngoing: number;
     perksOngoing: number;                 // unchanged
     feeOngoing: number;                   // unchanged
     // SUB split. subYear1 stays as the dollar-amortized number for back-compat;
     // subYear1Detail carries the cash-vs-points breakdown for the new UI.
     subYear1: number;
     subYear1Detail: SubBucket | null;     // null when no sub
   }
   ```

   `spendImpact[cat]` gets one new field marking which currency the new best rate is in:
   ```ts
   spendImpact: Record<SpendCategoryId, {
     current: number;        // unchanged — best $/$ rate before
     new: number;            // unchanged — best $/$ rate after
     currentFrom: string;    // unchanged
     newFrom: string;        // unchanged
     spend: number;          // unchanged
     delta: number;          // unchanged
     newCap: number | null;  // unchanged
     newBase: number | null; // unchanged
     newMode: "cash" | "loyalty" | null;  // NEW. null when nothing wins.
   }>;
   ```

7. **`scoreCard` produces both buckets.** In `lib/engine/scoring.ts`:
   - Build `contextCards = [...walletCards, card]` and pass to `normalizeEarning(card, contextCards, db)` and `bestRateForCategory` (see next requirement).
   - For each category where the candidate beats the wallet, attribute the marginal earning to either `cashOngoing` or `pointsOngoing` based on the candidate's `EarningMode`. A card has exactly one mode (the candidate's `currency_earned` is one program), so all earning deltas for a candidate land in one bucket.
   - `pointsOngoing.pts` accumulates as `Σ marginal_$_delta / cpp × 100` (i.e., translate the $ delta back to raw points). `pointsOngoing.valueUsd` is the rounded $ delta sum. `pointsOngoing` is null when `mode === "cash"` OR when no points are earned.
   - Brand-fit value (`getBrandFit`) lands in `cashOngoing` regardless of the card's mode — cobrand bonuses are evaluated as dollars-back per `brandAffinity.ts` and stay that way.
   - `subYear1Detail`: if the candidate's mode is `cash`, `mode: "cash"`, `pts: 0`, `valueUsd: subYear1`. If mode is `loyalty`, `pts: signup_bonus.amount_pts × 12 / subAmortizeMonths` (rounded), `valueUsd: subYear1`. `programId` / `programName` from `EarningMode`. Null when there's no sub.
   - `spendOngoing = cashOngoing + (pointsOngoing?.valueUsd ?? 0)` so existing UI math is preserved exactly. `deltaOngoing = spendOngoing + perksOngoing + feeOngoing`. `deltaYear1 = deltaOngoing + subYear1`. These three reconcile byte-for-byte with today's outputs whenever the wallet has no paired-mode flips — see Requirement 10 for the test that pins this.

8. **`bestRateForCategory` accepts a context.** Signature changes to:
   ```ts
   export function bestRateForCategory(
     category: SpendCategoryId,
     cards: Card[],          // unchanged
     db: CardDatabase,
   ): { rate: number; from: string; mode: "cash" | "loyalty" | null };
   ```
   The function walks `cards` and, for each, calls `normalizeEarning(c, cards, db)` so paired-mode resolution applies (e.g., when the user holds CSP, CFU's chase_ur earnings are evaluated at portal cpp, not at 1cpp). The returned `mode` mirrors the winning card's `EarningMode.mode`. Returns `mode: null` only when no card contributes (`from: "—"` case).

   This change ripples to `RecPanelDesktop.tsx` and `RecPanelMobile.tsx` which call `bestRateForCategory` directly for the wallet sidebar's `walletBestRates` — they receive an extra `mode` field they can ignore for now (back-compat). Do not change those panels' rendering in this TASK.

9. **`generateWhy` gains a currency-type lead when relevant.** In `lib/engine/ranking.ts`, after the existing branch 3 ("Big category jump"), when the chosen winning category's mode is `loyalty`, append the program name to the produced sentence: `Adds 3% on dining (Chase UR), your biggest gap.` When mode is `cash`, append `(cash back)`: `Adds 3% on dining (cash back), your biggest gap.` Keep the 90-char `clip` cap. Do not touch branches 0/1/2/4/5/6 — those have their own messaging and shouldn't gain a tag.

10. **Tests.** Add a new file `tests/engine/cash-points-split.test.ts` covering:

    a. **Classifier — cash program.** `classifyEarning(amex_blue_cash_preferred, [amex_blue_cash_preferred], db)` → `mode: "cash", cpp: 1, programId: "amex_cashback"`.

    b. **Classifier — loyalty unlocked by candidate itself.** `classifyEarning(chase_sapphire_preferred, [chase_sapphire_preferred], db)` → `mode: "loyalty", cpp: 1.25, programId: "chase_ur"`.

    c. **Classifier — loyalty NOT unlocked.** `classifyEarning(chase_freedom_unlimited, [chase_freedom_unlimited], db)` → `mode: "cash", cpp: 1`. CFU sitting alone earns cashback.

    d. **Classifier — loyalty unlocked by wallet.** `classifyEarning(chase_freedom_unlimited, [chase_sapphire_preferred, chase_freedom_unlimited], db)` → `mode: "loyalty", cpp: 1.25`. Adding CSP flips CFU into points mode.

    e. **Classifier — cobrand always loyalty.** `classifyEarning(united_explorer, [united_explorer], db)` → `mode: "loyalty"`, regardless of wallet (cobrand programs have empty `transfer_unlock_card_ids`).

    f. **Score split — cash card.** Score Amex BCP against an empty wallet on a grocery-heavy profile. Expect `cashOngoing > 0`, `pointsOngoing === null`, `spendOngoing === cashOngoing`.

    g. **Score split — loyalty card unlocked.** Score CSP against an empty wallet on a dining-heavy profile. Expect `cashOngoing === 0` (modulo brand-fit), `pointsOngoing.pts > 0`, `pointsOngoing.programId === "chase_ur"`, `spendOngoing === pointsOngoing.valueUsd`.

    h. **Score split — paired-mode flip.** Score CFU against (i) empty wallet and (ii) wallet with CSP. In (i), `pointsOngoing === null` and `cashOngoing > 0`. In (ii), `pointsOngoing.pts > 0` and `cashOngoing === 0`. The two `spendOngoing` values differ by the cpp uplift (1.25× minus 1.0×) on CFU's earning rates.

    i. **Back-compat: `spendOngoing` and `deltaOngoing` reconcile.** For ten arbitrary cards scored against an empty wallet on the default test profile, assert `spendOngoing === cashOngoing + (pointsOngoing?.valueUsd ?? 0)` and `deltaOngoing === spendOngoing + perksOngoing + feeOngoing`. Pins the back-compat invariant.

    Use the real compiled card database — same pattern as the existing engine tests. Run `npm run cards:build` in the test setup if the existing tests don't already.

## Implementation Notes

### Engine purity

`scoreCard`, `classifyEarning`, `normalizeEarning`, `bestRateForCategory` all stay pure functions. No `Date.now()`, no I/O. The architecture doc (`docs/ARCHITECTURE.md` §"The recommendation engine") is explicit about this and the existing tests assume it.

### Memoization

`normalizeCache` currently keys on `card.id` and lives in module scope. With paired-mode resolution, the result depends on the wallet too. Two options:

1. (Preferred) Key on `card.id + ":" + mode + ":" + cpp`. Compute the key after `classifyEarning` runs (cheap). Keeps the cache effective across repeated scoring of the same card with the same wallet shape.
2. Drop the cache. `normalizeEarning` is fast (loops over a card's earning rules); the cache is a small win.

Pick option 1. The cache key is one extra string concat per call.

### Cobrand cpp

Per the design discussion, cobrand `cpp` resolution stays as today: `Math.max(portal_redemption_cpp ?? 0, fixed_redemption_cpp ?? 0) || 1`. No editorial pass on cobrand programs in this TASK. Most cobrand programs leave both fields null and resolve to 1cpp — that's the current behavior, preserved.

### Back-compat shim philosophy

`spendOngoing` and `subYear1` exist only so the existing UI components (`ValuePillars`, `WalletRow`, `DrillIn`, the panel sidebars) continue to render unchanged after this TASK lands. The follow-up UI TASK will read `cashOngoing`, `pointsOngoing`, `subYear1Detail` directly and the shim fields can be removed. Do not delete the shim in this TASK.

### Markdown JSON edits

The five `transfer_unlock_card_ids` edits in Requirement 3 land in the existing `## programs.json entry` JSON blocks of those files. Add the field; do not reorder or rewrite other fields. After editing, run `npm run cards:build` and confirm `data/programs.json` shows the field populated for those five program ids.

For Capital One Venture X and Bilt Blue, scan the program definition's `earning_cards` array first; the unlock list is a subset (excludes cobrand-only siblings like `capital_one_walmart`).

### Files in scope

- `scripts/lib/schemas.ts` — schema additions
- `scripts/build-card-db.ts` — derive `kind` if missing
- `lib/engine/scoring.ts` — `classifyEarning`, `normalizeEarning`, `bestRateForCategory`, `scoreCard` updates
- `lib/engine/types.ts` — `CardScoreComponents`, `PointsBucket`, `SubBucket`, `spendImpact.newMode`, `EarningMode` re-export
- `lib/engine/ranking.ts` — `generateWhy` currency-type tag in branch 3
- `cards/chase_sapphire_preferred.md`, `cards/amex_gold.md`, `cards/citi_strata_premier.md`, `cards/capital_one_venture_x.md`, `cards/bilt_blue.md` — `transfer_unlock_card_ids` arrays
- `tests/engine/cash-points-split.test.ts` — new test file

## Do Not Change

- `data/*.json`, `data/manifest.json` — gitignored, regenerated by `cards:build`. Never hand-edit.
- `cards/*.md` other than the five listed above. No edits to non-program-defining card files in this TASK.
- `lib/engine/eligibility.ts` — out of scope.
- `lib/engine/brandAffinity.ts` — `getBrandFit` continues to return dollar-valued bonuses; cash-vs-points doesn't reshape this.
- `lib/data/loader.ts`, `lib/data/serialized.ts` — Zod handles the schema additions transparently. No code changes.
- `lib/profile/**` — profile shape unchanged.
- `lib/auth/**`, `lib/db.ts`, `lib/rules/**` — out of scope.
- `app/**` — no route or server-component changes.
- `components/**` — UI is the follow-up TASK. The back-compat shim (`spendOngoing`, `subYear1`) is what makes this safe.
- `RankOptions`, `RankResult`, `RankedRecommendation` — ranking ordering and shape are unchanged. `generateWhy` text gains a tag in one branch; the function signature is unchanged.
- `RankFilter` and the brand-pin behavior in `rankCards` — untouched.

## Acceptance Criteria

- [ ] `npm run cards:build` passes; `data/programs.json` shows `kind` populated on every program and `transfer_unlock_card_ids` populated on the five transferable programs listed in Requirement 3.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes with zero errors.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes, including the nine new test cases in `tests/engine/cash-points-split.test.ts`.
- [ ] Visual check: `npm run dev`, navigate to `/recommendations`. The page renders identically to before this TASK — same numbers, same layout. (Back-compat shim verifies.)
- [ ] `git diff --stat` shows changes only in: `scripts/lib/schemas.ts`, `scripts/build-card-db.ts`, `lib/engine/scoring.ts`, `lib/engine/types.ts`, `lib/engine/ranking.ts`, the five `cards/*.md` files in Requirement 3, and `tests/engine/cash-points-split.test.ts`. No other files touched.

## Verification

1. `npm run cards:build` — confirm the five program ids show `transfer_unlock_card_ids` in `data/programs.json`, and every program has `kind` set to either `"cash"` or `"loyalty"`. Spot-check: `chase_ur` → loyalty, `amex_cashback` → cash, `united_miles` → loyalty (cobrand), `citi_thankyou` → loyalty.
2. `npm run typecheck && npm run build && npm run lint`.
3. `npm test` — confirm all nine new cases pass and no existing engine tests regress.
4. `git diff --stat` — confirm scope matches the file list in Acceptance Criteria.
5. `npm run dev` and load `/recommendations` with a test wallet that includes CFU but not CSP. Inspect the engine output (or add a temporary `console.log(score)` and remove before commit) and confirm CFU's `pointsOngoing === null`, `cashOngoing > 0`. Then add CSP to the wallet and confirm CFU flips: `pointsOngoing.pts > 0`, `cashOngoing === 0`. The visible UI numbers will shift (CSP-paired CFU is worth more), which is the intended behavior.
6. Confirm `score.deltaOngoing` for any one card equals `score.components.spendOngoing + score.components.perksOngoing + score.components.feeOngoing` exactly — the back-compat invariant is what unblocks the UI follow-up landing safely.
