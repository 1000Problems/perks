# Prompt — research a new credit card and produce its markdown

Paste everything below this line into a new Claude session, then add the card name on the line that says "RESEARCH THIS CARD." Claude will produce a single markdown file ready to drop into `cards/`.

---

## Mission

You are researching a single US credit card and producing one markdown file in the exact format used by the perks app's card database. The file lives at `cards/{card_id}.md`. It will be parsed by a build script (`scripts/build-card-db.ts`) that extracts JSON fenced blocks and validates them with Zod schemas. The output feeds a credit card recommendation engine.

**Before researching:** check `cards/AllCards.md` to confirm this card isn't already done. If it is, stop and tell me.

**After researching:** output one complete markdown file. No commentary outside the file. Include all six sections below, in order, even if a section has no JSON block (use prose pointing to the anchor card instead).

## File naming

`card_id.md` — lowercase snake_case. The `card_id` must match exactly what you put in the `id` field of the `cards.json entry`. Examples: `chase_sapphire_preferred`, `amex_gold`, `capital_one_venture_x`, `boa_premium_rewards`, `bilt_obsidian`.

## Required sections (in this exact order)

```
# {Full card name}

`card_id`: {card_id}
`data_freshness`: {today's ISO date, YYYY-MM-DD}

## cards.json entry

```json
{ ... full card record, see schema below ... }
```

## programs.json entry ({program_id})

```json
{ ... full program record IF this card is the anchor for its currency. Otherwise prose: "See `chase_sapphire_preferred.md` for canonical chase_ur program." ... }
```

## issuer_rules.json entry ({Issuer})

```json
{ ... full issuer rules record IF this card is the anchor for its issuer. Otherwise prose pointer. ... }
```

## perks_dedup.json entries contributed by this card

```json
[ ... array of perk dedup entries this card adds. Empty array `[]` if none. ... ]
```

## destination_perks.json entries this card relevant to

```json
{ ... object keyed by destination. Empty object `{}` if none. ... }
```

## RESEARCH_NOTES.md entries for this card

- Bullet list of caveats, valuation context, recently-changed flags, source quality notes.
```

## Schema — cards.json entry

Required fields. Use `null` for unknown values; do not invent.

```ts
{
  id: string,                               // matches filename
  name: string,                             // full official card name
  issuer: "Chase" | "Amex" | "Citi" | "Capital One" | "Bank of America" | "Wells Fargo" | "US Bank" | "Discover" | "Bilt (issued by Wells Fargo)" | "Barclays" | etc,
  network: "Visa" | "Mastercard" | "American Express" | "Discover",
  card_type: "personal" | "business" | "secured" | "student",
  category: string[],                       // e.g. ["mid_tier_travel"], ["flat_rate_cashback"], ["airline_cobrand"]
  annual_fee_usd: number,
  annual_fee_first_year_waived: boolean,
  foreign_tx_fee_pct: number,               // 0 or 3 typically
  credit_score_required: "good" | "good_to_excellent" | "excellent" | "any" | etc,
  currency_earned: string,                  // program id, e.g. "chase_ur", "amex_mr", "capital_one_miles", "amex_cashback", "discover_cashback"

  earning: [
    {
      category: string,                     // e.g. "dining", "travel_chase_portal", "everything_else", "groceries", "gas", "online_grocery", "streaming_select", "utilities", "shopping", "transit"
      rate_pts_per_dollar: number,
      cap_usd_per_year: number | null,      // null = uncapped
      notes: string | null
    }
  ],

  signup_bonus: {
    amount_pts: number | null,              // null if no SUB
    spend_required_usd: number | null,
    spend_window_months: number | null,
    estimated_value_usd: number | null,
    notes: string | null
  } | null,                                 // OR null if card has no SUB at all

  annual_credits: [
    {
      name: string,
      value_usd: number | null,             // face value
      type: "specific" | "flexible" | etc,
      expiration: "annual_anniversary" | "calendar_year" | "monthly" | etc,
      ease_of_use: "easy" | "medium" | "hard" | "coupon_book",
      notes: string | null
    }
  ],

  ongoing_perks: [
    {
      name: string,
      value_estimate_usd: number | null,    // null = use-dependent, can't pre-estimate
      category: "travel_protection" | "purchase_protection" | "lifestyle" | "rewards_boost" | "rewards_flexibility" | "lounge" | "elite_status" | etc,
      notes: string | null
    }
  ],

  transfer_partners_inherited_from: string | null,  // program id if card inherits from a flexible currency

  issuer_rules: string[],                   // human-readable rule statements, e.g. "Chase 5/24: denied if 5+ new personal-credit cards opened in last 24 months"

  best_for: string[],                       // tags like ["dining_and_travel_balance", "first_transferable_points_card", "international_travel_no_FX_fee", "Hyatt_transfer_value"]
  synergies_with: string[],                 // card ids that pair well
  competing_with_in_wallet: string[],       // card ids that overlap

  breakeven_logic_notes: string,            // 1-3 sentences explaining when this card pays for itself

  recently_changed: boolean,                // true if a refresh happened in the last 12 months
  closed_to_new_apps: boolean,              // optional, omit if false
  data_freshness: string,                   // YYYY-MM-DD
  sources: string[]                         // 2-5 URLs, primary issuer page first
}
```

