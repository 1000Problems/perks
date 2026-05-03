# J.P. Morgan Reserve

`card_id`: jpmorgan_reserve
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "jpmorgan_reserve",
  "name": "J.P. Morgan Reserve Card",
  "issuer": "Chase / J.P. Morgan",
  "network": "Visa Infinite",
  "card_type": "personal",
  "category": ["premium_travel", "invite_only"],
  "annual_fee_usd": 595,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "wealth_relationship_required_usd": 10000000,
  "wealth_relationship_required_notes": "Requires $10M+ in JPM Private Bank assets",
  "currency_earned": "chase_ur",

  "earning": [
    {"category": "travel_dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Earning structure mirrors pre-refresh Sapphire Reserve"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "No public SUB. Negotiated via JPM relationship."
  },

  "annual_credits": [
    {"name": "$300 travel credit (legacy CSR-style)", "signal_id": "travel_credit", "value_usd": 300, "type": "specific", "expiration": "calendar_year", "ease_of_use": "easy"},
    {"name": "Global Entry / TSA PreCheck", "signal_id": "global_entry_tsa", "value_usd": 100, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Priority Pass Select (legacy unlimited)", "signal_id": "lounge_access", "value_estimate_usd": 469, "category": "lounge_access"},
    {"name": "Sapphire Lounge access", "signal_id": "lounge_access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "1.5cpp portal redemption (legacy)", "value_estimate_usd": null, "category": "rewards_flexibility"},
    {"name": "Trip cancellation/interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Primary CDW", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "chase_ur",

  "issuer_rules": ["Chase 5/24", "Sapphire family 48-month rule", "JPM Private Bank invitation"],

  "best_for": ["JPM_private_bank_clients_seeking_legacy_CSR_terms"],
  "synergies_with": ["chase_sapphire_preferred"],
  "competing_with_in_wallet": ["chase_sapphire_reserve_post_refresh"],

  "breakeven_logic_notes": "Effectively the pre-refresh CSR retained for ultra-affluent JPM clients. AF $595, $300 easy travel credit = $295 net. Major value: maintains 1.5cpp portal redemption that public CSR lost in 2025 refresh.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.jpmorgan.com/wealth-management/wealth-partners/credit-cards"]
}
```

## programs.json entry
See `chase_sapphire_preferred.md`.

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `chase_sapphire_preferred.md`.

## RESEARCH_NOTES.md entries

- **Invite-only**: Engine should never surface as a recommendation; only relevant to identify if user already holds it (different earning math).
- **Pre-refresh CSR terms preserved**: 1.5cpp portal, $300 broad travel credit, no coupon book. Ultra-affluent escape hatch from CSR refresh.
