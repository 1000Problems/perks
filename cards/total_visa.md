# Total Visa Card

`card_id`: total_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "total_visa",
  "name": "Total Visa Card",
  "issuer": "The Bank of Missouri",
  "network": "Visa",
  "card_type": "personal",
  "category": ["subprime_unsecured", "credit_building"],
  "annual_fee_usd": 75,
  "monthly_maintenance_fee_usd_after_year_one": 6.25,
  "program_fee_usd": 95,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "fair_to_poor",
  "currency_earned": null,
  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],
  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},
  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],
  "best_for": ["users_with_no_other_options"],
  "synergies_with": [],
  "competing_with_in_wallet": ["aspire_credit_card"],
  "breakeven_logic_notes": "Predatory with $95 program fee + $75 AF + monthly maintenance. Engine: red flag. See aspire_credit_card.md.",
  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.totalcardvisa.com/"]
}
```

See `aspire_credit_card.md`.
