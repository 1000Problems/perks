# Mission Lane Cash Back Visa

`card_id`: mission_lane_cash_back
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "mission_lane_cash_back",
  "name": "Mission Lane Cash Back Visa",
  "issuer": "Mission Lane / Transportation Alliance Bank",
  "network": "Visa",
  "card_type": "personal",
  "category": ["credit_building", "no_af_cashback", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "fair_credit",
  "currency_earned": "mission_lane_cashback",

  "earning": [
    {"category": "gas_grocery_dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["fair_credit_users_seeking_2pct_categories"],
  "synergies_with": ["mission_lane_visa"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Decent fair-credit rewards card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.missionlane.com/cards"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Aimed at fair-credit segment.
