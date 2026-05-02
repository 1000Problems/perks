# Mission Lane Visa Credit Card

`card_id`: mission_lane_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "mission_lane_visa",
  "name": "Mission Lane Visa Credit Card",
  "issuer": "Mission Lane / Transportation Alliance Bank",
  "network": "Visa",
  "card_type": "personal",
  "category": ["credit_building", "no_af_cashback", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "fair_credit",
  "currency_earned": null,

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Auto credit-line review", "value_estimate_usd": null, "category": "credit_building"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["fair_credit_users_credit_building"],
  "synergies_with": ["mission_lane_cash_back"],
  "competing_with_in_wallet": ["mission_lane_cash_back"],

  "breakeven_logic_notes": "No AF, no rewards. Cash Back variant supersedes for any user who can qualify.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.missionlane.com/cards"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Entry-tier; users should pursue the Cash Back variant if eligible.
