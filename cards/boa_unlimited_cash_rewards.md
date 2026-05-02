# BoA Unlimited Cash Rewards

`card_id`: boa_unlimited_cash_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "boa_unlimited_cash_rewards",
  "name": "Bank of America Unlimited Cash Rewards",
  "issuer": "Bank of America",
  "network": "Visa",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "boa_points",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "earning_modifier_preferred_rewards": "PH 75% bonus = 2.625x flat",

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 1000,
    "spend_window_months": 3,
    "estimated_value_usd": 200
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["BoA 2/3/4", "Preferred Rewards bonus"],

  "best_for": ["BoA_PH_tier_2_625_pct_flat"],
  "synergies_with": ["boa_premium_rewards_elite", "boa_customized_cash"],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_active_cash"],

  "breakeven_logic_notes": "No AF. Standalone 1.5% is uncompetitive. At PH tier becomes 2.625% — best no-AF flat with BoA relationship.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/unlimited-cash-back-rewards-credit-card/"]
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
