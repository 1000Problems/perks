# Chase Ink Business Cash

`card_id`: chase_ink_business_cash
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "chase_ink_business_cash",
  "name": "Chase Ink Business Cash",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "business",
  "category": ["business", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "chase_ur",
  "currency_earned_notes": "Cash back; converts 1:1 to UR with paired Sapphire/Ink Preferred",

  "earning": [
    {"category": "office_supplies", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "cap_combined_usd": 25000, "notes": "5% on first $25k combined office supply + internet/cable/phone per year"},
    {"category": "internet_cable_phone", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "cap_combined_usd": 25000},
    {"category": "gas_stations", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "cap_combined_usd": 25000, "notes": "2% on first $25k combined gas + dining per year"},
    {"category": "dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "cap_combined_usd": 25000},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 6000,
    "spend_window_months": 6,
    "estimated_value_usd": 1500,
    "notes": "$750 cash back equivalent, or 75k UR if paired with Ink/Sapphire Preferred. Often split-tier (e.g. $350 + $400)."
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (primary for business)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Purchase protection", "signal_id": "purchase_protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Extended warranty", "signal_id": "extended_warranty", "value_estimate_usd": null, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": "chase_ur",
  "transfer_partners_inherited_from_notes": "Only with paired Ink Preferred or Sapphire",

  "issuer_rules": [
    "Chase 5/24 (business apps still pull personal credit)"
  ],

  "best_for": ["small_business_office_supplies_and_telecom", "Visa_gift_card_5x_via_office_supply_stores"],
  "synergies_with": ["chase_ink_business_preferred", "chase_ink_business_unlimited", "chase_sapphire_preferred", "chase_sapphire_reserve"],
  "competing_with_in_wallet": ["amex_blue_business_cash", "us_bank_business_triple_cash"],

  "breakeven_logic_notes": "No AF; 5x on office supplies up to $25k = $1,250/yr ceiling. Combined with Ink Preferred unlocks transfer partners on the 5x category — a top-tier earning rate for transferable points.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://creditcards.chase.com/business-credit-cards/ink/business-cash",
    "https://thepointsguy.com/credit-cards/chase-ink-business-cash-review/"
  ]
}
```

## programs.json entry

See `chase_sapphire_preferred.md`.

## issuer_rules.json entry

See `chase_sapphire_preferred.md`.

## perks_dedup.json entries

None unique.

## destination_perks.json entries

None.

## RESEARCH_NOTES.md entries

- **Office supply 5x sweet spot**: Office supply stores (Staples, Office Depot) historically sell Visa/Mastercard gift cards. This makes Ink Cash a manufactured-spend gateway — not for everyone, but engine should flag for users with high non-bonus spend.
- **3% FX fee**: Domestic only.
- **$25k combined cap on 5x**: Cap resets every cardmember anniversary year, not calendar year.
- **SUB structure**: Often shown as $350 after $3k spend in 3 months + $400 after $6k more in 6 months. Confirm current offer structure before recommending.
