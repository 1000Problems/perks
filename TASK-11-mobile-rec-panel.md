# TASK: Mobile recommendation panel layout

> Three-tab compress of the desktop rec panel. Defaults to "Top 5 to add" — the moment of value. Wallet and Detail are accessible via the tab bar.

## Context

The desktop rec panel uses three columns. On mobile, three columns won't fit and stacking would bury the value. The right answer is a tab-bar UI where users land on "Top 5" by default. Detail view appears when a card is tapped, becoming the active tab. Same data, same engine, different IA.

## Requirements

1. Create `components/recommender/RecPanelMobile.tsx` — mirrors the desktop component's data interface (same `{ profile, db }` props) but renders a tabbed mobile layout.
2. Three tabs: **Wallet** | **Top 5** | **Detail**. Default selected is "Top 5."
3. Tapping a card in the Top 5 list automatically switches to the Detail tab and shows that card's drill-in.
4. The header (`components/recommender/Header.tsx`) collapses on mobile: hide the segmented controls, show a small "filter" icon button that opens a bottom sheet with the same controls. The logo, account menu, and Sign out remain visible.
5. The recommendations page (`app/(app)/recommendations/page.tsx`) chooses the layout based on viewport using a CSS media query approach — render both components, hide one with a Tailwind/CSS class. The component that's hidden should not run heavy computations (use `useMediaQuery` or a server-side hint).

## Implementation Notes

- For the layout switch, a clean approach is:
  ```tsx
  <>
    <div className="hidden md:block"><RecPanelDesktop ... /></div>
    <div className="block md:hidden"><RecPanelMobile ... /></div>
  </>
  ```
  Both render server-side; CSS hides the unused one. Acceptable for now — if engine compute becomes expensive, refactor to a client `useMediaQuery` later.
- The bottom sheet for the filter modal is a fixed-position div anchored to the bottom of the viewport. No new dependencies.
- Tabs are buttons styled with `data-active="true"` matching the existing segmented control look.
- Reuse `DrillIn`, `CardArt`, `EligibilityChip`, `HeatRow`, `Money`, `Eyebrow` — the components are already mobile-friendly.
- The Wallet tab on mobile shows the same content as the left column on desktop: net value, card list, spend coverage heatmap, perks held.
- Include a small header label above the tab bar: "Recommendations" so users know where they are.

## Do Not Change

- `components/recommender/RecPanelDesktop.tsx` (after TASK-09 edits) — desktop layout stays
- `components/recommender/DrillIn.tsx` — reuse
- `components/perks/**` — primitives
- `lib/engine/**`, `lib/profile/**`, `lib/data/**`
- Onboarding, auth, trip planner
- `app/globals.css` design tokens

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Visiting `/recommendations` on a 390px viewport shows the mobile layout
- [ ] Visiting on a 1280px viewport shows the desktop layout
- [ ] Default mobile tab is "Top 5"
- [ ] Tapping a card switches to Detail tab and shows that card
- [ ] The mobile filter sheet opens, applies a filter, closes
- [ ] The wallet tab shows current wallet content
- [ ] `git diff` shows changes in `components/recommender/RecPanelMobile.tsx` (new), `components/recommender/Header.tsx` (filter sheet), `app/(app)/recommendations/page.tsx` (renders both layouts)

## Verification

1. `npm run typecheck && npm run build`
2. Open dev tools, set viewport to iPhone 14 — confirm mobile layout, tab behavior
3. Resize to desktop — confirm desktop layout
