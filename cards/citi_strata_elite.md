# Citi Strata Elite

`card_id`: citi_strata_elite
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_strata_elite",
  "name": "Citi Strata Elite Card",
  "issuer": "Citi",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["premium_travel"],
  "annual_fee_usd": 595,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "citi_thankyou",

  "earning": [
    {"category": "hotels_cars_attractions_citi_travel", "rate_pts_per_dollar": 12, "cap_usd_per_year": null},
    {"category": "air_travel_citi_travel", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "restaurants_citi_nights_fri_sat_6pm_6am", "rate_pts_per_dollar": 6, "cap_usd_per_year": null, "notes": "6x dining only Fri/Sat 6PM-6AM ET"},
    {"category": "restaurants_other_times", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 80000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "estimated_value_usd": 1300,
    "notes": "Has hit higher elevated tiers via CardMatch"
  },

  "annual_credits": [
    {"name": "Citi Travel hotel credit", "value_usd": 300, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium", "notes": "2-night minimum"},
    {"name": "Splurge credit (choose 2 merchants)", "value_usd": 200, "type": "specific", "expiration": "annual", "ease_of_use": "medium"},
    {"name": "Blacklane car-service credit", "value_usd": 200, "type": "specific", "expiration": "split_h1_h2", "ease_of_use": "hard", "notes": "$100 H1 + $100 H2"},
    {"name": "Global Entry / TSA PreCheck credit", "value_usd": 120, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Priority Pass Select w/ 2 guests", "value_estimate_usd": 469, "category": "lounge_access"},
    {"name": "4 Admirals Club passes per calendar year", "value_estimate_usd": 240, "category": "lounge_access"},
    {"name": "Cell phone protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Trip protections", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "citi_thankyou",

  "issuer_rules": ["Citi 8/65, 2/65, 1/8", "TY family 24-month rule"],

  "best_for": ["citi_premium_traveler", "AA_loyalist_using_admirals_passes"],
  "synergies_with": ["citi_strata_premier", "citi_double_cash", "citi_custom_cash"],
  "competing_with_in_wallet": ["chase_sapphire_reserve", "amex_platinum", "capital_one_venture_x"],

  "breakeven_logic_notes": "AF $595 less $300 hotel less $200 Splurge less $200 Blacklane = -$105 if all credits captured. New entrant at the $595-$895 premium tier; cheapest path to TY transferable points + Admirals access.",

  "recently_changed": true,
  "recently_changed_date": "2025-07",
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.citi.com/credit-cards/citi-strata-elite-credit-card",
    "https://thepointsguy.com/credit-cards/reviews/citi-strata-elite-review/",
    "https://www.citigroup.com/global/news/press-release/2025/citi-launches-citi-strata-elite-credit-card"
  ]
}
```

## programs.json entry
See `citi_strata_premier.md` for citi_thankyou.

## issuer_rules.json entry
See `citi_strata_premier.md`.

## perks_dedup.json entries

```json
[
  {"perk": "priority_pass_w_2_guests", "card_ids": ["citi_strata_elite"], "value_if_unique_usd": 469, "value_if_duplicate_usd": 0},
  {"perk": "admirals_club_passes_4yr", "card_ids": ["citi_strata_elite"], "value_if_unique_usd": 240, "value_if_duplicate_usd": 0},
  {"perk": "global_entry_credit", "card_ids": ["citi_strata_elite"], "value_if_unique_usd": 120, "value_if_duplicate_usd": 0}
]
```

## destination_perks.json entries
See `citi_strata_premier.md` for AA hub footprint.

## RESEARCH_NOTES.md entries

- **Launched July 2025** as Citi's premium re-entry after Prestige sunset.
- **Citi Nights** dining bonus is unusual — 6x only Fri/Sat 6PM-6AM ET. Engine should weight conservatively for non-night-out users.
- **2 PP guests** is more generous than CSR (which has unlimited but post-2023 changes apply) and Cap One Venture X (which now requires $75k spend for free guests post-Feb-2026).
- TY family 24-month rule applies — cannot earn SUB if Strata Premier or Premier SUB received in last 24 months.
