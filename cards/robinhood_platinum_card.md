# Robinhood Platinum Card

`card_id`: robinhood_platinum_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "robinhood_platinum_card",
  "name": "Robinhood Platinum Card",
  "issuer": "Robinhood / Coastal Community Bank",
  "network": "Visa Infinite (likely)",
  "card_type": "personal",
  "category": ["premium_travel", "fintech"],
  "annual_fee_usd": null,
  "annual_fee_first_year_waived": false,
  "membership_required": "Invite-only; top-tier Robinhood Gold customer",
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "robinhood_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": null, "cap_usd_per_year": null, "notes": "Final earning rates not publicly confirmed; presumed higher than Gold's 3% flat or with multipliers on travel/dining"}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Premium travel benefits (lounge access, etc.) — pending official disclosure", "value_estimate_usd": null, "category": "lounge_access"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Robinhood invite-only Platinum"],

  "best_for": ["high_net_worth_robinhood_clients"],
  "synergies_with": ["robinhood_gold_card"],
  "competing_with_in_wallet": ["amex_platinum", "chase_sapphire_reserve"],

  "breakeven_logic_notes": "Insufficient public disclosure to compute net AF. Engine: flag for follow-up once card details are official.",

  "recently_changed": true,
  "recently_changed_date": "2026 rollout",
  "data_freshness": "2026-05-01",
  "sources": ["https://robinhood.com/us/en/creditcard/platinum/"]
}
```

## programs.json entry
See `robinhood_gold_card.md`.

## issuer_rules.json entry
See `robinhood_gold_card.md`.

## perks_dedup.json entries
None unique pending disclosure.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Invite-only, details fluid**: As of May 2026, public details are limited. Engine should treat as "watch list" rather than primary recommendation.
- Likely positioned competitively vs Amex Platinum / CSR.
