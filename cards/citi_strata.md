# Citi Strata

`card_id`: citi_strata
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_strata",
  "name": "Citi Strata Card",
  "issuer": "Citi",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["no_af_cashback", "tiered_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "citi_thankyou",

  "earning": [
    {"category": "hotels_cars_attractions_citi_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "restaurants", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "supermarkets", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "gas_stations", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 1500,
    "spend_window_months": 3,
    "estimated_value_usd": 200
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "citi_thankyou",
  "transfer_partners_inherited_from_notes": "Only with paired Strata Premier",

  "issuer_rules": ["Citi 8/65, 2/65, 1/8", "TY family 24-month rule"],

  "best_for": ["no_AF_TY_feeder_at_2x_grocery"],
  "synergies_with": ["citi_strata_premier", "citi_double_cash", "citi_custom_cash"],
  "competing_with_in_wallet": ["chase_freedom_unlimited", "wells_fargo_autograph"],

  "breakeven_logic_notes": "No AF. Useful only as a TY feeder for Strata Premier holders, otherwise beaten by Citi Custom Cash on category and WF Active Cash on flat rate.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.citi.com/credit-cards/citi-strata-card"]
}
```

## programs.json entry
See `citi_strata_premier.md`.

## issuer_rules.json entry
See `citi_strata_premier.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **3% FX**: Domestic only.
- **Newer launch (2024)**: Replaces several legacy ThankYou Preferred-class cards. Lower-tier sibling of Strata Premier.
