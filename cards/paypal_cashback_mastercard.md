# PayPal Cashback Mastercard

`card_id`: paypal_cashback_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "paypal_cashback_mastercard",
  "name": "PayPal Cashback Mastercard",
  "issuer": "Synchrony",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "paypal_cashback",

  "earning": [
    {"category": "paypal_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "Periodic $200 promotional"
  },

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [],

  "best_for": ["paypal_user_seeking_3pct"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_active_cash"],

  "breakeven_logic_notes": "No AF. 2% flat with 0% FX. Ties Citi DC; 3% PayPal beats most for online checkouts paying via PayPal.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.paypal.com/us/digital-wallet/credit-cards/cashback-mastercard"]
}
```

## programs.json entry

```json
{
  "id": "paypal_cashback",
  "name": "PayPal Cashback",
  "type": "fixed_value",
  "issuer": "Synchrony (PayPal)",
  "earning_cards": ["paypal_cashback_mastercard"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.paypal.com/"]
}
```

## issuer_rules.json entry
None unique.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 0% FX is unusual for a no-AF cashback card; viable secondary international card.
- Cashback redeems to PayPal balance.
