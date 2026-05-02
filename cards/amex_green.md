# American Express Green Card

`card_id`: amex_green
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_green",
  "name": "American Express Green Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 150,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amex_mr",

  "earning": [
    {"category": "travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Broad travel: airlines, hotels, cruises, car rentals, lodging, vacation rentals, campgrounds, transit, ride-share, parking, tolls"},
    {"category": "transit", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "restaurants_worldwide", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 40000,
    "spend_required_usd": 3000,
    "spend_window_months": 6,
    "estimated_value_usd": 800,
    "notes": "Has hit 60k in elevated periods. Lifetime once-per-product."
  },

  "annual_credits": [
    {"name": "CLEAR+ membership credit", "value_usd": 199, "type": "specific", "expiration": "annual", "ease_of_use": "easy"},
    {"name": "LoungeBuddy credit", "value_usd": 100, "type": "specific", "expiration": "annual", "ease_of_use": "hard", "notes": "Pay-per-visit lounge platform; many users never use"}
  ],

  "ongoing_perks": [
    {"name": "Trip delay insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Baggage insurance", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "amex_mr",

  "issuer_rules": ["Amex once-per-lifetime SUB", "Amex 2-in-90-days personal velocity"],

  "best_for": ["transit_heavy_users", "broad_travel_3x_definition", "MR_with_no_FX_at_$150"],
  "synergies_with": ["amex_gold", "amex_platinum"],
  "competing_with_in_wallet": ["chase_sapphire_preferred", "capital_one_venture"],

  "breakeven_logic_notes": "AF $150 less CLEAR+ $199 (easy) = negative effective AF if user uses CLEAR. If user already has CLEAR via Plat or other card, Green offers little vs CSP at lower AF.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.americanexpress.com/us/credit-cards/card/green/",
    "https://thepointsguy.com/credit-cards/reviews/amex-green-card-review/"
  ]
}
```

## programs.json entry
See `amex_gold.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
```json
[
  {
    "perk": "clear_plus",
    "card_ids": ["amex_green"],
    "value_if_unique_usd": 199,
    "value_if_duplicate_usd": 0,
    "notes": "Same CLEAR membership; redundant if user holds Plat or Business Plat."
  }
]
```

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Charge card with NPSL**: No Pre-Set Limit but Pay Over Time on certain charges.
- **Broad travel category**: Green's "travel" definition (transit, ride-share, tolls, parking) is wider than CSP/CSR which restrict transit/ride-share to "other travel" or specific Lyft tiles. Green is uniquely strong for urban commuters.
- **Out of fashion**: Green is the least-discussed MR card. Justified primarily for CLEAR + transit + travel definition combination.
