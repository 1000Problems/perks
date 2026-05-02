# JetBlue Plus

`card_id`: jetblue_plus
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "jetblue_plus",
  "name": "JetBlue Plus Card",
  "issuer": "Barclays",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 99,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "jetblue_trueblue",

  "earning": [
    {"category": "jetblue_purchases", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "restaurants_grocery", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 60000,
    "spend_required_usd": 1000,
    "spend_window_months": 3,
    "estimated_value_usd": 800
  },

  "annual_credits": [
    {"name": "5,000 anniversary points", "value_usd": 70, "type": "rewards", "expiration": "annual_anniversary", "ease_of_use": "easy"},
    {"name": "10% rebate on award flights", "value_usd": null, "type": "rewards_modifier", "expiration": "ongoing", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag", "value_estimate_usd": 140, "category": "airline_perk"},
    {"name": "50% off inflight food/drink", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Mosaic status with $50k spend", "value_estimate_usd": null, "category": "elite_status"}
  ],

  "transfer_partners_inherited_from": "jetblue_trueblue",

  "issuer_rules": ["Barclays 6/24 informal rule"],

  "best_for": ["JetBlue_loyalist_NYC_BOS_FLL"],
  "synergies_with": ["chase_sapphire_preferred"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $99 less 5k anniversary pts ($70) = $29 net. Free bag + 10% award rebate makes this worth it for occasional JetBlue flyers.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cards.barclaycardus.com/cards/jetblue-plus-card/"]
}
```

## programs.json entry (jetblue_trueblue)

```json
{
  "id": "jetblue_trueblue",
  "name": "JetBlue TrueBlue",
  "type": "cobrand_airline",
  "issuer": "JetBlue Airways",
  "earning_cards": ["jetblue_plus", "jetblue_business"],
  "fixed_redemption_cpp": 1.4,
  "transfer_partners_notes": "Receives transfers from Chase UR (1:1), Citi TY (1:1), Bilt (1:1). Amex MR transfers at 1.25:1 (less favorable).",
  "sweet_spots": [
    {"description": "Mint business class with low cash equivalents during sales", "value_estimate_usd": "~1.6cpp", "source": null}
  ],
  "sources": ["https://www.jetblue.com/trueblue"]
}
```

## issuer_rules.json entry (Barclays)

```json
{
  "issuer": "Barclays",
  "rules": [
    {
      "id": "barclays_6_24",
      "name": "6/24 informal rule",
      "description": "Barclays may deny if applicant has 6+ new accounts in 24 months.",
      "applies_to": "barclays_personal",
      "official": false
    },
    {
      "id": "barclays_aa_aviator_business_path",
      "name": "AA Aviator Business no-spend SUB",
      "description": "Aviator Business historically awards SUB after just 1 transaction (not full spend hurdle).",
      "applies_to": "barclays_aa_aviator_business",
      "official": true
    }
  ]
}
```

## perks_dedup.json entries
None unique.

## destination_perks.json entries

```json
{
  "northeast_caribbean": {
    "airline_routes_strong": ["JetBlue at JFK/BOS/FLL/SJU"],
    "relevant_cards": ["jetblue_plus"]
  }
}
```

## RESEARCH_NOTES.md entries
- 10% award rebate is unique among co-brand cards; effectively reduces award cost by 10% on every redemption.
