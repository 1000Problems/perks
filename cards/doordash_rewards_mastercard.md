# Chase DoorDash Rewards Mastercard

`card_id`: doordash_rewards_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "doordash_rewards_mastercard",
  "name": "Chase DoorDash Rewards Mastercard", "signal_id": "doordash_credit",
  "issuer": "Chase",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": "doordash_credit",

  "earning": [
    {"category": "doordash_caviar", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "grocery", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 100,
    "notes": "DashPass + cash credit"
  },

  "annual_credits": [
    {"name": "Free DashPass membership", "signal_id": "doordash_credit", "value_usd": 120, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "Free delivery on DoorDash $12+ orders via DashPass", "signal_id": "doordash_credit", "value_estimate_usd": null, "category": "lifestyle"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["doordash_user_2x_plus_orders_per_week"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Free DashPass alone justifies card if user orders multiple times per month.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/a1/doordash/rewards"]
}
```

## programs.json entry
Closed-loop DoorDash credit.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries

```json
[
  {
    "perk": "doordash_dashpass",
    "card_ids": ["doordash_rewards_mastercard"],
    "value_if_unique_usd": 120,
    "value_if_duplicate_usd": 0,
    "notes": "Same DashPass membership across all participating issuers."
  }
]
```

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 3% FX. Domestic only.
