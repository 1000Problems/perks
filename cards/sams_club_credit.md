# Sam's Club Credit Card (closed-loop)

`card_id`: sams_club_credit
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "sams_club_credit",
  "name": "Sam's Club Credit Card",
  "issuer": "Synchrony",
  "network": "Closed-loop (Sam's Club only)",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": null,
  "credit_score_required": "fair",
  "currency_earned": "sams_club_cashback",
  "membership_required": "Sam's Club membership",

  "earning": [{"category": "sams_club_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "5% Plus member only"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Special financing on Sam's Club $499+ purchases", "value_estimate_usd": null, "category": "financing"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Sam's Club membership required"],

  "best_for": ["sams_club_member_with_in_store_purchases_only"],
  "synergies_with": [],
  "competing_with_in_wallet": ["sams_club_mastercard"],

  "breakeven_logic_notes": "No AF, closed-loop. Mastercard variant supersedes.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.samsclub.com/credit"]
}
```

See `sams_club_mastercard.md`.
