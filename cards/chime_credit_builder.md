# Chime Credit Builder Visa

`card_id`: chime_credit_builder
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "chime_credit_builder",
  "name": "Chime Credit Builder Visa Credit Card",
  "issuer": "Chime / Stride Bank",
  "network": "Visa",
  "card_type": "personal",
  "category": ["credit_building", "secured", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "no_credit_required",
  "secured_deposit_required": "Self-funded via Chime Spending Account; no separate deposit",
  "currency_earned": null,

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "No interest, no late fees, no minimum security deposit", "value_estimate_usd": null, "category": "fee_free"},
    {"name": "Reports to all 3 bureaus", "value_estimate_usd": null, "category": "credit_building"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chime Checking Account required"],

  "best_for": ["chime_user_credit_building_no_deposit"],
  "synergies_with": [],
  "competing_with_in_wallet": ["self_visa", "cash_app_card"],

  "breakeven_logic_notes": "No AF, no fees. Self-funded model unique among credit-builders.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.chime.com/credit-card/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Self-funding model: spending limit set by Chime account balance moved to Credit Builder Account.
