# TASK: Onboarding screen 1 — spend profile

> Twelve sliders with US-household defaults, a live total at the top, and persistence to the user's profile on every change (debounced).

## Context

The first onboarding screen captures how much the user spends per year by category. The brief calls for this to feel like 60 seconds of work, not a tax form. Defaults are visible immediately; only the total is shown live. The current page at `app/(app)/onboarding/spend/page.tsx` is a stub — replace it.

## Requirements

1. Replace `app/(app)/onboarding/spend/page.tsx` with the real screen.
2. Render 12 sliders, one per category in `SPEND_CATEGORIES` from `lib/data/stub.ts` (or the loader once TASK-01 is done). Each slider:
   - Range 0 to 30,000 (or 50,000 for the `other` category)
   - Step 100
   - Initial value = current `profile.spend_profile[id]` or the category's `default`
   - Label, current dollar value, and the slider track, all on one row
3. Show a live "Total annual spend: $X" at the top, updating as sliders move.
4. On every slider change, call `useProfile().update()` with the new spend_profile (debounced — TASK-05 handles the debounce).
5. Bottom-right "Continue →" button navigates to `/onboarding/brands`. Disabled if total spend is 0.

## Implementation Notes

- Convert the page to a client component (`"use client"`). Server-render the initial profile from `getCurrentProfile()` in a parent server component, pass it down as a prop. Pattern: `app/(app)/onboarding/spend/page.tsx` (server, fetches profile) renders `<SpendForm initialProfile={...} />` from `components/onboarding/SpendForm.tsx`.
- Reuse `OnboardingShell` from `components/onboarding/OnboardingShell.tsx` for the title and progress bar. Keep step={1}.
- Sliders: native `<input type="range">` styled to match the design tokens. No new dependencies. Style guide:
  - Track: 4px tall, `var(--rule)` background
  - Filled portion: `var(--ink)`
  - Thumb: 18px circle, `var(--ink)`, slight shadow
- Format dollar values with `fmt.usd` from `lib/utils/format.ts`.
- The `Continue` button should be a standard `btn btn-primary`; the disabled state uses `opacity: 0.4` and `cursor: not-allowed`. Do not introduce a new design token for this.
- Add a "Statement upload — coming soon" disabled chip below the sliders, just to mark the intent. No actual upload behavior.

## Do Not Change

- `app/(app)/onboarding/brands/page.tsx`, `app/(app)/onboarding/cards/page.tsx` — TASK-07 and TASK-08
- `components/onboarding/OnboardingShell.tsx` — extend if needed but don't redesign
- `lib/profile/**` — TASK-05 is settled; consume its API
- `lib/engine/**`, `lib/data/**` — out of scope
- Existing rec panel files

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Visiting `/onboarding/spend` while authenticated renders 12 sliders pre-populated with the user's current profile (or defaults)
- [ ] Moving a slider updates the displayed dollar value immediately
- [ ] Moving a slider triggers a Supabase write within ~1 second (visible in network tab as a request to `*.supabase.co`)
- [ ] Reloading the page restores the values that were last set
- [ ] Total spend at top reflects the live sum
- [ ] Continue button navigates to `/onboarding/brands`
- [ ] Visually consistent with the design tokens — paper background, ink text, no introduced colors
- [ ] `git diff` shows changes in `app/(app)/onboarding/spend/**` and `components/onboarding/**` only

## Verification

1. `npm run typecheck && npm run build`
2. Sign in, visit `/onboarding/spend`, move a slider, refresh the page, confirm value persists
3. Open Supabase Table Editor on `profiles` row — `spend_profile` JSON reflects the changes
