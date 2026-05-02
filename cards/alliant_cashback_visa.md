# Alliant Cashback Visa Signature

`card_id`: alliant_cashback_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "alliant_cashback_visa",
  "name": "Alliant Cashback Visa Signature Credit Card",
  "issuer": "Alliant Credit Union",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "alliant_cashback",
  "membership_required": "Alliant Credit Union membership (open via Foster Care Society donation $5)",

  "earning": [{"category": "everything_else", "rate_pts_per_dollar": 2.5, "cap_usd_per_year": 10000, "notes": "2.5% on first $10k/month with Tier 1 Alliant checking; 1.5% otherwise. After $10k cap, 1.5%."}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Alliant membership required (free)"],

  "best_for": ["alliant_member_at_2_5_pct_with_high_spend"],
  "synergies_with": [],
  "competing_with_in_wallet": ["us_bank_smartly", "citi_double_cash"],

  "breakeven_logic_notes": "No AF. 2.5% with $10k/month cap = $3,000/yr ceiling at full earning. Top no-AF rate currently in market for unrestricted spend.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.alliantcreditunion.org/bank/visa-signature-card"]
}
```

## programs.json entry
Closed-loop Alliant cashback.

## issuer_rules.json entry

```json
{
  "issuer": "Alliant Credit Union",
  "rules": [
    {
      "id": "alliant_membership",
      "name": "Alliant CU membership",
      "description": "Open via Foster Care Society donation ($5) or other association.",
      "applies_to": "all_alliant_cards",
      "official": true
    },
    {
      "id": "alliant_tier_1_required",
      "name": "Tier 1 checking required for 2.5%",
      "description": "Must maintain Alliant High-Rate Checking with average $1k+ daily balance and electronic statements.",
      "applies_to": "alliant_cashback_visa",
      "official": true
    }
  ]
}
```

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Top no-AF unrestricted rate (2.5%) in the credit-union space, but requires Alliant checking + cap structure.
