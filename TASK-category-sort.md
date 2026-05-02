# TASK: Category-specific sort on the recommendations panel

> Add a "Sort by" listbox to the recommendation panel so users can re-rank cards by marginal value in a single spend category (dining, groceries, etc.). Combines orthogonally with the existing No-fee / Premium filter. Brand-pin releases when category sort is active.

## Context

Users with strong wallets often need to top off a single weak category — e.g. they have Sapphire Preferred giving 5.4¢/$ overall but want to find the best 5%+ dining card. The current recommendation list ranks by total annual marginal value (`score.deltaOngoing`), which buries narrow-but-excellent category boosters under well-rounded cards. The engine already computes per-category marginal value (`score.spendImpact[cat].delta`) — this task surfaces that data through a new sort mode.

Discussion converged on a native `<select>` next to the existing segmented filter. Native `<select>` was chosen over a custom listbox because it gives free mobile native pickers, free a11y, and zero popup-positioning logic. The existing `Best total / No fee / Premium` segmented filter is preserved untouched and combines orthogonally with the new sort.

## Requirements

1. Engine: `RankOptions` gets a new optional `sortBy` field with shape `{ kind: "total" } | { kind: "category"; category: SpendCategoryId }`. Default behavior when omitted is `{ kind: "total" }` — same as today. When `kind: "category"`, the ranker sorts by `r.score.spendImpact[category].delta` (credit-band-adjusted, same haircut as today) instead of `r.score.deltaOngoing`. Tiebreak still on `card.id`.

2. Engine: brand-pin loop in `rankCards` (currently `ranking.ts:303-309`) is skipped when `sortBy.kind === "category"`. Brand affinity still affects total `deltaOngoing` via `getBrandFit`, but the user has explicitly chosen a different sort axis, so we don't override it with a pin.

3. UI: both `RecPanelDesktop.tsx` and `RecPanelMobile.tsx` get a new native `<select>` adjacent to the existing `Segmented` filter. Options: `Overall` (default), then every `SpendCategoryId` from `SPEND_CATEGORIES` in `lib/categories.ts`, sorted by descending user spend (pull from `profile.spend_profile`). Zero-spend categories appear at the end in their default order. `Overall` is always first.

4. UI: when a category is selected, each row's primary right-side number swaps to category-specific marginal value (`r.score.spendImpact[category].delta` formatted as `+$NN/yr on dining`). The existing `ValuePillars` continues to render below as the secondary breakdown. When `Overall` is selected, behavior is identical to today.

5. UI: when category sort is active and `ranked.visible.length === 0`, replace the existing "No cards match this filter. Try another." message with a category-aware variant. Pull the user's current best card name and rate from `score.spendImpact[category]` of any card (it's the same `currentFrom` and `current` for everyone). Format: `No card in this view beats your <currentFrom> for <category label> at <current * 100>%.` — e.g. `No card in this view beats your Sapphire Preferred for dining at 5.4%.` When the user holds nothing in that category, fall back to: `No card in this view adds value for <category label>.`

6. State: category selection is session-only via `useState<SpendCategoryId | "overall">("overall")`. No profile persistence — defaults to Overall on every visit. Do not modify `UserProfile.preferences`.

7. Tests: add Vitest cases in the existing engine test file covering (a) default behavior unchanged when `sortBy` omitted, (b) category sort reorders correctly when `sortBy.kind === "category"`, (c) brand-pin releases under category sort. Use the real compiled card database (other engine tests already do this).

## Implementation Notes

### Engine — `lib/engine/types.ts`

Add to `RankOptions`:

```ts
sortBy?:
  | { kind: "total" }
  | { kind: "category"; category: SpendCategoryId };
```

Import is already there — `SpendCategoryId` is imported at the top of the file.

### Engine — `lib/engine/ranking.ts`

In `rankCards`, after `let filtered = visibleRaw;` and before the existing `filtered.sort(...)` block at line 290:

```ts
const sortBy = options.sortBy ?? { kind: "total" };
```

