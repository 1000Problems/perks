# Chase Amazon Visa (no Prime)

`card_id`: amazon_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amazon_visa",
  "name": "Chase Amazon Visa",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["retail_cobrand", "tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "amazon_rewards",

  "earning": [
    {"category": "amazon_whole_foods", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "chase_travel", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "gas_dining_drugstores", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 50
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["amazon_user_without_Prime", "starter_chase_card"],
  "synergies_with": ["amazon_prime_visa"],
  "competing_with_in_wallet": ["amazon_prime_visa"],

  "breakeven_logic_notes": "No AF. Becomes Amazon Prime Visa if user activates Prime — engine should detect Prime status and recommend upgrade.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.amazon.com/iss/credit/storecardmember"]
}
```

## programs.json entry
See `amazon_prime_visa.md`.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Same card as Amazon Prime Visa with downgraded earning if user has no Prime membership.
