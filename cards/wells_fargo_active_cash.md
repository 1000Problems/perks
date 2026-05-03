# Wells Fargo Active Cash

`card_id`: wells_fargo_active_cash
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "wells_fargo_active_cash",
  "name": "Wells Fargo Active Cash Card",
  "issuer": "Wells Fargo",
  "network": "Visa",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback", "balance_transfer"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "wells_fargo_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 500,
    "spend_window_months": 3,
    "estimated_value_usd": 200
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Cell phone protection", "signal_id": "cell_phone_protection", "value_estimate_usd": 80, "category": "purchase_protection", "notes": "$600/claim, $25 deductible, 2 claims/12mo"},
    {"name": "Visa Signature concierge", "value_estimate_usd": null, "category": "lifestyle"},
    {"name": "0% intro APR 12 months on purchases and BT", "value_estimate_usd": null, "category": "financing"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [
    "Wells Fargo 6-months-since-last-WF-card informal rule",
    "WF lifetime once-per-product SUB rule on some products"
  ],

  "best_for": ["no_AF_2_pct_simplicity", "cell_phone_protection_with_$25_deductible", "best_BT_card_intro_APR"],
  "synergies_with": ["wells_fargo_autograph"],
  "competing_with_in_wallet": ["citi_double_cash", "fidelity_2pct"],

  "breakeven_logic_notes": "No AF; 2x flat. Cell phone protection $25 deductible is best-in-class. Engine should treat as default no-AF non-bonus catchall.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.wellsfargo.com/credit-cards/active-cash-card/"]
}
```

## programs.json entry

```json
{
  "id": "wells_fargo_cashback",
  "name": "Wells Fargo Cash Back",
  "type": "fixed_value",
  "issuer": "Wells Fargo",
  "earning_cards": ["wells_fargo_active_cash"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.wellsfargo.com/"]
}
```

## issuer_rules.json entry (Wells Fargo)

```json
{
  "issuer": "Wells Fargo",
  "rules": [
    {
      "id": "wf_6_month_rule",
      "name": "6-month between WF cards",
      "description": "Wells Fargo informally limits applicants to 1 new WF credit card every 6 months.",
      "applies_to": "wells_fargo_credit_cards",
      "official": false
    },
    {
      "id": "wf_15_month_bonus",
      "name": "15-month bonus rule",
      "description": "Cannot earn SUB on a Wells Fargo product if received SUB on the same product in the last 15 months.",
      "applies_to": "wells_fargo_with_SUB",
      "official": false
    }
  ]
}
```

## perks_dedup.json entries

```json
[
  {
    "perk": "cell_phone_protection",
    "card_ids": ["wells_fargo_active_cash"],
    "value_if_unique_usd": 80,
    "value_if_duplicate_usd": 0,
    "notes": "$25 deductible — lowest among major cards. Engine should prefer WFAC for the cell phone protection slot if user holds multiple cards offering it."
  }
]
```

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **3% FX**: Domestic only.
- **Cell phone protection**: Need to pay phone bill on the card to qualify.
- **No transfer partners**: Pure cash back.
