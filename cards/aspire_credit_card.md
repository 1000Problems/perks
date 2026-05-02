# Aspire Credit Card

`card_id`: aspire_credit_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "aspire_credit_card",
  "name": "Aspire Credit Card",
  "issuer": "The Bank of Missouri",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["subprime_unsecured", "credit_building"],
  "annual_fee_usd": 175,
  "annual_fee_after_year_one_usd": 49,
  "monthly_maintenance_fee_usd_after_year_one": 12.50,
  "foreign_tx_fee_pct": 1,
  "credit_score_required": "fair_to_poor_credit",
  "currency_earned": null,

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["users_who_dont_qualify_anywhere_else"],
  "synergies_with": [],
  "competing_with_in_wallet": ["reflex_mastercard", "surge_mastercard", "fit_mastercard", "indigo_mastercard", "milestone_mastercard", "destiny_mastercard", "verve_mastercard", "total_visa", "merrick_double_your_line"],

  "breakeven_logic_notes": "AF $175 yr 1 + $150/yr monthly maintenance + likely high APR. Engine: NEVER recommend to users who can qualify for any other card. Subprime predatory fee structure.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.aspirecreditcard.com/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries

- **Predatory fee structure**. Engine should warn users against this entire card class. Discover It Secured, Cap One Quicksilver Secured, OpenSky Secured all preferable for credit building.
- **Cluster cards** (similar predatory structure): Reflex, Surge, FIT, Indigo, Milestone, Destiny, Verve, Total, Merrick.
