# Frontier Airlines World Mastercard

`card_id`: frontier_world_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "frontier_world_mastercard",
  "name": "Frontier Airlines World Mastercard",
  "issuer": "Barclays",
  "network": "Mastercard World",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 79,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "frontier_miles",

  "earning": [
    {"category": "frontier_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 50000, "spend_required_usd": 1000, "spend_window_months": 90, "estimated_value_usd": 500},

  "annual_credits": [
    {"name": "$100 flight voucher after $2,500 spend", "value_usd": 100, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "medium"},
    {"name": "Family pooling", "value_estimate_usd": null, "type": "lifestyle", "expiration": "ongoing", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag (after $25k spend)", "signal_id": "free_checked_bag", "value_estimate_usd": 140, "category": "airline_perk"},
    {"name": "Earn Frontier Elite status with $15k spend", "value_estimate_usd": null, "category": "elite_status_acceleration"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["frontier_loyalist", "discount_carrier_traveler"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $79. Spend gates make this best for $25k+ Frontier annual spenders.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cards.barclaycardus.com/banking/cards/frontier-airlines-world-mastercard/"]
}
```

## programs.json entry
Closed-loop Frontier Miles.

## issuer_rules.json entry
See `jetblue_plus.md` for Barclays.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Family pooling is unusual benefit.
