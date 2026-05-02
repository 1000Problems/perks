# Bloomingdale's American Express Card

`card_id`: bloomingdales_amex
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "bloomingdales_amex",
  "name": "Bloomingdale's American Express Card",
  "issuer": "Citibank (Bloomingdale's co-brand)",
  "network": "Amex",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 2.7,
  "credit_score_required": "good",
  "currency_earned": "bloomingdales_loyallist",

  "earning": [
    {"category": "bloomingdales", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 25},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Loyallist tier benefits", "value_estimate_usd": null, "category": "lifestyle"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Citi 8/65"],

  "best_for": ["bloomingdales_shoppers"],
  "synergies_with": [],
  "competing_with_in_wallet": ["bloomingdales_credit"],

  "breakeven_logic_notes": "No AF. Open-loop Amex variant.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bloomingdales.com/c/credit-card/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Loyallist tier system tied to spend.
