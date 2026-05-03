# Bilt Obsidian

`card_id`: bilt_obsidian
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "bilt_obsidian",
  "name": "Bilt Obsidian Card",
  "issuer": "Bilt (issued by Wells Fargo)",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["mid_tier_travel", "rent_rewards"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "bilt_rewards",

  "earning": [
    {"category": "rent", "rate_pts_per_dollar": 1, "cap_pts_per_year": 200000, "notes": "Higher cap than Bilt Blue"},
    {"category": "user_choice_dining_or_grocery", "rate_pts_per_dollar": 3, "cap_usd_per_year": 25000, "notes": "Choose one of dining/groceries; 3x up to $25k/yr"},
    {"category": "travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "earning_modifier_rent_day": "Doubled rates on Rent Day (1st of month) up to higher cap than Blue",

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "No traditional SUB"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Cell phone protection", "signal_id": "cell_phone_protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Trip cancellation/interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "bilt_rewards",

  "issuer_rules": ["Bilt 5-transactions-per-cycle", "Housing payment scaling"],

  "best_for": ["renters_paying_high_rent_dining_grocery_focus"],
  "synergies_with": ["bilt_blue", "bilt_palladium"],
  "competing_with_in_wallet": ["chase_sapphire_preferred", "amex_gold"],

  "breakeven_logic_notes": "AF $95. Renter paying $2k/mo + $400/mo grocery: ~24k rent pts + ~14.4k grocery pts = ~38k pts/yr at 2cpp = $760. Strong value but only meaningful for renters with high non-housing dining/grocery spend.",

  "recently_changed": true,
  "recently_changed_date": "2026-01",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.cnbc.com/select/bilt-mastercard-new-credit-cards-rewards/"]
}
```

## programs.json entry
See `bilt_blue.md`.

## issuer_rules.json entry
See `bilt_blue.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `bilt_blue.md`.

## RESEARCH_NOTES.md entries

- **Bilt 2.0 mid-tier**: Sits between Blue (no AF) and Palladium ($495). Only worthwhile for high-rent renters.
- Verify exact Rent Day multiplier caps; details emerging post-launch.
