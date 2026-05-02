# Capital One QuicksilverOne

`card_id`: capital_one_quicksilver_one
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_quicksilver_one",
  "name": "Capital One QuicksilverOne Cash Rewards",
  "issuer": "Capital One",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "credit_building"],
  "annual_fee_usd": 39,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "fair_credit",
  "currency_earned": "capital_one_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto credit-line review at 6 months", "value_estimate_usd": null, "category": "credit_building"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month", "Capital One 2-personal-card-max"],

  "best_for": ["fair_credit_users_seeking_rewards"],
  "synergies_with": [],
  "competing_with_in_wallet": ["capital_one_quicksilver"],

  "breakeven_logic_notes": "AF $39. 1.5% earns $58.50 on $3,900 spend to break even. Engine: surface for fair-credit users; preferred path to graduate to Quicksilver (no AF).",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/quicksilverone/"]
}
```

## programs.json entry
See `capital_one_savor.md`.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- AF $39 distinguishes from Quicksilver (no AF). Engine: treat as fair-credit gateway product.
