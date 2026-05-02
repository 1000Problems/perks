# Chase Freedom Flex

`card_id`: chase_freedom_flex
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "chase_freedom_flex",
  "name": "Chase Freedom Flex",
  "issuer": "Chase",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["rotating_5_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "chase_ur",
  "currency_earned_notes": "Earns cash back; converts 1:1 to UR with a Sapphire/Ink Preferred holder",

  "earning": [
    {"category": "rotating_quarterly_5pct", "rate_pts_per_dollar": 5, "cap_usd_per_year": 6000, "notes": "$1,500/quarter cap on activated categories. 2026 Q2 = Amazon, Whole Foods, Chase Travel (9% for CFF), Feeding America. Quarterly activation required."},
    {"category": "travel_chase_portal", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "drugstores", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 500,
    "spend_window_months": 3,
    "estimated_value_usd": 400,
    "notes": "$200 cash back equivalent. Has hit $250 / 25k in past elevated periods."
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Cell phone protection", "value_estimate_usd": null, "category": "purchase_protection", "notes": "$800/claim, $50 deductible, 2 claims/12mo"},
    {"name": "Trip cancellation/interruption", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Auto rental CDW (secondary US, primary abroad)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Purchase protection", "value_estimate_usd": null, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": "chase_ur",
  "transfer_partners_inherited_from_notes": "Only via paired Sapphire/Ink Preferred",

  "issuer_rules": [
    "Chase 5/24"
  ],

  "best_for": ["rotating_5_pct_chaser", "Sapphire_pair_for_quarterly_5x_UR", "no_AF_with_cell_phone_protection"],
  "synergies_with": ["chase_sapphire_preferred", "chase_sapphire_reserve", "chase_freedom_unlimited", "chase_ink_business_preferred"],
  "competing_with_in_wallet": ["discover_it_cash_back", "citi_custom_cash"],

  "breakeven_logic_notes": "No AF; activated quarterly $1,500 cap delivers up to $300/year in extra rewards on bonus categories vs flat-rate. Cell phone protection itself is worth $50-100/yr in expected value.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://creditcards.chase.com/cash-back-credit-cards/freedom/flex",
    "https://media.chase.com/news/chase-freedom-2026-q2-categories",
    "https://thepointsguy.com/credit-cards/activate-chase-freedom-5x-earnings/"
  ]
}
```

## programs.json entry

See `chase_sapphire_preferred.md` for chase_ur canonical entry. CFF in earning_cards.

## issuer_rules.json entry

See `chase_sapphire_preferred.md`. Chase 5/24 applies.

## perks_dedup.json entries

```json
[
  {
    "perk": "cell_phone_protection",
    "card_ids": ["chase_freedom_flex"],
    "value_if_unique_usd": 80,
    "value_if_duplicate_usd": 0,
    "notes": "Many cards offer cell phone protection (Wells Fargo Active Cash, Cap One Venture X, etc.). Engine should pick best terms. CFF: $800/claim, $50 deductible."
  }
]
```

## destination_perks.json entries

None — CFF is an everyday domestic earner. Not destination-specific.

## RESEARCH_NOTES.md entries

- **CFF closed to new applicants**: As of 2024, Chase rebranded the no-AF Freedom rotating card and the new product line is back to Chase Freedom (without "Flex"). Existing Flex holders retained the card. Verify before new-card recommendation — for new applicants the relevant SKU is "Chase Freedom" (no Flex).
- **2026 Q2 elevated 9% Chase Travel**: Q2 2026 has an unusual 9% (not 5%) on Chase Travel for CFF — flagged because it differs from typical 5% rotating structure.
- **3% FX fee**: Domestic-only card.
- **Cell phone protection**: One of the more useful no-AF perks; engine should weight this when comparing to Citi Custom Cash (no cell phone protection) or Wells Fargo Active Cash (similar protection, different deductible).
