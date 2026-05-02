# Athleta Rewards

`card_id`: athleta_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "athleta_rewards",
  "name": "Athleta Rewards Credit Card",
  "issuer": "Barclays",
  "network": "Closed-loop / Visa",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "fair_to_good",
  "currency_earned": "gap_inc_rewards",

  "earning": [
    {"category": "gap_family_brands", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 30},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["athleta_loyalists"],
  "synergies_with": ["old_navy_navyist", "gap_good_rewards", "banana_republic_rewards"],
  "competing_with_in_wallet": ["old_navy_navyist"],

  "breakeven_logic_notes": "Same as other Gap Inc cards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://athleta.gap.com/customerService/info.do"]
}
```

See `old_navy_navyist.md` for shared sections.
