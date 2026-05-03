# Wells Fargo Autograph

`card_id`: wells_fargo_autograph
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "wells_fargo_autograph",
  "name": "Wells Fargo Autograph Card",
  "issuer": "Wells Fargo",
  "network": "Visa",
  "card_type": "personal",
  "category": ["no_af_cashback", "tiered_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "wells_fargo_rewards",

  "earning": [
    {"category": "restaurants", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Includes airfare, hotels, car rentals, public transit, gas/EV stations"},
    {"category": "gas_stations_ev_charging", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "transit", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "select_streaming", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "phone_plans", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 1000,
    "spend_window_months": 3,
    "estimated_value_usd": 200
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Cell phone protection", "signal_id": "cell_phone_protection", "value_estimate_usd": 80, "category": "purchase_protection", "notes": "$600/claim, $25 deductible"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "wells_fargo_rewards",

  "issuer_rules": ["WF 6-month rule", "WF 15-month bonus rule"],

  "best_for": ["broad_3x_no_AF_no_FX", "transit_and_streaming_combo"],
  "synergies_with": ["wells_fargo_active_cash", "wells_fargo_autograph_journey"],
  "competing_with_in_wallet": ["citi_strata_premier", "amex_blue_cash_everyday"],

  "breakeven_logic_notes": "No AF, 0% FX, 3x on broad categories — best no-AF travel/transit/streaming earner. Without AJ paired, no transfer access; pure cash equivalent.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.wellsfargo.com/credit-cards/autograph-visa-card/"]
}
```

## programs.json entry (wells_fargo_rewards)

```json
{
  "id": "wells_fargo_rewards",
  "name": "Wells Fargo Rewards",
  "type": "transferable_with_journey",
  "issuer": "Wells Fargo",
  "earning_cards": ["wells_fargo_autograph", "wells_fargo_autograph_journey"],
  "fixed_redemption_cpp": 1.0,
  "portal_redemption_cpp": 1.0,
  "median_redemption_cpp": 1.75,
  "median_cpp_source_url": "https://thepointsguy.com/loyalty-programs/monthly-valuations/",
  "median_cpp_as_of": "2026-05-01",
  "transfer_partners_notes": "Transfer access requires Autograph Journey (the higher-tier card). Autograph alone earns redeemable points only.",
  "transfer_partners": [
    {"partner": "Air France-KLM Flying Blue", "ratio": "1:1", "type": "airline", "min_transfer": 1000},
    {"partner": "Avianca LifeMiles", "ratio": "1:1", "type": "airline", "min_transfer": 1000},
    {"partner": "British Airways Avios", "ratio": "1:1", "type": "airline", "min_transfer": 1000},
    {"partner": "Iberia Plus", "ratio": "1:1", "type": "airline", "min_transfer": 1000},
    {"partner": "AerLingus AerClub", "ratio": "1:1", "type": "airline", "min_transfer": 1000},
    {"partner": "Choice Privileges", "ratio": "1:2", "type": "hotel", "min_transfer": 1000}
  ],
  "sweet_spots": [
    {"description": "Avianca LifeMiles US-Europe biz ~63k", "value_estimate_usd": "~5cpp", "source": null}
  ],
  "sources": ["https://www.wellsfargo.com/credit-cards/autograph-journey/"]
}
```

## issuer_rules.json entry
See `wells_fargo_active_cash.md`.

## perks_dedup.json entries
See `wells_fargo_active_cash.md` for cell_phone_protection.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **0% FX** distinguishes Autograph from Active Cash; engine should prefer Autograph for international users with bonus-category spend.
- **Phone plan 3x** is unusual — engine should weight for users with $100+/mo phone bills.
