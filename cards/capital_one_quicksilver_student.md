# Capital One Quicksilver Student

`card_id`: capital_one_quicksilver_student
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_quicksilver_student",
  "name": "Capital One Quicksilver Student Cash Rewards",
  "issuer": "Capital One",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["student", "flat_rate_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "limited_credit_student",
  "currency_earned": "capital_one_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 50,
    "notes": "Often $50 after first purchase"
  },

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month", "Must be student"],

  "best_for": ["college_students_seeking_simple_flat_rate"],
  "synergies_with": [],
  "competing_with_in_wallet": ["discover_it_student_cash_back"],

  "breakeven_logic_notes": "No AF. Flat 1.5% with 0% FX. Discover It Student wins on first-year match value.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/quicksilver-student/"]
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
- Cap One's student-tier alternative to Quicksilver. 0% FX makes it study-abroad friendly.
