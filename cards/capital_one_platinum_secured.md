# Capital One Platinum Secured

`card_id`: capital_one_platinum_secured
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_platinum_secured",
  "name": "Capital One Platinum Secured Credit Card",
  "issuer": "Capital One",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["secured", "credit_building"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "no_credit_or_rebuilding",
  "secured_deposit_required": "$49_$99_or_$200_based_on_creditworthiness",
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
    {"name": "Auto credit-line review at 6 months", "value_estimate_usd": null, "category": "credit_building"},
    {"name": "Refundable deposit upon graduation to unsecured", "value_estimate_usd": null, "category": "credit_building"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month"],

  "best_for": ["secured_with_lowest_possible_deposit_$49"],
  "synergies_with": [],
  "competing_with_in_wallet": ["capital_one_quicksilver_secured", "discover_it_secured"],

  "breakeven_logic_notes": "No AF, no rewards. Lowest possible deposit ($49 for some applicants) makes this most accessible secured card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/platinum-secured/"]
}
```

## programs.json entry
None.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- $49 minimum deposit option (vs $200 standard) makes this most accessible. Engine: surface for users with limited cash.
