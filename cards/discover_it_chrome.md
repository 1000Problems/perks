# Discover It Chrome

`card_id`: discover_it_chrome
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "discover_it_chrome",
  "name": "Discover It Chrome",
  "issuer": "Discover",
  "network": "Discover",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "discover_cashback",

  "earning": [
    {"category": "gas_stations_and_restaurants", "rate_pts_per_dollar": 2, "cap_per_quarter_usd": 1000},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "earning_modifier_first_year_match": "Cashback Match in year 1",

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null, "notes": "Cashback Match acts as effective SUB"},

  "annual_credits": [],

  "ongoing_perks": [{"name": "Free FICO score", "value_estimate_usd": null, "category": "credit_management"}],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Discover 14-day rule", "Lifetime once-per-product Match"],

  "best_for": ["users_who_dont_want_rotating_categories"],
  "synergies_with": ["discover_it_cash_back"],
  "competing_with_in_wallet": ["discover_it_cash_back"],

  "breakeven_logic_notes": "No AF. 2% gas/dining flat with $1k/quarter cap. Discover It Cash Back's rotating 5% beats this for most users.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.discover.com/credit-cards/cash-back/chrome-card.html"]
}
```

## programs.json entry
See `discover_it_cash_back.md`.

## issuer_rules.json entry
See `discover_it_cash_back.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Cashback Match year 1 makes effective rate 4% gas/dining year 1.
