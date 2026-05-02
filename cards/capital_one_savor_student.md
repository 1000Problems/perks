# Capital One Savor Student

`card_id`: capital_one_savor_student
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_savor_student",
  "name": "Capital One Savor Student Cash Rewards",
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
    {"category": "dining_entertainment_streaming", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "grocery", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 50},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Capital One 1-per-month", "Must be student"],

  "best_for": ["college_students_with_dining_entertainment_focus"],
  "synergies_with": [],
  "competing_with_in_wallet": ["capital_one_savor_one_student"],

  "breakeven_logic_notes": "No AF. Slightly different category structure from SavorOne Student.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/savor-student/"]
}
```

## programs.json / issuer_rules
See `capital_one_savor.md` and `capital_one_venture_x.md`.

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Engine: Savor Student vs SavorOne Student split is largely cosmetic. Treat as functionally similar.
