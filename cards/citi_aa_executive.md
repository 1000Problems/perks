# Citi AAdvantage Executive

`card_id`: citi_aa_executive
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_aa_executive",
  "name": "Citi AAdvantage Executive World Elite Mastercard",
  "issuer": "Citi",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["airline_cobrand", "premium_travel"],
  "annual_fee_usd": 595,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "aa_aadvantage",

  "earning": [
    {"category": "american_airlines_purchases", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 70000,
    "spend_required_usd": 7000,
    "spend_window_months": 3,
    "estimated_value_usd": 1000
  },

  "annual_credits": [
    {"name": "Global Entry / TSA PreCheck", "signal_id": "global_entry_tsa", "value_usd": 100, "type": "specific", "expiration": "every_5_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Admirals Club membership for primary + authorized users", "signal_id": "lounge_access", "value_estimate_usd": 850, "category": "lounge_access"},
    {"name": "Free first checked bag for primary + 8 companions", "signal_id": "free_checked_bag", "value_estimate_usd": 240, "category": "airline_perk"},
    {"name": "Priority check-in/security/boarding", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Loyalty Points contribute toward AA elite status", "value_estimate_usd": null, "category": "elite_status"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Citi AA 48-month bonus rule", "Citi 8/65"],

  "best_for": ["AA_loyalist_with_Admirals_Club_use"],
  "synergies_with": ["citi_strata_premier"],
  "competing_with_in_wallet": ["citi_aa_platinum", "barclays_aa_aviator"],

  "breakeven_logic_notes": "AF $595. Admirals Club membership alone (~$850 standalone) covers AF for users who would buy lounge access anyway.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.citi.com/credit-cards/citi-aadvantage-executive-world-elite-mastercard"]
}
```

## programs.json entry
See `citi_aa_platinum.md`.

## issuer_rules.json entry
See `citi_strata_premier.md`.

## perks_dedup.json entries
See `citi_aa_platinum.md` for free_checked_bag_aa.

## destination_perks.json entries
See `citi_aa_platinum.md` for aa_hubs.

## RESEARCH_NOTES.md entries
- Authorized users included in Admirals Club access — major value for couples/families.
