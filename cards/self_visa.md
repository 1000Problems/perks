# Self Visa Credit Card

`card_id`: self_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "self_visa",
  "name": "Self Visa Credit Card",
  "issuer": "Self Financial / Lead Bank",
  "network": "Visa",
  "card_type": "personal",
  "category": ["credit_building", "secured", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "no_credit_or_severe_rebuilding",
  "secured_deposit_required": "Funded via Self Credit Builder Account",
  "currency_earned": null,

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Reports to all 3 bureaus + Self Credit Builder Loan adds installment trade line", "value_estimate_usd": null, "category": "credit_building"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Active Self Credit Builder Account required"],

  "best_for": ["thin_file_credit_building_with_installment_trade_line"],
  "synergies_with": [],
  "competing_with_in_wallet": ["chime_credit_builder", "cash_app_card"],

  "breakeven_logic_notes": "No AF. Self stacks: their installment loan + secured Visa creates two trade lines for thin-file users.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.self.inc/products/credit-card"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Pairs with Self Credit Builder Loan; double trade-line structure helps thin-file users.
