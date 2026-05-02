# Citi Simplicity

`card_id`: citi_simplicity
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_simplicity",
  "name": "Citi Simplicity Card",
  "issuer": "Citi",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["balance_transfer", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
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
    {"name": "No late fees, no penalty APR, no AF", "value_estimate_usd": null, "category": "fee_free"},
    {"name": "0% intro APR 12 months purchases / 21 months BT", "value_estimate_usd": null, "category": "financing"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Citi 8/65, 2/65, 1/8"],

  "best_for": ["users_concerned_about_late_fees", "long_BT_term_seekers"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_diamond_preferred"],

  "breakeven_logic_notes": "No AF, no rewards. Differentiator vs Diamond Preferred: no late fees ever.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.citi.com/credit-cards/citi-simplicity-credit-card"]
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
- "No late fees ever" is unique among major issuers.