Replace the comparator at line 290-295 with a comparator that picks the value to sort by based on `sortBy.kind`:

```ts
filtered.sort((a, b) => {
  const valueOf = (r: Row) =>
    sortBy.kind === "category"
      ? r.score.spendImpact[sortBy.category]?.delta ?? 0
      : r.score.deltaOngoing;
  const da = rankAdjustedDelta(b.card, valueOf(b), userBand) -
    rankAdjustedDelta(a.card, valueOf(a), userBand);
  if (da !== 0) return da;
  return a.card.id < b.card.id ? -1 : a.card.id > b.card.id ? 1 : 0;
});
```

Then guard the brand-pin loop (currently lines 303-309). Skip the pin loop entirely when `sortBy.kind === "category"`:

```ts
const combined =
  sortBy.kind === "category"
    ? filtered
    : (() => {
        const pinned: Row[] = [];
        const rest: Row[] = [];
        for (const r of filtered) {
          if (getBrandFit(r.card, userProfile.brands_used)) pinned.push(r);
          else rest.push(r);
        }
        return [...pinned, ...rest];
      })();
```

The denied list at the bottom keeps using `deltaOngoing` for sort — denied cards aren't visible in the sorted view so it doesn't matter, but keep the existing behavior to avoid any churn there.

### UI — both panels

In `RecPanelDesktop.tsx` (and the same pattern in `RecPanelMobile.tsx`):

1. Add to imports: `SPEND_CATEGORIES` is already imported, good.
2. New state: `const [sortCategory, setSortCategory] = useState<SpendCategoryId | "overall">("overall");`
3. New memo for sorted category options (most-spent first, zero-spend at end):

```ts
const categoryOptions = useMemo(() => {
  const spend = profile.spend_profile ?? {};
  return [...SPEND_CATEGORIES].sort((a, b) => {
    const sa = spend[a.id] ?? 0;
    const sb = spend[b.id] ?? 0;
    if (sa === 0 && sb === 0) return 0; // preserve original order
    return sb - sa;
  });
}, [profile.spend_profile]);
```

4. Plumb into `rankOptions`:

```ts
sortBy: sortCategory === "overall"
  ? { kind: "total" }
  : { kind: "category", category: sortCategory },
```

5. Render the `<select>` next to the existing `<Segmented>` (line 514-518 on desktop, line 426-429 on mobile). Use the same flex container that already wraps the segmented. Native `<select>` element with class `select` if a global one exists, otherwise inline-styled to match the segmented control's height and font. Label inline: `Sort by:` then the select. Options: first `<option value="overall">Overall</option>`, then map `categoryOptions` to `<option value={c.id}>{c.label}</option>`.

6. Headline swap. In the row render (around line 616 on desktop where `ValuePillars` is rendered), when `sortCategory !== "overall"`, render an emphasized line above `ValuePillars` showing `+$<delta>/yr on <category label>`. Use `r.score.spendImpact[sortCategory].delta` and round with `Math.round`. The `<ValuePillars>` element continues to render unchanged below — the new line is a primary headline for the category context, not a replacement for the breakdown.

7. Empty state. Replace the existing "No cards match this filter. Try another." text with a conditional: if `sortCategory === "overall"`, keep current copy. If `sortCategory !== "overall"`, derive the message per requirement (5) above. The `current` and `currentFrom` can be pulled from any card's `spendImpact[sortCategory]` — they reflect the user's wallet, not the candidate. If `ranked.visible` is empty and no cards exist at all, you can still get this from `ranked.denied[0]?.score.spendImpact[sortCategory]`, or compute it once via `bestRateForCategory` (already imported on desktop). Pick whichever is cleanest; the result must show the user's actual current best card and rate.

### Mobile-specific

`RecPanelMobile.tsx` already wraps the segmented in `flex-wrap`. The `<select>` can drop onto a second row on narrow screens without layout work. On the mobile filter sheet, the select sits as a stacked block under the segmented. Same logic, same data.

