# Discover It Secured

`card_id`: discover_it_secured
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "discover_it_secured",
  "name": "Discover It Secured Credit Card",
  "issuer": "Discover",
  "network": "Discover",
  "card_type": "personal",
  "category": ["secured", "credit_building"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "no_credit_or_rebuilding",
  "secured_deposit_required": "$200_minimum",
  "currency_earned": "discover_cashback",

  "earning": [
    {"category": "gas_stations_and_restaurants", "rate_pts_per_dollar": 2, "cap_usd_per_year": 1000, "notes": "$1k/quarter cap"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "earning_modifier_first_year_match": "Cashback Match in year 1 — doubles all rewards",

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "Cashback Match acts as effective SUB"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Free FICO score", "value_estimate_usd": null, "category": "credit_management"},
    {"name": "Path to graduate to unsecured (deposit returned after credit review)", "value_estimate_usd": null, "category": "credit_building"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Discover lifetime once-per-product Match", "Discover 14-day rule"],

  "best_for": ["building_credit_with_no_credit_history", "rebuilding_after_negative_credit_event"],
  "synergies_with": [],
  "competing_with_in_wallet": ["capital_one_quicksilver_secured", "capital_one_platinum_secured"],

  "breakeven_logic_notes": "No AF; secured deposit refundable. Path to unsecured graduation = top secured card available.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.discover.com/credit-cards/secured/"]
}
```

## programs.json entry
See `discover_it_cash_back.md`.

## issuer_rules.json entry
See `discover_it_cash_back.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Engine should surface for users with limited/no/negative credit history. Not a rewards-optimization recommendation.
