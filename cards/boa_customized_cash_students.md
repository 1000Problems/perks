# Bank of America Customized Cash Rewards for Students

`card_id`: boa_customized_cash_students
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "boa_customized_cash_students",
  "name": "Bank of America Customized Cash Rewards for Students",
  "issuer": "Bank of America",
  "network": "Visa",
  "card_type": "personal",
  "category": ["student", "tiered_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "limited_credit_student",
  "currency_earned": "boa_points",

  "earning": [
    {"category": "user_choice_3pct_category", "rate_pts_per_dollar": 3, "cap_combined_per_quarter_usd": 2500},
    {"category": "grocery_wholesale", "rate_pts_per_dollar": 2, "cap_combined_per_quarter_usd": 2500},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 20000, "spend_required_usd": 1000, "spend_window_months": 3, "estimated_value_usd": 200},
  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["BoA 2/3/4", "Must be student"],

  "best_for": ["college_student_with_specific_category_focus"],
  "synergies_with": [],
  "competing_with_in_wallet": ["boa_travel_rewards_students"],

  "breakeven_logic_notes": "No AF. Same earning structure as adult Customized Cash.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/student-cash-back-credit-card/"]
}
```

See `boa_customized_cash.md`.
