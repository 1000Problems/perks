# Chase Disney Premier Visa

`card_id`: disney_premier_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "disney_premier_visa",
  "name": "Chase Disney Premier Visa Card",
  "issuer": "Chase",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["retail_cobrand", "tiered_cashback"],
  "annual_fee_usd": 49,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "disney_rewards",

  "earning": [
    {"category": "disney_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "5% Disney Rewards Dollars on purchases at Disney/Disney+/Hulu/ESPN+/etc."},
    {"category": "gas_grocery_dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 300,
    "notes": "Often $300 statement credit"
  },

  "annual_credits": [
    {"name": "$150 Disney statement credit after $1k spend", "value_usd": 150, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "10% off Disney purchases", "value_estimate_usd": null, "category": "lifestyle"},
    {"name": "Disney character meet-and-greet", "value_estimate_usd": null, "category": "lifestyle"},
    {"name": "Disney vacation special financing", "value_estimate_usd": null, "category": "financing"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["disney_family_with_$150_annual_credit_use"],
  "synergies_with": ["disney_visa"],
  "competing_with_in_wallet": ["disney_visa"],

  "breakeven_logic_notes": "AF $49 less $150 Disney credit = -$101 if used. Easy positive value for any Disney park visitor.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://disneyrewards.com/cards/disney-premier-visa-card/"]
}
```

## programs.json entry
See `disney_visa.md`.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `disney_visa.md`.

## RESEARCH_NOTES.md entries
- 0% FX (Premier vs base Disney Visa's 3%).
