# Capital One Platinum

`card_id`: capital_one_platinum
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_platinum",
  "name": "Capital One Platinum Credit Card",
  "issuer": "Capital One",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["credit_building", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "fair_to_average_credit",
  "currency_earned": null,

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto credit-line review at 6 months", "value_estimate_usd": null, "category": "credit_building"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month"],

  "best_for": ["fair_credit_users_seeking_no_AF_credit_building"],
  "synergies_with": [],
  "competing_with_in_wallet": ["capital_one_platinum_secured"],

  "breakeven_logic_notes": "No AF, no rewards. Pure credit-building utility for fair-credit users.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/platinum/"]
}
```

## programs.json entry
None.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- No-AF, no-rewards. Engine should suggest QuicksilverOne instead if user can pay $39 AF for 1.5% rewards.
