# Wells Fargo Autograph Journey

`card_id`: wells_fargo_autograph_journey
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "wells_fargo_autograph_journey",
  "name": "Wells Fargo Autograph Journey Visa Card",
  "issuer": "Wells Fargo",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "wells_fargo_rewards",

  "earning": [
    {"category": "hotels", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "airlines", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "other_travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "restaurants", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 60000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "estimated_value_usd": 1000,
    "notes": "Often paired with $50 statement credit on airline purchase"
  },

  "annual_credits": [
    {"name": "Statement credit on $50 airline purchase", "value_usd": 50, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "Cell phone protection", "signal_id": "cell_phone_protection", "value_estimate_usd": 80, "category": "purchase_protection"},
    {"name": "Trip cancellation insurance", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "wells_fargo_rewards",
  "transfer_partners_inherited_from_notes": "Journey unlocks transfer partner access for the WF Rewards ecosystem",

  "issuer_rules": ["WF 6-month rule", "WF 15-month bonus rule"],

  "best_for": ["WF_ecosystem_anchor", "Avianca_LifeMiles_users_at_$95_AF"],
  "synergies_with": ["wells_fargo_active_cash", "wells_fargo_autograph"],
  "competing_with_in_wallet": ["chase_sapphire_preferred", "citi_strata_premier", "capital_one_venture"],

  "breakeven_logic_notes": "AF $95 less $50 airline credit (easy) = $45 net. Underrated — 5x hotels and 4x airlines beats CSP/Strata Premier on travel-heavy spend.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.wellsfargo.com/credit-cards/autograph-journey/"]
}
```

## programs.json entry
See `wells_fargo_autograph.md`.

## issuer_rules.json entry
See `wells_fargo_active_cash.md`.

## perks_dedup.json entries
See `wells_fargo_active_cash.md`.

## destination_perks.json entries

```json
{
  "europe_via_avianca": {
    "airline_routes_strong": ["Avianca LifeMiles for Star Alliance"],
    "relevant_cards": ["wells_fargo_autograph_journey (WF Rewards to Avianca)"],
    "notes": "Mid-tier transfer card path to Star Alliance biz to Europe at ~63k one-way."
  }
}
```

## RESEARCH_NOTES.md entries

- **Newer card (launched 2024)**: Less data on retention offers, AF waivers.
- **Travel-only category structure** is narrow — engine should prefer over Autograph for travel-heavy users, opposite for grocery/transit/streaming.
