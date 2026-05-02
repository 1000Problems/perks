# Tomo Credit Card

`card_id`: tomo_credit_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "tomo_credit_card",
  "name": "Tomo Credit Card",
  "issuer": "Tomo / Community Federal Savings Bank",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["credit_building", "fintech", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "no_credit_required",
  "currency_earned": "tomo_cashback",

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null, "notes": "1% Tomo Points"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [
    {"name": "No interest, no fees", "value_estimate_usd": null, "category": "fee_free"},
    {"name": "Auto-pay required", "value_estimate_usd": null, "category": "credit_building"}
  ],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["thin_file_users_no_credit_check_required"],
  "synergies_with": [],
  "competing_with_in_wallet": ["petal_2", "chime_credit_builder"],

  "breakeven_logic_notes": "No AF, no fees. Auto-pay required prevents interest accrual.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.tomocredit.com/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Cash-flow underwriting; alternative to Petal for thin-file users.
