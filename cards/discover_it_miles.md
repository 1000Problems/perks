# Discover It Miles

`card_id`: discover_it_miles
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "discover_it_miles",
  "name": "Discover It Miles",
  "issuer": "Discover",
  "network": "Discover",
  "card_type": "personal",
  "category": ["flat_rate_travel", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "discover_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "earning_modifier_first_year_match": "Cashback Match doubles all rewards earned in year 1, effectively 3% on all spend year 1.",

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "No traditional SUB; Match acts as effective bonus"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Discover 14-day rule", "Discover lifetime once-per-product Match"],

  "best_for": ["first_year_3pct_match_value", "no_AF_no_FX_simple_travel"],
  "synergies_with": ["discover_it_cash_back"],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_active_cash", "capital_one_quicksilver"],

  "breakeven_logic_notes": "No AF; Cashback Match is the SUB. Year 1 effective 3% on all spend; year 2+ drops to 1.5%, beaten by Citi DC/WF Active Cash.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.discover.com/credit-cards/travel/miles-card.html"]
}
```

## programs.json entry
See `discover_it_cash_back.md`.

## issuer_rules.json entry
See `discover_it_cash_back.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Limited international acceptance per Discover network.
- Travel "miles" is a misnomer — same as cashback redeemed against travel purchases.
