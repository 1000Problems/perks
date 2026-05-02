# Citi Secured Mastercard

`card_id`: citi_secured_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_secured_mastercard",
  "name": "Citi Secured Mastercard",
  "issuer": "Citi",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["secured", "credit_building"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "no_credit_or_rebuilding",
  "secured_deposit_required": "$200_minimum",
  "currency_earned": null,

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Reports to all 3 bureaus", "value_estimate_usd": null, "category": "credit_building"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Citi 8/65"],

  "best_for": ["building_credit_in_citi_ecosystem"],
  "synergies_with": [],
  "competing_with_in_wallet": ["discover_it_secured", "capital_one_quicksilver_secured"],

  "breakeven_logic_notes": "No AF, no rewards. Engine: surface only for credit-building. Discover It Secured / Cap One Quicksilver Secured are stronger picks (rewards-earning).",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.citi.com/credit-cards/citi-secured-mastercard-credit-card"]
}
```

## programs.json entry
None.

## issuer_rules.json entry
See `citi_strata_premier.md`.

## perks_dedup.json entries
None.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- No rewards earning makes this less attractive vs Discover/Cap One secured cards.
