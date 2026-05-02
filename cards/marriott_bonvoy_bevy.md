# Amex Marriott Bonvoy Bevy

`card_id`: marriott_bonvoy_bevy
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "marriott_bonvoy_bevy",
  "name": "Amex Marriott Bonvoy Bevy Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["hotel_cobrand"],
  "annual_fee_usd": 250,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "marriott_bonvoy",

  "earning": [
    {"category": "marriott_bonvoy_purchases", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "us_supermarkets_us_dining_worldwide", "rate_pts_per_dollar": 4, "cap_usd_per_year": 15000},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 85000,
    "spend_required_usd": 5000,
    "spend_window_months": 6,
    "estimated_value_usd": 600
  },

  "annual_credits": [
    {"name": "Free Night Cert (50,000 pts) after $15k spend", "value_usd": 350, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Marriott Gold Elite status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "15 elite-night credits/year", "value_estimate_usd": null, "category": "elite_status_acceleration"}
  ],

  "transfer_partners_inherited_from": "marriott_bonvoy",

  "issuer_rules": ["Amex once-per-lifetime SUB", "Marriott 24-month cross-issuer rule"],

  "best_for": ["Marriott_loyalist_who_will_hit_$15k_spend"],
  "synergies_with": ["marriott_bonvoy_brilliant", "marriott_bonvoy_business"],
  "competing_with_in_wallet": ["marriott_bonvoy_boundless", "marriott_bonvoy_bountiful"],

  "breakeven_logic_notes": "AF $250. Free Night cert at $15k spend ~$350. Net value after spend gate. Engine should weight only for users who realistically hit $15k.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-bevy-amex/"]
}
```

## programs.json entry
See `marriott_bonvoy_boundless.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
See `marriott_bonvoy_boundless.md`.

## destination_perks.json entries
See `marriott_bonvoy_boundless.md`.

## RESEARCH_NOTES.md entries
- Marriott 24-month bonus rule means user can't earn Bevy SUB while holding Brilliant/Bountiful.
