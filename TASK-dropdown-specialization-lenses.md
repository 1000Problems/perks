# TASK: Cash / Points / Perks specialization lenses in the sort dropdown

> Add three new sort options — Cash, Points, Perks — between "Overall" and the
> spend categories in the rec-panel dropdown. Each acts as a discovery lens
> that surfaces cards specializing in that area.

## Context

Today the rec-panel dropdown has "Overall" plus spend categories (Dining,
Groceries, etc.) sorted by user spend. There's no way to ask "show me the
best cashback specialists" or "best transferable-points cards" or "best
cards where the perks justify the fee." Adding these three as discovery
lenses gives the user a way to browse specialists without forcing them to
guess the right spend category.

Decision recap from the design discussion:
- Cash / Points / Perks act as **filter + sort projections** on top of the
  existing engine — no new scoring math.
- Cash = filter to programs with `kind === "cash"`, sort by `deltaOngoing`.
- Points = filter to programs with `kind === "loyalty" && type === "transferable"`
  (strict — cobrand airline/hotel cards are excluded by design and stay in
  their own categories).
- Perks = no program filter; sort by net perks (`perksOngoing + feeOngoing`).
- Order in the dropdown: `Overall, Cash, Points, Perks, ──, Dining, Groceries, …`.

## Requirements

1. `RankSortBy` in `lib/engine/types.ts` gains a third variant:
   `{ kind: "specialization"; lens: "cash" | "points" | "perks" }`. The
   existing `total` and `category` variants are unchanged.

2. `rankCards` in `lib/engine/ranking.ts` honors the new variant by:
   - **Cash lens**: filtering `visibleRaw` to cards whose `currency_earned`
     resolves to a program where `kind === "cash"`. Cards with
     `currency_earned: null` are excluded (no-rewards cards aren't cash
     specialists). Sort by `rankAdjustedDelta(card, score.deltaOngoing, ...)`.
   - **Points lens**: filtering to cards where `currency_earned` resolves
     to a program with `kind === "loyalty" && type === "transferable"`.
     Sort by `rankAdjustedDelta(card, score.deltaOngoing, ...)`.
   - **Perks lens**: no filter. Sort by
     `rankAdjustedDelta(card, score.components.perksOngoing + score.components.feeOngoing, ...)`.
     Note: `feeOngoing` is already signed negative, so this is gross perks
     minus annual fee.
   - Brand-pin pass is **skipped** under specialization sort, same as it
     is under category sort. The user's lens choice is a stronger signal
     than their cobrand affinity.

3. The "Sort by category" `<select>` in
   `components/recommender/RecPanelDesktop.tsx` and
   `components/recommender/RecPanelMobile.tsx` is restructured with two
   `<optgroup>` blocks:
   ```
   Overall                   ← default option, no group
   ─── Optimize for ───      ← <optgroup label="Optimize for">
   Cash
   Points
   Perks
   ─── Best card for ───     ← <optgroup label="Best card for">
   {sorted spend categories}
   ```
   The existing `sortCategory` state type expands from
   `SpendCategoryId | "overall"` to
   `SpendCategoryId | "overall" | "cash" | "points" | "perks"`. The
   `rankOptions.sortBy` derivation maps the three new values to the
   `specialization` variant.

4. Per-card delta line behavior:
   - Under `category` sort, the existing `+$X/yr on dining` line stays.
   - Under `specialization` sort, that line is **not rendered** (specialization
     ranks by an aggregate, so a per-category delta would mislead).
   - The eyebrow text adapts: `Top {N} cash specialists` /
     `Top {N} points specialists` / `Top {N} perks specialists`.

5. Empty-state copy when `display.length === 0` under specialization:
   - Cash: `No cash-back specialists match this filter.`
   - Points: `No transferable-points cards match this filter.`
   - Perks: `No perks specialists match this filter.`

6. Vitest coverage in `tests/engine/ranking.test.ts`:
   - One test per lens confirming the filter behavior (cash lens excludes
     a known points card; points lens excludes a known cobrand-hotel card;
     perks lens includes both but ranks Reserve/Platinum-class cards
     above no-fee cards on a fixture wallet).
   - Fixtures should use the real compiled card database (consistent with
     the integration test pattern already in this file).

