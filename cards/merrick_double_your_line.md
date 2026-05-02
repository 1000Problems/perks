# Merrick Bank Double Your Line Mastercard

`card_id`: merrick_double_your_line
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "merrick_double_your_line",
  "name": "Merrick Bank Double Your Line Mastercard",
  "issuer": "Merrick Bank",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["subprime_unsecured", "credit_building"],
  "annual_fee_usd": 75,
  "foreign_tx_fee_pct": 2,
  "credit_score_required": "fair_to_poor",
  "currency_earned": null,
  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],
  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},
  "annual_credits": [],
  "ongoing_perks": [{"name": "Auto credit-line double after 7 months on-time payments", "value_estimate_usd": null, "category": "credit_building"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],
  "best_for": ["users_in_credit_rebuilding_phase"],
  "synergies_with": [],
  "competing_with_in_wallet": ["merrick_secured_visa"],
  "breakeven_logic_notes": "AF $75. Less predatory than Aspire/Total but still engine should prefer no-AF secured cards (Discover It Secured, Cap One Quicksilver Secured) for credit building.",
  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.merrickbank.com/personal/credit-cards"]
}
```

See `aspire_credit_card.md` for predatory class context (Merrick is the lowest end of this class but still warrants caution).
