# Bank of America Premium Rewards

`card_id`: boa_premium_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "boa_premium_rewards",
  "name": "Bank of America Premium Rewards",
  "issuer": "Bank of America",
  "network": "Visa",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "boa_points",

  "earning": [
    {"category": "travel", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "earning_modifier_preferred_rewards": "Preferred Rewards Platinum Honors tier (>$100k assets at BoA/Merrill) adds 75% bonus: 3.5x travel/dining, 2.625x everything else. Effectively the highest no-cap return at preferred-tier.",

  "signup_bonus": {
    "amount_pts": 60000,
    "spend_required_usd": 4000,
    "spend_window_months": 90,
    "estimated_value_usd": 600
  },

  "annual_credits": [
    {"name": "Airline incidental credit", "value_usd": 100, "type": "specific", "expiration": "calendar_year", "ease_of_use": "medium"},
    {"name": "TSA PreCheck / Global Entry", "value_usd": 100, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Trip cancellation/interruption", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["BoA 2/3/4", "BoA 7/12 (informal)"],

  "best_for": ["BoA_Preferred_Rewards_Platinum_Honors", "$100k_BoA_Merrill_relationship"],
  "synergies_with": ["boa_premium_rewards_elite", "boa_customized_cash"],
  "competing_with_in_wallet": ["chase_sapphire_preferred", "citi_strata_premier", "amex_gold"],

  "breakeven_logic_notes": "AF $95 less $100 airline credit (medium) = effectively free. With Platinum Honors 75% bonus, becomes 3.5x travel/dining + 2.625x non-bonus — beats CSP at-equivalent AF for users with BoA assets.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/premium-rewards-credit-card/"]
}
```

## programs.json entry (boa_points)

```json
{
  "id": "boa_points",
  "name": "Bank of America Travel/Cash Rewards",
  "type": "fixed_value",
  "issuer": "Bank of America",
  "earning_cards": ["boa_premium_rewards", "boa_premium_rewards_elite", "boa_travel_rewards", "boa_customized_cash"],
  "fixed_redemption_cpp": 1.0,
  "portal_redemption_cpp": null,
  "transfer_partners": [],
  "sweet_spots": [],
  "preferred_rewards_modifier": "25%/50%/75% earning bonus at Gold/Platinum/Platinum Honors tiers based on BoA/Merrill assets ($20k/$50k/$100k thresholds).",
  "sources": ["https://www.bankofamerica.com/preferred-rewards/"]
}
```

## issuer_rules.json entry (BoA)

```json
{
  "issuer": "Bank of America",
  "rules": [
    {
      "id": "boa_2_3_4",
      "name": "2/3/4 rule",
      "description": "BoA limits new card approvals: 2 cards in 30 days, 3 in 12 months, 4 in 24 months — across BoA products.",
      "applies_to": "boa_personal",
      "official": false
    },
    {
      "id": "boa_7_12",
      "name": "7/12 rule",
      "description": "Across all issuers: BoA may deny if applicant has 7+ new cards on credit report in last 12 months.",
      "applies_to": "boa_personal",
      "official": false
    },
    {
      "id": "boa_preferred_rewards",
      "name": "Preferred Rewards bonus",
      "description": "Asset-based earning multiplier: $20k/$50k/$100k at BoA/Merrill = 25%/50%/75% bonus on rewards earning. Engine should detect user's banking relationship.",
      "applies_to": "boa_personal_credit_cards",
      "official": true
    }
  ]
}
```

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Preferred Rewards leverage**: Engine should ask user about BoA/Merrill relationship; cards transform from mediocre to top-tier at Platinum Honors.
- **Premium Rewards Elite**: Sister card with $550 AF and broader credits; treat as separate card_id.
