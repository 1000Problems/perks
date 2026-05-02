# AAA Member Rewards Visa (BoA)

`card_id`: aaa_member_rewards_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "aaa_member_rewards_visa",
  "name": "AAA Member Rewards Visa",
  "issuer": "Bank of America",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": "boa_points",
  "membership_required": "AAA membership",

  "earning": [
    {"category": "aaa_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "gas_grocery_drugstores", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 20000, "spend_required_usd": 1000, "spend_window_months": 3, "estimated_value_usd": 200},

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["BoA 2/3/4", "AAA membership required"],

  "best_for": ["aaa_member_with_road_trip_focus"],
  "synergies_with": [],
  "competing_with_in_wallet": ["aaa_daily_advantage_visa"],

  "breakeven_logic_notes": "No AF. Solid commuter card if AAA-eligible.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/aaa-rewards-credit-card/"]
}
```

## programs.json entry
See `boa_premium_rewards.md`.

## issuer_rules.json entry
See `boa_premium_rewards.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 3% FX. Domestic only.
