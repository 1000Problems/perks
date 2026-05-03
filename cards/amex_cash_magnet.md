# Amex Cash Magnet

`card_id`: amex_cash_magnet
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_cash_magnet",
  "name": "American Express Cash Magnet Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 2.7,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amex_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 200,
    "notes": "Often $200 statement credit"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Purchase protection", "signal_id": "purchase_protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Amex once-per-lifetime SUB"],

  "best_for": ["no_AF_simple_1_5_pct_cashback_amex"],
  "synergies_with": ["amex_blue_cash_preferred"],
  "competing_with_in_wallet": ["wells_fargo_active_cash", "citi_double_cash"],

  "breakeven_logic_notes": "No AF. 1.5% flat is beaten by 2% cards (DC, Active Cash). Amex Cash Magnet exists primarily as Amex's no-AF flat-rate option.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/cash-magnet/"]
}
```

## programs.json entry
See `amex_blue_cash_preferred.md` for amex_cashback.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 2.7% FX. Domestic only.
