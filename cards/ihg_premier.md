# Chase IHG One Rewards Premier

`card_id`: ihg_premier
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "ihg_premier",
  "name": "Chase IHG One Rewards Premier Card",
  "issuer": "Chase",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["hotel_cobrand"],
  "annual_fee_usd": 99,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "ihg_one_rewards",

  "earning": [
    {"category": "ihg_hotels", "rate_pts_per_dollar": 10, "cap_usd_per_year": null, "notes": "Plus elite bonus stacking"},
    {"category": "dining_gas_select_streaming", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 3, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 140000,
    "spend_required_usd": 3000,
    "spend_window_months": 3,
    "estimated_value_usd": 700
  },

  "annual_credits": [
    {"name": "Free Night Award (40,000 pts)", "value_usd": 200, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy", "notes": "Top-up with points to use at any IHG property"},
    {"name": "Global Entry / TSA PreCheck", "value_usd": 100, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "IHG Platinum Elite status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "4th-night-free on award stays", "value_estimate_usd": null, "category": "rewards_modifier"}
  ],

  "transfer_partners_inherited_from": "ihg_one_rewards",

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["IHG_loyalist_with_Free_Night_redemption", "Holiday_Inn_Express_business_travelers"],
  "synergies_with": [],
  "competing_with_in_wallet": ["ihg_traveler", "ihg_business"],

  "breakeven_logic_notes": "AF $99 less Free Night ($200+) = -$100. Top-up flexibility makes IHG Free Night more flexible than Marriott's tiered structure.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/ihg-one-rewards-premier-credit-card"]
}
```

## programs.json entry (ihg_one_rewards)

```json
{
  "id": "ihg_one_rewards",
  "name": "IHG One Rewards",
  "type": "cobrand_hotel",
  "issuer": "IHG",
  "earning_cards": ["ihg_premier", "ihg_traveler", "ihg_business"],
  "fixed_redemption_cpp": 0.6,
  "transfer_partners_notes": "Receives transfers from Chase UR (1:1) and Bilt (1:1).",
  "sweet_spots": [
    {"description": "4th-night-free for Premier holders + reasonable point pricing", "value_estimate_usd": "~+25%", "source": null}
  ],
  "sources": ["https://www.ihg.com/onerewards/"]
}
```

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 4th-night-free + Free Night cert combine to deliver 5 nights for the cost of 3 nights of points.
