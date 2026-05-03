# Wyndham Rewards Earner Plus

`card_id`: wyndham_earner_plus
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "wyndham_earner_plus",
  "name": "Wyndham Rewards Earner Plus Card",
  "issuer": "Barclays",
  "network": "Visa",
  "card_type": "personal",
  "category": ["hotel_cobrand"],
  "annual_fee_usd": 75,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "wyndham_rewards",

  "earning": [
    {"category": "wyndham_hotels_and_gas", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "dining_grocery_utilities", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 60000,
    "spend_required_usd": 1000,
    "spend_window_months": 90,
    "estimated_value_usd": 600
  },

  "annual_credits": [
    {"name": "7,500 anniversary points", "value_usd": 75, "type": "rewards", "expiration": "annual_anniversary", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "Wyndham Platinum status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "5,000-pt nightly Vacasa rentals available", "value_estimate_usd": null, "category": "redemption_value"}
  ],

  "transfer_partners_inherited_from": "wyndham_rewards",
  "transfer_partners_inherited_from_notes": "Receives transfers from Capital One Miles (1:1) and Citi TY (1:1).",

  "issuer_rules": ["Barclays 6/24 informal rule"],

  "best_for": ["Vacasa_rental_users", "budget_hotel_travelers"],
  "synergies_with": ["capital_one_venture_x"],
  "competing_with_in_wallet": ["choice_privileges_visa"],

  "breakeven_logic_notes": "AF $75 less 7.5k anniv ($75) = -$0. Vacasa 7.5k-pt rentals deliver outsized value at $200+/night equivalent.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cards.barclaycardus.com/cards/wyndham-rewards-earner-plus-card/"]
}
```

## programs.json entry (wyndham_rewards)

```json
{
  "id": "wyndham_rewards",
  "name": "Wyndham Rewards",
  "type": "cobrand_hotel",
  "issuer": "Wyndham",
  "earning_cards": ["wyndham_earner", "wyndham_earner_plus", "wyndham_earner_business"],
  "fixed_redemption_cpp": 1.1,
  "median_redemption_cpp": 0.65,
  "median_cpp_source_url": "https://thepointsguy.com/loyalty-programs/monthly-valuations/",
  "median_cpp_as_of": "2026-05-01",
  "transfer_partners_notes": "Receives from Capital One Miles, Citi TY at 1:1.",
  "sweet_spots": [
    {"description": "Vacasa vacation rentals at 7,500-15,000 pts/night", "value_estimate_usd": "~3-5cpp at $200-400 cash equivalent", "source": null},
    {"description": "Caesars status match via Wyndham Diamond", "value_estimate_usd": null, "source": null}
  ],
  "sources": ["https://www.wyndhamhotels.com/wyndham-rewards"]
}
```

## issuer_rules.json entry
See `jetblue_plus.md` for Barclays.

## perks_dedup.json entries
None unique.

## destination_perks.json entries

```json
{
  "vacation_rentals": {
    "hotel_chains_strong": ["Vacasa via Wyndham"],
    "relevant_cards": ["wyndham_earner_plus", "capital_one_venture_x"],
    "notes": "Vacasa 7.5k-15k pt rentals = top sweet spot for vacation rental properties via points."
  }
}
```

## RESEARCH_NOTES.md entries
- Wyndham Diamond status (top tier) attainable in ~$15k spend; entitles to Caesars Diamond status match.
