# PenFed Pathfinder Rewards

`card_id`: penfed_pathfinder_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "penfed_pathfinder_rewards",
  "name": "PenFed Pathfinder Rewards Visa Signature Card",
  "issuer": "PenFed Credit Union",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "penfed_cashback",
  "membership_required": "PenFed membership",

  "earning": [
    {"category": "travel", "rate_pts_per_dollar": 4, "cap_usd_per_year": null, "notes": "4x with Honors Advantage"},
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 50000, "spend_required_usd": 3000, "spend_window_months": 90, "estimated_value_usd": 500},

  "annual_credits": [
    {"name": "$100 airline incidental credit", "signal_id": "airline_incidental_credit", "value_usd": 100, "type": "specific", "expiration": "calendar_year", "ease_of_use": "medium"},
    {"name": "$100 Global Entry / TSA PreCheck", "signal_id": "global_entry_tsa", "value_usd": 100, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Trip cancellation/interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["PenFed membership required"],

  "best_for": ["penfed_member_traveler_at_$95_AF"],
  "synergies_with": ["penfed_power_cash_rewards"],
  "competing_with_in_wallet": ["chase_sapphire_preferred"],

  "breakeven_logic_notes": "AF $95 less $100 airline credit = -$5. Strong travel card for PenFed members.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.penfed.org/credit-cards/pathfinder-rewards-visa-signature-card"]
}
```

## programs.json / issuer_rules
See `penfed_power_cash_rewards.md`.

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Top PenFed travel card; 4x travel uncapped at Honors tier is rare at $95 AF.
