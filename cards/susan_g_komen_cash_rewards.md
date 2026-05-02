# Susan G. Komen Pink Ribbon BankAmericard Cash Rewards Visa

`card_id`: susan_g_komen_cash_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "susan_g_komen_cash_rewards",
  "name": "Susan G. Komen Pink Ribbon BankAmericard Cash Rewards Visa",
  "issuer": "Bank of America",
  "network": "Visa",
  "card_type": "personal",
  "category": ["affinity_cobrand", "tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": "boa_points",

  "earning": [
    {"category": "user_choice_3pct_category", "rate_pts_per_dollar": 3, "cap_combined_per_quarter_usd": 2500},
    {"category": "grocery_wholesale", "rate_pts_per_dollar": 2, "cap_combined_per_quarter_usd": 2500},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "earning_modifier_preferred_rewards": "PH 75% bonus = 5.25%/3.5%/1.75%",

  "signup_bonus": {"amount_pts": 20000, "spend_required_usd": 1000, "spend_window_months": 3, "estimated_value_usd": 200},
  "annual_credits": [],
  "ongoing_perks": [{"name": "Donation to Susan G. Komen on each purchase", "value_estimate_usd": null, "category": "lifestyle"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["BoA 2/3/4", "Preferred Rewards bonus"],

  "best_for": ["donors_aligning_spend_with_breast_cancer_research"],
  "synergies_with": ["boa_customized_cash"],
  "competing_with_in_wallet": ["boa_customized_cash"],

  "breakeven_logic_notes": "Functionally identical to Customized Cash with Komen-branded affinity donation.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/susan-g-komen-cash-rewards-credit-card/"]
}
```

See `boa_customized_cash.md` for shared sections.
