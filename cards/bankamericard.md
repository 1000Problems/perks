# BankAmericard

`card_id`: bankamericard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "bankamericard",
  "name": "BankAmericard Credit Card",
  "issuer": "Bank of America",
  "network": "Visa",
  "card_type": "personal",
  "category": ["balance_transfer", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": null,

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "0% intro APR 18 months on purchases and BT", "value_estimate_usd": null, "category": "financing"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["BoA 2/3/4"],

  "best_for": ["balance_transfer_focused"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_diamond_preferred", "wells_fargo_reflect"],

  "breakeven_logic_notes": "No AF, no rewards. Pure BT card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/bankamericard-credit-card/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique. See `boa_premium_rewards.md` for issuer rules.

## RESEARCH_NOTES.md entries
- 3% FX. Domestic only.
