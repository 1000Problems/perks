# Wells Fargo Attune

`card_id`: wells_fargo_attune
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "wells_fargo_attune",
  "name": "Wells Fargo Attune Card",
  "issuer": "Wells Fargo",
  "network": "Visa",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback", "lifestyle"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "wells_fargo_cashback",

  "earning": [
    {"category": "lifestyle_categories_fitness_pet_self_care_recreation_etc", "rate_pts_per_dollar": 4, "cap_usd_per_year": null, "notes": "4% on broad lifestyle definition: gyms, sporting events, pet supplies, personal care, etc."},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": 500, "spend_window_months": 3, "estimated_value_usd": 100, "notes": "Often $100 bonus"},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Cell phone protection", "value_estimate_usd": 80, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["WF 6-month rule"],

  "best_for": ["lifestyle_spend_focused_no_AF"],
  "synergies_with": ["wells_fargo_active_cash"],
  "competing_with_in_wallet": ["amex_blue_cash_preferred"],

  "breakeven_logic_notes": "No AF. 4% on lifestyle is competitive but cap structure determines real return; verify cap.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.wellsfargo.com/credit-cards/attune/"]
}
```

## programs.json entry
See `wells_fargo_active_cash.md`.

## issuer_rules.json entry
See `wells_fargo_active_cash.md`.

## perks_dedup.json entries
See `wells_fargo_active_cash.md`.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Newer launch; verify category list and any caps.
