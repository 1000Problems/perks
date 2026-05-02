# Wells Fargo Reflect

`card_id`: wells_fargo_reflect
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "wells_fargo_reflect",
  "name": "Wells Fargo Reflect Card",
  "issuer": "Wells Fargo",
  "network": "Visa",
  "card_type": "personal",
  "category": ["balance_transfer", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": null,

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "0% intro APR up to 21 months on purchases and qualifying BT", "value_estimate_usd": null, "category": "financing"},
    {"name": "Cell phone protection", "value_estimate_usd": 80, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["WF 6-month rule"],

  "best_for": ["balance_transfer_with_cell_phone_protection_bonus"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_diamond_preferred", "chase_slate_edge"],

  "breakeven_logic_notes": "No AF, no rewards. 21-month BT term + cell phone protection are differentiators.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.wellsfargo.com/credit-cards/reflect/"]
}
```

## programs.json entry
None.

## issuer_rules.json entry
See `wells_fargo_active_cash.md`.

## perks_dedup.json entries
See `wells_fargo_active_cash.md` for cell_phone_protection.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 3% FX. Domestic only. Among longest BT terms in market.
