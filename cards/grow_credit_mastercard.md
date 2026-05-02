# Grow Credit Mastercard

`card_id`: grow_credit_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "grow_credit_mastercard",
  "name": "Grow Credit Mastercard",
  "issuer": "Grow Credit / Sutton Bank",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["credit_building", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": null,
  "credit_score_required": "no_credit_required",
  "currency_earned": null,
  "earning": [{"category": "subscription_purchases_only", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "Card only authorizes for streaming/subscription billers"}],
  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},
  "annual_credits": [],
  "ongoing_perks": [{"name": "Reports to all 3 bureaus", "value_estimate_usd": null, "category": "credit_building"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],
  "best_for": ["thin_file_users_paying_subscriptions"],
  "synergies_with": [],
  "competing_with_in_wallet": ["kikoff_credit_account"],
  "breakeven_logic_notes": "No AF. Limited to subscription spend.",
  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.growcredit.com/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Subscription-only spend authorization is unique restriction.
