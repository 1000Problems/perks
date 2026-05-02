# Bread Rewards Amex

`card_id`: bread_rewards_amex
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "bread_rewards_amex",
  "name": "Bread Rewards American Express Card",
  "issuer": "Bread Financial",
  "network": "Amex",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "bread_cashback",

  "earning": [
    {"category": "dining_groceries", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["dining_grocery_focused_no_AF"],
  "synergies_with": ["bread_cashback_amex"],
  "competing_with_in_wallet": ["amex_blue_cash_everyday"],

  "breakeven_logic_notes": "No AF. 3% dining/grocery competitive at no-AF tier.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.breadfinancial.com/en/products-services/credit-cards/bread-rewards.html"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- New Amex-network entrant from Bread Financial.
