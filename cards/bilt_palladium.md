# Bilt Palladium

`card_id`: bilt_palladium
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "bilt_palladium",
  "name": "Bilt Palladium Card",
  "issuer": "Bilt (issued by Wells Fargo)",
  "network": "Mastercard World Elite (or Visa Infinite — verify)",
  "card_type": "personal",
  "category": ["premium_travel", "rent_rewards"],
  "annual_fee_usd": 495,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "bilt_rewards",

  "earning": [
    {"category": "rent_uncapped_higher_rate", "rate_pts_per_dollar": 1, "cap_pts_per_year": null, "notes": "Higher cap or uncapped vs Blue/Obsidian; verify"},
    {"category": "dining", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "Verify exact category structure post-launch"},
    {"category": "travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "No traditional SUB"
  },

  "annual_credits": [
    {"name": "Hotel/dining/travel credit", "signal_id": "travel_credit", "value_usd": null, "type": "specific", "expiration": "annual", "ease_of_use": "medium", "notes": "Details emerging post-launch; verify before recommendation"}
  ],

  "ongoing_perks": [
    {"name": "Lounge access (Priority Pass and/or Bilt-curated)", "signal_id": "lounge_access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Cell phone protection", "signal_id": "cell_phone_protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Trip protections", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "bilt_rewards",

  "issuer_rules": ["Bilt 5-transactions-per-cycle", "Housing payment scaling"],

  "best_for": ["high_rent_renters_with_premium_travel_demand"],
  "synergies_with": ["bilt_blue", "bilt_obsidian"],
  "competing_with_in_wallet": ["chase_sapphire_reserve", "amex_platinum", "capital_one_venture_x"],

  "breakeven_logic_notes": "AF $495. Justified for users paying $3k+/mo rent who would also pay for a premium travel card anyway. Engine: weight conservatively until full benefit slate verified.",

  "recently_changed": true,
  "recently_changed_date": "2026-01",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.cnbc.com/select/bilt-mastercard-new-credit-cards-rewards/"]
}
```

## programs.json entry
See `bilt_blue.md`.

## issuer_rules.json entry
See `bilt_blue.md`.

## perks_dedup.json entries
None unique to Palladium beyond `bilt_blue.md` notes.

## destination_perks.json entries
See `bilt_blue.md`.

## RESEARCH_NOTES.md entries

- **New launch — fluid details**: Engine should treat several fields as TBD. Re-verify earning rates, credits, lounge access, and SUB structure when card has been live for 6+ months.
- **AF positioning**: At $495, sits below Plat/CSR but above Cap One Venture X. Targets affluent renters specifically.
