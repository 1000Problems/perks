# Navy Federal More Rewards Amex

`card_id`: nfcu_more_rewards_amex
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "nfcu_more_rewards_amex",
  "name": "Navy Federal More Rewards American Express Card",
  "issuer": "Navy Federal Credit Union",
  "network": "Amex",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "nfcu_points",
  "membership_required": "NFCU membership",

  "earning": [
    {"category": "supermarkets_gas_dining_transit", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 25000, "spend_required_usd": 3000, "spend_window_months": 90, "estimated_value_usd": 250},

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["NFCU membership required"],

  "best_for": ["military_member_seeking_no_AF_grocery_gas_dining_3pct"],
  "synergies_with": ["nfcu_flagship_rewards"],
  "competing_with_in_wallet": ["amex_blue_cash_everyday"],

  "breakeven_logic_notes": "No AF, 0% FX, 3x grocery (no Walmart/Target exclusion). Best no-AF grocery card for NFCU members.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.navyfederal.org/products/credit-cards/personal-cards/more-rewards-american-express.html"]
}
```

## programs.json / issuer_rules
See `nfcu_flagship_rewards.md`.

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- 3% supermarket without typical Walmart/Target/wholesale-club exclusion that BCP/BCE have.
