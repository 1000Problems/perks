# TASK: Trip planner

> Destination input → list of what's bookable today with the user's points, plus which recommended cards would unlock more options.

## Context

The trip planner is the secondary value moment after the rec list. User picks a destination and sees a concrete list: "Andaz Scottsdale, Cat 4 off-peak, 12,000 Hyatt points — you have access via Chase UR." It's where transfer partners and sweet spots become tangible. The current page at `app/(app)/trips/page.tsx` is a stub.

## Requirements

1. Replace `app/(app)/trips/page.tsx` with the real planner.
2. Top of page: destination chip selector populated from the user's `trips_planned` plus a "+ add destination" inline input.
3. Below: two stacked sections:
   - **Bookable today** — for the selected destination, list every entry from `db.destinationPerks` whose key matches (or fuzzy-matches) the destination, filtered to transfer partners reachable via cards the user currently holds. Each row: hotel/airline name, redemption description, point cost, equivalent retail price, source program, and which card(s) of theirs unlock it.
   - **A new card would unlock** — same shape, but for transfer partners the user doesn't have access to. Each row links to the corresponding card in the rec list (`/recommendations?card={id}`).
4. If the user holds no cards with transferable points, the "Bookable today" section shows an empty state: "You don't have any transferable-point cards yet. Recommended starter cards below."
5. The destination input accepts a free-form string and stores it in `profile.trips_planned` if confirmed.

## Implementation Notes

- Server-render: load `loadCardDatabase()`, fetch profile, pass both to `<TripPlanner>` client component.
- "Transferable-point cards the user has" = iterate `profile.cards_held`, look up each in `db.cardById`, collect unique `currency_earned` values that have `db.programById.get(currency).type === "transferable"`.
- Sweet spots come from `program.sweet_spots[]`. Destination matching: use the destination key in `db.destinationPerks` if available; fall back to fuzzy match against the destination string.
- Don't show point balances yet — we don't track them. Just show "you can transfer to Hyatt." A future task can add balance tracking; for now flag it in a small footer note.
- Use `chip` class for destination chips. Redemption rows: small card-style with a left border accent (`var(--pos)` for "Bookable today," `var(--ink-3)` for "Unlocked by new card").
- The header navigation already has a Trip planner link.

## Do Not Change

- `lib/engine/**`, `lib/data/**`, `lib/profile/**`, `scripts/**` — settled
- Other pages
- Auth + db

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Visiting `/trips` with Phoenix in `trips_planned` shows Phoenix-relevant redemptions if `db.destinationPerks` has a Phoenix entry
- [ ] Selecting a different destination updates both sections
- [ ] Adding a destination via inline input persists it
- [ ] If user has no transferable-point cards, "Bookable today" shows empty state
- [ ] Clicking an "unlocked by new card" row links to `/recommendations?card={id}`
- [ ] `git diff` shows changes in `app/(app)/trips/**` and `components/trips/**` (new directory)

## Verification

1. `npm run typecheck && npm run build`
2. Sign in, set Phoenix as a planned trip, visit `/trips` — confirm Hyatt-via-Chase-UR appears if user holds a CSP/CSR/CFU
3. Remove all Chase cards, refresh — confirm empty state and "new card" suggestions
