# Bread Cashback American Express

`card_id`: bread_cashback_amex
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "bread_cashback_amex",
  "name": "Bread Cashback American Express Card",
  "issuer": "Bread Financial",
  "network": "Amex",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "bread_cashback",

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["simple_2_pct_alternative"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_active_cash"],

  "breakeven_logic_notes": "No AF, 2% flat, 0% FX. Competitive with DC/Active Cash.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.breadfinancial.com/en/products-services/credit-cards/bread-cashback.html"]
}
```

## programs.json entry
Closed-loop Bread cashback.

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Newer issuer; verify network acceptance and any account closure history before recommending.
