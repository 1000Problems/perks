# Navy Federal GO Rewards

`card_id`: nfcu_go_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "nfcu_go_rewards",
  "name": "Navy Federal GO Rewards Credit Card",
  "issuer": "Navy Federal Credit Union",
  "network": "Mastercard / Visa",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "nfcu_points",
  "membership_required": "NFCU membership",

  "earning": [
    {"category": "restaurants", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "gas", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["NFCU membership required"],

  "best_for": ["nfcu_member_dining_focus"],
  "synergies_with": ["nfcu_flagship_rewards"],
  "competing_with_in_wallet": ["nfcu_more_rewards_amex"],

  "breakeven_logic_notes": "No AF. More Rewards Amex's broader 3x supermarket+gas+dining+transit beats this for most users.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.navyfederal.org/products/credit-cards/personal-cards/go-rewards.html"]
}
```

See `nfcu_flagship_rewards.md`.
