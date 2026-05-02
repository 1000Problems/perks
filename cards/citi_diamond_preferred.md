# Citi Diamond Preferred

`card_id`: citi_diamond_preferred
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_diamond_preferred",
  "name": "Citi Diamond Preferred Card",
  "issuer": "Citi",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["balance_transfer", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": null,

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards. Built around 0% intro APR balance transfer."}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "0% intro APR 21 months on balance transfers", "value_estimate_usd": null, "category": "financing"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Citi 8/65, 2/65, 1/8"],

  "best_for": ["balance_transfer_focused_user_carrying_existing_debt"],
  "synergies_with": [],
  "competing_with_in_wallet": ["wells_fargo_reflect", "chase_slate_edge"],

  "breakeven_logic_notes": "No AF, no rewards. Engine: surface only for users with debt to transfer.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.citi.com/credit-cards/citi-diamond-preferred-credit-card"]
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
- 21 months 0% APR on BT is one of the longest in market.
- 3% BT fee.
