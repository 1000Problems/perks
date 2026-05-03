# Amex Blue Cash Preferred

`card_id`: amex_blue_cash_preferred
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_blue_cash_preferred",
  "name": "American Express Blue Cash Preferred",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["tiered_cashback", "grocery_streaming"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 2.7,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amex_cashback",

  "earning": [
    {"category": "us_supermarkets", "rate_pts_per_dollar": 6, "cap_usd_per_year": 6000, "notes": "6% on first $6k/yr in US supermarkets, then 1%"},
    {"category": "select_streaming", "rate_pts_per_dollar": 6, "cap_usd_per_year": null, "notes": "Includes Netflix, Spotify, Disney+, Hulu, HBO, etc."},
    {"category": "transit", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Includes ride-share, taxis, parking, tolls, transit"},
    {"category": "us_gas_stations", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 25000,
    "spend_required_usd": 3000,
    "spend_window_months": 6,
    "estimated_value_usd": 250,
    "notes": "Often $250 cash back; sometimes structured as 'earn $X back' format"
  },

  "annual_credits": [
    {"name": "Disney+ Bundle credit", "signal_id": "streaming_credit", "value_usd": 84, "type": "specific", "expiration": "monthly", "ease_of_use": "medium", "notes": "$7/month, requires auto-renewing Disney+ Bundle subscription"}
  ],

  "ongoing_perks": [
    {"name": "Return protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Purchase protection", "signal_id": "purchase_protection", "value_estimate_usd": null, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": null,
  "transfer_partners_inherited_from_notes": "Cash back only. Does not earn MR.",

  "issuer_rules": ["Amex once-per-lifetime SUB"],

  "best_for": ["us_supermarket_heavy_user", "streaming_subscriptions", "household_grocery_$500_per_month_plus"],
  "synergies_with": ["amex_blue_cash_everyday", "amex_platinum"],
  "competing_with_in_wallet": ["chase_freedom_flex_quarterly_grocery", "citi_custom_cash_grocery"],

  "breakeven_logic_notes": "AF $95 (waived Y1). Breakeven at $1,584/yr in US supermarkets at 6% vs 0% baseline; $2k/yr at 6% covers AF outright. For households spending $6k/yr in groceries: $360 cash back annual vs $95 AF = $265 net. Heavy grocery cards rarely worth it for singles spending <$2k/yr.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/",
    "https://thepointsguy.com/credit-cards/reviews/amex-blue-cash-preferred-review/"
  ]
}
```

## programs.json entry

```json
{
  "id": "amex_cashback",
  "name": "Amex cash back (Blue Cash family)",
  "type": "fixed_value",
  "issuer": "Amex",
  "earning_cards": ["amex_blue_cash_preferred", "amex_blue_cash_everyday", "amex_cash_magnet"],
  "fixed_redemption_cpp": 1.0,
  "portal_redemption_cpp": null,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.americanexpress.com/"]
}
```

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **2.7% FX fee**: Domestic only.
- **US supermarket exclusions**: Excludes Walmart, Target, Costco, Sam's Club, BJ's, warehouse clubs, specialty/convenience stores. Major exclusion — a household that shops at Whole Foods, Trader Joe's, Kroger, Safeway, regional chains is the target.
- **Disney+ Bundle**: Requires explicit auto-renewing subscription billed to BCP; users with Disney+ via other means get nothing.
- **AF waiver**: First-year waiver is a SUB-equivalent worth $95 explicitly.
