# Robinhood Gold Card

`card_id`: robinhood_gold_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "robinhood_gold_card",
  "name": "Robinhood Gold Card",
  "issuer": "Robinhood / Coastal Community Bank",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "fintech"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "membership_required": "Robinhood Gold ($5/mo or $50/yr)",
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "robinhood_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "3% flat with no caps and no categories — highest unrestricted rate currently in market"},
    {"category": "robinhood_travel_portal", "rate_pts_per_dollar": 5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "No traditional SUB"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto-redeem cash back as Robinhood deposit", "value_estimate_usd": null, "category": "rewards_payout"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Waitlist-based access", "Requires active Robinhood Gold subscription"],

  "best_for": ["robinhood_users_with_$60_plus_in_other_value", "highest_unrestricted_rate_seeker"],
  "synergies_with": ["robinhood_platinum_card"],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_active_cash", "us_bank_smartly"],

  "breakeven_logic_notes": "Effective AF: $60 (Gold annual). 3% flat earns $300 on $10k spend net of subscription. Beats 2% cards once spend exceeds $6k annually. Engine should ask whether user already pays for Robinhood Gold (sunk cost) — if so, effective AF is $0.",

  "recently_changed": true,
  "recently_changed_date": "2024-2026 rollout",
  "data_freshness": "2026-05-01",
  "sources": [
    "https://robinhood.com/creditcard/",
    "https://www.cnbc.com/select/robinhood-gold-card-announcement/",
    "https://www.nerdwallet.com/credit-cards/learn/robinhood-credit-card"
  ]
}
```

## programs.json entry

```json
{
  "id": "robinhood_cashback",
  "name": "Robinhood Gold Cashback",
  "type": "fixed_value",
  "issuer": "Robinhood / Coastal Community Bank",
  "earning_cards": ["robinhood_gold_card", "robinhood_platinum_card"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://robinhood.com/creditcard/"]
}
```

## issuer_rules.json entry

```json
{
  "issuer": "Robinhood",
  "rules": [
    {
      "id": "robinhood_gold_required",
      "name": "Robinhood Gold subscription required",
      "description": "Cardholder must maintain Robinhood Gold subscription ($5/mo or $50/yr). Card terminates if Gold lapses.",
      "applies_to": "robinhood_cards",
      "official": true
    },
    {
      "id": "robinhood_waitlist",
      "name": "Waitlist access (Gold)",
      "description": "Robinhood Gold Card admits waitlist applicants in batches; ~600k+ admitted as of mid-2026.",
      "applies_to": "robinhood_gold_card",
      "official": false
    },
    {
      "id": "robinhood_invite_only",
      "name": "Invite-only (Platinum)",
      "description": "Robinhood Platinum Card is invite-only; available to top-tier Robinhood Gold customers.",
      "applies_to": "robinhood_platinum_card",
      "official": true
    }
  ]
}
```

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Highest unrestricted rate**: 3% flat with no categories, no caps. Beats USB Smartly's 4% (which requires $100k+ deposits) for users without USB relationship.
- **Subscription gate**: Engine must check if user already pays for Robinhood Gold for trading/margin/IRA. If yes, card subscription is "free."
- **No FX fee**: Usable internationally.
- **Travel portal 5x**: New addition. Limited utility unless travel portal pricing is competitive.
