# Chase IHG One Rewards Traveler

`card_id`: ihg_traveler
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "ihg_traveler",
  "name": "Chase IHG One Rewards Traveler Card",
  "issuer": "Chase",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["hotel_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "ihg_one_rewards",

  "earning": [
    {"category": "ihg_hotels", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "dining_gas_streaming", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 80000,
    "spend_required_usd": 2000,
    "spend_window_months": 3,
    "estimated_value_usd": 400
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "IHG Silver Elite status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "4th-night-free on award stays", "value_estimate_usd": null, "category": "rewards_modifier"}
  ],

  "transfer_partners_inherited_from": "ihg_one_rewards",

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["occasional_IHG_stayer_no_AF"],
  "synergies_with": ["ihg_premier"],
  "competing_with_in_wallet": ["ihg_premier"],

  "breakeven_logic_notes": "No AF. Lower earning rates and Silver status only. Best as bonus-spend card for IHG-loyal users without AF appetite.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/ihg-one-rewards-traveler-credit-card"]
}
```

## programs.json entry
See `ihg_premier.md`.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 4th-night-free is preserved on no-AF Traveler — unusual benefit retention.
