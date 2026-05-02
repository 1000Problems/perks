# Navy Federal Visa Signature Flagship Rewards

`card_id`: nfcu_flagship_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "nfcu_flagship_rewards",
  "name": "Navy Federal Visa Signature Flagship Rewards",
  "issuer": "Navy Federal Credit Union",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 49,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "nfcu_points",
  "membership_required": "Navy Federal Credit Union membership (military/family/DoD)",

  "earning": [
    {"category": "travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 40000, "spend_required_usd": 4000, "spend_window_months": 90, "estimated_value_usd": 400},

  "annual_credits": [{"name": "$100 airline credit", "value_usd": 100, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium"}],

  "ongoing_perks": [
    {"name": "Trip cancellation/interruption", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["NFCU membership required"],

  "best_for": ["military_or_dod_member_seeking_premium_travel_card"],
  "synergies_with": [],
  "competing_with_in_wallet": ["chase_sapphire_preferred"],

  "breakeven_logic_notes": "AF $49 less $100 airline credit = -$51. Outstanding value for NFCU members. 2x flat baseline beats most $95-AF mid-tier cards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.navyfederal.org/products/credit-cards/personal-cards/flagship.html"]
}
```

## programs.json entry

```json
{
  "id": "nfcu_points",
  "name": "Navy Federal Rewards Points",
  "type": "fixed_value",
  "issuer": "Navy Federal Credit Union",
  "earning_cards": ["nfcu_flagship_rewards", "nfcu_more_rewards_amex", "nfcu_cashrewards", "nfcu_go_rewards"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.navyfederal.org/"]
}
```

## issuer_rules.json entry

```json
{
  "issuer": "Navy Federal Credit Union",
  "rules": [
    {
      "id": "nfcu_membership_required",
      "name": "NFCU membership required",
      "description": "Eligibility: active/retired military, DoD civilians, family members of NFCU members.",
      "applies_to": "all_nfcu_cards",
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
- Best mid-tier card available to NFCU members. AF lower than CSP but earning rate broadly comparable on non-bonus.
