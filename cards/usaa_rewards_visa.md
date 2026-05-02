# USAA Rewards Visa Signature

`card_id`: usaa_rewards_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "usaa_rewards_visa",
  "name": "USAA Rewards Visa Signature Card",
  "issuer": "USAA",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 1,
  "credit_score_required": "good",
  "currency_earned": "usaa_points",
  "membership_required": "USAA membership",

  "earning": [
    {"category": "dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "gas", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},
  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["USAA membership required"],

  "best_for": ["military_member_no_AF_dining_gas"],
  "synergies_with": ["usaa_eagle_navigator"],
  "competing_with_in_wallet": ["usaa_cashback_rewards_plus_amex"],

  "breakeven_logic_notes": "No AF. Cashback Rewards Plus Amex earns more on gas/base spend.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usaa.com/inet/wc/rewards-visa"]
}
```

See `usaa_eagle_navigator.md`.
