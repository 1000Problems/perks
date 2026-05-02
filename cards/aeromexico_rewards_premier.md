# Aeromexico Rewards Premier

`card_id`: aeromexico_rewards_premier
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "aeromexico_rewards_premier",
  "name": "Aeromexico Rewards Premier Card",
  "issuer": "US Bank",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 99,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "aeromexico_rewards",

  "earning": [
    {"category": "aeromexico_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "dining_grocery", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 50000, "spend_required_usd": 2500, "spend_window_months": 90, "estimated_value_usd": 750},

  "annual_credits": [{"name": "Aeromexico companion ticket benefit", "value_estimate_usd": null, "category": "airline_perk"}],
  "ongoing_perks": [{"name": "Free first checked bag", "value_estimate_usd": 100, "category": "airline_perk"}],
  "transfer_partners_inherited_from": "aeromexico_rewards",
  "issuer_rules": ["USB 30-day rule"],

  "best_for": ["mexico_traveler_with_$15k_plus_aeromexico_spend"],
  "synergies_with": ["aeromexico_visa"],
  "competing_with_in_wallet": ["aeromexico_visa"],

  "breakeven_logic_notes": "AF $99 (Y1 waived). Premier tier of Aeromexico co-brand.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usbank.com/credit-cards/aeromexico-rewards-premier-credit-card.html"]
}
```

See `aeromexico_visa.md`.
