# Chase Aer Lingus Visa Signature

`card_id`: aer_lingus_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "aer_lingus_visa",
  "name": "Chase Aer Lingus Visa Signature Card",
  "issuer": "Chase",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "british_airways_avios",
  "currency_earned_notes": "Avios in Aer Lingus AerClub program; pooled across BA/IB/QR/AY",

  "earning": [
    {"category": "aer_lingus_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "ba_iberia_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
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
    {"name": "Companion Ticket after $30k spend", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": "british_airways_avios",

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["Aer_Lingus_loyalist", "ORD_BOS_DUB_traveler"],
  "synergies_with": ["british_airways_visa", "iberia_visa"],
  "competing_with_in_wallet": ["british_airways_visa"],

  "breakeven_logic_notes": "AF $95. Most attractive for Aer Lingus business class redemptions which avoid heavy BA surcharges.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/aerlingus"]
}
```

## programs.json entry
See `british_airways_visa.md`.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `british_airways_visa.md`.

## RESEARCH_NOTES.md entries
- Lower surcharges than BA metal makes Aer Lingus the preferred Avios redemption path for transatlantic.
