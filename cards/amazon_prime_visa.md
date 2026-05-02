# Amazon Prime Visa

`card_id`: amazon_prime_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amazon_prime_visa",
  "name": "Prime Visa Signature Card",
  "issuer": "Chase",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["retail_cobrand", "tiered_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amazon_rewards",
  "membership_required": "Amazon Prime membership",

  "earning": [
    {"category": "amazon_whole_foods_amazon_fresh", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "chase_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "gas_dining_drugstores", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 100,
    "notes": "$100-200 Amazon gift card upon approval"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Purchase protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Extended warranty", "value_estimate_usd": null, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24", "Prime membership required for 5x earning"],

  "best_for": ["Amazon_Prime_member_with_$200_plus_monthly_Amazon_spend"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 5% on Amazon at $5k/yr = $250 cash back. Net positive value at any Amazon spend.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/amazon-credit-card"]
}
```

## programs.json entry

```json
{
  "id": "amazon_rewards",
  "name": "Amazon Rewards (cash back / Amazon credit)",
  "type": "fixed_value",
  "issuer": "Chase (for Amazon)",
  "earning_cards": ["amazon_prime_visa", "amazon_visa"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.amazon.com/credit/storecard"]
}
```

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Without Prime membership, downgrades to 3% Amazon (Amazon Visa, no Prime).
- 5/24 applies — major source of denials for Chase-bonus chasers.
