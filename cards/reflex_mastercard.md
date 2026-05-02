# Reflex Mastercard

`card_id`: reflex_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "reflex_mastercard",
  "name": "Reflex Mastercard",
  "issuer": "Continental Finance / Celtic Bank",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["subprime_unsecured", "credit_building"],
  "annual_fee_usd": 99,
  "monthly_maintenance_fee_usd_after_year_one": 10,
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
  "competing_with_in_wallet": ["aspire_credit_card", "surge_mastercard"],

  "breakeven_logic_notes": "AF + monthly maintenance. Predatory. See `aspire_credit_card.md` for class warnings.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.reflexcardinfo.com/"]
}
```

See `aspire_credit_card.md` for shared sections and predatory-class caution.
