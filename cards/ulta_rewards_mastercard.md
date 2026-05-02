# Ulta Beauty Rewards Mastercard

`card_id`: ulta_rewards_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "ulta_rewards_mastercard",
  "name": "Ulta Beauty Rewards Mastercard",
  "issuer": "Comenity (Bread)",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "fair_to_good",
  "currency_earned": "ulta_rewards",

  "earning": [
    {"category": "ulta_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "notes": "2x ultamate rewards points"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 25},

  "annual_credits": [{"name": "Birthday gift", "value_usd": null, "type": "lifestyle", "expiration": "annual_anniversary", "ease_of_use": "easy"}],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["ulta_loyalist"],
  "synergies_with": [],
  "competing_with_in_wallet": ["ulta_rewards_credit"],

  "breakeven_logic_notes": "No AF. 3% FX domestic only.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://comenity.net/ulta/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Ultamate Rewards platinum tier offers escalating benefits.
