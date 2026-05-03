# Chase United Explorer

`card_id`: united_explorer
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "united_explorer",
  "name": "Chase United Explorer Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "united_mileageplus",

  "earning": [
    {"category": "united_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "hotel_purchases_via_united", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 50000,
    "spend_required_usd": 3000,
    "spend_window_months": 3,
    "estimated_value_usd": 700
  },

  "annual_credits": [
    {"name": "Global Entry / TSA PreCheck", "signal_id": "global_entry_tsa", "value_usd": 100, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"},
    {"name": "United Hotels $100 credit (newer benefit)", "value_usd": 100, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag (primary + 1 companion)", "signal_id": "free_checked_bag", "value_estimate_usd": 200, "category": "airline_perk"},
    {"name": "Priority boarding (Group 2)", "signal_id": "priority_boarding", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "2 United Club one-time passes per year", "signal_id": "lounge_access", "value_estimate_usd": 100, "category": "lounge_access"},
    {"name": "Trip cancellation/interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Primary auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "25% back on inflight purchases", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["entry_United_loyalist", "couple_flying_United_with_bags"],
  "synergies_with": ["united_quest", "chase_sapphire_preferred"],
  "competing_with_in_wallet": ["united_quest"],

  "breakeven_logic_notes": "AF $95 (Y1 waived). Free bag covers ~$200/yr value at moderate United usage. Cheaper alternative to Quest for low-frequency United flyers.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/united/explorer"]
}
```

## programs.json entry
See `united_quest.md`.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
See `united_quest.md` for free_checked_bag_united.

## destination_perks.json entries
See `united_quest.md`.

## RESEARCH_NOTES.md entries
- Lowest entry to United bag/boarding perks.
