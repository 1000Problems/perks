# BankAmericard Secured

`card_id`: bankamericard_secured
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "bankamericard_secured",
  "name": "BankAmericard Secured Credit Card",
  "issuer": "Bank of America",
  "network": "Visa",
  "card_type": "personal",
  "category": ["secured", "credit_building"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "no_credit_or_rebuilding",
  "secured_deposit_required": "$200_minimum",
  "currency_earned": null,

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],

  "ongoing_perks": [{"name": "Path to graduate to unsecured", "value_estimate_usd": null, "category": "credit_building"}],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["BoA 2/3/4"],

  "best_for": ["BoA_customer_credit_building"],
  "synergies_with": [],
  "competing_with_in_wallet": ["discover_it_secured", "capital_one_quicksilver_secured"],

  "breakeven_logic_notes": "No AF, no rewards. Discover/Cap One secured stronger picks (rewards-earning).",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/secured-credit-card/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
See `boa_premium_rewards.md` for issuer rules. Otherwise none unique.

## RESEARCH_NOTES.md entries
- 3% FX. Domestic only.
