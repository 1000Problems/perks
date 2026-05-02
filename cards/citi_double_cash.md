# Citi Double Cash

`card_id`: citi_double_cash
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_double_cash",
  "name": "Citi Double Cash Card",
  "issuer": "Citi",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback", "balance_transfer"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "citi_thankyou",
  "currency_earned_notes": "Cash back default; converts to TY points 1:1 with Strata Premier paired account",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "notes": "1% when purchased + 1% when paid"}
  ],

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 1500,
    "spend_window_months": 6,
    "estimated_value_usd": 200
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Citi Entertainment access", "value_estimate_usd": null, "category": "lifestyle"},
    {"name": "0% intro APR balance transfer 18 months", "value_estimate_usd": null, "category": "financing"}
  ],

  "transfer_partners_inherited_from": "citi_thankyou",
  "transfer_partners_inherited_from_notes": "Only with paired Strata Premier",

  "issuer_rules": [
    "Citi 8/65, 2/65, 1/8",
    "Citi ThankYou family 24-month rule"
  ],

  "best_for": ["non_bonus_2pct_baseline", "Strata_Premier_pair_for_2x_TY", "balance_transfer_18_months"],
  "synergies_with": ["citi_strata_premier", "citi_custom_cash"],
  "competing_with_in_wallet": ["wells_fargo_active_cash", "fidelity_rewards_2pct", "us_bank_smartly"],

  "breakeven_logic_notes": "No AF; 2x flat is the no-AF baseline. Paired with Strata Premier for transferable TY points access at 2cpp+ valuations.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.citi.com/credit-cards/citi-double-cash-credit-card"]
}
```

## programs.json entry
See `citi_strata_premier.md`.

## issuer_rules.json entry
See `citi_strata_premier.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **2-stage earning**: 1% earned at purchase, 1% at payment. Engine should note that minimum-payment-only users only realize partial 2%.
- **3% FX**: Domestic only.
- **Balance transfer**: 18 months 0% intro APR after 3% transfer fee. One of best BT cards.
- **Long-running structure**: Earning rates have been stable for 10+ years.
