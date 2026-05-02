# US Bank Altitude Reserve

`card_id`: us_bank_altitude_reserve
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "us_bank_altitude_reserve",
  "name": "US Bank Altitude Reserve Visa Infinite",
  "issuer": "US Bank",
  "network": "Visa Infinite",
  "card_type": "personal",
  "category": ["premium_travel"],
  "annual_fee_usd": 400,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "us_bank_flexpoints",

  "earning": [
    {"category": "mobile_wallet_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "3x via Apple Pay/Google Pay/Samsung Pay anywhere accepted — uniquely broad bonus category"},
    {"category": "travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 50000,
    "spend_required_usd": 4500,
    "spend_window_months": 3,
    "estimated_value_usd": 750
  },

  "annual_credits": [
    {"name": "Travel/dining credit", "value_usd": 325, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy", "notes": "Auto-applied to first $325 of travel and dining each year"},
    {"name": "TSA PreCheck / Global Entry", "value_usd": 100, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"},
    {"name": "Priority Pass select", "value_usd": null, "type": "specific", "expiration": "annual", "ease_of_use": "easy", "notes": "4 free visits per year"}
  ],

  "ongoing_perks": [
    {"name": "Priority Pass Select (4 free visits)", "value_estimate_usd": 140, "category": "lounge_access"},
    {"name": "Trip cancellation/interruption", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Auto rental CDW (primary in US)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Cell phone protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "1.5cpp redemption when redeeming for travel via Real-Time Rewards or US Bank Travel", "value_estimate_usd": null, "category": "rewards_flexibility", "notes": "Effective return: 4.5% mobile wallet, 4.5% travel, 1.5% non-bonus when used for travel"}
  ],

  "transfer_partners_inherited_from": "us_bank_flexpoints",

  "issuer_rules": ["US Bank single-app every 30 days", "US Bank generally requires existing relationship"],

  "best_for": ["mobile_wallet_3x_anywhere", "Apple_Pay_heavy_users", "USB_relationship_holders"],
  "synergies_with": ["us_bank_altitude_connect", "us_bank_smartly"],
  "competing_with_in_wallet": ["chase_sapphire_reserve", "amex_platinum", "capital_one_venture_x"],

  "breakeven_logic_notes": "AF $400 less $325 travel/dining (easy) less $100 GE = $25 net or negative. 3x mobile wallet is uniquely broad — the only premium card to reward Apple Pay/Google Pay grocery/everything-else as a bonus category. At 1.5cpp redemption: 4.5% effective on all mobile-wallet spend.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.usbank.com/credit-cards/altitude-reserve-visa-infinite-credit-card.html",
    "https://thepointsguy.com/credit-cards/reviews/us-bank-altitude-reserve-review/"
  ]
}
```

## programs.json entry (us_bank_flexpoints)

```json
{
  "id": "us_bank_flexpoints",
  "name": "US Bank FlexPoints",
  "type": "fixed_value",
  "issuer": "US Bank",
  "earning_cards": ["us_bank_altitude_reserve", "us_bank_altitude_connect", "us_bank_altitude_go"],
  "fixed_redemption_cpp": 1.0,
  "portal_redemption_cpp": 1.5,
  "portal_redemption_cpp_notes": "1.5cpp on Altitude Reserve via Real-Time Rewards/USB Travel",
  "transfer_partners": [],
  "transfer_partners_notes": "Until 2024 had no transfer partners. Some new partners may be added; verify.",
  "sweet_spots": [],
  "sources": ["https://www.usbank.com/"]
}
```

## issuer_rules.json entry (US Bank)

```json
{
  "issuer": "US Bank",
  "rules": [
    {
      "id": "usb_30_day_rule",
      "name": "30 days between apps",
      "description": "US Bank typically allows one new card application per 30-day window.",
      "applies_to": "us_bank_personal",
      "official": false
    },
    {
      "id": "usb_relationship_preferred",
      "name": "Existing-relationship preference",
      "description": "Approval rates significantly higher with prior US Bank deposit/credit relationship. Cold applicants may be denied with strong credit.",
      "applies_to": "us_bank_personal",
      "official": false
    }
  ]
}
```

## perks_dedup.json entries

```json
[
  {
    "perk": "priority_pass_4_visits",
    "card_ids": ["us_bank_altitude_reserve"],
    "value_if_unique_usd": 140,
    "value_if_duplicate_usd": 0,
    "notes": "Limited to 4 visits/yr (vs unlimited on CSR/Cap One Venture X). Engine: deprioritize this PP variant if user holds full PP."
  }
]
```

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Mobile wallet 3x = unique**: Pay any merchant via Apple Pay, get 3x. At 1.5cpp redemption, 4.5% return on practically any spend the merchant accepts contactless — the highest no-cap return on a credit card.
- **Hard to get**: USB underwrites conservatively for non-customers. May require opening a checking account first.
