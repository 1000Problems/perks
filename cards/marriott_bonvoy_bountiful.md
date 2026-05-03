# Chase Marriott Bonvoy Bountiful

`card_id`: marriott_bonvoy_bountiful
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "marriott_bonvoy_bountiful",
  "name": "Chase Marriott Bonvoy Bountiful Credit Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["hotel_cobrand", "premium_travel"],
  "annual_fee_usd": 250,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "marriott_bonvoy",

  "earning": [
    {"category": "marriott_bonvoy_purchases", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "us_supermarkets_us_dining", "rate_pts_per_dollar": 4, "cap_usd_per_year": 15000},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 85000,
    "spend_required_usd": 5000,
    "spend_window_months": 3,
    "estimated_value_usd": 600
  },

  "annual_credits": [
    {"name": "Free Night cert (50,000 pts) after $15k spend", "signal_id": "hotel_free_night_cert", "value_usd": 350, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Marriott Gold Elite status", "signal_id": "hotel_status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "15 elite-night credits per year", "value_estimate_usd": null, "category": "elite_status_acceleration"}
  ],

  "transfer_partners_inherited_from": "marriott_bonvoy",

  "issuer_rules": ["Chase 5/24", "Marriott 24-month cross-issuer rule"],

  "best_for": ["chase_side_marriott_loyalist_at_$15k_plus_spend"],
  "synergies_with": ["marriott_bonvoy_boundless", "marriott_bonvoy_brilliant"],
  "competing_with_in_wallet": ["marriott_bonvoy_bevy"],

  "breakeven_logic_notes": "AF $250. Chase counterpart to Amex Bevy. Same Free Night gate; verify which sister card is better fit by issuer rule eligibility.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/marriott/bountiful"]
}
```

## programs.json entry
See `marriott_bonvoy_boundless.md`.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
See `marriott_bonvoy_boundless.md`.

## destination_perks.json entries
See `marriott_bonvoy_boundless.md`.

## RESEARCH_NOTES.md entries
- Marriott 24-month rule applies across Chase + Amex Marriott family — engine must check both sides.
