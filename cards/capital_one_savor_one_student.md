# Capital One SavorOne Student

`card_id`: capital_one_savor_one_student
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_savor_one_student",
  "name": "Capital One SavorOne Student Cash Rewards",
  "issuer": "Capital One",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["student", "tiered_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "limited_credit_student",
  "currency_earned": "capital_one_cashback",

  "earning": [
    {"category": "dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "entertainment", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "popular_streaming", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "grocery", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 50
  },

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month", "Must be student"],

  "best_for": ["college_student_with_dining_grocery_focus"],
  "synergies_with": [],
  "competing_with_in_wallet": ["discover_it_student_cash_back", "capital_one_quicksilver_student"],

  "breakeven_logic_notes": "No AF. Top student card for tiered cashback (3% on 4 categories). Beats Discover It Student Cash Back's rotating model for users with consistent dining/grocery spend.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/savorone-student/"]
}
```

## programs.json entry
See `capital_one_savor.md`.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Best student tiered-cashback card.
