# Caesars Rewards Visa

`card_id`: caesars_rewards_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "caesars_rewards_visa",
  "name": "Caesars Rewards Visa",
  "issuer": "Comenity (Bread)",
  "network": "Visa",
  "card_type": "personal",
  "category": ["lifestyle_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "caesars_rewards",

  "earning": [
    {"category": "caesars_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "5% Reward Credits at Caesars properties"},
    {"category": "gas_grocery", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null, "notes": "10k Reward Credits / Tier Credits after first purchase"},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Tier Credits accelerate Caesars Diamond status", "value_estimate_usd": null, "category": "lifestyle"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["las_vegas_caesars_visitors"],
  "synergies_with": [],
  "competing_with_in_wallet": ["wyndham_earner_plus"],

  "breakeven_logic_notes": "No AF. Tier Credit acceleration is differentiator (vs status match via Wyndham Diamond).",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://comenity.net/caesarsrewards/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Engine: Wyndham Diamond status match remains better path to Caesars Diamond status without spend.
