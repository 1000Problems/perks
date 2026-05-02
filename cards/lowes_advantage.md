# Lowe's Advantage Card

`card_id`: lowes_advantage
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "lowes_advantage",
  "name": "Lowe's Advantage Card",
  "issuer": "Synchrony",
  "network": "Closed-loop (Lowe's only)",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": null,
  "credit_score_required": "good",
  "currency_earned": "lowes_discount",

  "earning": [{"category": "lowes_purchases", "rate_pts_per_dollar": null, "discount_pct": 5, "notes": "5% off everyday at Lowe's; alternative 6 months special financing on $299+ purchases"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Special financing options on big purchases", "value_estimate_usd": null, "category": "financing"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["DIY_home_improvement_at_Lowes"],
  "synergies_with": [],
  "competing_with_in_wallet": ["home_depot_consumer"],

  "breakeven_logic_notes": "No AF. 5% off at Lowe's beats most general cards. Closed-loop only.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.lowes.com/l/lowes-advantage-credit-card.html"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Cannot use outside Lowe's.
- Engine: surface for users mentioning home improvement projects.
