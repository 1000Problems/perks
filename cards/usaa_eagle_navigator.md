# USAA Eagle Navigator

`card_id`: usaa_eagle_navigator
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "usaa_eagle_navigator",
  "name": "USAA Eagle Navigator Credit Card",
  "issuer": "USAA",
  "network": "Visa",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "usaa_points",
  "membership_required": "USAA membership (military/family)",

  "earning": [
    {"category": "travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 60000, "spend_required_usd": 3000, "spend_window_months": 90, "estimated_value_usd": 600},

  "annual_credits": [
    {"name": "$100 airline credit (after $20k spend)", "value_usd": 100, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Trip cancellation/interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["USAA membership required"],

  "best_for": ["military_or_family_seeking_premium_travel"],
  "synergies_with": [],
  "competing_with_in_wallet": ["nfcu_flagship_rewards"],

  "breakeven_logic_notes": "AF $95 (Y1 waived). 2x flat baseline + 3x travel matches mid-tier cards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usaa.com/inet/wc/eagle-navigator-credit-card"]
}
```

## programs.json entry

```json
{
  "id": "usaa_points",
  "name": "USAA Rewards Points",
  "type": "fixed_value",
  "issuer": "USAA",
  "earning_cards": ["usaa_eagle_navigator", "usaa_cashback_rewards_plus_amex", "usaa_preferred_cash_rewards", "usaa_rewards_amex", "usaa_rewards_visa"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.usaa.com/"]
}
```

## issuer_rules.json entry

```json
{
  "issuer": "USAA",
  "rules": [
    {
      "id": "usaa_membership_required",
      "name": "USAA membership required",
      "description": "Eligibility limited to active/retired military, their spouses, and their children.",
      "applies_to": "all_usaa_cards",
      "official": true
    }
  ]
}
```

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Top USAA travel card. Y1 AF waiver is a $95 effective SUB.
