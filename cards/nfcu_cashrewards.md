# Navy Federal cashRewards

`card_id`: nfcu_cashrewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "nfcu_cashrewards",
  "name": "Navy Federal cashRewards Credit Card",
  "issuer": "Navy Federal Credit Union",
  "network": "Mastercard / Visa",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "nfcu_points",
  "membership_required": "NFCU membership",

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 1.75, "cap_usd_per_year": null, "notes": "1.75% with NFCU direct deposit; 1.5% without"}],

  "signup_bonus": {"amount_pts": 20000, "spend_required_usd": 2000, "spend_window_months": 90, "estimated_value_usd": 200},

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["NFCU membership required"],

  "best_for": ["military_member_seeking_simple_flat_rate"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_double_cash"],

  "breakeven_logic_notes": "No AF. 1.75% with direct deposit beats 1.5% non-bonus cards but loses to 2% (DC, Active Cash).",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.navyfederal.org/products/credit-cards/personal-cards/cash-rewards.html"]
}
```

## programs.json / issuer_rules
See `nfcu_flagship_rewards.md`.

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- 0% FX with no AF makes this strong international backup for NFCU members.
