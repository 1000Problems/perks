# Alaska Airlines Visa Signature

`card_id`: alaska_airlines_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "alaska_airlines_visa",
  "name": "Alaska Airlines Visa Signature Card",
  "issuer": "Bank of America",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "alaska_atmos_rewards",

  "earning": [
    {"category": "alaska_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "gas_grocery_local_transit_cable_streaming", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 50000,
    "spend_required_usd": 3000,
    "spend_window_months": 90,
    "estimated_value_usd": 750,
    "notes": "Often paired with companion fare from $122"
  },

  "annual_credits": [
    {"name": "Alaska's Famous Companion Fare ($122)", "value_usd": 250, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy", "notes": "Companion fare from $122 + taxes/fees on round-trip Alaska flights"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag (primary + up to 6 companions)", "value_estimate_usd": 240, "category": "airline_perk"},
    {"name": "Boarding priority", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "20% back on inflight purchases", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": "alaska_atmos_rewards",
  "transfer_partners_inherited_from_notes": "Atmos receives transfers from Bilt at 1:1",

  "issuer_rules": ["BoA 2/3/4", "BoA 7/12"],

  "best_for": ["Alaska_loyalist_with_couple_using_companion_fare", "PNW_traveler_via_SEA"],
  "synergies_with": ["bilt_blue", "bilt_obsidian"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $95. Companion fare from $122 typically saves $250-500 on a round-trip. Used 1x/yr fully covers AF.",

  "recently_changed": true,
  "recently_changed_date": "2024-2025",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.alaskaair.com/content/credit-card"]
}
```

## programs.json entry (alaska_atmos_rewards)

```json
{
  "id": "alaska_atmos_rewards",
  "name": "Alaska Atmos Rewards (formerly Mileage Plan + Hawaiian HawaiianMiles)",
  "type": "cobrand_airline",
  "issuer": "Alaska Airlines",
  "earning_cards": ["alaska_airlines_visa", "alaska_airlines_business_visa"],
  "fixed_redemption_cpp": 1.4,
  "transfer_partners_notes": "Receives transfers from Bilt (1:1). Marriott Bonvoy 60k:25k.",
  "sweet_spots": [
    {"description": "JAL business class to Asia (legacy AS Mileage Plan; verify post-merger continuity)", "value_estimate_usd": "~5-7cpp", "source": null},
    {"description": "Cathay Pacific business via Atmos partner award", "value_estimate_usd": "~4-6cpp", "source": null}
  ],
  "sources": ["https://www.alaskaair.com/atmos"]
}
```

## issuer_rules.json entry
See `boa_premium_rewards.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries

```json
{
  "pnw_alaska_hawaii": {
    "airline_routes_strong": ["Alaska SEA/PDX/ANC", "Hawaiian HNL/OGG/KOA (post-merger)"],
    "relevant_cards": ["alaska_airlines_visa"]
  }
}
```

## RESEARCH_NOTES.md entries
- 2024 Hawaiian/Alaska merger; Mileage Plan + HawaiianMiles consolidating into Atmos Rewards. Transition period — verify partner-airline award rules at recommendation time.
