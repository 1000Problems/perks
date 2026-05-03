# Chase Southwest Rapid Rewards Premier

`card_id`: southwest_premier
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "southwest_premier",
  "name": "Chase Southwest Rapid Rewards Premier Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 99,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "southwest_rapid_rewards",

  "earning": [
    {"category": "southwest_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "local_transit_commuting_rideshare", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "internet_cable_phone_streaming", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 50000,
    "spend_required_usd": 1000,
    "spend_window_months": 3,
    "estimated_value_usd": 700
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "6,000 anniversary points", "value_estimate_usd": 80, "category": "rewards_boost"},
    {"name": "Up to 25% back on inflight purchases", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Tier-qualifying points contribution toward A-List status (1.5 TQP per $1)", "value_estimate_usd": null, "category": "elite_status"}
  ],

  "transfer_partners_inherited_from": "chase_ur",
  "transfer_partners_inherited_from_notes": "Southwest is itself a Chase UR transfer partner; this card earns RR directly",

  "issuer_rules": [
    "Chase 5/24",
    "Southwest 24-month bonus rule",
    "Southwest Companion Pass: earn 135k qualifying points or 100 qualifying flights in calendar year"
  ],

  "best_for": ["Southwest_loyalist_chasing_Companion_Pass"],
  "synergies_with": ["southwest_priority", "southwest_plus", "chase_sapphire_preferred"],
  "competing_with_in_wallet": ["southwest_priority", "southwest_plus"],

  "breakeven_logic_notes": "AF $99. Anniversary 6k pts ~$80. Companion Pass is the holy grail — earned via combined card SUB + spend across Southwest cards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/southwest-credit-cards"]
}
```

## programs.json entry (southwest_rapid_rewards)

```json
{
  "id": "southwest_rapid_rewards",
  "name": "Southwest Rapid Rewards",
  "type": "cobrand_airline",
  "issuer": "Southwest Airlines",
  "earning_cards": ["southwest_plus", "southwest_premier", "southwest_priority", "southwest_performance_business"],
  "fixed_redemption_cpp": 1.4,
  "median_redemption_cpp": 1.25,
  "median_cpp_source_url": "https://thepointsguy.com/loyalty-programs/monthly-valuations/",
  "median_cpp_as_of": "2026-05-01",
  "transfer_partners_notes": "Receives transfers from Chase UR (1:1)",
  "sweet_spots": [
    {"description": "Companion Pass: free fly-with-companion entire calendar year", "value_estimate_usd": "$1,500-3,000", "source": null}
  ],
  "sources": ["https://www.southwest.com/rapidrewards/"]
}
```

## issuer_rules.json entry
See `chase_sapphire_preferred.md` for Chase 5/24.

## perks_dedup.json entries
None unique.

## destination_perks.json entries

```json
{
  "domestic_southwest_routes": {
    "airline_routes_strong": ["Southwest at MDW/BWI/PHX/LAS/DAL/HOU/STL/BNA"],
    "relevant_cards": ["southwest_premier", "southwest_priority", "southwest_plus", "southwest_performance_business"]
  }
}
```

## RESEARCH_NOTES.md entries
- Companion Pass strategy: open Southwest personal + business cards in same calendar year, earn enough points to unlock 1.5+ years of unlimited free companion flights.
- 5/24 applies; Chase business cards count toward CP earning despite not counting toward 5/24.
