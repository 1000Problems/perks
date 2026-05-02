# Target RedCard

`card_id`: target_redcard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "target_redcard",
  "name": "Target RedCard Credit Card",
  "issuer": "TD Bank (private label)",
  "network": "Closed-loop (Target only)",
  "card_type": "personal",
  "category": ["retail_cobrand"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": null,
  "credit_score_required": "fair_to_good",
  "currency_earned": "target_discount",

  "earning": [
    {"category": "target_purchases", "rate_pts_per_dollar": null, "discount_pct": 5, "notes": "5% off at point of sale on Target purchases"}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "Periodic $40 off your first Target purchase of $40+"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Free 2-day shipping on Target.com orders", "value_estimate_usd": null, "category": "lifestyle"},
    {"name": "Extra 30-day return window", "value_estimate_usd": null, "category": "lifestyle"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [],

  "best_for": ["Target_shopper_$200_plus_per_month"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 5% off Target instantly is unbeatable for Target shoppers. Limited to Target only.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.target.com/c/redcard/"]
}
```

## programs.json entry
None — closed-loop Target discount only.

## issuer_rules.json entry
None unique.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Closed-loop card; cannot use outside Target.
- Engine should surface as "Target shopping companion" rather than a primary wallet card.
- Target also offers a debit RedCard (linked to bank account) with same 5% discount.
