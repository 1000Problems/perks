# My Best Buy Visa

`card_id`: my_best_buy_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "my_best_buy_visa",
  "name": "My Best Buy Visa Card",
  "issuer": "Citibank (Best Buy co-brand)",
  "network": "Visa",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "best_buy_rewards",

  "earning": [
    {"category": "best_buy_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "5% back as Best Buy reward certificates"},
    {"category": "gas_grocery_dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 50},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Special financing on Best Buy purchases", "value_estimate_usd": null, "category": "financing"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Citi 8/65"],

  "best_for": ["best_buy_loyalist_with_electronics_spend"],
  "synergies_with": [],
  "competing_with_in_wallet": ["my_best_buy_credit"],

  "breakeven_logic_notes": "No AF. Visa version earns on non-BB spend; closed-loop earns only at BB.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bestbuy.com/credit-cards"]
}
```

## programs.json entry
Closed-loop Best Buy reward certs.

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Best Buy reward certs only redeemable at Best Buy.
