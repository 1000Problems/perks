# Home Depot Consumer Credit Card

`card_id`: home_depot_consumer
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "home_depot_consumer",
  "name": "Home Depot Consumer Credit Card",
  "issuer": "Citibank (Home Depot co-brand)",
  "network": "Closed-loop",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": null,
  "credit_score_required": "fair_to_good",
  "currency_earned": null,

  "earning": [{"category": "home_depot_purchases", "rate_pts_per_dollar": 0, "discount_pct": 0, "notes": "No cashback. Card is for special financing on big purchases."}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 50},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "6-24 months special financing on $299+ purchases", "value_estimate_usd": null, "category": "financing"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [],

  "best_for": ["home_improvement_financing_only"],
  "synergies_with": [],
  "competing_with_in_wallet": ["lowes_advantage"],

  "breakeven_logic_notes": "No AF, no rewards. Pure financing card. Engine: surface only for users planning $1k+ HD purchases who want to spread payments.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.homedepot.com/c/Credit_Center"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- No rewards. Lowe's Advantage offers 5% discount, making Lowe's preferred for non-financing scenarios.
