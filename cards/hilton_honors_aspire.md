# Amex Hilton Honors Aspire

`card_id`: hilton_honors_aspire
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "hilton_honors_aspire",
  "name": "Amex Hilton Honors Aspire Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["hotel_cobrand", "premium_travel"],
  "annual_fee_usd": 550,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "hilton_honors",

  "earning": [
    {"category": "hilton_purchases", "rate_pts_per_dollar": 14, "cap_usd_per_year": null},
    {"category": "flights_amex_travel_or_direct", "rate_pts_per_dollar": 7, "cap_usd_per_year": null},
    {"category": "car_rentals_amex_travel_or_direct", "rate_pts_per_dollar": 7, "cap_usd_per_year": null},
    {"category": "us_dining", "rate_pts_per_dollar": 7, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 3, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 175000,
    "spend_required_usd": 6000,
    "spend_window_months": 6,
    "estimated_value_usd": 875
  },

  "annual_credits": [
    {"name": "Hilton Resort credit", "signal_id": "hotel_credit", "value_usd": 400, "type": "specific", "expiration": "split_h1_h2", "ease_of_use": "medium", "notes": "$200 H1 + $200 H2"},
    {"name": "Hilton Free Night Reward (no category cap)", "value_usd": 800, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy", "notes": "Use anywhere in Hilton portfolio incl. Waldorf Astoria, Conrad — best free-night cert in industry"},
    {"name": "Second Free Night after $30k spend", "value_usd": 800, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"},
    {"name": "Flight credit", "value_usd": 200, "type": "specific", "expiration": "annual", "ease_of_use": "medium"},
    {"name": "Clear+ credit", "signal_id": "clear_credit", "value_usd": null, "type": "specific", "expiration": "annual", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "Hilton Diamond status", "value_estimate_usd": null, "category": "hotel_status", "notes": "Highest published Hilton status: 100% room bonus, suite upgrades, exec lounge access, breakfast"},
    {"name": "Priority Pass Select", "signal_id": "lounge_access", "value_estimate_usd": 469, "category": "lounge_access"},
    {"name": "Trip protections", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Amex once-per-lifetime SUB"],

  "best_for": ["Hilton_loyalist_at_premium_properties_using_Free_Night"],
  "synergies_with": ["hilton_honors_business", "hilton_honors_surpass", "amex_platinum"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $550 less $400 resort + $800 Free Night + $200 flight = -$850 if used in full. Best-in-class hotel co-brand credit value.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/hilton-honors-aspire-amex/"]
}
```

## programs.json entry
See `hilton_honors_surpass.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries

```json
[
  {
    "perk": "hilton_diamond",
    "card_ids": ["hilton_honors_aspire"],
    "value_if_unique_usd": null,
    "value_if_duplicate_usd": 0
  }
]
```

## destination_perks.json entries
See `hilton_honors_surpass.md`.

## RESEARCH_NOTES.md entries
- Highest-value hotel co-brand by face value of credits.
- Free Night cert without category cap is unique — most other cert programs have limits.
