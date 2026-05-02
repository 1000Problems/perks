# Upgrade Cash Rewards Visa

`card_id`: upgrade_cash_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "upgrade_cash_rewards",
  "name": "Upgrade Cash Rewards Visa",
  "issuer": "Upgrade / Cross River Bank",
  "network": "Visa",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "upgrade_cashback",

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 200, "notes": "Often $200 statement credit"},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Hybrid card-loan structure: balances convert to fixed-payment installment loans", "value_estimate_usd": null, "category": "financing"},
    {"name": "No fees", "value_estimate_usd": null, "category": "fee_free"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [],

  "best_for": ["users_who_want_fixed_payment_balance_structure"],
  "synergies_with": ["upgrade_triple_cash_rewards", "upgrade_bitcoin_rewards"],
  "competing_with_in_wallet": ["citi_double_cash"],

  "breakeven_logic_notes": "No AF. 1.5% flat. Balance auto-converts to installment loan (fixed APR, fixed payments). Engine should warn users this is unusual structure.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.upgrade.com/cards/cash-rewards/"]
}
```

## programs.json entry
Closed-loop Upgrade cashback.

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Hybrid loan structure: every purchase becomes a small installment loan with fixed APR. Distinct from revolving credit; engine should flag for users seeking traditional revolving cards.
