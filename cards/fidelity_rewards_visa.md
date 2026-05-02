# Fidelity Rewards Visa Signature

`card_id`: fidelity_rewards_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "fidelity_rewards_visa",
  "name": "Fidelity Rewards Visa Signature Card",
  "issuer": "Elan Financial Services",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback", "investment_cobrand"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 1,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "fidelity_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "notes": "2% deposited to Fidelity brokerage account (any account type: taxable, IRA, 529)"}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null, "notes": "Periodic $150-300 bonuses"},

  "annual_credits": [],

  "ongoing_perks": [{"name": "Auto-deposit cash back to Fidelity account", "value_estimate_usd": null, "category": "rewards_payout"}],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [],

  "best_for": ["fidelity_brokerage_holder_seeking_2pct_with_no_AF"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_active_cash", "amex_schwab_investor"],

  "breakeven_logic_notes": "No AF. 2% flat with auto-deposit to brokerage. Beats Citi DC slightly via 1% FX (vs 3%); pairs with brokerage account for compounding.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.fidelityrewards.com/"]
}
```

## programs.json entry

```json
{
  "id": "fidelity_cashback",
  "name": "Fidelity Cashback",
  "type": "fixed_value",
  "issuer": "Elan / Fidelity",
  "earning_cards": ["fidelity_rewards_visa"],
  "fixed_redemption_cpp": 1.0,
  "redemption_constraint": "Must deposit to Fidelity brokerage; cannot statement-credit",
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.fidelityrewards.com/"]
}
```

## issuer_rules.json entry
None unique to Elan.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 1% FX (better than most no-AF cards' 3%).
- Best card for self-directed investors who want compounding from card spend.
