# Chase United Quest

`card_id`: united_quest
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "united_quest",
  "name": "Chase United Quest Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["airline_cobrand", "mid_tier_travel"],
  "annual_fee_usd": 250,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "united_mileageplus",

  "earning": [
    {"category": "united_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "select_streaming", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "all_other_travel", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 70000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "estimated_value_usd": 900,
    "notes": "Often paired with 500 PQP"
  },

  "annual_credits": [
    {"name": "United Travel credit", "signal_id": "travel_credit", "value_usd": 200, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy", "notes": "Auto-applied to first $200 in United purchases"},
    {"name": "Up to $150 in JSX or Avelo credit (newer)", "value_usd": 150, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "hard"},
    {"name": "Anniversary award flight credit", "value_usd": null, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium", "notes": "5,000-mile rebate on first award flight redemption per year, up to 10k"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag (primary + 1 companion)", "signal_id": "free_checked_bag", "value_estimate_usd": 240, "category": "airline_perk", "notes": "Saves $40 each way x 2 people roundtrip = ~$160 per trip; ~$240/yr if used 1.5 times"},
    {"name": "Priority boarding (Group 2)", "signal_id": "priority_boarding", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "25% back as statement credit on inflight purchases", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Trip cancellation/interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Primary auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Cell phone protection", "signal_id": "cell_phone_protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Hyatt $50 credit (some periods)", "value_estimate_usd": null, "category": "lifestyle"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["united_loyalist_with_2x_award_flights_per_year", "free_bag_for_couple"],
  "synergies_with": ["chase_sapphire_preferred", "chase_sapphire_reserve", "united_club_infinite"],
  "competing_with_in_wallet": ["united_explorer", "united_club_infinite"],

  "breakeven_logic_notes": "AF $250 less $200 United credit (easy) = $50 net AF. Free checked bag for 2 + 5k-mile rebate likely covers AF if user flies United 2x/yr.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/united/quest"]
}
```

## programs.json entry (united_mileageplus)

```json
{
  "id": "united_mileageplus",
  "name": "United MileagePlus",
  "type": "cobrand_airline",
  "issuer": "United Airlines",
  "earning_cards": ["united_explorer", "united_quest", "united_club_infinite", "united_gateway", "united_business"],
  "fixed_redemption_cpp": 1.0,
  "median_redemption_cpp": 1.35,
  "median_cpp_source_url": "https://thepointsguy.com/loyalty-programs/monthly-valuations/",
  "median_cpp_as_of": "2026-05-01",
  "transfer_partners": [],
  "transfer_partners_notes": "Receives transfers from Chase UR, Bilt, Marriott Bonvoy",
  "sweet_spots": [
    {"description": "Star Alliance partner award flights via Excursionist Perk (free segment)", "value_estimate_usd": "~3-5cpp", "source": null}
  ],
  "sources": ["https://www.united.com/mileageplus/"]
}
```

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries

```json
[
  {
    "perk": "free_checked_bag_united",
    "card_ids": ["united_quest", "united_explorer", "united_club_infinite"],
    "value_if_unique_usd": 240,
    "value_if_duplicate_usd": 0,
    "notes": "All three United cards offer same checked bag benefit. Holding multiple is redundant for the bag perk."
  }
]
```

## destination_perks.json entries

```json
{
  "united_hubs": {
    "airline_routes_strong": ["United at IAH/EWR/ORD/DEN/SFO/IAD/LAX"],
    "relevant_cards": ["united_quest", "united_club_infinite", "united_explorer"],
    "notes": "United co-brands materially valuable mainly for hub-based travelers."
  }
}
```

## RESEARCH_NOTES.md entries
- Mid-tier United co-brand best for couples flying 2-3 United trips/yr.
- 5k-mile award rebate is unusual and underweighted in many comparisons.
