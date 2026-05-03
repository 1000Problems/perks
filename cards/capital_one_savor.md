# Capital One Savor Rewards

`card_id`: capital_one_savor
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_savor",
  "name": "Capital One Savor Cash Rewards",
  "issuer": "Capital One",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["tiered_cashback", "dining_entertainment"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "capital_one_cashback",
  "currency_earned_notes": "Cash back; not Capital One Miles",

  "earning": [
    {"category": "dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "3% on dining (was rebranded from SavorOne in 2024)"},
    {"category": "entertainment", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Tickets, concerts, theme parks, etc."},
    {"category": "popular_streaming", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "grocery_excluding_walmart_target", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "hotels_rentals_capital_one_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 500,
    "spend_window_months": 3,
    "estimated_value_usd": 200,
    "notes": "Low spend hurdle"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Extended warranty", "signal_id": "extended_warranty", "value_estimate_usd": null, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month", "Capital One 2-personal-card-max"],

  "best_for": ["no_AF_dining_grocery_entertainment_combo", "households_with_streaming"],
  "synergies_with": ["capital_one_venture_x"],
  "competing_with_in_wallet": ["chase_freedom_flex", "amex_blue_cash_everyday"],

  "breakeven_logic_notes": "No AF; 3% on 4 broad categories is best-in-class for no-AF cashback breadth.",

  "recently_changed": true,
  "recently_changed_date": "2024-07",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/savor-cash-rewards/"]
}
```

## programs.json entry

```json
{
  "id": "capital_one_cashback",
  "name": "Capital One Cash Back",
  "type": "fixed_value",
  "issuer": "Capital One",
  "earning_cards": ["capital_one_savor", "capital_one_savor_one", "capital_one_quicksilver"],
  "fixed_redemption_cpp": 1.0,
  "portal_redemption_cpp": null,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.capitalone.com/"]
}
```

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **2024 rebrand**: The card formerly known as SavorOne was renamed to Savor in mid-2024; the prior Savor (with $95 AF) was discontinued. Engine should treat current Savor as the no-AF product.
- **Walmart/Target exclusion on grocery**: Standard.
- **0% FX**: Usable internationally.
