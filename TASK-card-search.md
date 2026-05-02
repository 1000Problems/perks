# TASK: Card search, scoped to current segment with escape hatch

> Add a search box top-right of the recommendations header (left of Settings). Search filters the visible list within the current segment (Best total / No annual fee / Premium). When the segment yields zero matches but matches exist in all cards, show a one-click escape hatch that drops the segment and keeps the query. Greyed-out segment chip stays visible for one-click restore.

## Context

The recommendation panel today shows a top-5 list filtered by a `RankFilter` segment (`total | nofee | premium`). There is no way to search by card name, issuer, or perk. When the user knows what they want — "Sapphire Reserve," "Hyatt," "Hilton Aspire" — they have to scan or scroll. That's the gap this task closes.

The non-obvious decision is how search interacts with the segment. Discussion converged on **scoped-by-default with an escape hatch**: search filters within the current segment so the user's frame ("what I'm looking at") is preserved, but the empty state surfaces an explicit count of matches in all cards with one tap to broaden. Greyed chip pattern was chosen over fully removing the chip so accidental escapes are recoverable in one click.

Search ranking: when the query exactly matches a card name (case-insensitive substring), pin that card to the top regardless of score — otherwise the user typing "Venture X" on a dining-heavy profile gets buried results, which feels broken. Brand-pin releases under search for the same reason category-sort releases it: the user's typed query is a stronger signal than their cobrand affinity.

## Requirements

1. **Header search input.** Add a search input to `components/recommender/Header.tsx`, positioned to the left of the Settings link in the right-side cluster. Desktop: always-visible input, ~220px wide, rounded, with magnifier icon and a clear-X when non-empty. Mobile: render a magnifier icon in the right cluster that, when tapped, expands to a full-width search bar overlaying the header (with a back/close affordance). Cmd/Ctrl+K focuses the input from anywhere on the page. Esc clears and blurs.

