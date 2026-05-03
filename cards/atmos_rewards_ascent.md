# Atmos Rewards Ascent Visa Signature

`card_id`: atmos_rewards_ascent
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "atmos_rewards_ascent",
  "name": "Atmos Rewards Ascent Visa Signature",
  "issuer": "Bank of America",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "alaska_atmos_rewards",

  "earning": [
    {"category": "alaska_hawaiian_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 50000,
    "spend_required_usd": 3000,
    "spend_window_months": 90,
    "estimated_value_usd": 750,
    "notes": "Verify current public offer"
  },

  "annual_credits": [
    {"name": "$99 Companion Fare (after $6k spend)", "signal_id": "airline_companion_cert", "value_usd": 250, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag (Alaska + Hawaiian, primary + 6 companions)", "signal_id": "free_checked_bag", "value_estimate_usd": 240, "category": "airline_perk"},
    {"name": "Preferred boarding", "signal_id": "priority_boarding", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "20% back on inflight purchases", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": "alaska_atmos_rewards",

  "issuer_rules": ["BoA 2/3/4", "BoA 7/12"],

  "best_for": ["alaska_hawaiian_loyalist_basic_tier", "PNW_traveler_via_SEA"],
  "synergies_with": ["atmos_rewards_summit"],
  "competing_with_in_wallet": ["alaska_airlines_visa"],

  "breakeven_logic_notes": "AF $95. Companion Fare from $99 after $6k spend; saves $200-500 on round trip. Same Atmos earning across personal cards.",

  "recently_changed": true,
  "recently_changed_date": "2025-08",
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.bankofamerica.com/credit-cards/products/atmos-rewards-ascent-visa-signature/",
    "https://thepointsguy.com/credit-cards/atmos-ascent-vs-atmos-summit/"
  ]
}
```

## programs.json entry
See `alaska_airlines_visa.md`.

## issuer_rules.json entry
See `boa_premium_rewards.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `alaska_airlines_visa.md`.

## RESEARCH_NOTES.md entries

- **Replacement for Alaska Visa Signature**. Existing Alaska Visa cardholders may product-change or retain legacy. Verify with applicant.
- Companion Fare gate moved to $6k spend threshold (vs prior anniversary auto-credit on Alaska Visa).
