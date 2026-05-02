# SoFi Credit Card

`card_id`: sofi_credit_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "sofi_credit_card",
  "name": "SoFi Credit Card",
  "issuer": "SoFi Bank",
  "network": "Mastercard World",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "sofi_rewards",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "notes": "2% when redeemed to SoFi (invest, savings, debt payoff); 1% otherwise"}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null, "notes": "Periodic $200 SoFi bonuses"},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Rate-Down feature: $1k+ on-time payments unlocks 1% APR reduction", "value_estimate_usd": null, "category": "financing"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [],

  "best_for": ["sofi_user_seeking_2pct_with_invest_payoff"],
  "synergies_with": ["sofi_everyday_cash_rewards"],
  "competing_with_in_wallet": ["citi_double_cash"],

  "breakeven_logic_notes": "No AF. 2% requires SoFi redemption; 1% if user wants statement credit.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.sofi.com/credit-card/"]
}
```

## programs.json entry
Closed-loop SoFi rewards.

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Auto-deposit cashback to SoFi savings/invest is the differentiator (similar to Fidelity and Schwab cards).
