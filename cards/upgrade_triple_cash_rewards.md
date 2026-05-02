# Upgrade Triple Cash Rewards Visa

`card_id`: upgrade_triple_cash_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "upgrade_triple_cash_rewards",
  "name": "Upgrade Triple Cash Rewards Visa",
  "issuer": "Upgrade / Cross River Bank",
  "network": "Visa",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "upgrade_cashback",

  "earning": [
    {"category": "home_auto_health", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Home improvement, auto repair/parts, health/wellness"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 200},

  "annual_credits": [],

  "ongoing_perks": [{"name": "Hybrid card-loan structure", "value_estimate_usd": null, "category": "financing"}],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [],

  "best_for": ["home_auto_health_focused_spend"],
  "synergies_with": ["upgrade_cash_rewards"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 3x on home/auto/health is a unique category combo.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.upgrade.com/cards/triple-cash-rewards/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique. See `upgrade_cash_rewards.md`.

## RESEARCH_NOTES.md entries
- Niche category card; home/auto/health is unusual and may match heavy DIY/medical-spend users.
