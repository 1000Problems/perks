# Capital One Spark Miles

`card_id`: capital_one_spark_miles
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_spark_miles",
  "name": "Capital One Spark Miles for Business",
  "issuer": "Capital One",
  "network": "Visa",
  "card_type": "business",
  "category": ["business", "mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "capital_one_miles",

  "earning": [
    {"category": "hotels_rentals_capital_one_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 50000,
    "spend_required_usd": 4500,
    "spend_window_months": 3,
    "estimated_value_usd": 850
  },

  "annual_credits": [
    {"name": "Global Entry / TSA PreCheck", "signal_id": "global_entry_tsa", "value_usd": 120, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Free employee cards", "value_estimate_usd": null, "category": "business_admin"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "capital_one_miles",

  "issuer_rules": ["Capital One business app limits"],

  "best_for": ["business_2x_flat_with_transfer_partners"],
  "synergies_with": ["capital_one_venture_x_business", "capital_one_spark_cash_plus"],
  "competing_with_in_wallet": ["chase_ink_business_preferred", "amex_business_gold"],

  "breakeven_logic_notes": "AF $95 (Y1 waived). 2x flat with transfer partners makes this the business-side Venture-equivalent.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/small-business/credit-cards/spark-miles/"]
}
```

## programs.json entry
See `capital_one_venture_x.md`.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `capital_one_venture_x.md`.

## RESEARCH_NOTES.md entries
- Business sister to Cap One Venture; same earning structure with employee cards added.
