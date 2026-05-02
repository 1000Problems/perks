# Best Western Rewards Mastercard (basic)

`card_id`: best_western_rewards_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "best_western_rewards_mastercard",
  "name": "Best Western Rewards Mastercard",
  "issuer": "First Bankcard",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["hotel_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "best_western_rewards",

  "earning": [
    {"category": "bw_purchases", "rate_pts_per_dollar": 8, "cap_usd_per_year": null},
    {"category": "gas_grocery_dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 30000, "spend_required_usd": 1000, "spend_window_months": 90, "estimated_value_usd": 180},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Best Western Gold status", "value_estimate_usd": null, "category": "hotel_status"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["light_BW_user_no_AF"],
  "synergies_with": ["best_western_premium"],
  "competing_with_in_wallet": ["best_western_premium"],

  "breakeven_logic_notes": "No AF. Premium card supersedes for active BW users.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bestwestern.com/en_US/rewards/credit-card.html"]
}
```

See `best_western_premium.md`.