### Tests

Add to the existing engine vitest file (find via `npm test -- --list` or by grepping for `rankCards` in test files). New `describe("rankCards sortBy", ...)` block with three tests:

1. `sortBy` undefined produces same order as `sortBy: { kind: "total" }`. Use real card DB.
2. `sortBy: { kind: "category", category: "dining" }` orders cards by descending `spendImpact.dining.delta`. Pick a profile with high dining spend; assert the top card has the highest dining delta among visible.
3. With a brands_used entry that triggers a `getBrandFit` (e.g. "Costco"), `sortBy: { kind: "total" }` pins the Costco card; `sortBy: { kind: "category", category: "dining" }` does not pin it (the top card is whichever has the best dining delta, regardless of Costco match).

## Do Not Change

- `cards/*.md` — card data is the source of truth and edits go through markdown only. This task touches no card data.
- `data/*.json` and `data/manifest.json` — gitignored, derived from card markdown.
- `lib/engine/scoring.ts` — `spendImpact` already computes per-category math; no change needed there.
- `lib/engine/eligibility.ts` — out of scope.
- `lib/engine/brandAffinity.ts` — `getBrandFit` is still used, just not for pinning under category sort.
- `lib/profile/types.ts`, `lib/profile/server.ts`, `lib/profile/actions.ts`, `lib/profile/client.ts` — category sort is session-only; no profile schema changes.
- `lib/auth/*`, `lib/db.ts`, `lib/rules/*` — out of scope.
- The existing `Segmented` filter (`FILTER_OPTIONS`) — three values stay (Best total / No fee / Premium), wiring unchanged. The new select is additive.
- `RecHeader`, `DrillIn`, `WalletRow`, `ValuePillars`, `CardArt`, `EligibilityChip`, `Money`, `CoverageRow` — peripheral components stay untouched. The headline-swap requirement (4) renders new text above `ValuePillars`, not inside it.
- `app/(app)/recommendations/page.tsx` — the server-side page does not change. The client panels handle the new state.
- `app/(app)/onboarding/*` — no onboarding changes.
- Brand-pin behavior under `sortBy: { kind: "total" }` (or omitted) — must be byte-identical to today.

## Acceptance Criteria

- [ ] `npm run build` passes with zero errors.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes, including the three new sort tests.
- [ ] Manual: on the recommendations page, a "Sort by" select appears next to the existing segmented filter on both desktop and mobile.
- [ ] Manual: select options begin with `Overall`, then list categories in descending order of the current user's spend.
- [ ] Manual: choosing a category re-orders the visible list. The headline number on each row reflects category-specific marginal value with format `+$NN/yr on <category>`.
- [ ] Manual: combining `No fee` (segmented) + `Dining` (select) produces a list of only no-AF cards sorted by dining marginal delta.
- [ ] Manual: with a profile that triggers brand affinity (e.g. Costco user), choosing a category releases the brand pin — the top card is the one with the highest delta in that category, not the cobrand.
- [ ] Manual: when category sort produces an empty list (e.g. `Dining` + `No fee` for a user holding Sapphire Preferred), the empty state shows the user's actual current best card name and rate per requirement (5).
- [ ] `git diff` shows changes only in: `lib/engine/types.ts`, `lib/engine/ranking.ts`, `components/recommender/RecPanelDesktop.tsx`, `components/recommender/RecPanelMobile.tsx`, and one engine test file. No other files modified.

## Verification

1. Run `npm run cards:build` then `npm run build` — must complete without errors.
2. Run `npm run typecheck` and `npm run lint`.
3. Run `npm test` — confirm new tests pass and no existing tests regress.
4. Run `git diff --stat` and confirm only the five files listed above are modified.
5. `npm run dev` and walk through the manual checks above on both desktop and mobile (use browser devtools mobile emulation for the second).
6. Specifically verify: with `sortBy` omitted in engine call, brand-pin and ranking are unchanged from main branch baseline.
