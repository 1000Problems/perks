# Chase Instacart Mastercard

`card_id`: instacart_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "instacart_mastercard",
  "name": "Chase Instacart Mastercard",
  "issuer": "Chase",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": "instacart_credit",

  "earning": [
    {"category": "instacart", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "5% on Instacart purchases (capped)"},
    {"category": "gas_restaurants_other_streaming", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 100,
    "notes": "Free Instacart+ year + $100 statement credit"
  },

  "annual_credits": [
    {"name": "Free Instacart+ membership", "value_usd": 99, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "Free delivery on Instacart+ orders $35+", "value_estimate_usd": null, "category": "lifestyle"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["instacart_user_with_$50_plus_monthly_grocery_delivery"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Free Instacart+ ($99) covers any opportunity cost. Engine: surface for users mentioning Instacart.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/instacart"]
}
```

## programs.json entry
Closed-loop Instacart credit.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 3% FX. Domestic only.
- Instacart+ is the headline benefit.
