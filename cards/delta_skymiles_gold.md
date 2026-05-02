# Amex Delta SkyMiles Gold

`card_id`: delta_skymiles_gold
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "delta_skymiles_gold",
  "name": "Amex Delta SkyMiles Gold Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 150,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "delta_skymiles",

  "earning": [
    {"category": "delta_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "us_supermarkets", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "restaurants_worldwide", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 50000,
    "spend_required_usd": 2000,
    "spend_window_months": 6,
    "estimated_value_usd": 600,
    "notes": "Often paired with $200 statement credit on Delta purchase"
  },

  "annual_credits": [
    {"name": "Delta Stays credit", "value_usd": 200, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium", "notes": "$200 toward prepaid hotel stays via Delta Stays"},
    {"name": "Resy dining credit", "value_usd": null, "type": "specific", "expiration": "monthly", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag (primary + 8 companions on same itinerary)", "value_estimate_usd": 240, "category": "airline_perk"},
    {"name": "Priority boarding (Zone 5)", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "20% off inflight purchases", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "$100 Delta flight credit after $10k spend", "value_estimate_usd": 100, "category": "airline_perk", "notes": "Earn anytime in calendar year"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Amex once-per-lifetime SUB", "Amex 5-credit-card limit"],

  "best_for": ["Delta_loyalist_with_2_plus_companions_per_trip"],
  "synergies_with": ["delta_skymiles_reserve", "amex_gold", "amex_platinum"],
  "competing_with_in_wallet": ["delta_skymiles_platinum", "delta_skymiles_blue"],

  "breakeven_logic_notes": "AF $150 less Delta Stays $200 = -$50 net. Free bag for up to 9 people on same itinerary makes this a family travel perk machine.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-gold-amex/"]
}
```

## programs.json entry (delta_skymiles)

```json
{
  "id": "delta_skymiles",
  "name": "Delta SkyMiles",
  "type": "cobrand_airline",
  "issuer": "Delta Air Lines",
  "earning_cards": ["delta_skymiles_blue", "delta_skymiles_gold", "delta_skymiles_platinum", "delta_skymiles_reserve", "delta_skymiles_business_variants"],
  "fixed_redemption_cpp": 1.2,
  "transfer_partners_notes": "Receives transfers from Amex MR (1:1)",
  "sweet_spots": [
    {"description": "Delta Flash Sales / 'mile sales' for round-trip flights", "value_estimate_usd": "~1.5cpp", "source": null}
  ],
  "sources": ["https://www.delta.com/skymiles/"]
}
```

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries

```json
[
  {
    "perk": "free_checked_bag_delta",
    "card_ids": ["delta_skymiles_gold", "delta_skymiles_platinum", "delta_skymiles_reserve"],
    "value_if_unique_usd": 240,
    "value_if_duplicate_usd": 0
  }
]
```

## destination_perks.json entries

```json
{
  "delta_hubs": {
    "airline_routes_strong": ["Delta at ATL/DTW/MSP/SLC/SEA/LAX/JFK/BOS"],
    "relevant_cards": ["delta_skymiles_gold", "delta_skymiles_platinum", "delta_skymiles_reserve"],
    "notes": "Delta is dominant in the Southeast and Upper Midwest."
  }
}
```

## RESEARCH_NOTES.md entries
- 2024-2025 had a major refresh; verify current credit slate.
