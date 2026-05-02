# Avant Credit Card

`card_id`: avant_credit_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "avant_credit_card",
  "name": "Avant Credit Card",
  "issuer": "WebBank",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["credit_building", "no_af_cashback"],
  "annual_fee_usd": 39,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "fair_credit",
  "currency_earned": null,

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Auto credit-line review", "value_estimate_usd": null, "category": "credit_building"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["fair_credit_users_no_security_deposit"],
  "synergies_with": [],
  "competing_with_in_wallet": ["capital_one_quicksilver_one"],

  "breakeven_logic_notes": "AF $39. No rewards. Cap One QuicksilverOne supersedes for any user who can qualify.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.avant.com/credit-card"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Niche fair-credit unsecured option.
