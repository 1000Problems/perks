# Capital One Venture X Business

`card_id`: capital_one_venture_x_business
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_venture_x_business",
  "name": "Capital One Venture X Business",
  "issuer": "Capital One",
  "network": "Visa Infinite Business",
  "card_type": "business",
  "category": ["business", "premium_travel"],
  "annual_fee_usd": 395,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "capital_one_miles",

  "earning": [
    {"category": "hotels_rentals_capital_one_travel", "rate_pts_per_dollar": 10, "cap_usd_per_year": null},
    {"category": "flights_vacation_rentals_capital_one_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 150000,
    "spend_required_usd": 30000,
    "spend_window_months": 3,
    "estimated_value_usd": 3000,
    "notes": "High spend hurdle but elevated ceiling"
  },

  "annual_credits": [
    {"name": "Capital One Travel credit", "value_usd": 300, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy"},
    {"name": "10,000 anniversary miles", "value_usd": 200, "type": "rewards", "expiration": "annual", "ease_of_use": "easy"},
    {"name": "Global Entry / TSA PreCheck", "value_usd": 120, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Pay-in-full charge card structure", "value_estimate_usd": null, "category": "financing"},
    {"name": "Priority Pass Select (primary only post-Feb-2026)", "value_estimate_usd": 469, "category": "lounge_access"},
    {"name": "Capital One Lounge access (primary only post-Feb-2026)", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Plaza Premium Lounge access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Free employee cards", "value_estimate_usd": null, "category": "business_admin"},
    {"name": "Cell phone protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Premier Collection hotel benefits", "value_estimate_usd": null, "category": "hotel_perk"}
  ],

  "transfer_partners_inherited_from": "capital_one_miles",

  "issuer_rules": ["Capital One business 1-per-month informal limit"],

  "best_for": ["business_premium_traveler_with_high_initial_spend"],
  "synergies_with": ["capital_one_venture_x", "capital_one_spark_cash_plus", "capital_one_spark_miles"],
  "competing_with_in_wallet": ["amex_business_platinum", "chase_ink_business_premier"],

  "breakeven_logic_notes": "AF $395 less $300 CO Travel credit less 10k anniv miles ($200 at 2cpp) = -$105 net AF. Same value structure as personal Venture X with business benefits.",

  "recently_changed": true,
  "recently_changed_date": "2026-02-01",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/small-business/credit-cards/venture-x-business/"]
}
```

## programs.json entry
See `capital_one_venture_x.md` for capital_one_miles.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries

```json
[
  {
    "perk": "priority_pass_primary",
    "card_ids": ["capital_one_venture_x_business"],
    "value_if_unique_usd": 469,
    "value_if_duplicate_usd": 0,
    "notes": "Same Feb 2026 policy changes apply: primary cardholder only post-Feb-2026"
  }
]
```

## destination_perks.json entries
See `capital_one_venture_x.md`.

## RESEARCH_NOTES.md entries

- **Pay-in-full charge card**: Like Spark Cash Plus, no preset spend limit; balance must be paid in full each month.
- **Same lounge policy changes** as personal Venture X effective 2026-02-01.
- Strong companion to personal Venture X for businesses with separate liability needs.
