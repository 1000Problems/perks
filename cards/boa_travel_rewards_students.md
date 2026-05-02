# Bank of America Travel Rewards for Students

`card_id`: boa_travel_rewards_students
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "boa_travel_rewards_students",
  "name": "Bank of America Travel Rewards for Students",
  "issuer": "Bank of America",
  "network": "Visa",
  "card_type": "personal",
  "category": ["student", "no_af_travel"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "limited_credit_student",
  "currency_earned": "boa_points",

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}],

  "signup_bonus": {"amount_pts": 25000, "spend_required_usd": 1000, "spend_window_months": 3, "estimated_value_usd": 250},
  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["BoA 2/3/4", "Must be student"],

  "best_for": ["college_student_no_FX_travel_card"],
  "synergies_with": [],
  "competing_with_in_wallet": ["boa_customized_cash_students"],

  "breakeven_logic_notes": "No AF, 0% FX, 1.5% flat. Decent study-abroad starter card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/student-travel-credit-card/"]
}
```

See `boa_premium_rewards.md` for issuer rules.
