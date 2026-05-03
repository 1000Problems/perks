# Barclays AAdvantage Aviator Red

`card_id`: barclays_aa_aviator_red
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "barclays_aa_aviator_red",
  "name": "Barclays AAdvantage Aviator Red World Elite Mastercard",
  "issuer": "Barclays",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 99,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "aa_aadvantage",

  "earning": [
    {"category": "american_airlines_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 60000,
    "spend_required_usd": null,
    "spend_window_months": 1,
    "estimated_value_usd": 850,
    "notes": "Famously generous — 60k miles after just 1 transaction + paying AF"
  },

  "annual_credits": [
    {"name": "$25 American Airlines inflight credit", "value_usd": 25, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium"},
    {"name": "Companion certificate after $20k spend", "value_usd": null, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag (primary + 4 companions)", "signal_id": "free_checked_bag", "value_estimate_usd": 240, "category": "airline_perk"},
    {"name": "Preferred boarding", "signal_id": "priority_boarding", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "25% back on inflight purchases", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Barclays 6/24", "AA Aviator no-spend SUB unique"],

  "best_for": ["AA_loyalist_seeking_easy_60k_SUB"],
  "synergies_with": ["citi_aa_platinum", "citi_aa_executive"],
  "competing_with_in_wallet": ["citi_aa_platinum"],

  "breakeven_logic_notes": "AF $99. SUB at 1 transaction makes this an easy points-grab.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cards.barclaycardus.com/cards/aadvantage-aviator-red-world-elite-mastercard/"]
}
```

## programs.json entry
See `citi_aa_platinum.md`.

## issuer_rules.json entry
See `jetblue_plus.md` for Barclays.

## perks_dedup.json entries
See `citi_aa_platinum.md`.

## destination_perks.json entries
See `citi_aa_platinum.md`.

## RESEARCH_NOTES.md entries
- Barclays AA Aviator's no-spend SUB is unique among premium airline cards.
- Barclays + Citi can each issue AA cards independently — the same applicant can hold multiple AA cards across issuers.
