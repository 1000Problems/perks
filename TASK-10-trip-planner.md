# TASK: Trip planner

> Destination input → list of what's bookable today with the user's points, plus which recommended cards would unlock more options.

## Context

The trip planner is the secondary value moment after the rec list. User picks a destination (or one of their `trips_planned`) and sees a concrete list: "Andaz Scottsdale, Cat 4 off-peak, 12,000 Hyatt points — you have 47,000 Chase UR which transfer 1:1 to Hyatt." It's the place where transfer partners and sweet spots become tangible. The current page at `app/(app)/trips/page.tsx` is a stub.

## Requirements

1. Replace `app/(app)/trips/page.tsx` with the real planner.
2. Top of page: a destination chip selector populated from the user's `trips_planned` plus a "+ add destination" inline input.
3. Below: two stacked sections:
   - **Bookable today** — for the selected destination, list every redemption from `data/destination_perks.json` that maps to a transfer partner the user can reach via cards they currently hold. Each row: hotel/airline name, redemption description, point cost, equivalent retail price, the user's source program, and "you have X points."
   - **A new card would unlock** — same shape, but for transfer partners the user doesn't currently have access to. Each row links to the corresponding card in the rec list.
4. If the user holds no cards with transferable points, the "Bookable today" section shows an empty state with copy: "You don't have any transferable-point cards yet. Recommended starter cards below."
5. The destination input accepts a free-form string and stores it in `profile.trips_planned` if confirmed (matches the same shape as TASK-07).

## Implementation Notes

- Server-render the page: load `destination_perks.json` and `programs.json` via the loader, fetch the user's profile, pass everything to a `<TripPlanner>` client component.
- Resolving "transferable-point cards the user has": iterate `profile.cards_held`, look up each card in `db.cards`, collect the unique `currency_earned` values that are of `type: "transferable"` in `db.programs`.
- For "you have X points," we don't track point balances yet. Either:
  - Skip showing the user's balance for v1 and just show "you can transfer to Hyatt"
  - Or add a per-program estimated-points input later
  Pick the first; flag in `RESEARCH_NOTES.md` that point-balance tracking is a future addition.
- Use the existing `chip` class for the destination chips. Use small card-style rows with a left border accent (`var(--pos)` for "Bookable today," `var(--ink-3)` for "A new card would unlock") for the redemption list.
- The header navigation already has a "Trip planner" link — confirm it routes correctly.

## Do Not Change

- `lib/engine/**` — engine doesn't touch trips directly; this page does its own data joining
- `lib/data/**`, `lib/profile/**` — settled
- Other pages
- Auth, middleware

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Visiting `/trips` with a profile that has Phoenix planned shows Phoenix-relevant redemptions
- [ ] Selecting a different destination updates both sections
- [ ] Adding a new destination via the inline input persists it
- [ ] If user has no transferable-point cards, the "Bookable today" empty state shows
- [ ] Clicking an "unlocked by new card" row links to the rec list and highlights the corresponding card (use a query string like `?card=sapphire-tier`)
- [ ] `git diff` shows changes in `app/(app)/trips/**` and `components/trips/**` (new directory)

## Verification

1. `npm run typecheck && npm run build`
2. Sign in, set Phoenix as a planned trip, visit `/trips` — confirm Hyatt-via-Chase-UR appears if the user has a Chase UR card
3. Remove all Chase cards, refresh — confirm the empty state and the "new card" suggestions
