# Amex Blue Business Plus

`card_id`: amex_blue_business_plus
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_blue_business_plus",
  "name": "Amex Blue Business Plus",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "business",
  "category": ["business", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 2.7,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amex_mr",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": 50000, "notes": "2x on first $50k/yr, then 1x"}
  ],

  "signup_bonus": {
    "amount_pts": 15000,
    "spend_required_usd": 3000,
    "spend_window_months": 3,
    "estimated_value_usd": 300
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "amex_mr",

  "issuer_rules": ["Amex once-per-lifetime SUB", "Amex business 90-day velocity informal"],

  "best_for": ["business_non_bonus_2x_MR_at_no_AF", "MR_currency_anchor_no_AF"],
  "synergies_with": ["amex_business_gold", "amex_business_platinum", "amex_gold", "amex_platinum"],
  "competing_with_in_wallet": ["chase_ink_business_unlimited"],

  "breakeven_logic_notes": "No AF. 2x flat MR up to $50k cap = 100k MR/yr ceiling. Best no-AF transferable points earner for business spend.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/amex-blue-business-plus/"]
}
```

## programs.json entry
See `amex_gold.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **2.7% FX**: Domestic only.
- **Cap at $50k**: After cap, drops to 1x — engine should warn high-spend users.
- BBP is the most underrated business card. Perfect catchall feeder for MR ecosystem.
