# Chase United Gateway Card

`card_id`: united_gateway
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "united_gateway",
  "name": "Chase United Gateway Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["airline_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "united_mileageplus",

  "earning": [
    {"category": "united_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "gas_local_transit_commuting", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 30000,
    "spend_required_usd": 1000,
    "spend_window_months": 3,
    "estimated_value_usd": 400
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "25% back on inflight purchases", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["light_united_flyer_no_AF"],
  "synergies_with": ["united_explorer", "chase_sapphire_preferred"],
  "competing_with_in_wallet": ["united_explorer"],

  "breakeven_logic_notes": "No AF. No bag perk — Explorer/Quest/Club Infinite supersede for actual United flyers. Pure no-AF MileagePlus earner.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/united/gateway"]
}
```

## programs.json entry
See `united_quest.md` for united_mileageplus.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `united_quest.md`.

## RESEARCH_NOTES.md entries

- No checked-bag perk. Engine: never surface for users seeking bag value — recommend Explorer instead.
