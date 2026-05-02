# Bank of America Unlimited Cash Rewards for Students

`card_id`: boa_unlimited_cash_students
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "boa_unlimited_cash_students",
  "name": "Bank of America Unlimited Cash Rewards for Students",
  "issuer": "Bank of America",
  "network": "Visa",
  "card_type": "personal",
  "category": ["student", "flat_rate_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "limited_credit_student",
  "currency_earned": "boa_points",

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}],

  "signup_bonus": {"amount_pts": 20000, "spend_required_usd": 1000, "spend_window_months": 3, "estimated_value_usd": 200},
  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["BoA 2/3/4", "Must be student"],

  "best_for": ["college_student_simple_flat_cashback"],
  "synergies_with": [],
  "competing_with_in_wallet": ["boa_customized_cash_students"],

  "breakeven_logic_notes": "No AF. 1.5% flat with 3% FX makes domestic-only.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/unlimited-cash-back-students-credit-card/"]
}
```

See `boa_premium_rewards.md`.
