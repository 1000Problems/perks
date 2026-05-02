# PenFed Promise Visa

`card_id`: penfed_promise_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "penfed_promise_visa",
  "name": "PenFed Promise Visa Card",
  "issuer": "PenFed Credit Union",
  "network": "Visa",
  "card_type": "personal",
  "category": ["balance_transfer", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": null,
  "membership_required": "PenFed membership",

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],
  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},
  "annual_credits": [],
  "ongoing_perks": [{"name": "No fees of any kind (no AF, no late, no cash advance, no FX, no over-limit)", "value_estimate_usd": null, "category": "fee_free"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["PenFed membership required"],

  "best_for": ["fee_averse_balance_transfer_users"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_simplicity"],

  "breakeven_logic_notes": "No AF, no fees ever. Differentiator is total fee absence — even more comprehensive than Citi Simplicity.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.penfed.org/credit-cards/promise-visa-card"]
}
```

See `penfed_power_cash_rewards.md` for issuer rules.
