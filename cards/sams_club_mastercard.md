# Sam's Club Mastercard

`card_id`: sams_club_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "sams_club_mastercard",
  "name": "Sam's Club Mastercard",
  "issuer": "Synchrony",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["retail_cobrand"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": "sams_club_cashback",
  "membership_required": "Sam's Club membership",

  "earning": [
    {"category": "gas_stations_ev", "rate_pts_per_dollar": 5, "cap_usd_per_year": 6000, "notes": "5% on first $6k/yr, then 1%"},
    {"category": "dining_takeout", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null},
    {"category": "sams_club_purchases_plus_member_only", "rate_pts_per_dollar": 2, "cap_usd_per_year": 5000, "notes": "Plus members only; capped"}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 30,
    "notes": "Periodic $30 statement credit on first purchase"
  },

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Sam's Club membership required to apply"],

  "best_for": ["Sams_Club_member_with_$6k_plus_gas_spend"],
  "synergies_with": [],
  "competing_with_in_wallet": ["costco_anywhere_visa"],

  "breakeven_logic_notes": "No AF (membership separately). 5% gas at $6k cap = $300/yr ceiling. Strong commuter card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.samsclub.com/credit"]
}
```

## programs.json entry
Closed-loop. No transfer partners.

## issuer_rules.json entry
None unique.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Annual cashback paid as Sam's Club voucher, redeemable in-club.
- 3% FX makes this domestic-only.
