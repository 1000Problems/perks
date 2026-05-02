# LATAM Visa Signature

`card_id`: latam_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "latam_visa",
  "name": "LATAM Visa Signature Card",
  "issuer": "US Bank",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 79,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "latam_pass",

  "earning": [
    {"category": "latam_purchases", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "gas_grocery_dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 30000, "spend_required_usd": 1500, "spend_window_months": 90, "estimated_value_usd": 400},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Free first checked bag (LATAM-marketed)", "value_estimate_usd": 100, "category": "airline_perk"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["USB 30-day rule"],

  "best_for": ["south_america_traveler_to_brazil_chile_argentina_peru"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $79 (Y1 waived). Niche South America card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usbank.com/credit-cards/latam-visa-signature-credit-card.html"]
}
```

## programs.json entry
Closed-loop LATAM Pass.

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Useful primarily for travelers to GIG/GRU/SCL/EZE/LIM.