### `ease_of_use` grading guide for `annual_credits`

This is the most opinionated field. The engine multiplies face value by:

- **easy = 1.0** — flexible cash equivalent, no merchant restriction. Examples: Capital One Venture X $300 travel credit, Amex Plat $200 hotel credit at Fine Hotels & Resorts (when used).
- **medium = 0.75** — specific category, recurring, but most people use it. Examples: Chase Sapphire Preferred $50 hotel credit (must book through Chase Travel; users do this anyway), Amex Gold dining credit.
- **hard = 0.40** — narrow merchant or one-time-feeling. Examples: Saks $50 semiannual, Equinox $300 (most people don't have an Equinox membership), Resy.
- **coupon_book = 0.20** — Amex Plat-style stacks of small monthly credits where realistic redemption rate is far below face. The Walmart+ credit, Uber Cash monthly drops, streaming credits at Plat tier.

When in doubt, lean toward the more conservative grade. The engine will be tuned on real user feedback later.

## Schema — programs.json entry (only if anchor)

A card is the **anchor** for a program if it's the most-recognized issuer of that program (e.g., Chase Sapphire Preferred for Chase Ultimate Rewards, Amex Gold for Amex Membership Rewards). For non-anchor cards, write prose only:

```
## programs.json entry

See `chase_sapphire_preferred.md` for canonical chase_ur program. {Card name} earns chase_ur at fixed value (1cpp) unless paired with a Sapphire/Ink Preferred for transfer access.
```

For anchor cards, the schema is:

```ts
{
  id: string,                               // e.g. "chase_ur"
  name: string,                             // e.g. "Chase Ultimate Rewards"
  type: "transferable" | "fixed_value" | "cobrand_airline" | "cobrand_hotel" | string,
  issuer: string,
  earning_cards: string[],                  // list every card_id that earns this currency. The build script will recompute this from `currency_earned` on each card, so this is a starting point; don't agonize over completeness.
  fixed_redemption_cpp: number | null,      // baseline cents per point
  portal_redemption_cpp: number | null,     // value when redeemed through issuer travel portal
  portal_redemption_cpp_notes: string | null,
  transfer_partners: [
    {
      partner: string,                      // e.g. "World of Hyatt"
      ratio: string,                        // e.g. "1:1", "2:1.5"
      type: "airline" | "hotel" | "other",
      min_transfer: number | null,          // typically 1000
      notes: string | null
    }
  ],
  sweet_spots: [
    {
      description: string,                  // e.g. "Hyatt Cat 1-4 free night 3,500-15,000 points"
      value_estimate_usd: number | string | null,  // "~3-5cpp" or 400 or null
      source: string | null
    }
  ],
  sources: string[]
}
```

## Schema — issuer_rules.json entry (only if anchor for the issuer)

Same anchor model. First card from a given issuer (lexically) provides the full rules block. Others write prose pointer:

```
## issuer_rules.json entry

See `chase_sapphire_preferred.md` for canonical Chase rules.
```

For anchor:

```ts
{
  issuer: string,                           // matches the card's issuer
  rules: [
    {
      id: string,                           // e.g. "chase_5_24", "amex_once_per_lifetime"
      name: string,
      description: string,                  // 1-3 sentences in plain English
      applies_to: string | string[],        // "all_personal_and_business_cards" | array of card_ids | family name
      official: boolean,                    // true if in the cardholder agreement; false if data-points-derived
      notes: string | null
    }
  ]
}
```

## Schema — perks_dedup.json entries

Array of perks this card contributes that overlap with other cards. The engine uses this to avoid double-counting. Common dedupable perks: DashPass, Walmart+, primary CDW, Global Entry credit, Priority Pass, cell phone protection, trip delay insurance.

```ts
[
  {
    perk: string,                           // canonical key, e.g. "doordash_dashpass", "primary_cdw_rental", "global_entry_credit", "priority_pass_lounge"
    card_ids: string[],                     // start with [this_card_id]; the build script unions across files
    value_if_unique_usd: number | string | null,  // value when only one card has it
    value_if_duplicate_usd: number | string | null,  // value when multiple cards have it (often 0)
    notes: string | null
  }
]
```

If the card has no dedupable perks, write `[]` (empty array). Don't omit the section.

## Schema — destination_perks.json entries

Object keyed by destination slug. Used by the trip planner to show "transfer your points here for X."

```ts
{
  "{destination_key}": {                    // e.g. "anywhere_with_hyatt", "phoenix_scottsdale", "tokyo", "international_no_fx_fee"
    "hotel_chains_strong": ["Hyatt", "..."], // optional
    "airline_routes_strong": ["..."],        // optional
    "relevant_cards": ["chase_sapphire_preferred (UR transfer to Hyatt)"],
    "notes": "1-2 sentences explaining the angle"
  }
}
```

If the card doesn't unlock any destination-specific value, write `{}` (empty object).

## Research notes

Free-form bullet list. Include:

- Current SUB level vs historical baseline (e.g. "75k now, 60k baseline")
- Recent product changes (refresh dates, devaluations)
- Realistic-value caveats ("UR at 2cpp assumes Hyatt transfers; drops to 1.25cpp without")
- Once-per-product clarifications, eligibility windows
- Source quality concerns ("Doctor of Credit reports inconsistent enforcement")

## Quality bar

- **Cite primary sources first.** Issuer's own card page beats blog posts. Use The Points Guy, NerdWallet, Doctor of Credit for cross-checks.
- **Date-stamp everything.** `data_freshness: YYYY-MM-DD` at the top of the file and on the cards.json entry.
- **Use `null`, not made-up values.** If you can't confirm the foreign tx fee, write `null` and flag it in research notes.
- **Realistic over face value.** If a card advertises "$1,500 in credits" but most are coupon-book stacks, mark them as such with `ease_of_use: "coupon_book"` and a low realistic value.
- **No card-art guesses.** The schema doesn't include artwork; that's handled separately.
- **Sources array: 2-5 URLs.** Issuer page mandatory. Two cross-references from independent reviewers strongly preferred.

## Example template — read this end to end before producing your output

For a complete worked example, read the existing file `cards/chase_sapphire_preferred.md`. It's the canonical reference for both content shape and quality bar. Match its level of specificity: concrete numbers, specific category names, dated SUB info, conservative `ease_of_use` grades, well-sourced.

## What to output

A single markdown file, ready to drop into `cards/`. No commentary, no preamble, no closing summary. Just the file content starting with `# {Card name}`.

If the card is already in `cards/AllCards.md`, stop and respond with: "{card_id} is already in the database. To update, edit cards/{card_id}.md and rerun `npm run cards:build`."

If you can't confidently fill in a required field after a search, do not invent — use `null` and flag it in the research notes.

---

## RESEARCH THIS CARD

{Replace this line with the card name, e.g. "Citi Strata Premier" or "Chase United Quest" or "Apple Card"}
