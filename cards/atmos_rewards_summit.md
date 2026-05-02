# Atmos Rewards Summit Visa Infinite

`card_id`: atmos_rewards_summit
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "atmos_rewards_summit",
  "name": "Atmos Rewards Summit Visa Infinite",
  "issuer": "Bank of America",
  "network": "Visa Infinite",
  "card_type": "personal",
  "category": ["airline_cobrand", "premium_travel"],
  "annual_fee_usd": 395,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "alaska_atmos_rewards",

  "earning": [
    {"category": "alaska_hawaiian_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": null, "cap_usd_per_year": null, "notes": "Verify base earning"}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "Has launched with elevated public offers. Verify before recommending."
  },

  "annual_credits": [
    {"name": "25,000-point Global Companion Award (anniversary)", "value_usd": 500, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium"},
    {"name": "100,000-point Global Companion Award after $60k spend", "value_usd": 1500, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag (Alaska + Hawaiian)", "value_estimate_usd": 240, "category": "airline_perk"},
    {"name": "Preferred boarding", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Lounge access (verify scope — likely Alaska Lounges + select partners)", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Trip protections", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "alaska_atmos_rewards",

  "issuer_rules": ["BoA 2/3/4", "BoA 7/12"],

  "best_for": ["alaska_hawaiian_loyalist_at_premium_tier", "PNW_to_Asia_premium_traveler"],
  "synergies_with": ["atmos_rewards_ascent", "alaska_airlines_visa"],
  "competing_with_in_wallet": ["amex_platinum", "chase_sapphire_reserve"],

  "breakeven_logic_notes": "AF $395. 25k Global Companion Award alone covers AF for users using it on int'l business class. Premium positioning.",

  "recently_changed": true,
  "recently_changed_date": "2025-08",
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.bankofamerica.com/credit-cards/products/atmos-rewards-summit-visa-infinite/",
    "https://news.alaskaair.com/loyalty/alaska-airlines-and-bank-of-america-present-a-new-premium-credit-card/",
    "https://onemileatatime.com/reviews/credit-cards/bank-of-america/atmos-rewards-summit-card/"
  ]
}
```

## programs.json entry
See `alaska_airlines_visa.md` for alaska_atmos_rewards.

## issuer_rules.json entry
See `boa_premium_rewards.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `alaska_airlines_visa.md` for PNW/Hawaii/Asia routes.

## RESEARCH_NOTES.md entries

- **New Aug 2025 launch** post-Hawaiian merger.
- Replaces premium-tier Alaska Visa Signature. Existing Alaska Visa holders likely product-changed or retained legacy structure.
- Global Companion Award uses points (not cash) — engine should value at marginal point cost (typically ~$300-700 of cash equivalent).
