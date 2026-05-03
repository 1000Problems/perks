# Chase Aeroplan Credit Card

`card_id`: aeroplan_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "aeroplan_card",
  "name": "Chase Aeroplan Credit Card",
  "issuer": "Chase",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "aeroplan",

  "earning": [
    {"category": "air_canada_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "dining_grocery", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "estimated_value_usd": 1200
  },

  "annual_credits": [
    {"name": "Up to $100 Global Entry / NEXUS / TSA PreCheck", "value_usd": 100, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag on Air Canada", "value_estimate_usd": 200, "category": "airline_perk"},
    {"name": "25% back on inflight purchases", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Path to Aeroplan 25K elite status with $15k+ spend", "value_estimate_usd": null, "category": "elite_status_acceleration"},
    {"name": "Primary auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "aeroplan",

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["aeroplan_loyalist", "Star_Alliance_award_optimizer", "frequent_flyer_to_Canada"],
  "synergies_with": ["chase_sapphire_preferred", "chase_sapphire_reserve"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $95. 3x dining/grocery rivals CSP at same AF. Aeroplan transfer access from Chase UR + AAdvantage 1:1 partnership makes this a strong second card for award travel.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/aeroplan/applynow"]
}
```

## programs.json entry (aeroplan)

```json
{
  "id": "aeroplan",
  "name": "Air Canada Aeroplan",
  "type": "cobrand_airline",
  "issuer": "Air Canada",
  "earning_cards": ["aeroplan_card"],
  "fixed_redemption_cpp": 1.5,
  "median_redemption_cpp": 1.4,
  "median_cpp_source_url": "https://thepointsguy.com/loyalty-programs/monthly-valuations/",
  "median_cpp_as_of": "2026-05-01",
  "transfer_partners_notes": "Receives transfers from Chase UR (1:1), Amex MR (1:1), Capital One Miles (1:1), Bilt (1:1). Marriott Bonvoy 60k:25k+5k bonus.",
  "sweet_spots": [
    {"description": "Star Alliance partner award flights with stopovers (5k pts)", "value_estimate_usd": "~3-5cpp", "source": null},
    {"description": "Air Canada short-haul economy", "value_estimate_usd": "~2cpp", "source": null}
  ],
  "sources": ["https://www.aircanada.com/aeroplan/"]
}
```

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries

```json
{
  "canada_and_international_via_star_alliance": {
    "airline_routes_strong": ["Air Canada at YYZ/YVR/YUL"],
    "relevant_cards": ["aeroplan_card"],
    "notes": "Aeroplan 5k-pt stopovers on Star Alliance award flights are best-in-class for multi-city itineraries."
  }
}
```

## RESEARCH_NOTES.md entries
- Among the highest-value airline transferable currencies due to stopover policy and Star Alliance award chart.
