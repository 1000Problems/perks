# Discover It Student Cash Back

`card_id`: discover_it_student_cash_back
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "discover_it_student_cash_back",
  "name": "Discover It Student Cash Back",
  "issuer": "Discover",
  "network": "Discover",
  "card_type": "personal",
  "category": ["student", "rotating_5_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "limited_credit_student",
  "currency_earned": "discover_cashback",

  "earning": [
    {"category": "rotating_quarterly_5pct", "rate_pts_per_dollar": 5, "cap_per_quarter_usd": 1500},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "earning_modifier_first_year_match": "Cashback Match year 1",

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "Cashback Match is the SUB"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Free FICO score monthly", "value_estimate_usd": null, "category": "credit_management"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Discover 14-day rule", "Must be enrolled in qualifying college/university"],

  "best_for": ["college_students_starting_credit"],
  "synergies_with": [],
  "competing_with_in_wallet": ["capital_one_quicksilver_student", "chase_freedom_rise"],

  "breakeven_logic_notes": "No AF. Match-doubled rotating 5% is the strongest student card earning structure.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.discover.com/credit-cards/student/"]
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
- College enrollment requirement.
- Same rotating categories as adult It Cash Back.
