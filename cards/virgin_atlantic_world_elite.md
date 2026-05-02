# Virgin Atlantic World Elite Mastercard

`card_id`: virgin_atlantic_world_elite
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "virgin_atlantic_world_elite",
  "name": "Virgin Atlantic World Elite Mastercard",
  "issuer": "Bank of America",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 99,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "virgin_atlantic_flying_club",

  "earning": [
    {"category": "virgin_atlantic_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 30000, "spend_required_usd": 1000, "spend_window_months": 90, "estimated_value_usd": 600},

  "annual_credits": [
    {"name": "Companion Reward Voucher after $25k spend", "value_usd": null, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Bonus tier points on Virgin Atlantic flights", "value_estimate_usd": null, "category": "elite_status_acceleration"}
  ],

  "transfer_partners_inherited_from": "virgin_atlantic_flying_club",

  "issuer_rules": ["BoA 2/3/4"],

  "best_for": ["virgin_atlantic_loyalist", "ANA_business_class_redemption_via_VA"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "AF $99. Most VA flyers transfer from Chase UR / Amex MR / Cap One Miles instead. This card useful primarily for elite status acceleration on Virgin metal.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/virgin-atlantic-world-elite-mastercard/"]
}
```

## programs.json entry (virgin_atlantic_flying_club)

```json
{
  "id": "virgin_atlantic_flying_club",
  "name": "Virgin Atlantic Flying Club",
  "type": "cobrand_airline",
  "issuer": "Virgin Atlantic",
  "earning_cards": ["virgin_atlantic_world_elite"],
  "fixed_redemption_cpp": 1.5,
  "transfer_partners_notes": "Receives transfers from Chase UR (1:1), Amex MR (1:1), Citi TY (1:1), Capital One Miles (1:1), Bilt (1:1).",
  "sweet_spots": [
    {"description": "ANA business class to Tokyo (95-120k r/t)", "value_estimate_usd": "~5-7cpp", "source": null},
    {"description": "Delta One US-Europe (75-85k one-way)", "value_estimate_usd": "~4-5cpp", "source": null}
  ],
  "sources": ["https://www.virginatlantic.com/flyingclub"]
}
```

## issuer_rules.json entry
See `boa_premium_rewards.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `amex_gold.md` for Tokyo via VA->ANA.

## RESEARCH_NOTES.md entries
- VA Flying Club is the iconic ANA biz redemption path; almost all transfer from MR/UR/Cap One rather than earn directly.
