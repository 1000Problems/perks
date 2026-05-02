# OpenSky Secured Visa

`card_id`: opensky_secured_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "opensky_secured_visa",
  "name": "OpenSky Secured Visa",
  "issuer": "Capital Bank",
  "network": "Visa",
  "card_type": "personal",
  "category": ["secured", "credit_building"],
  "annual_fee_usd": 35,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "no_credit_or_severe_rebuilding",
  "secured_deposit_required": "$200_minimum",
  "currency_earned": null,

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 0, "cap_usd_per_year": null, "notes": "No rewards"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "No credit check approval available", "value_estimate_usd": null, "category": "credit_building", "notes": "Approves users with no/poor credit history"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [],

  "best_for": ["users_with_severe_credit_damage_or_thin_file_who_dont_qualify_for_other_secured_cards"],
  "synergies_with": [],
  "competing_with_in_wallet": ["discover_it_secured", "capital_one_quicksilver_secured"],

  "breakeven_logic_notes": "AF $35. Engine: only surface when other secured cards are unavailable. Discover/Cap One have better terms when accessible.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.openskycc.com/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- No-credit-check approval is rare; serves users denied elsewhere.
