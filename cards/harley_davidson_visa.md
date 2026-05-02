# Harley-Davidson Visa Signature

`card_id`: harley_davidson_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "harley_davidson_visa",
  "name": "Harley-Davidson Visa Signature",
  "issuer": "US Bank",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "harley_genuine_rewards",

  "earning": [
    {"category": "harley_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "gas_dining_grocery", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["USB 30-day rule"],

  "best_for": ["harley_davidson_owner"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Niche Harley enthusiast card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usbank.com/credit-cards/harley-davidson-visa-credit-card.html"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique. See `us_bank_altitude_reserve.md`.

## RESEARCH_NOTES.md entries
- Niche brand enthusiast card.
