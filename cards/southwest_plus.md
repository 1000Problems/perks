# Chase Southwest Rapid Rewards Plus

`card_id`: southwest_plus
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "southwest_plus",
  "name": "Chase Southwest Rapid Rewards Plus Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 69,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "southwest_rapid_rewards",

  "earning": [
    {"category": "southwest_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "local_transit_streaming_internet_phone", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
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
    {"name": "3,000 anniversary points", "value_estimate_usd": 40, "category": "rewards_boost"},
    {"name": "Two early-bird check-ins per year (some periods)", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24", "Southwest 24-month bonus rule"],

  "best_for": ["entry_southwest_card_for_companion_pass_chase"],
  "synergies_with": ["southwest_premier", "southwest_priority"],
  "competing_with_in_wallet": ["southwest_premier"],

  "breakeven_logic_notes": "AF $69. Lowest entry to Southwest co-brand. Useful primarily for Companion Pass strategy.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/southwest-credit-cards/plus"],

  "is_cobrand": true
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
- 3% FX makes this domestic-only.
