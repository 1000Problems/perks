# TASK: Extend brand-pin to travel cobrand cards (with family-best rule)

> Pin the best card from a brand family when the user picks that brand on /onboarding/brands. Today only 7 retail cards qualify for `getBrandFit`; airline and hotel picks (Hilton, United, Marriott, Hyatt, Delta, etc.) are wasted signal — no pin, no spend bonus.

## Context

`getBrandFit()` and `CARD_BRAND_FIT` in `lib/engine/brandAffinity.ts` currently support 7 retail cards (Costco, Amazon, Target, Sam's Club, Walmart, Apple, REI). `ranking.ts` lines 303-328 pin every match to the top of the visible list. Travel cobrand cards (`hilton_honors_aspire`, `united_quest`, `world_of_hyatt`, …) match nothing today, so the loyalty signal from `BrandsForm.tsx`'s TRAVEL chip group is dropped.

Decision: hard-pin travel cobrand the same way retail is hard-pinned, with a *family-best* rule so picking "Hilton" surfaces exactly one Hilton card at the top instead of all four. Other family members still appear in normal rank order. The user can remove a brand from /settings if a pin isn't useful.

This is code-only. No card markdown changes, no schema changes.

## Requirements

1. Engine: `BrandFit` interface in `lib/engine/brandAffinity.ts` gains a required `family: string` field. Existing 7 retail entries get `family` set to the card_id (each retail card is its own family of one).

2. Engine: `CARD_BRAND_FIT` is extended with one entry per travel cobrand card listed in the family map below. Each travel entry's `brand` matches a chip string in `BrandsForm.tsx`'s `TRAVEL` group exactly. Each travel entry's `family` is the brand slug (lowercase, no spaces).

3. Engine: brand-fit `bonus` for travel cobrand cards is tiered by the card's `annual_fee_usd`:
   - fee == 0  → bonus = 30
   - 0 < fee ≤ 150 → bonus = 60
   - fee > 150 → bonus = 100
   These bonuses represent soft-status value (priority boarding, room upgrades, bag fee waivers) the spend math doesn't capture. Free-night certs, resort credits, lounge access etc. stay in `annual_credits` / `ongoing_perks` and are NOT double-counted here.

4. Engine: pin loop in `rankCards` (`lib/engine/ranking.ts` lines 303-328) is replaced with a family-best version. At most one card per family pins, chosen by highest `score.deltaOngoing` within the family. All non-best siblings fall through to the regular sorted `rest` list — they remain visible at their normal rank. Pinned cards within the leading group are themselves sorted by `deltaOngoing` desc so multi-pin order is deterministic.

5. Engine: family-best pin logic respects the existing `sortBy.kind === "category"` skip — when category sort is active, no pinning fires (existing behavior, keep intact).

6. Tests: add a new `describe("rankCards family-best pin", ...)` block to `tests/engine/ranking.test.ts` covering: (a) picking "Hilton" places exactly one Hilton card in the leading pinned group; (b) the pinned Hilton card has the highest `deltaOngoing` among Hilton family members; (c) other Hilton cards still appear in the visible list; (d) retail behavior unchanged (Costco user → `costco_anywhere_visa` at rank 1); (e) multi-brand (Hilton + United) pins one card per family; (f) under `sortBy: { kind: "category", category: "..." }`, no pinning fires.

## Implementation Notes

### Family map (the contract)

Brand chip → family slug → card IDs. **Verify each card_id exists at `cards/{id}.md` before adding** — if missing, omit that entry and flag back to me. Don't add new cards.

Retail (existing — set `family` to card_id):

```
"Costco"      → costco_anywhere_visa
"Amazon"      → amazon_prime_visa
"Target"      → target_redcard
"Sam's Club"  → sams_club_mastercard
"Walmart"     → capital_one_walmart
"Apple"       → apple_card
"REI"         → rei_co_op_mastercard
```

Travel (new — `family` is the slug shown):

```
"Hilton"    → hilton: hilton_honors, hilton_honors_surpass,
                       hilton_honors_aspire, hilton_honors_business
"United"    → united: united_gateway, united_explorer, united_quest,
                       united_club_infinite
"Delta"     → delta: delta_skymiles_blue, delta_skymiles_gold,
                      delta_skymiles_platinum, delta_skymiles_reserve
"American"  → american: citi_aa_mileup, citi_aa_platinum,
                          citi_aa_executive, barclays_aa_aviator_red
"Southwest" → southwest: southwest_plus, southwest_premier, southwest_priority
"Alaska"    → alaska: alaska_airlines_visa
"JetBlue"   → jetblue: jetblue_plus, jetblue_premier
"Marriott"  → marriott: marriott_bonvoy_bold, marriott_bonvoy_boundless,
                          marriott_bonvoy_bevy, marriott_bonvoy_bountiful,
                          marriott_bonvoy_brilliant, marriott_bonvoy_business
"Hyatt"     → hyatt: world_of_hyatt, world_of_hyatt_business
"IHG"       → ihg: ihg_traveler, ihg_premier
"Wyndham"   → wyndham: wyndham_earner_plus
```

### `lib/engine/brandAffinity.ts`

Update the interface:

```ts
interface BrandFit {
  brand: string;
  family: string; // NEW — groups card IDs that share a brand
  bonus: number;
  note: string;
  whyPhrase: string;
}
```

Update existing retail entries by adding `family: "<card_id>"` to each. Example for Costco:

```ts
costco_anywhere_visa: [
  {
    brand: "Costco",
    family: "costco_anywhere_visa",
    bonus: 80,
    note: "Costco only accepts Visa, and this card pays 2% on warehouse purchases plus the Feb cash-back voucher",
    whyPhrase: "the only Visa Costco accepts, 2% on warehouse runs",
  },
],
```

Add new travel entries. The `note` should be one short sentence stating the cobrand-specific value the spend math misses (status, free-bag-for-companion, etc.). The `whyPhrase` is a comma-separated list of the 1–2 most prominent perks, used in the why-sentence after `"You picked {brand} — "`. Examples:

```ts
hilton_honors_aspire: [
  {
    brand: "Hilton",
    family: "hilton",
    bonus: 100,
    note: "Diamond status, free-night cert, and resort credits — pays back fast for a regular Hilton stayer",
    whyPhrase: "free night cert, Diamond status, $400 resort credit",
  },
],
united_quest: [
  {
    brand: "United",
    family: "united",
    bonus: 60,
    note: "Free first checked bag for you and a companion, +$125 United travel credit",
    whyPhrase: "free first bag for two, $125 United credit",
  },
],
```

Use the bonus tier rule from requirement 3 — pull `annual_fee_usd` from each card's markdown to set the bonus. Don't over-engineer the strings; brand-specific, factual, no superlatives.

`MEMBERSHIP_TO_BRANDS` does not change — travel brands aren't memberships.

### `lib/engine/ranking.ts`

Replace the existing pin block (the `if (sortBy.kind === "category") { combined = filtered; } else { ... }` at lines 317-328) with a family-best version:

```ts
let combined: Row[];
if (sortBy.kind === "category") {
  combined = filtered;
} else {
  // Group by family. For each family with at least one match, pin the
  // highest-scoring matching card; non-best siblings fall through to the
  // rest list and rank normally.
  const familyBest = new Map<string, Row>();
  const rest: Row[] = [];
  for (const r of filtered) {
    const fit = getBrandFit(r.card, userProfile.brands_used);
    if (!fit) {
      rest.push(r);
      continue;
    }
    const current = familyBest.get(fit.family);
    if (!current) {
      familyBest.set(fit.family, r);
    } else if (r.score.deltaOngoing > current.score.deltaOngoing) {
      // New best — old best demoted to rest
      rest.push(current);
      familyBest.set(fit.family, r);
    } else {
      rest.push(r);
    }
  }
  // Sort pinned cards among themselves by deltaOngoing so multi-family
  // pin order is deterministic (highest-value pin first).
  const pinned = Array.from(familyBest.values()).sort(
    (a, b) => b.score.deltaOngoing - a.score.deltaOngoing,
  );
  combined = [...pinned, ...rest];
}
```

The `rest` list is already sorted by the comparator above (line 300-305), so demoted siblings end up in their correct rank position automatically.

### Tests — `tests/engine/ranking.test.ts`

Use the real compiled card DB (other tests in the file already do this). Helper patterns to mirror existing tests in the file. New describe block:

```ts
describe("rankCards family-best pin", () => {
  it("picks Hilton: pins exactly one Hilton card at the top of visible", () => {
    const profile = makeProfile({
      brands_used: ["Hilton"],
      spend_profile: { hotels: 4000, dining: 3000, other: 30000 },
    });
    const r = rankCards(profile, [], db, defaultRankOptions());
    const hiltonIds = new Set([
      "hilton_honors", "hilton_honors_surpass",
      "hilton_honors_aspire", "hilton_honors_business",
    ]);
    expect(hiltonIds.has(r.visible[0].card.id)).toBe(true);
    // Verify the pinned Hilton card has highest deltaOngoing among Hilton siblings present in the catalog
    const hiltonRows = r.visible.filter((v) => hiltonIds.has(v.card.id));
    const max = Math.max(...hiltonRows.map((v) => v.score.deltaOngoing));
    expect(r.visible[0].score.deltaOngoing).toBe(max);
  });

  it("non-best Hilton siblings still appear in visible (not removed)", () => {
    const profile = makeProfile({
      brands_used: ["Hilton"],
      spend_profile: { hotels: 4000, other: 30000 },
    });
    const r = rankCards(profile, [], db, { ...defaultRankOptions(), limit: 50 });
    const hiltonIds = ["hilton_honors", "hilton_honors_surpass", "hilton_honors_aspire", "hilton_honors_business"];
    const visibleHilton = r.visible.filter((v) => hiltonIds.includes(v.card.id));
    // At least one (the pinned one). Confirm at least one sibling is also visible.
    expect(visibleHilton.length).toBeGreaterThanOrEqual(2);
  });

  it("retail behavior unchanged: picking Costco pins costco_anywhere_visa at rank 1", () => {
    const profile = makeProfile({ brands_used: ["Costco"] });
    const r = rankCards(profile, [], db, defaultRankOptions());
    expect(r.visible[0].card.id).toBe("costco_anywhere_visa");
  });

  it("multi-brand: Hilton + United pin one card per family in top 2", () => {
    const profile = makeProfile({
      brands_used: ["Hilton", "United"],
      spend_profile: { hotels: 3000, airfare: 3000, other: 30000 },
    });
    const r = rankCards(profile, [], db, defaultRankOptions());
    const hiltonIds = ["hilton_honors", "hilton_honors_surpass", "hilton_honors_aspire", "hilton_honors_business"];
    const unitedIds = ["united_gateway", "united_explorer", "united_quest", "united_club_infinite"];
    const top2Ids = [r.visible[0].card.id, r.visible[1].card.id];
    expect(top2Ids.some((id) => hiltonIds.includes(id))).toBe(true);
    expect(top2Ids.some((id) => unitedIds.includes(id))).toBe(true);
  });

  it("under category sort: no pinning fires even with brand match", () => {
    const profile = makeProfile({
      brands_used: ["Hilton"],
      spend_profile: { dining: 6000, hotels: 4000, other: 30000 },
    });
    const r = rankCards(profile, [], db, {
      ...defaultRankOptions(),
      sortBy: { kind: "category", category: "dining" },
    });
    // Top card should be the best dining card overall, not necessarily Hilton
    const hiltonIds = ["hilton_honors", "hilton_honors_surpass", "hilton_honors_aspire", "hilton_honors_business"];
    // We can't assert which card is top without knowing the catalog by heart,
    // but we can assert that the rank order matches dining delta desc:
    for (let i = 1; i < r.visible.length; i++) {
      expect(r.visible[i - 1].score.spendImpact.dining.delta).toBeGreaterThanOrEqual(
        r.visible[i].score.spendImpact.dining.delta,
      );
    }
  });
});
```

If `makeProfile` and `defaultRankOptions` helpers don't exist in `tests/engine/ranking.test.ts`, inline the necessary `UserProfile` and `RankOptions` shapes following the patterns in adjacent tests in the same file.

### Why-sentence side effect (do NOT modify)

`generateWhy()` in `ranking.ts:153-219` already reads `getBrandFit` at step 0 and uses `fit.brand` and `fit.whyPhrase`. With travel entries added, the cobrand-match why line will fire for travel picks automatically (e.g. `"You shop at Hilton — free night cert, Diamond status, $400 resort credit."`). The existing string template `"You shop at ${fit.brand} — ${fit.whyPhrase}."` reads slightly off for "Hilton" / "United" (you don't *shop* at Hilton). Leave the template alone in this task — fixing the verb is its own one-line copy change and it's bikeshedding territory. Note it as a follow-up.

### Post-build sanity

After implementing, run a manual check in `npm run dev`:

1. Set `brands_used = ["Hilton"]` (via /onboarding/brands or directly in the DB).
2. Set `spend_profile.hotels = 4000`.
3. Visit /recommendations.
4. Confirm exactly one Hilton card sits at rank 1.
5. Confirm at least one other Hilton card appears further down the list.
6. Toggle "Sort by: Dining" — confirm no Hilton card is pinned.

## Do Not Change

- `cards/*.md` — card data is canonical, do NOT edit. If a card_id listed in the family map is missing from `cards/`, omit that entry and report which IDs were missing.
- `data/*.json`, `data/manifest.json` — gitignored, derived from card markdown via `npm run cards:build`.
- `lib/engine/scoring.ts` — `getBrandFit` consumers in this file read only `bonus`, `note`, `whyPhrase`, `lineItem`. Adding `family` to the type doesn't change scoring math.
- `lib/engine/eligibility.ts` — `getMembershipStatus()` and `membershipRequired()` are unaffected.
- `lib/engine/types.ts` — no engine type changes needed (the `family` field lives on the internal `BrandFit` interface in `brandAffinity.ts`, not on any exported engine type).
- `components/onboarding/BrandsForm.tsx` — chip strings are the contract; do NOT rename them. The `STORES`, `TRAVEL`, and `SERVICES` arrays stay as-is.
- `components/recommender/*`, `components/perks/*` — UI is untouched. The pin behavior change is engine-only; the UI already renders whatever order the engine returns.
- `lib/profile/*`, `lib/auth/*`, `lib/db.ts`, `lib/rules/*` — out of scope.
- The existing `EASE_MULT` capture haircut, `walletNet` calculation, perk-vs-spend rebalance — separate TASK track, do NOT touch here.
- `MEMBERSHIP_TO_BRANDS` in `brandAffinity.ts` — no changes; travel brands are not memberships.
- `app/(app)/recommendations/page.tsx`, `app/(app)/onboarding/*` — no page-level changes needed.
- The why-sentence template `"You shop at ${fit.brand} — ${fit.whyPhrase}."` in `ranking.ts:160` — leave verbatim despite the "shop at Hilton" awkwardness; copy fix is out of scope.

## Acceptance Criteria

- [ ] `npm run cards:build` runs clean (data is unchanged but the build still verifies).
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `npm test` passes — existing tests unchanged, all six new family-best tests pass.
- [ ] Manual: with `brands_used = ["Hilton"]` and `hotels: 4000`, /recommendations shows exactly one Hilton card at rank 1.
- [ ] Manual: with `brands_used = ["Costco"]`, /recommendations shows `costco_anywhere_visa` at rank 1 (regression check).
- [ ] Manual: with `brands_used = ["Hilton", "United"]` and meaningful hotel + airfare spend, top 2 visible cards include one Hilton and one United card.
- [ ] Manual: with `brands_used = ["Hilton"]` and `sortBy = { kind: "category", category: "dining" }` (toggle "Sort by: Dining" in UI), no Hilton card is pinned — top card is whichever has the best dining delta.
- [ ] `git diff` shows changes only in: `lib/engine/brandAffinity.ts`, `lib/engine/ranking.ts`, `tests/engine/ranking.test.ts`. No other files modified.

## Verification

1. `npm run cards:build && npm run typecheck && npm run lint && npm run build && npm test` — all clean, no regressions, new tests pass.
2. `git diff --stat` — exactly three files modified.
3. `npm run dev`, run the manual checks under Acceptance Criteria.
4. Report any card_id from the family map that was missing from `cards/` (omit that entry, do not add new card markdown).