2. **State and URL sync.** Search query lives in the rec panel components (`RecPanelDesktop.tsx`, `RecPanelMobile.tsx`) as `useState<string>("")`. When non-empty, sync to URL as `?q=...` via `useSearchParams` + `router.replace` (debounced ~150ms so each keystroke doesn't push history). Reading `?q=` on mount initializes the state. Segment lives in URL as `?seg=...` only when search is active — otherwise it remains pure session state to avoid breaking existing share/back behavior.

3. **Search corpus and predicate.** Build a per-card searchable string (lowercased, joined with spaces) from: `card.name`, `card.issuer`, `card.network`, `card.currency_earned`, `card.best_for[]`, `card.category[]`, `card.ongoing_perks[].name`, `card.annual_credits[].name`. Predicate is plain substring match — no fuzzy. Memoize the per-card haystack on the database object so it computes once per session.

4. **Filtering and ranking under search.** When `q` is non-empty:
   - Call `rankCards` with `filter: "total"` (override the visual segment) and `limit: db.cards.length` so the full eligible list is returned.
   - Apply the visual segment as a UI predicate on `annual_fee_usd` (`nofee` → fee === 0; `premium` → fee >= 395; `total` → no filter). Use the same thresholds as `lib/engine/ranking.ts:309-314` so behavior matches the engine when not searching.
   - Apply the query predicate.
   - If any result's name contains the query as a substring, pin the highest-scoring such card to position 1.
   - Slice to 5 for display.

   When `q` is empty, behavior is identical to today — pass `limit: 5` and the segment's `RankFilter`.

5. **Empty-state escape hatch.** When `q` is non-empty and `(segment + query)` yields zero matches but `(query alone, no segment)` yields ≥1 match, replace the empty state with: `No matches in <segment label>. <N> in all cards →` where the arrow link is a button. Clicking it sets segment to `"total"` (state + URL) and keeps the query. After the click, render a thin restore strip above the list: `Showing all cards. Restore <segment label>` with `Restore` as a text button that flips segment back. Restore strip disappears when the user clears the search or manually picks a new segment.

   When `(query alone, no segment)` is also zero, show: `No cards match "<q>".` — no escape hatch, no restore strip.

6. **Segment chip behavior post-escape.** After clicking the escape hatch, the existing `Segmented` filter component visually reflects the new segment (`total`). The restore affordance from requirement 5 is the recovery path — do not add a separate greyed-chip element.

7. **Tests.** Add Vitest cases in `tests/` (new file `tests/search.test.ts` is fine):
   - Substring match against name, issuer, and a perk name (3 separate cases).
   - Name-match pin: a card whose name contains the query and ranks low surfaces at position 1.
   - Segment + query interaction: when `seg=nofee` and a fee card matches the query, that card is excluded; when seg is dropped, it appears.
   - Empty-state arithmetic: a query that matches in `total` but not in `nofee` returns 0 under `nofee` and >0 under `total`.

   Tests use the real compiled card database (existing engine tests already do this).

## Implementation Notes

### Header — `components/recommender/Header.tsx`

Add two new props: `query: string`, `setQuery: (q: string) => void`. Render the input in the desktop right cluster, before the Settings `Link`:

```tsx
<input
  type="search"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="Search cards"
  aria-label="Search cards"
  className="rec-header-search"
  // styling matches the existing header buttons — 1px var(--rule) border,
  // 8px radius, 32px height, 12px font, monospace placeholder OK
/>
```

For Cmd/Ctrl+K, attach a `keydown` listener at the document level inside a `useEffect` in the Header. `e.preventDefault()` and call `inputRef.current?.focus()`. For Esc, handle on the input itself.

Mobile: render a magnifier-icon button in the right cluster that toggles a `searchOpen` boolean. When `searchOpen`, render a fixed-position bar over the header (z-index above the existing sheet) with the input + a close button. Tapping close clears the input.

### Rec panels — both desktop and mobile

Add `query` state (`useState<string>("")`) and pass it to `RecHeader`. Initialize from `useSearchParams().get("q") ?? ""`. Sync back to URL with a 150ms debounced effect using `router.replace` from `next/navigation`.

The ranking call splits into two paths:

```ts
const isSearching = query.trim().length > 0;
const segment = filter; // existing RankFilter state

const rankOptions: RankOptions = useMemo(() => ({
  filter: isSearching ? "total" : segment,
  scoring: { creditsMode: credits, subAmortizeMonths: 24 },
  limit: isSearching ? db.cards.length : 5,
  eligibilityOverrides: /* unchanged */,
  sortBy: sortCategory === "overall"
    ? { kind: "total" }
    : { kind: "category", category: sortCategory },
}), [/* deps */]);
```

After `ranked = rankCards(...)`, derive in UI:

```ts
const segmentPredicate = (fee: number | null) => {
  if (segment === "nofee") return (fee ?? 0) === 0;
  if (segment === "premium") return (fee ?? 0) >= 395;
  return true;
};
const queryPredicate = (haystack: string) =>
  haystack.includes(query.trim().toLowerCase());

const matchesSegment = ranked.visible.filter(r => segmentPredicate(r.card.annual_fee_usd));
const matchesAll = isSearching
  ? ranked.visible.filter(r => queryPredicate(haystackFor(r.card)))
  : ranked.visible;
const matchesBoth = isSearching
  ? matchesSegment.filter(r => queryPredicate(haystackFor(r.card)))
  : matchesSegment;

// Name-match pin
let display = matchesBoth;
if (isSearching) {
  const q = query.trim().toLowerCase();
  const nameHits = display.filter(r => r.card.name.toLowerCase().includes(q));
  if (nameHits.length > 0) {
    const top = nameHits[0]; // already score-sorted
    display = [top, ...display.filter(r => r.card.id !== top.card.id)];
  }
}
display = display.slice(0, 5);
```

For the escape-hatch arithmetic, you only need `matchesBoth.length` and `matchesAll.length` — not a separate engine pass.

### Search haystack helper — new file `lib/data/searchIndex.ts`

```ts
import type { Card } from "@/lib/data/loader";

const cache = new WeakMap<Card, string>();

export function haystackFor(card: Card): string {
  const cached = cache.get(card);
  if (cached !== undefined) return cached;
  const parts: string[] = [
    card.name,
    card.issuer,
    card.network ?? "",
    card.currency_earned ?? "",
    ...(card.best_for ?? []),
    ...(card.category ?? []),
    ...card.ongoing_perks.map(p => p.name),
    ...card.annual_credits.map(c => c.name),
  ];
  const out = parts.join(" ").toLowerCase();
  cache.set(card, out);
  return out;
}
```

WeakMap keyed on the Card object — since the database is reconstructed once per render via `fromSerialized`, the cache will rebuild on each remount, which is fine.

### Restore strip placement

In both rec panels, render the strip directly above the result list (between the filter row and the `<ol>`), only when `isSearching && segmentWasOverridden`. `segmentWasOverridden` is a session-only ref — set it `true` when the escape-hatch button is clicked, set it `false` when `query` becomes empty or when `filter` changes via the `Segmented` control.

### URL sync

Use `useSearchParams` + `useRouter` from `next/navigation`:

```ts
useEffect(() => {
  const t = setTimeout(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query); else params.delete("q");
    if (isSearching) params.set("seg", segment); else params.delete("seg");
    router.replace(`?${params.toString()}` as Route, { scroll: false });
  }, 150);
  return () => clearTimeout(t);
}, [query, segment]);
```

Cast to `Route` — Next 15 typed routes will complain otherwise. If TS still complains, `as unknown as Route` is acceptable here.

## Do Not Change

- `lib/engine/{eligibility,scoring,ranking}.ts` — the engine stays pure. All search logic is in the UI layer. Do **not** add a `searchQuery` field to `RankOptions`.
- `lib/engine/types.ts` — same reason. Do not extend `RankFilter` or add new sort modes.
- `cards/*.md`, `data/*.json`, `scripts/build-card-db.ts`, `scripts/lib/schemas.ts` — search reads existing fields; no schema changes.
- `app/(app)/layout.tsx` and the auth gate — search is anonymous within the authenticated app.
- `lib/profile/*` — search state is session-only and URL-only. Do not persist to the user profile.
- `components/perks/Segmented.tsx` — the existing segmented filter is used as-is. Do not add a "greyed-out" mode.
- `components/recommender/DrillIn.tsx` — search does not touch the right panel. Selection behavior on the middle panel is unchanged (first visible card auto-selects).
- The "Try" button, Considering flow, wallet writes, brand-pin family logic for non-search cases — all untouched.
- Trip planner, settings page, onboarding — out of scope.

## Acceptance Criteria

- [ ] `npm run build` passes with zero errors.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes including the new search tests.
- [ ] Desktop: search input visible top-right of header, left of Settings. Cmd/Ctrl+K focuses it from anywhere on the page. Esc clears and blurs.
- [ ] Mobile: magnifier icon top-right; tapping it reveals a full-width search bar; close affordance dismisses it.
- [ ] Typing "sapphire" filters the list to Sapphire cards within the current segment, with the rec panel's score-based ordering preserved (except the name-match pin).
- [ ] In `No annual fee`, typing "sapphire reserve" shows `No matches in No annual fee. <N> in all cards →`. Clicking the link shows the cards and renders a `Showing all cards. Restore No annual fee` strip above the list. Clicking `Restore` flips the segment back.
- [ ] Typing a string that matches nothing anywhere shows `No cards match "<q>".` with no escape hatch.
- [ ] Clearing the search reverts to the original segment + top 5 ranking. URL `?q=` and `?seg=` are removed.
- [ ] Reloading the page with `?q=hyatt&seg=premium` restores the search state.
- [ ] `git diff` shows changes confined to: `components/recommender/Header.tsx`, `components/recommender/RecPanelDesktop.tsx`, `components/recommender/RecPanelMobile.tsx`, `lib/data/searchIndex.ts` (new), and `tests/search.test.ts` (new). CSS additions for `.rec-header-search` are acceptable in `app/globals.css` if needed.

## Verification

1. Run `npm run build` and confirm it passes.
2. Run `npm run typecheck` and `npm run lint`.
3. Run `npm test` and confirm all tests pass, including the new ones.
4. `npm run dev`, log in, hit `/recommendations`. Manually walk through:
   - Type a card name in the segment "Best total" — list narrows.
   - Switch to "No annual fee" with the query still active — verify segment + query interact correctly.
   - Type a fee card name while in "No annual fee" — verify escape-hatch state and restore strip.
   - Cmd/Ctrl+K to focus, Esc to clear.
   - Reload with `?q=hyatt` — verify state restores.
5. `git diff --stat` — confirm only the in-scope files changed.
