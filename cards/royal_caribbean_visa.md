# Royal Caribbean Visa Signature

`card_id`: royal_caribbean_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "royal_caribbean_visa",
  "name": "Royal Caribbean Visa Signature Card",
  "issuer": "Bank of America",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["cruise_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": "royal_caribbean_points",

  "earning": [
    {"category": "royal_caribbean_celebrity_silversea", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 100},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["BoA 2/3/4"],

  "best_for": ["royal_caribbean_cruisers"],
  "synergies_with": ["celebrity_cruises_visa"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Niche cruise card. 3% FX makes domestic-only.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/royal-caribbean-credit-card/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique. See `boa_premium_rewards.md` for issuer rules.

## RESEARCH_NOTES.md entries
- Niche cruise card.
