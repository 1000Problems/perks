# JetBlue Premier World Elite Mastercard

`card_id`: jetblue_premier
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "jetblue_premier",
  "name": "JetBlue Premier World Elite Mastercard",
  "issuer": "Barclays",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["airline_cobrand", "premium_travel"],
  "annual_fee_usd": 199,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "jetblue_trueblue",

  "earning": [
    {"category": "jetblue_purchases", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "restaurants_grocery", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 80000,
    "spend_required_usd": 3000,
    "spend_window_months": 90,
    "estimated_value_usd": 1100
  },

  "annual_credits": [
    {"name": "$100 statement credit on JetBlue Vacation $100+", "value_usd": 100, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium"},
    {"name": "5,000 anniversary points", "value_usd": 70, "type": "rewards", "expiration": "annual_anniversary", "ease_of_use": "easy"},
    {"name": "10% rebate on award redemptions", "value_usd": null, "type": "rewards_modifier", "expiration": "ongoing", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag (primary + companions)", "value_estimate_usd": 140, "category": "airline_perk"},
    {"name": "JetBlue Mosaic status with $50k spend", "value_estimate_usd": null, "category": "elite_status_acceleration"},
    {"name": "Priority boarding (Even More Speed)", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": "jetblue_trueblue",

  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["JetBlue_Mosaic_pursuer", "JetBlue_loyalist_with_$50k_plus_spend"],
  "synergies_with": ["jetblue_plus"],
  "competing_with_in_wallet": ["jetblue_plus"],

  "breakeven_logic_notes": "AF $199 less $100 vacation credit less $70 anniversary pts = $29 net. Status path is the differentiator.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cards.barclaycardus.com/banking/cards/jetblue-premier-card/"]
}
```

## programs.json entry
See `jetblue_plus.md` for jetblue_trueblue.

## issuer_rules.json entry
See `jetblue_plus.md` for Barclays.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `jetblue_plus.md`.

## RESEARCH_NOTES.md entries

- Top JetBlue co-brand. Path to Mosaic at $50k spend.
- Ongoing 10% rebate makes every redemption ~10% cheaper.
