# Amex Business Gold

`card_id`: amex_business_gold
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_business_gold",
  "name": "American Express Business Gold Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "business",
  "category": ["business", "mid_tier_travel"],
  "annual_fee_usd": 375,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amex_mr",

  "earning": [
    {"category": "top_2_categories_each_month", "rate_pts_per_dollar": 4, "cap_usd_per_year": 150000, "notes": "4x on the top 2 of 6 eligible categories per cycle, automatic; categories: airfare-direct, advertising, gas, restaurants, transit, US computer hardware/software/cloud. $150k combined cap on 4x"},
    {"category": "flights_prepaid_hotels_amex_travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "3x on prepaid hotels and flights via amextravel.com"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 70000,
    "spend_required_usd": 10000,
    "spend_window_months": 3,
    "estimated_value_usd": 1400,
    "notes": "Has hit 150k via CardMatch; standard 70k. Lifetime once-per-product."
  },

  "annual_credits": [
    {"name": "Walmart+ monthly credit", "value_usd": 155, "type": "specific", "expiration": "monthly", "ease_of_use": "easy", "notes": "$12.95/month covers full Walmart+"},
    {"name": "FedEx / Grubhub / Office supply credit", "value_usd": 240, "type": "specific", "expiration": "monthly", "ease_of_use": "medium", "notes": "$20/month combined; specific merchants"},
    {"name": "Hilton credit", "value_usd": 100, "type": "specific", "expiration": "annual", "ease_of_use": "hard", "notes": "Hilton Aspire-style credit; specific properties"}
  ],

  "ongoing_perks": [
    {"name": "Trip delay insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Cell phone protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Pay Over Time", "value_estimate_usd": null, "category": "financing"},
    {"name": "25% airfare points rebate when redeeming MR for flights via Amex Travel", "value_estimate_usd": null, "category": "rewards_flexibility", "notes": "Cap of 250k points rebated per calendar year"}
  ],

  "transfer_partners_inherited_from": "amex_mr",

  "issuer_rules": ["Amex once-per-lifetime SUB", "Amex 1-or-2-business-cards in 90 days informal"],

  "best_for": ["business_with_mixed_high_spend", "advertising_or_gas_or_dining_heavy_business"],
  "synergies_with": ["amex_blue_business_plus", "amex_business_platinum", "amex_platinum"],
  "competing_with_in_wallet": ["chase_ink_business_preferred", "capital_one_spark_miles"],

  "breakeven_logic_notes": "AF $375 less Walmart+ $155 less FedEx/Grubhub $240 = -$20 net AF if all credits captured. 4x top-2 auto-categorized makes this versatile but the per-category cap keeps high-spenders from runaway value. CIBP often beats Business Gold on raw points-per-dollar at lower AF.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-gold-card/"
  ]
}
```

## programs.json entry
See `amex_gold.md` for amex_mr.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
```json
[
  {
    "perk": "walmart_plus",
    "card_ids": ["amex_business_gold", "amex_platinum", "amex_business_platinum"],
    "value_if_unique_usd": 155,
    "value_if_duplicate_usd": 0,
    "notes": "One Walmart+ subscription per household; all cards crediting it stack only on the first card to bill."
  }
]
```

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Auto-categorization**: 4x on top 2 of 6 categories — no need to choose, system picks each cycle. Engine should weight expected value across the 6 buckets relative to user's business spend mix.
- **25% rebate**: When redeeming MR for flights through Amex Travel, 25% of points refunded up to 250k/yr. Effective 1.33cpp on flights via portal — competitive with CSP's 1.25cpp.
- **150k bonus history**: Has been the most aggressive Amex SUB in recent years. CardMatch periodically.
