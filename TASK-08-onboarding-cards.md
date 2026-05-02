# TASK: Onboarding screen 3 — cards held wallet builder

> Search-and-add wallet builder. For each card the user holds, capture when they opened it (drives 5/24, once-per-lifetime) and whether the sign-up bonus was already received.

## Context

The eligibility engine (TASK-02) needs the user's card history with open dates to evaluate issuer rules. This screen captures it. The current page at `app/(app)/onboarding/cards/page.tsx` is a stub — replace it.

## Requirements

1. Replace `app/(app)/onboarding/cards/page.tsx` with the real screen.
2. A search input at the top — fuzzy-matching against card names from `data/cards.json` (loaded via TASK-01). Show a dropdown of up to 8 matches as the user types.
3. Selecting a card opens a small inline form prompting for:
   - **Opened**: month + year picker (default to current month)
   - **Got the sign-up bonus?**: yes/no toggle (default yes)
4. Save adds the card to `profile.cards_held` as `{ card_id, opened_at, bonus_received }` and renders it as a row below the search.
5. Each held-card row shows the card art, name, issuer, opened date, and a small "remove" link. Removing writes the updated array.
6. A small eligibility pre-check appears below the held cards, computed live from the wallet:
   - "You're at 2/24 for Chase. Eligible for new Chase products."
   - "You're at 5/24. Most Chase products won't approve right now."
   - Computed by calling `evaluateEligibility` from TASK-02 against a few representative cards (e.g., Sapphire Preferred for Chase). Surface the issuer-level summary, not card-level.

## Implementation Notes

- Server-render the initial profile via `getCurrentProfile()`, plus the card database via the loader from TASK-01. Pass both to `<CardsForm>` client component.
- Search: simple substring match against `card.name` (case-insensitive) is fine for v1 — no need for Fuse.js.
- Use the existing `CardArt` component for the visuals (variant comes from the card record; if missing, fall back to `art-graphite`).
- Month/year picker: two `<select>` elements (months 1-12, years current-7 to current). Don't pull a date library.
- The eligibility pre-check uses TASK-02's `evaluateEligibility`. Pick one anchor card per major issuer (Chase: Sapphire Preferred; Amex: Gold; Citi: Premier; Cap One: Venture) and surface the result.
- Continue button navigates to `/recommendations`. Skip navigates to `/recommendations` without writing.
- Empty state: when no cards are held, render a small note: "No cards yet — that's fine, we'll recommend starter cards."

## Do Not Change

- `lib/engine/eligibility.ts` — call it, don't modify
- `lib/data/**` — schema and loader are settled
- `lib/profile/**` — settled
- `components/perks/CardArt.tsx` — reuse
- Other onboarding pages
- Auth, middleware, Supabase

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Searching shows matching cards within the dropdown
- [ ] Adding a card writes to Supabase and renders in the list
- [ ] Removing a card writes and removes from list
- [ ] Eligibility pre-check updates as cards are added/removed (test by adding 5 Chase personal cards within 24 months — pre-check should flip to red for Chase)
- [ ] Continue navigates to `/recommendations`
- [ ] `git diff` shows changes in `app/(app)/onboarding/cards/**` and `components/onboarding/**` only

## Verification

1. `npm run typecheck && npm run build`
2. Add a few cards, refresh, confirm persistence
3. Add cards that should trigger 5/24 — confirm the pre-check changes
