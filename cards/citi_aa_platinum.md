# Citi AAdvantage Platinum Select

`card_id`: citi_aa_platinum
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_aa_platinum",
  "name": "Citi AAdvantage Platinum Select World Elite Mastercard",
  "issuer": "Citi",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 99,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "aa_aadvantage",

  "earning": [
    {"category": "american_airlines_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "gas_stations", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "restaurants", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 50000,
    "spend_required_usd": 2500,
    "spend_window_months": 3,
    "estimated_value_usd": 700
  },

  "annual_credits": [
    {"name": "$125 American Airlines flight discount after $20k spend", "value_usd": 125, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag (primary + 4 companions)", "signal_id": "free_checked_bag", "value_estimate_usd": 240, "category": "airline_perk"},
    {"name": "Group 5 boarding", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "25% back on inflight food/drink", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Loyalty Points contribute to AA elite status", "value_estimate_usd": null, "category": "elite_status"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Citi AA 48-month bonus rule", "Citi 8/65"],

  "best_for": ["AA_loyalist_with_companion", "AA_elite_status_pursuit_via_Loyalty_Points"],
  "synergies_with": ["citi_strata_premier"],
  "competing_with_in_wallet": ["citi_aa_executive", "barclays_aa_aviator"],

  "breakeven_logic_notes": "AF $99 (Y1 waived). Free bag for 4 + 1 companions covers AF easily for AA flyers.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.citi.com/credit-cards/citi-aadvantage-platinum-select-card"]
}
```

## programs.json entry (aa_aadvantage)

```json
{
  "id": "aa_aadvantage",
  "name": "American Airlines AAdvantage",
  "type": "cobrand_airline",
  "issuer": "American Airlines",
  "earning_cards": ["citi_aa_platinum", "citi_aa_executive", "barclays_aa_aviator", "citi_aa_business"],
  "fixed_redemption_cpp": 1.5,
  "median_redemption_cpp": 1.6,
  "median_cpp_source_url": "https://thepointsguy.com/loyalty-programs/monthly-valuations/",
  "median_cpp_as_of": "2026-05-01",
  "transfer_partners_notes": "Receives transfers from Citi TY (1:1) and Bilt (1:1)",
  "sweet_spots": [
    {"description": "Web Specials and off-peak awards", "value_estimate_usd": "~2-3cpp", "source": null}
  ],
  "sources": ["https://www.aa.com/aadvantage"]
}
```

## issuer_rules.json entry
See `citi_strata_premier.md`.

## perks_dedup.json entries

```json
[
  {
    "perk": "free_checked_bag_aa",
    "card_ids": ["citi_aa_platinum", "citi_aa_executive", "barclays_aa_aviator"],
    "value_if_unique_usd": 240,
    "value_if_duplicate_usd": 0
  }
]
```

## destination_perks.json entries

```json
{
  "aa_hubs": {
    "airline_routes_strong": ["AA at DFW/CLT/ORD/MIA/PHX/PHL/DCA/JFK"],
    "relevant_cards": ["citi_aa_platinum", "citi_aa_executive", "barclays_aa_aviator"]
  }
}
```

## RESEARCH_NOTES.md entries
- Loyalty Points (AA's status currency) earned via card spend at 1 LP per $1.
