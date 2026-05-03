# Merrill Lynch Premium Rewards

`card_id`: merrill_lynch_premium_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "merrill_lynch_premium_rewards",
  "name": "Merrill Lynch Premium Rewards Credit Card",
  "issuer": "Bank of America",
  "network": "Visa",
  "card_type": "personal",
  "category": ["mid_tier_travel", "investment_cobrand"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "boa_points",

  "earning": [
    {"category": "travel_dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "earning_modifier_preferred_rewards": "PH 75% bonus = 3.5x travel/dining, 2.625x flat",

  "signup_bonus": {"amount_pts": 60000, "spend_required_usd": 4000, "spend_window_months": 90, "estimated_value_usd": 600},

  "annual_credits": [
    {"name": "$100 airline incidental credit", "signal_id": "airline_incidental_credit", "value_usd": 100, "type": "specific", "expiration": "calendar_year", "ease_of_use": "medium"},
    {"name": "Global Entry / TSA PreCheck", "signal_id": "global_entry_tsa", "value_usd": 100, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [{"name": "Trip protections, primary CDW", "value_estimate_usd": null, "category": "travel_protection"}],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["BoA 2/3/4", "Preferred Rewards bonus"],

  "best_for": ["ML_advisor_relationship_with_PH_tier"],
  "synergies_with": ["boa_premium_rewards_elite", "boa_customized_cash"],
  "competing_with_in_wallet": ["boa_premium_rewards"],

  "breakeven_logic_notes": "AF $95 less $100 airline = -$5. Functionally identical to BoA Premium Rewards but co-branded ML.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://mlpf.fa.ml.com/credit-card.html"]
}
```

## programs.json / issuer_rules
See `boa_premium_rewards.md`.

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Branded variant of BoA Premium Rewards for ML clients.
