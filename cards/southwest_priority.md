# Chase Southwest Rapid Rewards Priority

`card_id`: southwest_priority
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "southwest_priority",
  "name": "Chase Southwest Rapid Rewards Priority Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 149,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "southwest_rapid_rewards",

  "earning": [
    {"category": "southwest_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "hotels_via_southwest_local_transit_streaming_internet_phone", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 50000,
    "spend_required_usd": 1000,
    "spend_window_months": 3,
    "estimated_value_usd": 700
  },

  "annual_credits": [
    {"name": "$75 Southwest annual travel credit", "signal_id": "travel_credit", "value_usd": 75, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "7,500 anniversary points", "value_estimate_usd": 100, "category": "rewards_boost"},
    {"name": "4 upgraded boardings per year (when available)", "value_estimate_usd": 120, "category": "airline_perk"},
    {"name": "20% back on inflight purchases", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Tier-qualifying points contribution to A-List status", "value_estimate_usd": null, "category": "elite_status"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24", "Southwest 24-month bonus rule"],

  "best_for": ["southwest_loyalist_with_$75_annual_credit_use"],
  "synergies_with": ["southwest_plus", "southwest_premier"],
  "competing_with_in_wallet": ["southwest_premier"],

  "breakeven_logic_notes": "AF $149 less $75 travel credit less 7.5k anniv ($100) less ~$120 in upgraded boardings = effectively negative. Top tier among Southwest personal cards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/southwest-credit-cards/priority"]
}
```

## programs.json entry
See `southwest_premier.md`.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `southwest_premier.md`.

## RESEARCH_NOTES.md entries
- Top-tier Southwest personal card. Engine should prefer over Premier for Southwest loyalists.
