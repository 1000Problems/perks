# Allegiant World Mastercard

`card_id`: allegiant_world_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "allegiant_world_mastercard",
  "name": "Allegiant World Mastercard",
  "issuer": "Bank of America",
  "network": "Mastercard World",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 59,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": "allegiant_points",

  "earning": [
    {"category": "allegiant_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "qualified_dining_select", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 15000, "spend_required_usd": 1000, "spend_window_months": 3, "estimated_value_usd": 200},

  "annual_credits": [
    {"name": "$100 Allegiant credit annually", "value_usd": 100, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "Priority boarding", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Free seat selection", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["BoA 2/3/4"],

  "best_for": ["allegiant_loyalist_to_leisure_destinations"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $59 less $100 Allegiant credit = -$41 if used. Easy positive value for occasional Allegiant flyer.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/allegiant-credit-card/"]
}
```

## programs.json entry
Closed-loop Allegiant points.

## issuer_rules.json entry
See `boa_premium_rewards.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 3% FX. Allegiant is leisure-focused (FL, AZ, NV, etc.).
