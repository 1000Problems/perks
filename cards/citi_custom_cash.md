# Citi Custom Cash

`card_id`: citi_custom_cash
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_custom_cash",
  "name": "Citi Custom Cash Card",
  "issuer": "Citi",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "citi_thankyou",
  "currency_earned_notes": "Cash back; converts to TY points 1:1 if user holds Strata Premier",

  "earning": [
    {"category": "top_eligible_category_each_cycle", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "cap_per_cycle_usd": 500, "notes": "Auto-detects top spend category each billing cycle from 10 eligible categories: restaurants, gas, grocery, select travel, transit, drugstores, home improvement, fitness clubs, live entertainment, streaming. 5% on first $500/cycle, then 1%."},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 1500,
    "spend_window_months": 6,
    "estimated_value_usd": 200
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "citi_thankyou",
  "transfer_partners_inherited_from_notes": "Only with paired Strata Premier",

  "issuer_rules": [
    "Citi 8/65, 2/65, 1/8",
    "Citi ThankYou family 24-month rule"
  ],

  "best_for": ["one_category_5_pct_per_month", "Costco_via_Mastercard_alt", "Strata_Premier_pair_for_5x_TY"],
  "synergies_with": ["citi_strata_premier", "citi_double_cash"],
  "competing_with_in_wallet": ["chase_freedom_flex", "us_bank_cash_plus"],

  "breakeven_logic_notes": "No AF; $500/cycle 5% cap = $25/cycle = $300/yr ceiling. Highest no-AF effective rate on a single category. Combine with Strata Premier to get 5x TY transferable points on best monthly category.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.citi.com/credit-cards/citi-custom-cash-credit-card"],

  "is_pool_spoke": true,
  "accepts_pinned_category": [
    "dining",
    "gas",
    "groceries",
    "drugstore",
    "home",
    "streaming",
    "transit",
    "airfare",
    "hotels",
    "shopping"
  ]
}
```

## programs.json entry
See `citi_strata_premier.md`.

## issuer_rules.json entry
See `citi_strata_premier.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Multi-card stacking**: Power users hold 2-3 Custom Cash to stack 5x on different categories (e.g. one for grocery, one for restaurants). 24-month TY family rule limits this; verify Citi enforcement.
- **3% FX**: Domestic only.
- **Auto-categorization**: Engine should match best category to user's monthly spend forecast.
