# PenFed Platinum Rewards

`card_id`: penfed_platinum_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "penfed_platinum_rewards",
  "name": "PenFed Platinum Rewards Visa Signature",
  "issuer": "PenFed Credit Union",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "penfed_cashback",
  "membership_required": "PenFed membership",

  "earning": [
    {"category": "gas_ev", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "supermarkets_streaming", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 15000, "spend_required_usd": 1500, "spend_window_months": 90, "estimated_value_usd": 150},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["PenFed membership required"],

  "best_for": ["penfed_member_with_high_gas_spend"],
  "synergies_with": ["penfed_power_cash_rewards"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 5% gas (uncapped) is class-leading.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.penfed.org/credit-cards/platinum-rewards-visa-signature-card"]
}
```

## programs.json / issuer_rules
See `penfed_power_cash_rewards.md`.

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- 5% gas uncapped is rare. Pairs with AAA Travel Advantage as a top no-AF gas combo.
