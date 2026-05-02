# Capital One SavorOne (legacy variant)

`card_id`: capital_one_savor_one
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_savor_one",
  "name": "Capital One SavorOne Cash Rewards (legacy variant — see notes)",
  "issuer": "Capital One",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "capital_one_cashback",

  "earning": [
    {"category": "dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "entertainment", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "popular_streaming", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "grocery_excluding_walmart_target", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "hotels_rentals_capital_one_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 500,
    "spend_window_months": 3,
    "estimated_value_usd": 200
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month", "Capital One 2-personal-card-max"],

  "best_for": ["no_AF_dining_grocery_entertainment"],
  "synergies_with": ["capital_one_venture_x"],
  "competing_with_in_wallet": ["capital_one_savor"],

  "breakeven_logic_notes": "No AF; same earning structure as current Savor.",

  "recently_changed": true,
  "recently_changed_date": "2024-07 rebrand",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/savorone/"]
}
```

## programs.json entry
See `capital_one_savor.md`.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Same product as Savor** in current Cap One lineup — research doc lists separately. Current Cap One SavorOne is the no-AF variant; legacy with-AF Savor was discontinued in 2024 rebrand. Engine should treat `capital_one_savor` and `capital_one_savor_one` as identical for matching purposes, or merge in canonical layer.
