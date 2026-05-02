# Verizon Visa Card

`card_id`: verizon_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "verizon_visa",
  "name": "Verizon Visa Card",
  "issuer": "Synchrony",
  "network": "Visa",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "verizon_dollars",

  "earning": [
    {"category": "grocery_gas", "rate_pts_per_dollar": 4, "cap_usd_per_year": null, "notes": "4% back as Verizon Dollars"},
    {"category": "dining_takeout", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "verizon_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 100},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Up to $10/mo off Verizon mobile bill via auto-pay", "value_estimate_usd": 120, "category": "lifestyle"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Verizon Wireless customer required"],

  "best_for": ["verizon_customer_with_mobile_plan_discount"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Mobile-bill discount alone covers any opportunity cost. 4% grocery/gas is competitive.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.verizon.com/solutions-and-services/verizon-visa-card/"]
}
```

## programs.json entry
Closed-loop Verizon Dollars (redeemable against Verizon bill or accessories).

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Verizon Dollars only redeemable to Verizon services.
- $10/mo mobile discount via auto-pay is the killer feature for Verizon customers.
