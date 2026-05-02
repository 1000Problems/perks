# Kikoff Credit Account

`card_id`: kikoff_credit_account
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "kikoff_credit_account",
  "name": "Kikoff Credit Account",
  "issuer": "Kikoff",
  "network": "Closed-loop (Kikoff Store)",
  "card_type": "personal",
  "category": ["credit_building", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": null,
  "credit_score_required": "no_credit_required",
  "currency_earned": null,
  "earning": [{"category": "kikoff_store_only", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "Closed-loop revolving line for Kikoff Store products"}],
  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},
  "annual_credits": [],
  "ongoing_perks": [{"name": "Reports to bureaus", "value_estimate_usd": null, "category": "credit_building"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],
  "best_for": ["thin_file_users_no_card_needed"],
  "synergies_with": [],
  "competing_with_in_wallet": ["grow_credit_mastercard"],
  "breakeven_logic_notes": "No AF. Closed-loop credit-building line — not a usable card.",
  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://kikoff.com/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Not a real spending card. Engine: surface for credit-building only.
