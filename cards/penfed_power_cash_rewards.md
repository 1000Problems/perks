# PenFed Power Cash Rewards

`card_id`: penfed_power_cash_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "penfed_power_cash_rewards",
  "name": "PenFed Power Cash Rewards Visa Signature Card",
  "issuer": "PenFed Credit Union",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "penfed_cashback",
  "membership_required": "PenFed Credit Union membership (open to anyone via $5 deposit)",

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "notes": "2% with PenFed Honors Advantage Member status (free checking $500+ direct deposit); 1.5% without"}],

  "signup_bonus": {"amount_pts": 100, "spend_required_usd": 1500, "spend_window_months": 90, "estimated_value_usd": 100},

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["PenFed membership required (free)"],

  "best_for": ["penfed_honors_advantage_member_simple_2pct"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_double_cash"],

  "breakeven_logic_notes": "No AF. 2% flat at PenFed Honors tier matches Citi DC with 0% FX advantage.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.penfed.org/credit-cards/power-cash-rewards-visa-signature-card"]
}
```

## programs.json entry

```json
{
  "id": "penfed_cashback",
  "name": "PenFed Cashback",
  "type": "fixed_value",
  "issuer": "PenFed Credit Union",
  "earning_cards": ["penfed_power_cash_rewards", "penfed_pathfinder_rewards", "penfed_platinum_rewards"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.penfed.org/"]
}
```

## issuer_rules.json entry

```json
{
  "issuer": "PenFed Credit Union",
  "rules": [
    {
      "id": "penfed_membership_required",
      "name": "PenFed membership",
      "description": "Open to anyone via $5 share deposit; not military-restricted.",
      "applies_to": "all_penfed_cards",
      "official": true
    },
    {
      "id": "penfed_honors_advantage",
      "name": "Honors Advantage tier",
      "description": "Boosts earning rate; requires free checking + $500/mo direct deposit.",
      "applies_to": "penfed_power_cash_rewards",
      "official": true
    }
  ]
}
```

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- 0% FX, 2% flat, no AF — among best no-AF flat-rate cards if user opens PenFed checking.
