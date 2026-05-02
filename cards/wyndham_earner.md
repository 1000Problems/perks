# Wyndham Rewards Earner

`card_id`: wyndham_earner
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "wyndham_earner",
  "name": "Wyndham Rewards Earner Card",
  "issuer": "Barclays",
  "network": "Visa",
  "card_type": "personal",
  "category": ["hotel_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "wyndham_rewards",

  "earning": [
    {"category": "wyndham_purchases_and_gas", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "dining_grocery_utilities", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 45000, "spend_required_usd": 1000, "spend_window_months": 90, "estimated_value_usd": 450},

  "annual_credits": [{"name": "7,500 anniversary points", "value_usd": 75, "type": "rewards", "expiration": "annual_anniversary", "ease_of_use": "easy"}],

  "ongoing_perks": [{"name": "Wyndham Gold status", "value_estimate_usd": null, "category": "hotel_status"}],

  "transfer_partners_inherited_from": "wyndham_rewards",

  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["wyndham_user_no_AF"],
  "synergies_with": ["wyndham_earner_plus"],
  "competing_with_in_wallet": ["wyndham_earner_plus"],

  "breakeven_logic_notes": "No AF. Lower-tier Wyndham. Plus version costs $75 AF and provides Platinum + 7.5k pts; better breakeven for active Wyndham users.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cards.barclaycardus.com/banking/cards/wyndham-rewards-earner-card/"]
}
```

## programs.json / issuer_rules
See `wyndham_earner_plus.md` for programs; `jetblue_plus.md` for Barclays rules.

## perks_dedup.json / destination_perks
See `wyndham_earner_plus.md`.

## RESEARCH_NOTES.md entries
- No AF entry-tier Wyndham.
