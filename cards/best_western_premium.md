# Best Western Rewards Premium Mastercard

`card_id`: best_western_premium
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "best_western_premium",
  "name": "Best Western Rewards Premium Mastercard",
  "issuer": "First Bankcard",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["hotel_cobrand"],
  "annual_fee_usd": 89,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "best_western_rewards",

  "earning": [
    {"category": "best_western_purchases", "rate_pts_per_dollar": 13, "cap_usd_per_year": null},
    {"category": "gas_grocery_dining", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 80000, "spend_required_usd": 1000, "spend_window_months": 90, "estimated_value_usd": 480},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Best Western Diamond Elite status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "$50 Best Western credit annually", "value_usd": 50, "category": "hotel_perk"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [],

  "best_for": ["best_western_road_trip_user"],
  "synergies_with": [],
  "competing_with_in_wallet": ["best_western_rewards_mastercard"],

  "breakeven_logic_notes": "AF $89 less $50 BW credit = $39 net. Diamond status is the differentiator.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bestwestern.com/en_US/rewards/credit-card.html"]
}
```

## programs.json entry
Closed-loop BW Rewards.

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Niche road-trip hotel card.
