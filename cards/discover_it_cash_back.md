# Discover It Cash Back

`card_id`: discover_it_cash_back
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "discover_it_cash_back",
  "name": "Discover It Cash Back",
  "issuer": "Discover",
  "network": "Discover",
  "card_type": "personal",
  "category": ["rotating_5_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "discover_cashback",

  "earning": [
    {"category": "rotating_quarterly_5pct", "rate_pts_per_dollar": 5, "cap_per_quarter_usd": 1500, "notes": "Activate quarterly. 2026 Q2 categories: gas stations, restaurants. Annual cap effectively $6,000 across quarters."},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "earning_modifier_first_year_match": "Cashback Match: Discover doubles all cash back earned in first 12 months. Effectively 10% on rotating, 2% on everything else for year 1.",

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "No traditional SUB; Cashback Match acts as effective SUB. Average user earns ~$300-500 in first-year match."
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Free FICO score monthly", "value_estimate_usd": null, "category": "credit_management"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [
    "Discover lifetime once-per-product Cashback Match",
    "Discover 14-day rule: only one Discover credit card application per 14 days"
  ],

  "best_for": ["first_year_match_value_$300_500", "rotating_5pct_with_$6k_annual_cap"],
  "synergies_with": ["discover_it_chrome", "discover_it_miles"],
  "competing_with_in_wallet": ["chase_freedom_flex", "citi_custom_cash"],

  "breakeven_logic_notes": "No AF; first-year Cashback Match is the SUB. Engine: at full $6k cap (5% rotating) → $300 base + $300 match = $600 first year. Year 2+ becomes a $300/yr ceiling card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.discover.com/credit-cards/cash-back/it-card.html"]
}
```

## programs.json entry

```json
{
  "id": "discover_cashback",
  "name": "Discover Cashback",
  "type": "fixed_value",
  "issuer": "Discover",
  "earning_cards": ["discover_it_cash_back", "discover_it_chrome", "discover_it_student_cash_back", "discover_it_secured"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.discover.com/"]
}
```

## issuer_rules.json entry (Discover)

```json
{
  "issuer": "Discover",
  "rules": [
    {
      "id": "discover_14_day_rule",
      "name": "14 days between apps",
      "description": "Only one Discover credit card application can be approved every 14 days.",
      "applies_to": "discover_personal",
      "official": false
    },
    {
      "id": "discover_lifetime_match",
      "name": "Lifetime once-per-product match",
      "description": "Cashback Match (or equivalent doubling for It Miles) is once per lifetime per product.",
      "applies_to": "discover_with_match",
      "official": true
    },
    {
      "id": "discover_acceptance",
      "name": "Network acceptance",
      "description": "Discover is widely accepted in US (~99%) but limited internationally; engine should warn international travelers.",
      "applies_to": "all_discover",
      "official": true
    }
  ]
}
```

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **0% FX** but limited international acceptance — usable only where Discover network has agreements (Diners Club, JCB, UnionPay).
- **First-year value capture**: Engine should weight ~$500 expected first-year value if user spends across rotating categories. Year 2+ rate is unimpressive vs other no-AF cards.
