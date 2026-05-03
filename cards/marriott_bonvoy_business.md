# Amex Marriott Bonvoy Business

`card_id`: marriott_bonvoy_business
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "marriott_bonvoy_business",
  "name": "Amex Marriott Bonvoy Business Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "business",
  "category": ["business", "hotel_cobrand"],
  "annual_fee_usd": 125,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "marriott_bonvoy",

  "earning": [
    {"category": "marriott_bonvoy_purchases", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "us_gas_us_shipping_us_dining_us_internet_phone_etc", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 100000,
    "spend_required_usd": 5000,
    "spend_window_months": 3,
    "estimated_value_usd": 800
  },

  "annual_credits": [
    {"name": "Free Night Cert (35,000 pts)", "signal_id": "hotel_free_night_cert", "value_usd": 250, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy"},
    {"name": "Second Free Night cert after $60k spend", "signal_id": "hotel_free_night_cert", "value_usd": 250, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Marriott Gold Elite status", "signal_id": "hotel_status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "15 elite-night credits/year", "value_estimate_usd": null, "category": "elite_status_acceleration"}
  ],

  "transfer_partners_inherited_from": "marriott_bonvoy",

  "issuer_rules": ["Amex once-per-lifetime SUB", "Marriott 24-month rule across all Marriott family cards"],

  "best_for": ["small_business_with_Marriott_loyalty"],
  "synergies_with": ["marriott_bonvoy_brilliant", "marriott_bonvoy_boundless"],
  "competing_with_in_wallet": ["amex_business_gold", "chase_ink_business_preferred"],

  "breakeven_logic_notes": "AF $125 less Free Night ($250) = -$125. Gold status + Free Night cert at modest AF.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/marriott-bonvoy-business-amex/"]
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
- 15 elite nights stack with Brilliant's 25 = 40 nights toward Marriott elite status from card-holding alone.
