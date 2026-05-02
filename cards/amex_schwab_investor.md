# Amex Schwab Investor Card

`card_id`: amex_schwab_investor
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_schwab_investor",
  "name": "American Express Schwab Investor Card",
  "issuer": "Amex (with Schwab brokerage relationship)",
  "network": "Amex",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "investment_cobrand"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 2.7,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "schwab_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null, "notes": "Cash back deposits to Schwab brokerage account"}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto-deposit cash back to Schwab brokerage", "value_estimate_usd": null, "category": "rewards_payout"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Amex once-per-lifetime SUB", "Schwab brokerage account required"],

  "best_for": ["schwab_investor_no_AF_brokerage_deposit_path"],
  "synergies_with": ["amex_platinum_schwab"],
  "competing_with_in_wallet": ["wells_fargo_active_cash", "citi_double_cash"],

  "breakeven_logic_notes": "No AF. 1.5% deposited to brokerage. Beaten by 2% cards on raw cashback rate but auto-investment is the differentiator.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/schwab-investor-card/"]
}
```

## programs.json entry

```json
{
  "id": "schwab_cashback",
  "name": "Schwab Investor Cashback",
  "type": "fixed_value",
  "issuer": "Amex (Schwab co-brand)",
  "earning_cards": ["amex_schwab_investor"],
  "fixed_redemption_cpp": 1.0,
  "redemption_constraint": "Auto-deposited to Schwab brokerage; cannot be statement-credited",
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/schwab-investor-card/"]
}
```

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Auto-investment cashback model is rare — only competitor is Fidelity Rewards Visa (2%).
