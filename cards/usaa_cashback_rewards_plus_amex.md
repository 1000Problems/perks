# USAA Cashback Rewards Plus Amex

`card_id`: usaa_cashback_rewards_plus_amex
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "usaa_cashback_rewards_plus_amex",
  "name": "USAA Cashback Rewards Plus American Express Card",
  "issuer": "USAA",
  "network": "Amex",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 1,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "usaa_cashback",
  "membership_required": "USAA membership",

  "earning": [
    {"category": "gas_military_base_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": 3000, "notes": "5% on first $3k/yr combined"},
    {"category": "supermarkets", "rate_pts_per_dollar": 2, "cap_usd_per_year": 3000},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["USAA membership required"],

  "best_for": ["military_member_with_gas_or_base_spend"],
  "synergies_with": ["usaa_eagle_navigator"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 5% on military base purchases is unique to USAA cards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usaa.com/inet/wc/cashback-rewards-plus-amex"]
}
```

## programs.json / issuer_rules
See `usaa_eagle_navigator.md`.

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Military base 5% category is unique benefit for service members.
