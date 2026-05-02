# JetBlue Card

`card_id`: jetblue_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "jetblue_card",
  "name": "JetBlue Card",
  "issuer": "Barclays",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["airline_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "jetblue_trueblue",

  "earning": [
    {"category": "jetblue_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "restaurants_grocery", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 10000, "spend_required_usd": 1000, "spend_window_months": 90, "estimated_value_usd": 140},

  "annual_credits": [],

  "ongoing_perks": [{"name": "50% off inflight food/drink", "value_estimate_usd": null, "category": "airline_perk"}],

  "transfer_partners_inherited_from": "jetblue_trueblue",

  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["light_jetblue_user_no_AF"],
  "synergies_with": ["jetblue_plus"],
  "competing_with_in_wallet": ["jetblue_plus"],

  "breakeven_logic_notes": "No AF. No bag perk. Plus card supersedes for any meaningful JetBlue user.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cards.barclaycardus.com/banking/cards/jetblue-card/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
See `jetblue_plus.md`.

## RESEARCH_NOTES.md entries
- Entry no-AF tier; uncompetitive vs Plus.
