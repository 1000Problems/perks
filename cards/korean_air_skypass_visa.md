# Korean Air SKYPASS Visa Signature

`card_id`: korean_air_skypass_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "korean_air_skypass_visa",
  "name": "Korean Air SKYPASS Visa Signature Card",
  "issuer": "US Bank",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 80,
  "annual_fee_first_year_waived": true,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "korean_air_skypass",

  "earning": [
    {"category": "korean_air_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 30000, "spend_required_usd": 1000, "spend_window_months": 90, "estimated_value_usd": 500},

  "annual_credits": [{"name": "Companion Ticket after $30k spend", "value_usd": null, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["USB 30-day rule"],

  "best_for": ["korean_air_loyalist", "asia_traveler_via_ICN_hub"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $80 (Y1 waived). Niche Asia carrier.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usbank.com/credit-cards/korean-air-skypass-visa-signature-credit-card.html"]
}
```

## programs.json entry
Closed-loop SKYPASS.

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Korean Air SKYPASS has known sweet spots for partner award redemption.
