# Chase Ink Business Unlimited

`card_id`: chase_ink_business_unlimited
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "chase_ink_business_unlimited",
  "name": "Chase Ink Business Unlimited",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "business",
  "category": ["business", "flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "chase_ur",
  "currency_earned_notes": "Cash back; converts 1:1 to UR with paired Sapphire/Ink Preferred",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 6000,
    "spend_window_months": 6,
    "estimated_value_usd": 1500,
    "notes": "$750 face value or 75k UR via paired Ink Preferred"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (primary for business)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Purchase protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Extended warranty", "value_estimate_usd": null, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": "chase_ur",
  "transfer_partners_inherited_from_notes": "Only with paired Ink Preferred or Sapphire",

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["business_non_bonus_spend", "Ink_Preferred_pair_for_1_5x_UR"],
  "synergies_with": ["chase_ink_business_preferred", "chase_ink_business_cash", "chase_sapphire_preferred", "chase_sapphire_reserve"],
  "competing_with_in_wallet": ["amex_blue_business_plus", "capital_one_spark_cash_plus"],

  "breakeven_logic_notes": "No AF. 1.5x flat rate beats 2% only when paired with Ink/Sapphire Preferred (then 1.5x UR transferable, valued ~3cpp on Hyatt). Standalone, lower than Citi DC/WF Active Cash.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://creditcards.chase.com/business-credit-cards/ink/business-unlimited"
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

- **3% FX**: Domestic only.
- **Trifecta partner**: Forms the "Ink trifecta" with Ink Preferred + Ink Cash. All three together cover non-bonus, office/telecom, advertising/travel.
- **5/24 strategy**: Often used as the 4th and 5th business-card stack (Chase business cards don't count toward 5/24 personal but applications still pull personal credit).
