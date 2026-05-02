# Chase Freedom Rise

`card_id`: chase_freedom_rise
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "chase_freedom_rise",
  "name": "Chase Freedom Rise",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["starter", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "limited_or_no_credit",
  "currency_earned": "chase_ur",
  "currency_earned_notes": "Cash back; no transfer access without paired Sapphire/Ink Preferred",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 25,
    "notes": "Typically $25 for adding authorized user, no traditional SUB. Designed for first-time credit users."
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Purchase protection", "value_estimate_usd": null, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": "chase_ur",
  "transfer_partners_inherited_from_notes": "Only with paired Sapphire/Ink Preferred",

  "issuer_rules": [
    "Chase 5/24",
    "Available primarily to applicants with limited or no credit history; designed as gateway product"
  ],

  "best_for": ["building_credit", "first_card", "Chase_ecosystem_entry"],
  "synergies_with": ["chase_sapphire_preferred", "chase_freedom_unlimited"],
  "competing_with_in_wallet": ["discover_it_secured", "capital_one_quicksilver_student", "petal_2"],

  "breakeven_logic_notes": "No AF; positive value at any spend. Engine should weight as a credit-building product, not a rewards optimization play.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://creditcards.chase.com/cash-back-credit-cards/freedom/rise"
  ]
}
```

## programs.json entry

See `chase_sapphire_preferred.md`. chase_ur, earning_cards includes chase_freedom_rise.

## issuer_rules.json entry

See `chase_sapphire_preferred.md`. Chase 5/24 applies but Freedom Rise itself is approved with limited credit; ironically it mostly operates outside the typical 5/24 denial pool because applicants haven't accumulated 5 cards yet.

## perks_dedup.json entries

None unique.

## destination_perks.json entries

None.

## RESEARCH_NOTES.md entries

- **Starter-card positioning**: Engine should not surface CFR for users with established credit (FICO 700+). Surface only when credit-building is the user's stated goal.
- **No SUB**: Authorized user $25 is the only acquisition incentive. Don't use this card to anchor a "best signup bonus" recommendation.
- **3% FX fee**: Domestic only.
- **Pathway**: After 12-18 months, holders typically product-change to CFU or apply for CSP. The CSP/CSR 48-month rule does not preclude this since CFR has no Sapphire SUB history.
