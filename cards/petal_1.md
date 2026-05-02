# Petal 1

`card_id`: petal_1
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "petal_1",
  "name": "Petal 1 'No Annual Fee' Visa Credit Card",
  "issuer": "WebBank (Petal)",
  "network": "Visa",
  "card_type": "personal",
  "category": ["credit_building", "no_af_cashback", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "limited_or_no_credit",
  "currency_earned": null,

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No baseline rewards; merchant-specific 2-10% offers only"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Cash flow underwriting (no credit history required)", "value_estimate_usd": null, "category": "credit_building"},
    {"name": "No fees", "value_estimate_usd": null, "category": "fee_free"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [],

  "best_for": ["thin_file_applicants_credit_building"],
  "synergies_with": ["petal_2"],
  "competing_with_in_wallet": ["petal_2", "capital_one_platinum"],

  "breakeven_logic_notes": "No AF. No baseline rewards but unsecured card for thin-file applicants. Petal 2 supersedes for users who can qualify.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.petalcard.com/petal-1"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Entry-tier Petal for users who don't qualify for Petal 2.
