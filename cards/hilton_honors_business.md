# Amex Hilton Honors Business

`card_id`: hilton_honors_business
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "hilton_honors_business",
  "name": "Amex Hilton Honors Business Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "business",
  "category": ["business", "hotel_cobrand"],
  "annual_fee_usd": 195,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "hilton_honors",

  "earning": [
    {"category": "hilton_purchases", "rate_pts_per_dollar": 12, "cap_usd_per_year": null},
    {"category": "us_gas_us_shipping_us_wireless_select_categories", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "us_dining_flights_amex_travel_or_direct_car_rentals", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 3, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 175000,
    "spend_required_usd": 8000,
    "spend_window_months": 6,
    "estimated_value_usd": 875
  },

  "annual_credits": [
    {"name": "Free Night Reward after $15k spend", "value_usd": 350, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"},
    {"name": "Second Free Night Reward after $60k spend", "value_usd": 350, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Hilton Gold status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "10 Priority Pass visits per year", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Diamond status with $40k spend", "value_estimate_usd": null, "category": "elite_status_acceleration"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Amex once-per-lifetime SUB"],

  "best_for": ["business_Hilton_loyalist_with_$15k_plus_annual_spend"],
  "synergies_with": ["hilton_honors_aspire", "hilton_honors_surpass"],
  "competing_with_in_wallet": ["hilton_honors_aspire"],

  "breakeven_logic_notes": "AF $195. Free Night certs at $15k and $60k thresholds. Realistic value capture for $20k+ business spender.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/hilton-honors-business-amex/"]
}
```

## programs.json entry
See `hilton_honors_surpass.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
See `hilton_honors_surpass.md`.

## destination_perks.json entries
See `hilton_honors_surpass.md`.

## RESEARCH_NOTES.md entries
- Hilton Gold + 10 PP visits + Free Night certs at modest AF makes this competitive with Aspire for businesses below $25k Hilton-direct spend.
