# Aeromexico Visa

`card_id`: aeromexico_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "aeromexico_visa",
  "name": "Aeromexico Visa Card",
  "issuer": "US Bank",
  "network": "Visa",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 99,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "aeromexico_rewards",

  "earning": [
    {"category": "aeromexico_purchases", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "gas_dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 30000, "spend_required_usd": 1500, "spend_window_months": 90, "estimated_value_usd": 400},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Free first checked bag", "value_estimate_usd": 100, "category": "airline_perk"}],
  "transfer_partners_inherited_from": "aeromexico_rewards",
  "issuer_rules": ["USB 30-day rule"],

  "best_for": ["mexico_traveler_via_aeromexico"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $99 (Y1 waived). Niche Mexico carrier.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usbank.com/credit-cards/aeromexico-visa-credit-card.html"]
}
```

## programs.json entry

```json
{
  "id": "aeromexico_rewards",
  "name": "Aeromexico Rewards",
  "type": "cobrand_airline",
  "issuer": "Aeromexico",
  "earning_cards": ["aeromexico_visa", "aeromexico_rewards_premier"],
  "fixed_redemption_cpp": 1.5,
  "transfer_partners_notes": "Receives transfers from Capital One Miles (1:1).",
  "sweet_spots": [],
  "sources": ["https://aeromexico.com/"]
}
```

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Aeromexico is SkyTeam alliance.
