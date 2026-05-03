# Amex Hilton Honors (no AF)

`card_id`: hilton_honors
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "hilton_honors",
  "name": "Amex Hilton Honors Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["hotel_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "hilton_honors",

  "earning": [
    {"category": "hilton_purchases", "rate_pts_per_dollar": 7, "cap_usd_per_year": null},
    {"category": "us_dining_supermarkets_gas", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 3, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 80000,
    "spend_required_usd": 2000,
    "spend_window_months": 6,
    "estimated_value_usd": 400
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Hilton Silver status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "Path to Gold via $20k spend", "value_estimate_usd": null, "category": "elite_status_acceleration"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Amex once-per-lifetime SUB"],

  "best_for": ["occasional_Hilton_stayer", "no_AF_Hilton_card_starter"],
  "synergies_with": ["hilton_honors_surpass", "hilton_honors_aspire"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Engine: surface for users with low Hilton stay frequency.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/hilton-honors-amex/"],

  "is_cobrand": true
}
```

## programs.json entry
See `hilton_honors_surpass.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `hilton_honors_surpass.md`.

## RESEARCH_NOTES.md entries
- Entry-tier Hilton co-brand. Status grant is Silver only.
