# Citi Strata Premier

`card_id`: citi_strata_premier
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_strata_premier",
  "name": "Citi Strata Premier Card",
  "issuer": "Citi",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "citi_thankyou",

  "earning": [
    {"category": "hotels_cars_attractions_citi_travel", "rate_pts_per_dollar": 10, "cap_usd_per_year": null, "notes": "Via CitiTravel.com"},
    {"category": "airlines", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "hotels_other", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "restaurants", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "supermarkets", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "gas_stations_ev_charging", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "estimated_value_usd": 1100,
    "notes": "Has hit 80k-90k. Citi 8/65/95 ThankYou family rules apply."
  },

  "annual_credits": [
    {"name": "Hotel credit", "value_usd": 100, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium", "notes": "Single hotel stay of $500+ via CitiTravel.com"}
  ],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Trip cancellation/interruption", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Trip delay protection", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Lost or damaged baggage protection", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "citi_thankyou",

  "issuer_rules": [
    "Citi 8/65 (8 cards in 65 days max)",
    "Citi 1/8 (1 Citi card every 8 days)",
    "Citi 2/65 (2 cards in 65 days)",
    "Citi ThankYou family 24-month rule: cannot earn SUB on Strata Premier if received bonus on Premier/Strata Premier in last 24 months"
  ],

  "best_for": ["broad_3x_categories_at_$95_AF", "AAdvantage_transfer_users", "Turkish_Miles_Smiles_for_United"],
  "synergies_with": ["citi_double_cash", "citi_custom_cash"],
  "competing_with_in_wallet": ["chase_sapphire_preferred", "amex_gold", "capital_one_venture"],

  "breakeven_logic_notes": "AF $95 less $100 hotel credit (medium) = -$5 net AF if used. Broadest 3x category footprint among $95 mid-tier cards. Strong choice if user prefers ThankYou ecosystem (American AAdvantage transfer, Turkish Miles+Smiles).",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.citi.com/credit-cards/citi-strata-premier-credit-card",
    "https://thepointsguy.com/credit-cards/citi-strata-vs-citi-strata-premier/"
  ]
}
```

## programs.json entry (citi_thankyou)

```json
{
  "id": "citi_thankyou",
  "name": "Citi ThankYou Rewards",
  "type": "transferable",
  "issuer": "Citi",
  "earning_cards": [
    "citi_strata_premier",
    "citi_strata",
    "citi_double_cash",
    "citi_custom_cash",
    "citi_rewards_plus"
  ],
  "transfer_unlock_card_ids": [
    "citi_strata_premier",
    "citi_strata_elite"
  ],
  "fixed_redemption_cpp": 1.0,
  "portal_redemption_cpp": 1.0,
  "transfer_partners": [
    {"partner": "American Airlines AAdvantage", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": "Unique to TY among major US transferable currencies"},
    {"partner": "Air France-KLM Flying Blue", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Avianca LifeMiles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Cathay Pacific Asia Miles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Emirates Skywards", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Etihad Guest", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "EVA Infinity MileageLands", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "JetBlue TrueBlue", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": "Best 1:1 of any TPG partner"},
    {"partner": "Qantas Frequent Flyer", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Qatar Privilege Club", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Singapore KrisFlyer", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Turkish Miles & Smiles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Virgin Atlantic Flying Club", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Choice Privileges", "ratio": "1:2", "type": "hotel", "min_transfer": 1000, "notes": "1:2 ratio is excellent for Choice transfers"},
    {"partner": "Wyndham Rewards", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": null},
    {"partner": "Accor Live Limitless", "ratio": "2:1", "type": "hotel", "min_transfer": 1000, "notes": null}
  ],
  "sweet_spots": [
    {"description": "American AAdvantage off-peak / web specials", "value_estimate_usd": "~2-3cpp", "source": null},
    {"description": "Turkish Miles & Smiles 7,500-mi United domestic", "value_estimate_usd": "~5-8cpp", "source": null},
    {"description": "Choice Privileges 1:2 transfer for European Preferred Hotels", "value_estimate_usd": "~2-3cpp", "source": null}
  ],
  "sources": ["https://www.citi.com/credit-cards/thank-you-rewards"]
}
```

## issuer_rules.json entry (Citi)

```json
{
  "issuer": "Citi",
  "rules": [
    {
      "id": "citi_8_65",
      "name": "8 cards in 65 days",
      "description": "Citi limits applicants to 8 card approvals across all Citi products in any 65-day rolling window.",
      "applies_to": "all_citi_cards",
      "official": false
    },
    {
      "id": "citi_2_65",
      "name": "2 cards in 65 days (per cardholder)",
      "description": "Stricter rule informally enforced for new accounts: 2 personal cards in 65 days max.",
      "applies_to": "citi_personal",
      "official": false
    },
    {
      "id": "citi_1_8",
      "name": "1 card per 8 days",
      "description": "No two Citi applications submitted within 8 days of each other.",
      "applies_to": "all_citi_cards",
      "official": false
    },
    {
      "id": "citi_thankyou_24_month",
      "name": "ThankYou family 24-month rule",
      "description": "Cannot earn SUB on a TY-earning card if received SUB on the same product or a sister product (Premier/Strata Premier) in the last 24 months.",
      "applies_to": "citi_thankyou_cards",
      "official": true
    },
    {
      "id": "citi_24_month_aa",
      "name": "AA card 48-month rule",
      "description": "Citi AA cards: cannot earn SUB if received bonus on the same AA card in the last 48 months.",
      "applies_to": "citi_aa_cards",
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
  "us_domestic_with_aa": {
    "airline_routes_strong": ["American Airlines"],
    "relevant_cards": ["citi_strata_premier (TY transfer to AA)"],
    "notes": "TY is one of two transferable currencies that transfer to AA (the other is Bilt). Useful for AA Web Specials and off-peak."
  }
}
```

## RESEARCH_NOTES.md entries

- **Citi Strata** (sister card, lower tier) — file separately.
- **Premier rebranded as Strata Premier in 2024.** Old Premier no longer accepts new applicants.
- **AA transfer access**: Major differentiator vs Chase UR and Amex MR.
