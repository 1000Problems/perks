# Capital One Venture Rewards

`card_id`: capital_one_venture
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_venture",
  "name": "Capital One Venture Rewards Credit Card",
  "issuer": "Capital One",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "capital_one_miles",

  "earning": [
    {"category": "hotels_and_rentals_capital_one_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "estimated_value_usd": 1300,
    "notes": "Often paired with $250 travel credit. Has hit 100k via CardMatch."
  },

  "annual_credits": [
    {"name": "Global Entry / TSA PreCheck credit", "value_usd": 120, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Travel accident insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Hertz Five Star status", "value_estimate_usd": null, "category": "rental_status"}
  ],

  "transfer_partners_inherited_from": "capital_one_miles",

  "issuer_rules": ["Capital One 1-per-month", "Capital One 2-personal-card-max", "Capital One 48-month bonus rule (some products)"],

  "best_for": ["flat_2x_transferable_points", "no_FX_fee_simple_travel"],
  "synergies_with": ["capital_one_savor", "capital_one_quicksilver", "capital_one_venture_x"],
  "competing_with_in_wallet": ["chase_sapphire_preferred", "amex_gold", "citi_strata_premier"],

  "breakeven_logic_notes": "AF $95. 2x flat = effectively 4cpp via Turkish Miles+Smiles transfers. Beats CSP for users who don't dine out heavily and want simple flat earning.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.capitalone.com/credit-cards/venture/"
  ]
}
```

## programs.json entry
See `capital_one_venture_x.md`.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
```json
[{"perk": "global_entry_credit", "card_ids": ["capital_one_venture"], "value_if_unique_usd": 120, "value_if_duplicate_usd": 0}]
```

## destination_perks.json entries
See `capital_one_venture_x.md` for Turkish/United sweet spot.

## RESEARCH_NOTES.md entries

- Simpler than Venture X. No lounge access. Best as a "set and forget" 2x earner with transferability.
- 48-month rule applies between Venture and Venture X bonus eligibility per Capital One pop-up.
