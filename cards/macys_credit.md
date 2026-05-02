# Macy's Credit Card

`card_id`: macys_credit
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "macys_credit",
  "name": "Macy's Credit Card",
  "issuer": "Citibank (Macy's co-brand)",
  "network": "Closed-loop",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": null,
  "credit_score_required": "fair",
  "currency_earned": "macys_star_rewards",

  "earning": [{"category": "macys_purchases", "rate_pts_per_dollar": 1, "cap_usd_per_year": null, "notes": "Star Rewards points; bonus offers via account"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 25, "notes": "20% off first day"},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Star Pass coupons via membership tiers", "value_estimate_usd": null, "category": "lifestyle"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Citi 8/65"],

  "best_for": ["frequent_macys_shoppers"],
  "synergies_with": ["macys_amex"],
  "competing_with_in_wallet": ["macys_amex"],

  "breakeven_logic_notes": "No AF. Closed-loop only.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.macys.com/cms/macys-credit-card-services"]
}
```

## programs.json entry
Closed-loop Macy's Star Rewards.

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Star Rewards Platinum tier (top spenders) gets 5% back.
