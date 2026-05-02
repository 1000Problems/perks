# JCPenney Mastercard

`card_id`: jcpenney_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "jcpenney_mastercard",
  "name": "JCPenney Mastercard",
  "issuer": "Synchrony",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "fair_to_good",
  "currency_earned": "jcp_rewards",

  "earning": [
    {"category": "jcpenney_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "5% JCPenney Rewards points"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 25},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["jcpenney_shoppers"],
  "synergies_with": [],
  "competing_with_in_wallet": ["jcpenney_credit"],

  "breakeven_logic_notes": "No AF. 3% FX domestic only.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.jcpenney.com/m/credit"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Closed-loop counterpart (JCPenney Credit) earns at JCP only.
