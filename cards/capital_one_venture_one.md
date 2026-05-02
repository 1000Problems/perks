# Capital One VentureOne Rewards

`card_id`: capital_one_venture_one
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_venture_one",
  "name": "Capital One VentureOne Rewards Credit Card",
  "issuer": "Capital One",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["no_af_travel"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "capital_one_miles",

  "earning": [
    {"category": "hotels_and_rentals_capital_one_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1.25, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 500,
    "spend_window_months": 3,
    "estimated_value_usd": 250,
    "notes": "Low spend hurdle"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Travel accident insurance", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "capital_one_miles",

  "issuer_rules": ["Capital One 1-per-month", "Capital One 2-personal-card-max"],

  "best_for": ["no_AF_transferable_points", "starter_capital_one_card"],
  "synergies_with": ["capital_one_venture", "capital_one_venture_x"],
  "competing_with_in_wallet": ["chase_freedom_unlimited", "discover_it_miles"],

  "breakeven_logic_notes": "No AF; 1.25x flat at 0% FX makes it useful only as a transferable-points feeder for Venture X holders, otherwise beaten by 2% cards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/ventureone/"]
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

- Pure feeder card; only valuable when paired with Venture or Venture X for transfer access.
- 0% FX makes it a backup international card despite low earn rate.
