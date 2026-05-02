# Chase Marriott Bonvoy Bold

`card_id`: marriott_bonvoy_bold
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "marriott_bonvoy_bold",
  "name": "Chase Marriott Bonvoy Bold Credit Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["hotel_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "marriott_bonvoy",

  "earning": [
    {"category": "marriott_bonvoy_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "dining_grocery_gas", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 30000,
    "spend_required_usd": 1000,
    "spend_window_months": 3,
    "estimated_value_usd": 240
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Marriott Silver Elite status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "5 elite-night credits per year", "value_estimate_usd": null, "category": "elite_status_acceleration"}
  ],

  "transfer_partners_inherited_from": "marriott_bonvoy",

  "issuer_rules": ["Chase 5/24", "Marriott 24-month cross-issuer rule"],

  "best_for": ["light_marriott_user_no_AF"],
  "synergies_with": ["marriott_bonvoy_boundless", "marriott_bonvoy_brilliant"],
  "competing_with_in_wallet": ["marriott_bonvoy_boundless"],

  "breakeven_logic_notes": "No AF. No Free Night cert. Engine: surface for casual Marriott stayer; otherwise Boundless wins on cert value.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/marriott/bold"]
}
```

## programs.json entry
See `marriott_bonvoy_boundless.md`.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `marriott_bonvoy_boundless.md`.

## RESEARCH_NOTES.md entries
- Entry-tier Marriott. No bonus elite-night earning beyond 5/yr.
