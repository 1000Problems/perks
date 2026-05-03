# Sun Country Airlines Rewards Visa

`card_id`: sun_country_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "sun_country_visa",
  "name": "Sun Country Airlines Rewards Visa",
  "issuer": "First Bankcard",
  "network": "Visa",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 69,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "sun_country_rewards",

  "earning": [
    {"category": "sun_country_purchases", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "gas_grocery_dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 25000, "spend_required_usd": 1000, "spend_window_months": 90, "estimated_value_usd": 250},

  "annual_credits": [{"name": "$50 Sun Country credit", "value_usd": 50, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium"}],

  "ongoing_perks": [{"name": "Free first checked bag (when paying with card)", "signal_id": "free_checked_bag", "value_estimate_usd": 100, "category": "airline_perk"}],

  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["sun_country_loyalist_minneapolis_focused"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $69 less $50 credit = $19 net. Niche regional airline card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.suncountry.com/credit-card"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Sun Country is a Minneapolis-based ULCC. Niche regional fit.
