# BoA Premium Rewards Elite

`card_id`: boa_premium_rewards_elite
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "boa_premium_rewards_elite",
  "name": "Bank of America Premium Rewards Elite",
  "issuer": "Bank of America",
  "network": "Visa Infinite",
  "card_type": "personal",
  "category": ["premium_travel"],
  "annual_fee_usd": 550,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "boa_points",

  "earning": [
    {"category": "travel_dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "earning_modifier_preferred_rewards": "Platinum Honors 75% bonus = 3.5x travel/dining, 2.625x flat — highest unrestricted earning at PH tier.",

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 5000,
    "spend_window_months": 90,
    "estimated_value_usd": 750
  },

  "annual_credits": [
    {"name": "Airline incidental credit", "signal_id": "airline_incidental_credit", "value_usd": 300, "type": "specific", "expiration": "calendar_year", "ease_of_use": "medium"},
    {"name": "Lifestyle credit", "value_usd": 150, "type": "specific", "expiration": "calendar_year", "ease_of_use": "medium", "notes": "Streaming, fitness, food delivery, ride-share"},
    {"name": "Global Entry / TSA PreCheck", "signal_id": "global_entry_tsa", "value_usd": 100, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Priority Pass Select", "signal_id": "lounge_access", "value_estimate_usd": 469, "category": "lounge_access"},
    {"name": "Trip cancellation/interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Auto rental CDW (primary)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Cell phone protection", "signal_id": "cell_phone_protection", "value_estimate_usd": null, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["BoA 2/3/4", "BoA 7/12", "Preferred Rewards bonus"],

  "best_for": ["BoA_PH_tier_holder_premium_traveler", "$100k_assets_at_BoA_Merrill"],
  "synergies_with": ["boa_premium_rewards", "boa_customized_cash"],
  "competing_with_in_wallet": ["chase_sapphire_reserve", "amex_platinum", "capital_one_venture_x"],

  "breakeven_logic_notes": "AF $550 less $300 airline less $150 lifestyle = $100 net. With PH 75% bonus, 3.5x travel/dining + 2.625x flat = top no-cap unrestricted earning at PH tier. Justified for BoA-relationship users.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/premium-rewards-elite-credit-card/"]
}
```

## programs.json entry
See `boa_premium_rewards.md`.

## issuer_rules.json entry
See `boa_premium_rewards.md`.

## perks_dedup.json entries
See `boa_premium_rewards.md`.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Best BoA card for PH-tier customers. At $100k+ assets, beats Premium Rewards on earning efficiency despite higher AF.
