# Wayfair Credit Card

`card_id`: wayfair_credit
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "wayfair_credit",
  "name": "Wayfair Credit Card",
  "issuer": "Comenity (Bread)",
  "network": "Closed-loop / Mastercard",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": null,
  "credit_score_required": "fair_to_good",
  "currency_earned": "wayfair_rewards",

  "earning": [{"category": "wayfair_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 40},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Promotional financing on $300+ Wayfair purchases", "value_estimate_usd": null, "category": "financing"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["wayfair_furniture_shopper"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Closed-loop only.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://comenity.net/wayfair/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- One-time furniture purchase card.
