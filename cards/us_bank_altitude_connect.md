# US Bank Altitude Connect

`card_id`: us_bank_altitude_connect
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "us_bank_altitude_connect",
  "name": "US Bank Altitude Connect Visa Signature",
  "issuer": "US Bank",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "us_bank_flexpoints",

  "earning": [
    {"category": "travel_via_usb_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "travel_other_gas_ev_streaming", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "dining_takeout", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 50000,
    "spend_required_usd": 2000,
    "spend_window_months": 4,
    "estimated_value_usd": 500
  },

  "annual_credits": [
    {"name": "TSA PreCheck / Global Entry", "value_usd": 100, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"},
    {"name": "Streaming credit", "value_usd": null, "type": "specific", "expiration": "annual", "ease_of_use": "medium", "notes": "Verify current structure"}
  ],

  "ongoing_perks": [
    {"name": "Auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["USB 30-day rule"],

  "best_for": ["mid_tier_travel_with_4x_other_travel"],
  "synergies_with": ["us_bank_altitude_reserve", "us_bank_smartly"],
  "competing_with_in_wallet": ["chase_sapphire_preferred", "citi_strata_premier"],

  "breakeven_logic_notes": "AF $95 (Y1 waived). Mid-pack mid-tier travel; less compelling than CSP/Strata Premier without USB relationship.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usbank.com/credit-cards/altitude-connect-visa-signature-credit-card.html"]
}
```

## programs.json entry
See `us_bank_altitude_reserve.md`.

## issuer_rules.json entry
See `us_bank_altitude_reserve.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Closed to new applicants for some periods; verify current availability.
