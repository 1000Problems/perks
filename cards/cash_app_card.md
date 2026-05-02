# Cash App Card (Credit Builder)

`card_id`: cash_app_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "cash_app_card",
  "name": "Cash App Card (Credit Builder)",
  "issuer": "Cash App / Sutton Bank",
  "network": "Visa",
  "card_type": "personal",
  "category": ["credit_building", "fintech", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "no_credit_required",
  "currency_earned": null,

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No traditional rewards. Cash boosts (offer-based) provide variable discounts."}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [
    {"name": "Boosts: rotating merchant-specific discounts", "value_estimate_usd": null, "category": "lifestyle"},
    {"name": "Reports to bureaus (Credit Builder feature)", "value_estimate_usd": null, "category": "credit_building"}
  ],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["cash_app_user_credit_building"],
  "synergies_with": [],
  "competing_with_in_wallet": ["chime_credit_builder"],

  "breakeven_logic_notes": "No AF, no rewards. Engine: surface for credit-building when user mentions Cash App.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cash.app/help/us/en-us/3104-cash-app-card"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Hybrid debit/credit-builder. Reports to bureaus.
