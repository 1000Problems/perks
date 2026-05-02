# Step Visa Card

`card_id`: step_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "step_visa",
  "name": "Step Visa Card",
  "issuer": "Step / Evolve Bank",
  "network": "Visa",
  "card_type": "personal",
  "category": ["credit_building", "fintech", "teen_cards"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "no_credit_required",
  "currency_earned": null,
  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],
  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},
  "annual_credits": [],
  "ongoing_perks": [{"name": "Designed for teens; reports to bureaus on 18th birthday", "value_estimate_usd": null, "category": "credit_building"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Step account required; targets ages 13+"],
  "best_for": ["teens_pre_credit_building"],
  "synergies_with": [],
  "competing_with_in_wallet": [],
  "breakeven_logic_notes": "No AF. Builds credit history starting at 13; converts at 18.",
  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://step.com/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Teen-focused credit building. Engine: surface for parents asking about teen credit options.
