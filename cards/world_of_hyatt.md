# Chase World of Hyatt

`card_id`: world_of_hyatt
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "world_of_hyatt",
  "name": "Chase World of Hyatt Credit Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["hotel_cobrand"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "hyatt_world_of_hyatt",

  "earning": [
    {"category": "hyatt_purchases", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "airline_tickets_direct", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "local_transit_commuting", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "fitness_clubs_gym_memberships", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 60000,
    "spend_required_usd": 6000,
    "spend_window_months": 6,
    "estimated_value_usd": 1200,
    "notes": "Tiered: 30k after $3k + 30k after $6k more in 6mo"
  },

  "annual_credits": [
    {"name": "Free Night Cat 1-4", "value_usd": 250, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy"},
    {"name": "Second Cat 1-4 Free Night after $15k spend", "value_usd": 250, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Hyatt Discoverist status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "5 elite-night credits per year", "value_estimate_usd": null, "category": "elite_status_acceleration"},
    {"name": "2 elite-night credits per $5k spend", "value_estimate_usd": null, "category": "elite_status_acceleration"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "hyatt_world_of_hyatt",
  "transfer_partners_inherited_from_notes": "Receives from Chase UR and Bilt at 1:1",

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["Hyatt_loyalist_using_Free_Night_at_Cat_4_property"],
  "synergies_with": ["chase_sapphire_preferred", "chase_sapphire_reserve"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $95 less $250 Free Night = -$155. Free Night at Andaz/Park Hyatt off-peak crushes value at $400-700 per night.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/world-of-hyatt"]
}
```

## programs.json entry (hyatt_world_of_hyatt)

```json
{
  "id": "hyatt_world_of_hyatt",
  "name": "World of Hyatt",
  "type": "cobrand_hotel",
  "issuer": "Hyatt",
  "earning_cards": ["world_of_hyatt", "world_of_hyatt_business"],
  "fixed_redemption_cpp": 1.7,
  "median_redemption_cpp": 1.65,
  "median_cpp_source_url": "https://thepointsguy.com/loyalty-programs/monthly-valuations/",
  "median_cpp_as_of": "2026-05-01",
  "transfer_partners_notes": "Receives transfers from Chase UR (1:1) and Bilt (1:1)",
  "sweet_spots": [
    {"description": "Cat 1-4 Free Night cert at Park Hyatt off-peak / Andaz", "value_estimate_usd": "~$300-700 retail value", "source": null},
    {"description": "Cat 1: 3,500 pts standard, 5,000 peak", "value_estimate_usd": "~5cpp at $175 cash equivalent", "source": null}
  ],
  "sources": ["https://world.hyatt.com/"]
}
```

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries

```json
{
  "hyatt_premium": {
    "hotel_chains_strong": ["Park Hyatt, Andaz, Alila, Miraval"],
    "relevant_cards": ["world_of_hyatt", "world_of_hyatt_business", "chase_sapphire_preferred"],
    "notes": "Cat 1-4 Free Night certs from WoH cards redeem extremely well at Andaz Scottsdale, Park Hyatt St. Kitts, Alila Ventana Big Sur, Park Hyatt Niseko (off-peak)."
  }
}
```

## RESEARCH_NOTES.md entries
- Best-value hotel co-brand for points-redemption value.
- Hyatt's award chart still has fixed categories (rare in 2026) — major sweet spot.
