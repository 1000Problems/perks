# Bank of America Travel Rewards

`card_id`: boa_travel_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "boa_travel_rewards",
  "name": "Bank of America Travel Rewards",
  "issuer": "Bank of America",
  "network": "Visa",
  "card_type": "personal",
  "category": ["no_af_travel", "flat_rate_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "boa_points",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "earning_modifier_preferred_rewards": "75% bonus at PH = 2.625x flat, top no-AF earning rate at PH tier.",

  "signup_bonus": {
    "amount_pts": 25000,
    "spend_required_usd": 1000,
    "spend_window_months": 3,
    "estimated_value_usd": 250
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["BoA 2/3/4"],

  "best_for": ["no_AF_no_FX_PH_tier_2_625_pct"],
  "synergies_with": ["boa_premium_rewards", "boa_customized_cash"],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_active_cash"],

  "breakeven_logic_notes": "No AF, 0% FX, 1.5x baseline. Only competitive at Platinum Honors tier (then 2.625x — best no-AF rate).",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/travel-rewards-credit-card/"]
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

- Targeted at people with BoA banking relationship; standalone earning beaten by Citi DC/WF Active Cash.
- Travel redemption via "travel purchases credit eraser" up to 12 months back.
