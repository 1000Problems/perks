# Choice Privileges Visa Signature

`card_id`: choice_privileges_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "choice_privileges_visa",
  "name": "Choice Privileges Visa Signature Card",
  "issuer": "Wells Fargo (issued for Choice)",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["hotel_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "choice_privileges",

  "earning": [
    {"category": "choice_hotels_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 60000,
    "spend_required_usd": 1000,
    "spend_window_months": 3,
    "estimated_value_usd": 360
  },

  "annual_credits": [
    {"name": "8,000 anniversary points", "value_usd": 48, "type": "rewards", "expiration": "annual_anniversary", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "Choice Gold status", "value_estimate_usd": null, "category": "hotel_status"}
  ],

  "transfer_partners_inherited_from": "choice_privileges",

  "issuer_rules": ["WF 6-month rule"],

  "best_for": ["budget_road_trips_via_Comfort_Inn_Quality_Inn"],
  "synergies_with": ["citi_strata_premier", "wells_fargo_active_cash"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Useful only for users staying at Choice properties (Comfort, Quality, Cambria, etc.).",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.wellsfargo.com/credit-cards/choice-privileges-credit-card/"]
}
```

## programs.json entry (choice_privileges)

```json
{
  "id": "choice_privileges",
  "name": "Choice Privileges",
  "type": "cobrand_hotel",
  "issuer": "Choice Hotels",
  "earning_cards": ["choice_privileges_visa", "choice_privileges_visa_business"],
  "fixed_redemption_cpp": 0.6,
  "transfer_partners_notes": "Receives transfers from Citi TY (1:2 — excellent), Capital One Miles (1:1).",
  "sweet_spots": [
    {"description": "Preferred Hotels & Resorts via Choice transfer at fixed point cost", "value_estimate_usd": "~2cpp", "source": null}
  ],
  "sources": ["https://www.choicehotels.com/choice-privileges"]
}
```

## issuer_rules.json entry
See `wells_fargo_active_cash.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Choice 1:2 transfer from Citi TY makes Strata Premier a stronger Choice points source than this card.
