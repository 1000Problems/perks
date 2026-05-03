# Choice Privileges Select Mastercard

`card_id`: choice_privileges_select_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "choice_privileges_select_mastercard",
  "name": "Choice Privileges Select Mastercard",
  "issuer": "Wells Fargo",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["hotel_cobrand"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "choice_privileges",

  "earning": [
    {"category": "choice_hotels", "rate_pts_per_dollar": 10, "cap_usd_per_year": null},
    {"category": "gas_grocery_dining", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 60000, "spend_required_usd": 1000, "spend_window_months": 90, "estimated_value_usd": 360},

  "annual_credits": [
    {"name": "Free Night Cert (35,000 pts) annually", "signal_id": "hotel_free_night_cert", "value_usd": 175, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [{"name": "Choice Diamond status", "value_estimate_usd": null, "category": "hotel_status"}],
  "transfer_partners_inherited_from": "choice_privileges",
  "issuer_rules": ["WF 6-month rule"],

  "best_for": ["choice_loyalist_for_road_trips_and_Vacasa_redemptions"],
  "synergies_with": ["choice_privileges_visa"],
  "competing_with_in_wallet": ["choice_privileges_visa"],

  "breakeven_logic_notes": "AF $95 less Free Night ($175) = -$80. Top Choice card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.wellsfargo.com/credit-cards/choice-privileges-select/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
See `choice_privileges_visa.md` for programs, `wells_fargo_active_cash.md` for issuer rules.

## RESEARCH_NOTES.md entries
- Top-tier Choice card; supersedes no-AF version for active Choice users.
