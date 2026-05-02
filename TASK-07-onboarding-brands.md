# TASK: Onboarding screen 2 — brands and trips

> Multi-select chip selectors for stores, airlines, hotels, services, plus a destinations input that powers hidden-gem detection.

## Context

The recommendation engine uses brand affinity and travel plans to surface specific perks ("transfer Hyatt for your Phoenix trip"). This screen captures both. The current page at `app/(app)/onboarding/brands/page.tsx` is a stub — replace it.

## Requirements

1. Replace `app/(app)/onboarding/brands/page.tsx` with the real screen.
2. Three chip groups:
   - **Stores**: Costco, Amazon, Target, Walmart, Sam's Club, Apple, Whole Foods, Best Buy
   - **Airlines & hotels**: United, Delta, American, Southwest, Alaska, JetBlue, Hilton, Marriott, Hyatt, IHG, Wyndham
   - **Services**: Uber, Lyft, DoorDash, Disney+, Netflix, Spotify, Equinox, Peloton
3. Selected chips persist to `profile.brands_used` (an array of brand strings) on every click, debounced.
4. A "Trips planned in the next 12 months" section. Free-text input + "Add" button. Each added trip becomes a removable chip. Stored in `profile.trips_planned` as `{ destination: string }[]`.
5. Skip and Continue buttons. Skip writes nothing; Continue → `/onboarding/cards`.

## Implementation Notes

- Reuse the `chip` CSS class from `app/globals.css` (selected/unselected via `data-active="true"`).
- Server-render initial profile via `getCurrentProfile()`, pass to `<BrandsForm>` client component.
- Brand list is hard-coded for v1. A later task may generate it dynamically from `loadCardDatabase()` co-brand cards, but not now.
- Trips input: `<input type="text">` + Enter handler. Each destination lower-cased + trimmed for storage.
- Wrap brand lists in `flex-wrap` with 8px gap.
- Group headers use the existing `.eyebrow` class.

## Do Not Change

- Other onboarding pages
- `components/onboarding/OnboardingShell.tsx` — keep, step={2}
- `lib/profile/**` — settled
- `lib/engine/**`, `lib/data/**`, `scripts/**` — out of scope
- Auth + db

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] All three chip groups render
- [ ] Clicking a chip toggles its state and writes to Postgres within ~1s
- [ ] Adding a trip adds a removable chip; removing writes the updated list
- [ ] Reloading restores selections and trips
- [ ] Continue → `/onboarding/cards`
- [ ] Skip → `/onboarding/cards` without writing
- [ ] `git diff` shows changes in `app/(app)/onboarding/brands/**` and `components/onboarding/**` only

## Verification

1. `npm run typecheck && npm run build`
2. Select a few brands, add a trip, refresh, confirm everything persists
3. Inspect `perks_profiles` row in Neon — `brands_used` and `trips_planned` JSON reflects state
