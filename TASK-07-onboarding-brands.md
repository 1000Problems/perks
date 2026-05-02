# TASK: Onboarding screen 2 — brands and trips

> Multi-select chip selectors for stores, airlines, hotels, services, plus a destinations input that powers hidden-gem detection.

## Context

The recommendation engine uses brand affinity and travel plans to surface specific perks ("transfer Hyatt for your Phoenix trip"). This screen captures both. The current page at `app/(app)/onboarding/brands/page.tsx` is a stub — replace it.

## Requirements

1. Replace `app/(app)/onboarding/brands/page.tsx` with the real screen.
2. Three chip groups, each with a heading:
   - **Stores**: Costco, Amazon, Target, Walmart, Sam's Club, Apple, Whole Foods, Best Buy
   - **Airlines & hotels**: United, Delta, American, Southwest, Alaska, JetBlue, Hilton, Marriott, Hyatt, IHG, Wyndham
   - **Services**: Uber, Lyft, DoorDash, Disney+, Netflix, Spotify, Equinox, Peloton
3. Selected chips persist to `profile.brands_used` (an array of brand strings) on every click, debounced.
4. A "Trips planned in the next 12 months" section below the chips. A free-text input + "Add" button. Each added trip becomes a removable chip. Stored in `profile.trips_planned` as `{ destination: string }[]`.
5. Skip and Continue buttons in the footer. Skip writes nothing; Continue navigates to `/onboarding/cards`.

## Implementation Notes

- Reuse the `chip` CSS class from `app/globals.css` — it already has selected/unselected states via `data-active="true"`.
- Server-render the initial profile via `getCurrentProfile()`, pass to a `<BrandsForm>` client component.
- The brand list is hard-coded in this screen for v1. Later we'll generate it from the issuer-card mappings, but not now.
- For the trips input, use a simple `<input type="text">` and an `Enter` key handler. Each added destination should be lower-cased and trimmed for storage.
- Wrap the long brand list in a `flex-wrap` container with 8px gap.
- Headers are eyebrow-styled (uppercase, 11px, letter-spacing 0.08em) — use the existing `.eyebrow` class.

## Do Not Change

- `app/(app)/onboarding/spend/**`, `app/(app)/onboarding/cards/**` — siblings
- `components/onboarding/OnboardingShell.tsx` — keep, use step={2}
- `lib/profile/**` — settled in TASK-05
- `lib/engine/**`, `lib/data/**` — out of scope
- Auth, Supabase clients, middleware

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Visiting `/onboarding/brands` renders all three chip groups
- [ ] Clicking a chip toggles its selected state and writes to Supabase within ~1s
- [ ] Adding a trip adds a removable chip
- [ ] Removing a trip writes the updated list to Supabase
- [ ] Reloading the page restores selections and trips
- [ ] Continue navigates to `/onboarding/cards`
- [ ] Skip navigates to `/onboarding/cards` without writing
- [ ] `git diff` shows changes in `app/(app)/onboarding/brands/**` and `components/onboarding/**` only

## Verification

1. `npm run typecheck && npm run build`
2. Select a few brands, add a trip, refresh, confirm everything persists
3. Inspect `profiles` row in Supabase — `brands_used` and `trips_planned` JSON reflects state
