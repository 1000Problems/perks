# TASK: Mobile recommendation panel layout

> Three-tab compress of the desktop rec panel. Defaults to "Top 5 to add" — the moment of value. Wallet and Detail accessible via the tab bar.

## Context

The desktop rec panel uses three columns. On mobile, three columns won't fit and stacking would bury the value. Tab-bar UI defaulting to "Top 5" is the right answer. Detail view appears when a card is tapped, becoming the active tab. Same data, same engine, different IA.

## Requirements

1. Create `components/recommender/RecPanelMobile.tsx` — mirrors the desktop component's data interface (`{ profile, db }` props) but renders a tabbed mobile layout.
2. Three tabs: **Wallet** | **Top 5** | **Detail**. Default selected: "Top 5."
3. Tapping a card in Top 5 switches to Detail tab and shows that card's drill-in.
4. The header (`components/recommender/Header.tsx`) collapses on mobile: hide segmented controls, show a "filter" icon button that opens a bottom sheet with the same controls. Logo, account menu, Sign out remain visible.
5. The recommendations page (`app/(app)/recommendations/page.tsx`) chooses layout via CSS media query approach:
   ```tsx
   <>
     <div className="hidden md:block"><RecPanelDesktop ... /></div>
     <div className="block md:hidden"><RecPanelMobile ... /></div>
   </>
   ```

## Implementation Notes

- Bottom sheet for the filter modal: fixed-position div anchored to viewport bottom. No new deps.
- Tabs are buttons styled with `data-active="true"` matching the existing segmented control look.
- Reuse `DrillIn`, `CardArt`, `EligibilityChip`, `HeatRow`, `Money`, `Eyebrow` — all primitives are mobile-friendly.
- Wallet tab on mobile shows the same content as the left column on desktop: net value, card list, spend coverage heatmap, perks held.
- Header label "Recommendations" above the tab bar so users know where they are.
- Both layouts call the engine; that's fine — `useMemo` keyed on inputs prevents redundant work.

## Do Not Change

- `components/recommender/RecPanelDesktop.tsx` (after TASK-09 edits) — desktop layout stays
- `components/recommender/DrillIn.tsx` — reuse
- `components/perks/**` — primitives
- `lib/engine/**`, `lib/profile/**`, `lib/data/**`, `scripts/**`
- Onboarding, auth, trip planner
- `app/globals.css` design tokens

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Visiting `/recommendations` on a 390px viewport shows the mobile layout
- [ ] Visiting on a 1280px viewport shows the desktop layout
- [ ] Default mobile tab is "Top 5"
- [ ] Tapping a card switches to Detail tab and shows that card
- [ ] Mobile filter sheet opens, applies a filter, closes
- [ ] Wallet tab shows current wallet content
- [ ] `git diff` shows changes in `components/recommender/RecPanelMobile.tsx` (new), `components/recommender/Header.tsx` (filter sheet), `app/(app)/recommendations/page.tsx` (renders both layouts)

## Verification

1. `npm run typecheck && npm run build`
2. Open dev tools, set viewport to iPhone 14 — confirm mobile layout, tab behavior
3. Resize to desktop — confirm desktop layout
