# Chase Freedom Unlimited

`card_id`: chase_freedom_unlimited
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "chase_freedom_unlimited",
  "name": "Chase Freedom Unlimited",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "chase_ur",
  "currency_earned_notes": "Earns cash back by default; converts to UR points 1:1 at a Sapphire/Ink Preferred holder's account, unlocking transfer partners",

  "earning": [
    {"category": "travel_chase_portal", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Includes takeout and delivery"},
    {"category": "drugstores", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "lyft", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "notes": "Through 2027-09-30"},
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 25000,
    "spend_required_usd": 500,
    "spend_window_months": 3,
    "estimated_value_usd": 500,
    "notes": "Limited-time $250 + 25k structure ended April 2026; standard offer reverts to $200 / $500 spend or similar low-spend hurdle. Verify before publishing."
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Purchase protection", "signal_id": "purchase_protection", "value_estimate_usd": null, "category": "purchase_protection", "notes": "120 days, $500/claim"},
    {"name": "Extended warranty", "signal_id": "extended_warranty", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Trip cancellation/interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "Up to $1,500/person, $6,000/trip"},
    {"name": "Auto rental CDW (secondary in US, primary abroad)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "chase_ur",
  "transfer_partners_inherited_from_notes": "Only when paired with a Sapphire (Preferred or Reserve) or Ink Preferred. Without one of those, points are cash back only.",

  "issuer_rules": [
    "Chase 5/24"
  ],

  "best_for": ["everyday_non_bonus_spend", "Sapphire_Preferred_pair_for_1_5x_UR", "no_AF_starter_with_partner_card"],
  "synergies_with": ["chase_sapphire_preferred", "chase_sapphire_reserve", "chase_ink_business_preferred", "chase_freedom_flex"],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_active_cash", "amex_blue_cash_everyday"],

  "breakeven_logic_notes": "No AF; positive value at $1 in spend. Strategic only when paired with a CSP/CSR/Ink Preferred — otherwise its 1.5x is beaten by 2% cards (Citi DC, WF Active Cash) on non-bonus spend.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
    "https://thepointsguy.com/credit-cards/chase-freedom-unlimited-freedom-flex-bonuses/",
    "https://www.nerdwallet.com/credit-cards/reviews/chase-freedom-unlimited"
  ]
}
```

## programs.json entry

See `chase_sapphire_preferred.md` for canonical chase_ur program. Note: CFU is in `earning_cards` and contributes points only at fixed cash-back value unless paired with a Sapphire/Ink Preferred for transfer access.

## issuer_rules.json entry

See `chase_sapphire_preferred.md`. Same Chase rules apply; CFU does count toward 5/24.

## perks_dedup.json entries

```json
[
  {
    "perk": "secondary_cdw",
    "card_ids": ["chase_freedom_unlimited"],
    "value_if_unique_usd": "use_based",
    "value_if_duplicate_usd": "use_based",
    "notes": "Secondary in US (kicks in after personal auto insurance). Primary internationally. Often used as a fallback for cards lacking primary CDW."
  }
]
```

## destination_perks.json entries

CFU contributes nothing destination-specific. Its value is a points-multiplier feeder for Sapphire/Ink ecosystem; downstream Hyatt and airline transfers come from the paired premium card.

## RESEARCH_NOTES.md entries

- **3% FX fee**: Important — do not use abroad. CFU is a domestic-spend card. Pair with CSP/CSR for international.
- **SUB volatility**: 25k+$250 limited offer (low $500 spend hurdle) ended April 30 2026. Reverting to standard offer; recheck before recommending.
- **No transfer partners alone**: CFU on its own is purely a cash-back card. Engine must check whether the user holds a Sapphire/Ink Preferred to award the "transfer partner unlock" value.
- **Lyft 2x**: A meaningful rate floor for ride-share-heavy users; expires 2027-09-30.
