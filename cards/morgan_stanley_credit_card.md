# Morgan Stanley Credit Card from Amex

`card_id`: morgan_stanley_credit_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "morgan_stanley_credit_card",
  "name": "Morgan Stanley Credit Card from American Express",
  "issuer": "Amex (with Morgan Stanley brokerage relationship)",
  "network": "Amex",
  "card_type": "personal",
  "category": ["mid_tier_travel", "investment_cobrand"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 2.7,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "ms_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null, "notes": "Cash back deposited to Morgan Stanley brokerage"}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto-deposit cash back to MS brokerage", "value_estimate_usd": null, "category": "rewards_payout"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Amex once-per-lifetime SUB", "MS CashPlus or qualifying account"],

  "best_for": ["MS_client_no_AF_brokerage_deposit"],
  "synergies_with": ["amex_platinum_morgan_stanley"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 1% is very low; only useful as a brokerage-deposit vehicle for MS clients.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/morgan-stanley/"]
}
```

## programs.json entry
Closed-loop MS brokerage deposit.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Limited utility outside MS client context.
