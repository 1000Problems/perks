# Capital One Spark Cash Plus

`card_id`: capital_one_spark_cash_plus
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_spark_cash_plus",
  "name": "Capital One Spark Cash Plus",
  "issuer": "Capital One",
  "network": "Visa",
  "card_type": "business",
  "category": ["business", "flat_rate_cashback"],
  "annual_fee_usd": 150,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "capital_one_cashback",

  "earning": [
    {"category": "hotels_rentals_capital_one_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 200000,
    "spend_required_usd": 30000,
    "spend_window_months": 3,
    "estimated_value_usd": 2000,
    "notes": "$2,000 cash back; high spend hurdle. Has tiered structure with bonus on additional spend."
  },

  "annual_credits": [
    {"name": "AF refund if spending $150k+/year", "value_usd": 150, "type": "spend_threshold", "expiration": "annual", "ease_of_use": "hard", "notes": "Capital One refunds the AF if cardholder spends $150k or more in the year"}
  ],

  "ongoing_perks": [
    {"name": "Pay-in-full charge card (no preset spend limit)", "value_estimate_usd": null, "category": "financing", "notes": "Charge card; no set credit limit; balance must be paid in full each month"},
    {"name": "Free employee cards", "value_estimate_usd": null, "category": "business_admin"},
    {"name": "Visa business benefits", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,
  "transfer_partners_inherited_from_notes": "Spark Cash Plus does NOT earn transferable miles. Spark Miles separately earns capital_one_miles.",

  "issuer_rules": ["Capital One business 1-per-month informal limit"],

  "best_for": ["heavy_business_spend_2pct_flat", "no_preset_spend_limit_for_large_purchases"],
  "synergies_with": ["capital_one_venture_x_business", "capital_one_spark_miles"],
  "competing_with_in_wallet": ["amex_business_platinum_for_NPSL", "chase_ink_business_unlimited"],

  "breakeven_logic_notes": "AF $150 (refundable at $150k spend). Effective AF $0 for high-spend businesses. 2% flat = $300/yr at $15k spend, $3,000/yr at $150k. Purely cash-back, no transfer partners, so engine should not include in transferable-points workflows.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/small-business/credit-cards/spark-cash-plus/"]
}
```

## programs.json entry
See `capital_one_savor.md` (capital_one_cashback).

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- Pay-in-full structure (charge card) — engine should flag for users seeking revolving credit.
- Used by businesses with vendor invoices or equipment purchases > standard credit limits.
