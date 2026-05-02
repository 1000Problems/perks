# Amex Blue Cash Everyday

`card_id`: amex_blue_cash_everyday
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_blue_cash_everyday",
  "name": "American Express Blue Cash Everyday",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 2.7,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amex_cashback",

  "earning": [
    {"category": "us_supermarkets", "rate_pts_per_dollar": 3, "cap_usd_per_year": 6000, "notes": "3% on first $6k/yr"},
    {"category": "us_gas_stations", "rate_pts_per_dollar": 3, "cap_usd_per_year": 6000, "notes": "3% on first $6k/yr"},
    {"category": "us_online_retail", "rate_pts_per_dollar": 3, "cap_usd_per_year": 6000, "notes": "3% on first $6k/yr"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 2000,
    "spend_window_months": 6,
    "estimated_value_usd": 200,
    "notes": "Often $200 cash back format"
  },

  "annual_credits": [
    {"name": "Disney+ Bundle credit", "value_usd": 84, "type": "specific", "expiration": "monthly", "ease_of_use": "medium", "notes": "$7/month, requires auto-renewing Disney+ Bundle"},
    {"name": "Home Chef credit", "value_usd": 84, "type": "specific", "expiration": "monthly", "ease_of_use": "hard", "notes": "$15 in statement credits per qualifying delivery, capped"}
  ],

  "ongoing_perks": [
    {"name": "Purchase protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Return protection", "value_estimate_usd": null, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Amex once-per-lifetime SUB"],

  "best_for": ["no_AF_grocery_card", "us_online_retail_3pct"],
  "synergies_with": ["amex_blue_cash_preferred"],
  "competing_with_in_wallet": ["chase_freedom_unlimited", "discover_it_cash_back"],

  "breakeven_logic_notes": "No AF; positive value at any spend. 3x grocery beats 1.5x flat-rate up to the $6k cap. Better starting card than BCP for households under $4k/yr grocery spend.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.americanexpress.com/us/credit-cards/card/blue-cash-everyday/"
  ]
}
```

## programs.json entry
See `amex_blue_cash_preferred.md` for `amex_cashback`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **2.7% FX**: Domestic only.
- **US online retail 3%**: Distinct earning bucket — Amazon, Walmart.com, Target.com, etc. count. Useful for households moving spend online.
- **Same supermarket exclusions as BCP**: Walmart/Target/warehouse-club exclusion applies.
