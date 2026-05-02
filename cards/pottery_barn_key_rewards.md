# Pottery Barn Key Rewards Visa

`card_id`: pottery_barn_key_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "pottery_barn_key_rewards",
  "name": "Pottery Barn Key Rewards Visa",
  "issuer": "Capital One",
  "network": "Visa",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "key_rewards",

  "earning": [
    {"category": "key_rewards_brands", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 50},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Capital One 1-per-month"],

  "best_for": ["pottery_barn_loyalists"],
  "synergies_with": ["williams_sonoma_key_rewards", "west_elm_key_rewards"],
  "competing_with_in_wallet": ["williams_sonoma_key_rewards"],

  "breakeven_logic_notes": "Same as WS Key Rewards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.potterybarn.com/customer-service/credit-card.html"]
}
```

See `williams_sonoma_key_rewards.md` for shared sections.
