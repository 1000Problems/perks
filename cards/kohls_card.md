# Kohl's Card

`card_id`: kohls_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "kohls_card",
  "name": "Kohl's Card",
  "issuer": "Capital One",
  "network": "Closed-loop",
  "card_type": "personal",
  "category": ["retail_cobrand"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": null,
  "credit_score_required": "fair",
  "currency_earned": "kohls_rewards",

  "earning": [{"category": "kohls_purchases", "rate_pts_per_dollar": null, "discount_pct": null, "notes": "Discount-based; 35% off first purchase, additional special offers; tiered Most Valued Customer benefits"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 35},

  "annual_credits": [],
  "ongoing_perks": [
    {"name": "MVC tier benefits with $600+ annual spend", "value_estimate_usd": null, "category": "lifestyle"}
  ],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["frequent_kohls_shopper"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Discount-driven (not cashback). Useful only at Kohl's.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.kohls.com/feature/credit.jsp"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Tiered MVC benefits scale with annual spend.
