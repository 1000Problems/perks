# BJ's One+ Mastercard

`card_id`: bjs_one_plus
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "bjs_one_plus",
  "name": "BJ's One+ Mastercard",
  "issuer": "Capital One",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "bjs_cashback",
  "membership_required": "BJ's Wholesale Club Plus membership",

  "earning": [
    {"category": "bjs_purchases", "rate_pts_per_dollar": null, "discount_pct": 5, "notes": "5% back on BJ's purchases when paid with card"},
    {"category": "gas_at_bjs", "rate_pts_per_dollar": null, "fixed_discount_per_gallon": 0.15, "notes": "15c off per gallon at BJ's gas"},
    {"category": "dining_streaming", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null
  },

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month", "BJ's Plus membership required"],

  "best_for": ["BJs_Plus_member_with_$300_plus_monthly_BJs_spend"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF (BJ's Plus membership separately). Useful only at BJ's; 2% non-bonus is competitive but not market-leading.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bjs.com/membership/credit-card"]
}
```

## programs.json entry
Closed-loop BJ's cashback.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- BJ's One Mastercard (no plus, lower membership tier) earns 3% on BJ's, 1.5% elsewhere.