## Implementation Notes

### Engine changes — `lib/engine/types.ts`

Extend the discriminated union:
```ts
export type RankSortBy =
  | { kind: "total" }
  | { kind: "category"; category: SpendCategoryId }
  | { kind: "specialization"; lens: "cash" | "points" | "perks" };
```

### Engine changes — `lib/engine/ranking.ts`

1. After the existing `switch (options.filter)` block (lines 308-319) and
   before the sort comparator, add a specialization-filter pass:
   ```ts
   if (sortBy.kind === "specialization" && sortBy.lens !== "perks") {
     filtered = filtered.filter((r) => {
       const programId = r.card.currency_earned;
       if (!programId) return false;
       const prog = db.programById.get(programId);
       if (!prog) return false;
       if (sortBy.lens === "cash") return prog.kind === "cash";
       // points
       return prog.kind === "loyalty" && prog.type === "transferable";
     });
   }
   ```

2. Extend the `valueOf` helper:
   ```ts
   const valueOf = (r: Row): number => {
     if (sortBy.kind === "category") {
       return r.score.spendImpact[sortBy.category]?.delta ?? 0;
     }
     if (sortBy.kind === "specialization" && sortBy.lens === "perks") {
       return r.score.components.perksOngoing + r.score.components.feeOngoing;
     }
     return r.score.deltaOngoing;
   };
   ```

3. Skip the brand-pin pass under specialization. The current code branches
   on `sortBy.kind === "category"`; widen that check:
   ```ts
   if (sortBy.kind === "category" || sortBy.kind === "specialization") {
     combined = filtered;
   } else {
     // existing brand-pin logic for `total`
   }
   ```

### Panel changes — desktop and mobile

Both files share the same dropdown shape. Touch them in parallel.

1. State type:
   ```ts
   type SortValue = SpendCategoryId | "overall" | "cash" | "points" | "perks";
   const [sortCategory, setSortCategory] = useState<SortValue>("overall");
   ```

2. `rankOptions.sortBy` derivation:
   ```ts
   sortBy:
     sortCategory === "overall"
       ? { kind: "total" }
       : sortCategory === "cash" || sortCategory === "points" || sortCategory === "perks"
         ? { kind: "specialization", lens: sortCategory }
         : { kind: "category", category: sortCategory },
   ```

3. Dropdown markup (replace the existing flat `<option>` list inside the
   `<select>`):
   ```tsx
   <option value="overall">Overall</option>
   <optgroup label="Optimize for">
     <option value="cash">Cash</option>
     <option value="points">Points</option>
     <option value="perks">Perks</option>
   </optgroup>
   <optgroup label="Best card for">
     {categoryOptions.map((c) => (
       <option key={c.id} value={c.id}>{c.label}</option>
     ))}
   </optgroup>
   ```

4. Eyebrow copy in the middle column. The existing line is
   `Top ${display.length} cards to add next` (desktop line 658, mobile
   equivalent). Add a specialization branch:
   ```tsx
   isSearching
     ? `${display.length} ${display.length === 1 ? "match" : "matches"} for "${query.trim()}"`
     : sortCategory === "cash"
       ? `Top ${display.length} cash specialists`
       : sortCategory === "points"
         ? `Top ${display.length} points specialists`
         : sortCategory === "perks"
           ? `Top ${display.length} perks specialists`
           : `Top ${display.length} cards to add next`
   ```

5. Per-card delta line guard. The existing block runs under
   `sortCategory !== "overall"` (desktop line 856, mobile line 722). Tighten
   it to category-only:
   ```tsx
   {sortCategory !== "overall"
     && sortCategory !== "cash"
     && sortCategory !== "points"
     && sortCategory !== "perks"
     && (() => { /* existing per-category delta render */ })()}
   ```
   Or — cleaner — narrow the type with a helper:
   ```ts
   const isCategorySort = (s: SortValue): s is SpendCategoryId =>
     s !== "overall" && s !== "cash" && s !== "points" && s !== "perks";
   // …
   {isCategorySort(sortCategory) && (() => { /* existing block */ })()}
   ```

