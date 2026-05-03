# Chase Ink Business Preferred

`card_id`: chase_ink_business_preferred
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "chase_ink_business_preferred",
  "name": "Chase Ink Business Preferred",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "business",
  "category": ["business", "mid_tier_travel", "transferable_points"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "chase_ur",

  "earning": [
    {"category": "travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "cap_combined_usd": 150000, "notes": "3x on first $150k combined per year across travel/shipping/internet-cable-phone/social-and-search ads"},
    {"category": "shipping", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "cap_combined_usd": 150000},
    {"category": "internet_cable_phone", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "cap_combined_usd": 150000},
    {"category": "advertising_social_search", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "cap_combined_usd": 150000, "notes": "Facebook, Google, etc."},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 90000,
    "spend_required_usd": 8000,
    "spend_window_months": 3,
    "estimated_value_usd": 1800,
    "notes": "Has hit 100k-120k in past elevated periods. Highest reliable points-per-dollar SUB on a sub-$100 AF card."
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Cell phone protection", "signal_id": "cell_phone_protection", "value_estimate_usd": 100, "category": "purchase_protection", "notes": "Up to $1,000/claim, 3 claims/12mo, $100 deductible"},
    {"name": "Trip cancellation/interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "$5,000/person, $10,000/trip"},
    {"name": "Primary auto rental CDW for business use", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Purchase protection", "signal_id": "purchase_protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Extended warranty", "signal_id": "extended_warranty", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "1.25cpp redemption via Chase Travel", "value_estimate_usd": null, "category": "rewards_flexibility"},
    {"name": "1:1 transfer to UR partners", "value_estimate_usd": null, "category": "rewards_flexibility"}
  ],

  "transfer_partners_inherited_from": "chase_ur",

  "issuer_rules": [
    "Chase 5/24 (business apps still pull personal credit)",
    "Ink approval cadence ~every 90 days for established cardholders (informal)",
    "Once-bonus-per-card-product, no Ink-family lockout"
  ],

  "best_for": ["small_business_with_ad_spend", "transferable_points_at_$95_AF", "Chase_ecosystem_anchor"],
  "synergies_with": ["chase_sapphire_preferred", "chase_sapphire_reserve", "chase_ink_business_cash", "chase_ink_business_unlimited"],
  "competing_with_in_wallet": ["amex_business_gold", "amex_business_platinum", "capital_one_spark_miles"],

  "breakeven_logic_notes": "AF $95. SUB alone repays AF for 18+ years at face value. Even modest $5k/yr spend in 3x category at 2cpp valuation = $300+/yr beating AF. The Ink-Sapphire stack is the most efficient transferable-points wallet for businesses under $150k bonus-category spend.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://creditcards.chase.com/business-credit-cards/ink/business-preferred",
    "https://thepointsguy.com/credit-cards/chase-ink-business-preferred-review/"
  ]
}
```

## programs.json entry

See `chase_sapphire_preferred.md` for chase_ur. Ink Preferred is in earning_cards and provides 1.25cpp portal + transfer access.

## issuer_rules.json entry

See `chase_sapphire_preferred.md`. Specific to business: Chase business cards do NOT report to personal credit bureaus (utilization is invisible to FICO), but the application itself triggers a personal hard pull.

## perks_dedup.json entries

```json
[
  {
    "perk": "cell_phone_protection",
    "card_ids": ["chase_ink_business_preferred"],
    "value_if_unique_usd": 80,
    "value_if_duplicate_usd": 0,
    "notes": "$100 deductible, $1,000/claim, 3 claims/12mo. Better than CFF on per-claim limit."
  },
  {
    "perk": "primary_cdw_business",
    "card_ids": ["chase_ink_business_preferred"],
    "value_if_unique_usd": "use_based",
    "value_if_duplicate_usd": "use_based",
    "notes": "Primary CDW when rental is for business purposes."
  }
]
```

## destination_perks.json entries

Inherits Hyatt sweet spot via chase_ur. See chase_sapphire_preferred.md.

## RESEARCH_NOTES.md entries

- **150k combined cap**: The 3x cap is across all four categories combined, not per-category. Heavy ad-spend businesses can blow through this quickly; engine should flag for users self-reporting >$150k on FB/Google ads.
- **No FX fee**: Visa Business; works internationally.
- **5/24**: Ink applications are subject to 5/24 even though the card does not count toward 5/24 once approved.
- **SUB volatility**: Has hit 120k pts publicly. 90k is the long-running standard.
