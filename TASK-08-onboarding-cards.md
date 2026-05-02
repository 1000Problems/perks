# TASK: Onboarding screen 3 — cards held wallet builder

> Search-and-add wallet builder. For each card the user holds, capture when they opened it (drives 5/24, once-per-lifetime) and whether the sign-up bonus was already received.

## Context

The eligibility engine (TASK-02) needs the user's card history with open dates to evaluate issuer rules. This screen captures it. The current page at `app/(app)/onboarding/cards/page.tsx` is a stub — replace it. Cards are searched against the live database loaded via `loadCardDatabase()`.

## Requirements

1. Replace `app/(app)/onboarding/cards/page.tsx` with the real screen.
2. Search input at the top — fuzzy-matching against card names from `db.cards` (loaded via `loadCardDatabase()` in the parent server component). Show a dropdown of up to 8 matches as the user types.
3. Selecting a card opens an inline form prompting for:
   - **Opened**: month + year picker (default to current month)
   - **Got the sign-up bonus?**: yes/no toggle (default yes)
4. Save adds the card to `profile.cards_held` as `{ card_id, opened_at, bonus_received }` and renders it as a row below the search.
5. Each held-card row shows the card art (use `<CardArt variant={...} />` with a generic variant for now since we don't have issuer-specific art), name, issuer, opened date, and a small "remove" link. Removing writes the updated array.
6. An eligibility pre-check below the held cards, computed live from the wallet using `evaluateEligibility` from TASK-02 against representative anchor cards (Sapphire Preferred for Chase, Gold for Amex, Strata Premier for Citi, Venture for Capital One). Surface issuer-level summaries:
   - "You're at 2/24 for Chase. Eligible for new Chase products."
   - "You're at 5/24. Most Chase products won't approve right now."

## Implementation Notes

- Server-render the page: load profile via `getCurrentProfile()` and database via `loadCardDatabase()`. Pass both to `<CardsForm initialProfile={...} db={...} />` client component.
- Search: case-insensitive substring match against `card.name`, plus a quick token match for issuer name. No need for Fuse.js.
- Use `CardArt` from `@/components/perks/CardArt`. Since the database doesn't have card art variants per card, derive a variant from the card's `currency_earned` or `issuer` (rough mapping) for the wallet display:
  - Chase UR cards → `art-navy`
  - Amex MR cards → `art-platinum`
  - Capital One miles → `art-skyblue`
  - everything else → `art-graphite`
  This is a placeholder until we have real art.
- Month/year picker: two `<select>` elements (months 1-12, years current-7 through current). No date library.
- Continue → `/recommendations`. Skip → `/recommendations` without writing.
- Empty state: "No cards yet — that's fine, we'll recommend starter cards." Render the rec page anyway for cold-start users.

## Do Not Change

- `lib/engine/eligibility.ts` — call it, don't modify
- `lib/data/**`, `scripts/**` — settled
- `lib/profile/**` — settled
- `components/perks/CardArt.tsx` — reuse
- Other onboarding pages
- Auth + db

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Searching shows matching cards from the real database (50+ cards)
- [ ] Adding a card writes to Postgres and renders in the list
- [ ] Removing a card writes and removes from list
- [ ] Eligibility pre-check updates as cards are added/removed (test by adding 5 Chase personal cards within 24 months — pre-check flips to red for Chase)
- [ ] Continue → `/recommendations`
- [ ] `git diff` shows changes in `app/(app)/onboarding/cards/**` and `components/onboarding/**` only

## Verification

1. `npm run typecheck && npm run build`
2. Add 3-5 cards from the real database, refresh, confirm persistence
3. Add 5 Chase personal cards opened in the last 12 months — confirm the pre-check flips to red for Chase
