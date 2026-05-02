# Amazon Store Card

`card_id`: amazon_store_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amazon_store_card",
  "name": "Amazon Store Card",
  "issuer": "Synchrony",
  "network": "Closed-loop (Amazon only)",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": null,
  "credit_score_required": "fair_to_good",
  "currency_earned": "amazon_rewards",
  "membership_required": "Amazon account",

  "earning": [{"category": "amazon_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "5% with Prime membership"}],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 50, "notes": "$50 Amazon gift card"},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Special financing on Amazon $50+ purchases", "value_estimate_usd": null, "category": "financing"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["amazon_user_seeking_special_financing"],
  "synergies_with": ["amazon_prime_visa"],
  "competing_with_in_wallet": ["amazon_prime_visa"],

  "breakeven_logic_notes": "No AF, closed-loop. Prime Visa supersedes for users wanting open-loop card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.amazon.com/iss/credit/storecardmember"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Closed-loop only. Cannot use outside Amazon.