6. Empty-state copy — extend the existing `display.length === 0` ladder
   (desktop line 713, mobile equivalent) with a specialization branch
   before the category-baseline branch.

### Known limitation — out of scope for this TASK

When `profile.spend_profile` is empty, Cash and Points lens rankings will
lean on SUB + perks − fee instead of earned-rewards-on-spend, so flat-rate
cashback workhorses (Double Cash) won't necessarily top the Cash lens.
The user has a populated spend profile in normal use, so this is a v1
edge case. Follow-up TASK could add a neutral baseline fallback for
empty profiles. Don't fix it here.

## Do Not Change

- `cards/*.md`, `scripts/build-card-db.ts`, `scripts/lib/schemas.ts`,
  `data/*.json` — no schema changes needed; the program `kind` and `type`
  fields already exist.
- `lib/engine/scoring.ts` — no scoring math changes.
- `lib/engine/eligibility.ts` — no eligibility changes.
- `lib/engine/brandAffinity.ts` — brand-fit logic is unchanged; the engine
  just skips the pin pass under specialization (same pattern as category).
- `components/perks/Segmented.tsx`, the `RankFilter` segmented control
  (All / No annual fee / Premium tier) — orthogonal axis; do not touch.
- `components/recommender/DrillIn.tsx`, `WalletRow.tsx`, `ValuePillars.tsx`,
  `CoverageRow.tsx`, `CardArt.tsx` — per-card render is unchanged.
- `components/recommender/Header.tsx` — view-mode and credits-mode toggles
  are unchanged.
- `app/(app)/layout.tsx` and any auth / profile / DB code — unrelated.
- The URL sync logic in the panels (`q` and `seg` query params) — the new
  sort modes are session-only state, same as the existing `sortCategory`.
- `categoryOptions` memo (the spend-descending category sort) — keep as-is
  for the second `<optgroup>`.

## Acceptance Criteria

- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` passes with zero errors.
- [ ] `npm run lint` passes with zero errors.
- [ ] `npm test` passes — including the three new ranking tests.
- [ ] Picking `Cash` from the dropdown shows only cards whose primary
      program is cash-kind (e.g. Citi Double Cash, Wells Active Cash,
      BoA Customized Cash, SavorOne, Quicksilver). No Sapphire Preferred,
      no Amex Gold.
- [ ] Picking `Points` shows only transferable-points cards (Sapphire
      Preferred/Reserve, Amex Gold/Platinum, Capital One Venture/Venture X,
      Citi Premier/Strata, Bilt). No Hilton Honors, no Delta SkyMiles, no
      Marriott Bonvoy.
- [ ] Picking `Perks` ranks Reserve / Platinum / Venture X / Hilton Aspire
      style cards near the top on a fixture wallet, ahead of no-fee cards.
- [ ] Per-card `+$X/yr on {category}` delta line does NOT render under
      Cash / Points / Perks; it still renders under category sort.
- [ ] Eyebrow copy reads `Top {N} cash specialists` etc. under the new
      modes.
- [ ] Mobile (`RecPanelMobile.tsx`) shows the same optgroup structure and
      behaves identically.
- [ ] `git diff` shows changes only in:
      - `lib/engine/types.ts`
      - `lib/engine/ranking.ts`
      - `components/recommender/RecPanelDesktop.tsx`
      - `components/recommender/RecPanelMobile.tsx`
      - `tests/engine/ranking.test.ts`

## Verification

1. `npm run typecheck && npm run lint && npm run build && npm test` from
   `/Users/angel/1000Problems/perks` — all four pass.
2. `git diff --name-only` — confirm only the five files above changed.
3. Manual smoke in `npm run dev`:
   - Open `/recommendations` (or wherever the rec panel renders).
   - Cycle through dropdown values: Overall → Cash → Points → Perks →
     Dining. Top-5 list reshuffles each time. Eyebrow copy updates.
     Per-card delta line appears only under Dining.
   - Confirm Cash list contains no transferable-points cards and Points
     list contains no cobrand airline/hotel cards.
4. Check that the URL stays clean (no `seg`/`q` writes from this dropdown
   — it's session-only, same as today's `sortCategory`).
