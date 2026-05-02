# US Bank Altitude Go

`card_id`: us_bank_altitude_go
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "us_bank_altitude_go",
  "name": "US Bank Altitude Go Visa Signature",
  "issuer": "US Bank",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "us_bank_flexpoints",

  "earning": [
    {"category": "dining_takeout_delivery", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "grocery_streaming", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "gas_ev_charging", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 20000, "spend_required_usd": 1000, "spend_window_months": 90, "estimated_value_usd": 200},

  "annual_credits": [
    {"name": "$15 streaming credit semi-annually", "value_usd": 30, "type": "specific", "expiration": "split_h1_h2", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": "us_bank_flexpoints",

  "issuer_rules": ["USB 30-day rule"],

  "best_for": ["dining_focused_no_AF_no_FX"],
  "synergies_with": ["us_bank_altitude_reserve"],
  "competing_with_in_wallet": ["amex_gold"],

  "breakeven_logic_notes": "No AF, 0% FX, 4% dining. Strong no-AF dining card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usbank.com/credit-cards/altitude-go-visa-signature-credit-card.html"]
}
```

## programs.json entry
See `us_bank_altitude_reserve.md`.

## issuer_rules.json entry
See `us_bank_altitude_reserve.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Best no-AF, no-FX dining card.
