# Apple Card

`card_id`: apple_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "apple_card",
  "name": "Apple Card",
  "issuer": "Goldman Sachs (transitioning to alternate issuer in 2026 — verify)",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "apple_daily_cash",

  "earning": [
    {"category": "apple_purchases_or_apple_pay", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "3% on Apple-direct purchases AND select merchants paid via Apple Pay (Walgreens, Duane Reade, Uber, T-Mobile, ExxonMobil, Nike, Panera, Ace Hardware)"},
    {"category": "apple_pay", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "notes": "2% on all Apple Pay purchases not in 3% list"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "No SUB. Periodic $50-200 promotions on specific merchants."
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Daily Cash payouts", "value_estimate_usd": null, "category": "rewards_payout", "notes": "Cash deposited to Apple Cash same day"},
    {"name": "No fees of any kind", "value_estimate_usd": null, "category": "fee_free"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Goldman Sachs single-card-per-customer policy"],

  "best_for": ["heavy_Apple_user_with_iPhone_for_2_pct_Apple_Pay", "users_seeking_zero_fees_low_friction"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_active_cash"],

  "breakeven_logic_notes": "No AF. 2% Apple Pay matches Citi DC for non-bonus spend, with same-day cash. 1% physical card is poor; engine should recommend only when paired with iPhone/Apple Watch user behavior.",

  "recently_changed": true,
  "recently_changed_date": "2026 (issuer transition rumored)",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.apple.com/apple-card/"]
}
```

## programs.json entry

```json
{
  "id": "apple_daily_cash",
  "name": "Apple Daily Cash",
  "type": "fixed_value",
  "issuer": "Goldman Sachs (Apple)",
  "earning_cards": ["apple_card"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.apple.com/apple-card/"]
}
```

## issuer_rules.json entry

```json
{
  "issuer": "Goldman Sachs (Apple Card)",
  "rules": [
    {
      "id": "gs_apple_single_card",
      "name": "One Apple Card per customer",
      "description": "Goldman issues only one Apple Card per Apple ID.",
      "applies_to": "apple_card",
      "official": true
    }
  ]
}
```

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Issuer transition**: Goldman Sachs has been winding down its consumer business; Apple Card may transfer to a new issuer in 2026. Verify before recommending.
- **No fees**: No FX, no late, no over-limit, no annual. Strong value prop for fee-averse users.
- **Apple Pay terminal acceptance**: 2% only when Apple Pay used at terminal. Physical card swipe = 1%.
