# Chase World of Hyatt Business

`card_id`: world_of_hyatt_business
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "world_of_hyatt_business",
  "name": "Chase World of Hyatt Business Credit Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "business",
  "category": ["business", "hotel_cobrand"],
  "annual_fee_usd": 199,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "hyatt_world_of_hyatt",

  "earning": [
    {"category": "hyatt_purchases", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "top_2_user_choice_categories_each_quarter", "rate_pts_per_dollar": 2, "cap_combined_usd_per_year": 50000, "notes": "Choose 2 from: dining, airline, car rental, local transit, gas, utilities, internet/cable/phone, social/search ads, shipping. 2x on first $50k combined."},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 7500,
    "spend_window_months": 6,
    "estimated_value_usd": 1500
  },

  "annual_credits": [
    {"name": "$100 Hyatt credit", "value_usd": 100, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy"},
    {"name": "5 elite-night credits per year", "value_estimate_usd": null, "category": "elite_status_acceleration"},
    {"name": "10% Hyatt point rebate up to 200k pts/yr after $50k spend", "value_estimate_usd": null, "category": "rewards_modifier"}
  ],

  "ongoing_perks": [
    {"name": "Hyatt Discoverist status", "signal_id": "hotel_status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "Free employee cards", "value_estimate_usd": null, "category": "business_admin"}
  ],

  "transfer_partners_inherited_from": "hyatt_world_of_hyatt",

  "issuer_rules": ["Chase 5/24 (business apps still pull personal credit)"],

  "best_for": ["business_with_dining_or_advertising_spend_who_value_Hyatt"],
  "synergies_with": ["world_of_hyatt", "chase_sapphire_preferred"],
  "competing_with_in_wallet": ["chase_ink_business_preferred"],

  "breakeven_logic_notes": "AF $199 less $100 Hyatt credit = $99 net. 4x Hyatt and uncapped non-bonus delivers Hyatt loyalists ~+30% on point earning vs IBP.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/world-of-hyatt-business"]
}
```

## programs.json entry
See `world_of_hyatt.md`.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `world_of_hyatt.md`.

## RESEARCH_NOTES.md entries
- Top business-side hotel co-brand for transferable-equivalent points value via Hyatt's award chart.
