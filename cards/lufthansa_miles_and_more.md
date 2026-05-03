# Lufthansa Miles & More World Elite Mastercard

`card_id`: lufthansa_miles_and_more
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "lufthansa_miles_and_more",
  "name": "Lufthansa Miles & More World Elite Mastercard",
  "issuer": "Barclays",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 89,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "lufthansa_miles_and_more",

  "earning": [
    {"category": "lufthansa_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 50000, "spend_required_usd": 3000, "spend_window_months": 90, "estimated_value_usd": 700},

  "annual_credits": [
    {"name": "Companion Ticket from $99 (after $30k spend)", "value_usd": null, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Trip cancellation/interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["lufthansa_loyalist", "Star_Alliance_european_traveler"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $89 (Y1 waived). Companion Ticket at $30k spend is the differentiator.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cards.barclaycardus.com/banking/cards/lufthansa-miles-and-more-world-elite-mastercard/"]
}
```

## programs.json entry

```json
{
  "id": "lufthansa_miles_and_more",
  "name": "Lufthansa Miles & More",
  "type": "cobrand_airline",
  "issuer": "Lufthansa",
  "earning_cards": ["lufthansa_miles_and_more"],
  "fixed_redemption_cpp": 1.5,
  "median_redemption_cpp": 1.2,
  "median_cpp_source_url": "estimated",
  "median_cpp_as_of": "2026-05-01",
  "transfer_partners_notes": "No major US transferable currency partners.",
  "sweet_spots": [
    {"description": "Star Alliance partner award flights", "value_estimate_usd": "~2-3cpp", "source": null}
  ],
  "sources": ["https://www.miles-and-more.com/"]
}
```

## issuer_rules / perks_dedup / destination_perks
See `jetblue_plus.md` for Barclays.

## RESEARCH_NOTES.md entries
- Companion Ticket on Lufthansa biz to Europe is potentially $3,000-5,000 in cash equivalent.
