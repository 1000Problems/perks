# Petal 2

`card_id`: petal_2
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "petal_2",
  "name": "Petal 2 'Cash Back, No Fees' Visa Credit Card",
  "issuer": "WebBank (Petal)",
  "network": "Visa",
  "card_type": "personal",
  "category": ["credit_building", "no_af_cashback", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "limited_or_no_credit",
  "currency_earned": "petal_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null, "notes": "1% baseline; up to 1.5% with on-time payments"},
    {"category": "select_merchants_2_to_10pct", "rate_pts_per_dollar": null, "discount_pct": 5, "notes": "Bonus categories vary"}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Cash flow underwriting (no credit history required)", "value_estimate_usd": null, "category": "credit_building"},
    {"name": "No fees of any kind (no AF, no late, no FX, no overlimit)", "value_estimate_usd": null, "category": "fee_free"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [],

  "best_for": ["building_credit_with_no_history", "fee_free_unsecured_card"],
  "synergies_with": [],
  "competing_with_in_wallet": ["discover_it_secured", "capital_one_quicksilver_secured"],

  "breakeven_logic_notes": "No AF, no fees. Petal 2 is unsecured for thin-file applicants — strong alternative to secured cards for credit building.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.petalcard.com/petal-2"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Cash-flow underwriting (bank account analysis instead of FICO score) is unique among unsecured cards. Engine: surface for users with limited/no credit history who don't want to tie up cash in secured deposit.
