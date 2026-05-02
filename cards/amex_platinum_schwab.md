# Amex Platinum for Schwab

`card_id`: amex_platinum_schwab
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_platinum_schwab",
  "name": "American Express Platinum Card for Charles Schwab",
  "issuer": "Amex (with Schwab brokerage relationship)",
  "network": "Amex",
  "card_type": "personal",
  "category": ["premium_travel", "investment_cobrand"],
  "annual_fee_usd": 895,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "amex_mr",

  "earning": [
    {"category": "flights_direct_or_amex_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": 500000},
    {"category": "prepaid_hotels_amex_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 80000,
    "spend_required_usd": 8000,
    "spend_window_months": 6,
    "estimated_value_usd": 1600
  },

  "annual_credits": [
    {"name": "All standard Amex Platinum credits (FHR/Resy/Digital Ent/Uber/Walmart+/Saks/CLEAR/etc.)", "value_usd": 2200, "type": "specific", "expiration": "monthly_or_split", "ease_of_use": "medium"},
    {"name": "Schwab cash-out at 1.1cpp (point-to-cash to brokerage)", "value_usd": null, "type": "rewards_modifier", "expiration": "ongoing", "ease_of_use": "easy", "notes": "Differentiator: Schwab Investor Platinum can cash out MR points to Schwab brokerage at 1.1cpp"}
  ],

  "ongoing_perks": [
    {"name": "Centurion Lounge access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Priority Pass Select", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "All standard Plat perks", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Schwab Pledged Asset Line eligible", "value_estimate_usd": null, "category": "investment_perk"}
  ],

  "transfer_partners_inherited_from": "amex_mr",

  "issuer_rules": ["Amex once-per-lifetime SUB", "Requires Schwab brokerage account"],

  "best_for": ["schwab_investor_seeking_1_1_cpp_cashout"],
  "synergies_with": ["amex_gold"],
  "competing_with_in_wallet": ["amex_platinum"],

  "breakeven_logic_notes": "Same AF/credits as personal Plat. Differentiator: 1.1cpp Schwab cashout sets a hard floor on MR value. For users who don't want to play transfer-partner games, this is the highest no-effort MR redemption.",

  "recently_changed": true,
  "recently_changed_date": "2025-09-29",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/platinum-charles-schwab/"]
}
```

## programs.json entry
See `amex_gold.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
See `amex_platinum.md`.

## destination_perks.json entries
See `amex_platinum.md`.

## RESEARCH_NOTES.md entries

- **Schwab cashout at 1.1cpp** is the killer feature; sets hard floor on MR value. Engine should detect Schwab brokerage relationship and prefer this Plat variant.
- Cashout was 1.25cpp historically; reduced to 1.1cpp in past few years. Verify current rate.
