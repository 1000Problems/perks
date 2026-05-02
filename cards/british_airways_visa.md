# Chase British Airways Visa Signature

`card_id`: british_airways_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "british_airways_visa",
  "name": "Chase British Airways Visa Signature Card",
  "issuer": "Chase",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "british_airways_avios",

  "earning": [
    {"category": "british_airways_aer_lingus_iberia_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "hotels_via_baholidays", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 5000,
    "spend_window_months": 3,
    "estimated_value_usd": 1100
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Travel Together Ticket after $30k spend", "value_estimate_usd": null, "category": "airline_perk", "notes": "Companion fare for paid biz/economy ticket; only fees due"},
    {"name": "10% off BA flights with code", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": "british_airways_avios",

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["BA_loyalist_with_$30k_spend_for_Travel_Together"],
  "synergies_with": ["chase_sapphire_preferred", "aer_lingus_visa", "iberia_visa"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $95. Travel Together Ticket at $30k spend can save $1,500-5,000 on biz class to Europe.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/britishairways"]
}
```

## programs.json entry (british_airways_avios)

```json
{
  "id": "british_airways_avios",
  "name": "British Airways Executive Club Avios",
  "type": "cobrand_airline",
  "issuer": "British Airways (IAG group; pooled with Aer Lingus, Iberia, Qatar)",
  "earning_cards": ["british_airways_visa", "aer_lingus_visa", "iberia_visa"],
  "fixed_redemption_cpp": 1.4,
  "transfer_partners_notes": "Receives transfers from Chase UR (1:1), Amex MR (1:1), Capital One Miles (1:1), Bilt (1:1). Avios pool 1:1 across BA/AY/IB/QR.",
  "sweet_spots": [
    {"description": "Short-haul AA flights via Avios at distance-based pricing (4-6k Avios SFO-LAX)", "value_estimate_usd": "~3-6cpp", "source": null},
    {"description": "Aer Lingus ORD-DUB business class 62.5k off-peak", "value_estimate_usd": "~5cpp", "source": null}
  ],
  "sources": ["https://www.britishairways.com/en-us/executive-club"]
}
```

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries

```json
{
  "europe_via_avios": {
    "airline_routes_strong": ["BA at LHR", "Aer Lingus at DUB", "Iberia at MAD"],
    "relevant_cards": ["british_airways_visa", "aer_lingus_visa", "iberia_visa"]
  }
}
```

## RESEARCH_NOTES.md entries
- Surcharges are heavy on BA-metal redemptions — engine should warn users that "free" award flights from US-LHR carry $500-1,500 in fees.
- Aer Lingus and Iberia Avios redemptions have lower surcharges; flag as preferred Avios redemption paths.
