# Macy's American Express Card

`card_id`: macys_amex
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "macys_amex",
  "name": "Macy's American Express Card",
  "issuer": "Citibank (Macy's co-brand)",
  "network": "Amex",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 2.7,
  "credit_score_required": "good",
  "currency_earned": "macys_star_rewards",

  "earning": [
    {"category": "macys_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "3% back at Macy's"},
    {"category": "restaurants", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "gas_supermarkets", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 25},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Citi 8/65"],

  "best_for": ["macys_shopper_seeking_card_usable_outside"],
  "synergies_with": ["macys_credit"],
  "competing_with_in_wallet": ["macys_credit"],

  "breakeven_logic_notes": "No AF. Open-loop Amex variant of Macy's card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.macys.com/cms/macys-credit-card-services"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
See `macys_credit.md`.

## RESEARCH_NOTES.md entries
- Open-loop with mid-tier earning structure.
