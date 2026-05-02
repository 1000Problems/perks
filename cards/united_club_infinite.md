# Chase United Club Infinite

`card_id`: united_club_infinite
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "united_club_infinite",
  "name": "Chase United Club Infinite Card",
  "issuer": "Chase",
  "network": "Visa Infinite",
  "card_type": "personal",
  "category": ["airline_cobrand", "premium_travel"],
  "annual_fee_usd": 695,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "united_mileageplus",

  "earning": [
    {"category": "united_purchases", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "all_other_travel", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 90000,
    "spend_required_usd": 5000,
    "spend_window_months": 3,
    "estimated_value_usd": 1100
  },

  "annual_credits": [
    {"name": "United Travel Bank credit", "value_usd": null, "type": "specific", "expiration": "annual", "ease_of_use": "medium"},
    {"name": "Global Entry / TSA PreCheck", "value_usd": 100, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"},
    {"name": "$100 Avis/Budget credit (recent addition)", "value_usd": 100, "type": "specific", "expiration": "annual", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "United Club lounge membership", "value_estimate_usd": 750, "category": "lounge_access", "notes": "Standalone membership ~$750/yr"},
    {"name": "Free first AND second checked bag (primary + companion)", "value_estimate_usd": 480, "category": "airline_perk"},
    {"name": "Premier Access (priority boarding/check-in/security)", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "25% back on inflight purchases", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Hyatt Discoverist status (in some periods)", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "IHG Platinum Elite", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "Avis President's Club / Hertz Five Star", "value_estimate_usd": null, "category": "rental_status"},
    {"name": "Trip cancellation/interruption / primary CDW", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Cell phone protection", "value_estimate_usd": null, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["United_loyalist_with_United_Club_use", "frequent_business_traveler_through_United_hubs"],
  "synergies_with": ["chase_sapphire_reserve", "chase_sapphire_preferred"],
  "competing_with_in_wallet": ["united_quest"],

  "breakeven_logic_notes": "AF $695. United Club membership alone (~$750/yr standalone) plus 2 free checked bags makes this a value play for users who would buy United Club anyway.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/united/clubinfinite"]
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
- Top United co-brand. Justified primarily for United Club users.
