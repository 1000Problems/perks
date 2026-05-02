# USAA Preferred Cash Rewards

`card_id`: usaa_preferred_cash_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "usaa_preferred_cash_rewards",
  "name": "USAA Preferred Cash Rewards Visa Signature",
  "issuer": "USAA",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 1,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "usaa_cashback",
  "membership_required": "USAA membership",

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["USAA membership required"],

  "best_for": ["military_member_simple_flat_rate"],
  "synergies_with": [],
  "competing_with_in_wallet": ["nfcu_cashrewards"],

  "breakeven_logic_notes": "No AF, 1% FX, 1.5% flat. Reasonable but not class-leading.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usaa.com/inet/wc/preferred-cash-rewards-visa"]
}
```

## programs.json / issuer_rules
See `usaa_eagle_navigator.md`.

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- 1% FX is better than most no-AF cards' 3%.
