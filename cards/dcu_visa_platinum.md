# DCU Visa Platinum

`card_id`: dcu_visa_platinum
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "dcu_visa_platinum",
  "name": "DCU Visa Platinum Credit Card",
  "issuer": "Digital Federal Credit Union",
  "network": "Visa Platinum",
  "card_type": "personal",
  "category": ["balance_transfer", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": null,
  "membership_required": "DCU membership (open to anyone via $5 share deposit + association)",

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],
  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},
  "annual_credits": [],
  "ongoing_perks": [{"name": "Low ongoing APR (often single-digit)", "value_estimate_usd": null, "category": "financing"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["DCU membership"],

  "best_for": ["users_carrying_balance_seeking_low_APR"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF, no rewards. Low APR is the differentiator.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.dcu.org/borrow/credit-cards.html"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- DCU often has lowest APR among major issuers for revolving users.
