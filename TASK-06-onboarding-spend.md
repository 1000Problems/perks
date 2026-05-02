# TASK: Onboarding screen 1 — spend profile

> Twelve sliders with US-household defaults, a live total at the top, and persistence to the user's profile on every change (debounced).

## Context

The first onboarding screen captures how much the user spends per year by category. The brief calls for this to feel like 60 seconds of work, not a tax form. Defaults are visible immediately; only the total is shown live. The current page at `app/(app)/onboarding/spend/page.tsx` is a stub — replace it.

## Requirements

1. Replace `app/(app)/onboarding/spend/page.tsx` with the real screen.
2. Render 12 sliders, one per category in `SPEND_CATEGORIES`. The constant currently lives in `lib/data/stub.ts` — move it to `lib/categories.ts` so the engine can import it without pulling stub user data. Each slider:
   - Range 0 to 30,000 (or 50,000 for `other`)
   - Step 100
   - Initial value = `profile.spend_profile[id]` or the category's `default`
   - Label, current dollar value, and slider track on one row
3. Show a live "Total annual spend: $X" at the top.
4. On every slider change, call `useProfile().update()` with the new spend_profile (debounced — TASK-05 handles the debounce).
5. Bottom-right "Continue →" navigates to `/onboarding/brands`. Disabled if total spend is 0.

## Implementation Notes

- Convert the page to a client component pattern: server-render the initial profile via `getCurrentProfile()` in a parent server component, pass it as a prop to `<SpendForm initialProfile={...} />` in `components/onboarding/SpendForm.tsx`.
- Reuse `OnboardingShell` from `components/onboarding/OnboardingShell.tsx`. Step={1}.
- Sliders: native `<input type="range">` styled to match the design tokens. No new deps. Style:
  - Track: 4px, `var(--rule)`
  - Filled portion: `var(--ink)`
  - Thumb: 18px circle, `var(--ink)`, slight shadow
- Format with `fmt.usd` from `lib/utils/format.ts`.
- Add a "Statement upload — coming soon" disabled chip below the sliders. No actual upload.
- The card database is loaded lazily via `loadCardDatabase()` if needed — but this screen doesn't need it. Spend categories are app-domain, not card-database.

## Do Not Change

- `app/(app)/onboarding/brands/**`, `app/(app)/onboarding/cards/**` — TASK-07 and TASK-08
- `components/onboarding/OnboardingShell.tsx` — extend if needed but don't redesign
- `lib/profile/**` — TASK-05 is settled; consume its API
- `lib/engine/**`, `lib/data/**`, `scripts/**` — out of scope
- `lib/auth/**`, `lib/db.ts`, `middleware.ts` — settled

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Visiting `/onboarding/spend` while authenticated renders 12 sliders pre-populated with the user's profile or defaults
- [ ] Moving a slider updates the displayed dollar value immediately
- [ ] Moving a slider triggers a Postgres write within ~1 second
- [ ] Reloading restores the values that were last set
- [ ] Total spend at top reflects the live sum
- [ ] Continue navigates to `/onboarding/brands`
- [ ] Visually consistent with design tokens
- [ ] `git diff` shows changes in `app/(app)/onboarding/spend/**`, `components/onboarding/**`, `lib/categories.ts` (new), and an import update in any file that previously imported `SPEND_CATEGORIES` from `lib/data/stub.ts`

## Verification

1. `npm run typecheck && npm run build`
2. Sign in, visit `/onboarding/spend`, move a slider, refresh, confirm value persists
3. In Neon SQL editor: `select spend_profile from perks_profiles where user_id = '<your-id>'` — JSON reflects the changes
