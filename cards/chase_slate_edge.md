# Chase Slate Edge

`card_id`: chase_slate_edge
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "chase_slate_edge",
  "name": "Chase Slate Edge",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["balance_transfer", "no_af_cashback", "credit_building"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": null,

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards. Built around APR/credit-line management."}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "0% intro APR 18 months on purchases and BT", "value_estimate_usd": null, "category": "financing"},
    {"name": "Automatic APR reduction (2% per year if pay on time + spend $1k)", "value_estimate_usd": null, "category": "financing"},
    {"name": "Auto credit-line review at 6 months", "value_estimate_usd": null, "category": "credit_building"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["balance_transfer_focused_user", "user_carrying_balance_who_wants_APR_reduction"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_reflect"],

  "breakeven_logic_notes": "No AF, no rewards. Engine should surface only for users with debt/balance-transfer needs, not rewards optimization.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/slate/edge"]
}
```

## programs.json entry
None — non-rewards card.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- Replaced original Chase Slate (BT-only) with rewards-free debt-management positioning.
- 5/24 still applies.
