# Chase Sapphire Reserve

`card_id`: chase_sapphire_reserve
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "chase_sapphire_reserve",
  "name": "Chase Sapphire Reserve",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["premium_travel"],
  "annual_fee_usd": 795,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "chase_ur",

  "earning": [
    {"category": "travel_chase_portal", "rate_pts_per_dollar": 8, "cap_usd_per_year": null, "notes": "Chase Travel; excludes purchases that earn The Edit credit"},
    {"category": "flights_hotels_direct", "rate_pts_per_dollar": 4, "cap_usd_per_year": null, "notes": "Booked directly with airline or hotel"},
    {"category": "dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Worldwide dining"},
    {"category": "lyft", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "Through 2027-09-30, includes ride-share"},
    {"category": "peloton_equipment", "rate_pts_per_dollar": 10, "cap_usd_per_year": null, "notes": "Equipment and accessories over $150 through 2027-12-31, capped at limited-time promo levels"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 100000,
    "spend_required_usd": 5000,
    "spend_window_months": 3,
    "estimated_value_usd": 2000,
    "notes": "Has hit 150k publicly post-refresh; current standard 100k. Plus $500 Chase Travel credit on some offers. Verify before applying."
  },

  "annual_credits": [
    {"name": "The Edit hotel credit", "value_usd": 500, "type": "specific", "expiration": "calendar_year", "ease_of_use": "medium", "notes": "Two $250 increments per calendar year. Prepaid 2+ night stays at The Edit by Chase Travel curated hotels."},
    {"name": "2026 select-hotels Chase Travel credit", "value_usd": 250, "type": "specific", "expiration": "calendar_year_2026_only", "ease_of_use": "medium", "notes": "Covers IHG, Montage, Pendry, Omni, Virgin, Minor, Pan Pacific; one-time 2026 benefit."},
    {"name": "Sapphire Reserve Exclusive Tables dining credit", "value_usd": 300, "type": "specific", "expiration": "split_h1_h2", "ease_of_use": "hard", "notes": "$150 H1 + $150 H2; only at curated reservations in select cities; risk of breakage"},
    {"name": "StubHub / viagogo credit", "value_usd": 300, "type": "specific", "expiration": "split_h1_h2", "ease_of_use": "medium", "notes": "$150 H1 + $150 H2 through 2027-12-31"},
    {"name": "Lyft in-app credit", "value_usd": 120, "type": "specific", "expiration": "monthly", "ease_of_use": "easy", "notes": "$10/month, requires monthly use, expires through 2027-09-30"},
    {"name": "DoorDash monthly credit", "value_usd": 300, "type": "specific", "expiration": "monthly", "ease_of_use": "medium", "notes": "$5 restaurants + 2x $10 grocery/retail per month; requires DashPass linked"},
    {"name": "Peloton membership credit", "value_usd": 120, "type": "specific", "expiration": "monthly", "ease_of_use": "hard", "notes": "$10/month; only valuable if you actively pay for Peloton membership"},
    {"name": "Apple TV+ subscription", "value_usd": 119, "type": "specific", "expiration": "annual", "ease_of_use": "medium", "notes": "Complimentary; ~$9.99/mo retail"},
    {"name": "Apple Music subscription", "value_usd": 132, "type": "specific", "expiration": "annual", "ease_of_use": "medium", "notes": "Complimentary; ~$10.99/mo retail; perks_dedup with Amex Platinum"},
    {"name": "Global Entry / TSA PreCheck / NEXUS credit", "value_usd": 120, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Priority Pass Select", "value_estimate_usd": 469, "category": "lounge_access", "notes": "Includes restaurants for primary cardholder"},
    {"name": "Chase Sapphire Lounge access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Trip cancellation/interruption insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "Up to $10k/person, $20k/trip"},
    {"name": "Trip delay reimbursement", "value_estimate_usd": null, "category": "travel_protection", "notes": "6+ hour delay; $500/ticket"},
    {"name": "Primary auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Baggage delay insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Lost luggage reimbursement", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Emergency evacuation/medical", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Cell phone protection", "value_estimate_usd": null, "category": "purchase_protection", "notes": "Up to $1,000/claim, 3 claims/12 mo, $50 deductible"},
    {"name": "IHG One Rewards Platinum status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "Hertz President's Circle status", "value_estimate_usd": null, "category": "rental_status"}
  ],

  "transfer_partners_inherited_from": "chase_ur",

  "issuer_rules": [
    "Chase 5/24",
    "Sapphire family 48-month bonus rule"
  ],

  "best_for": ["heavy_travel_with_high_credit_use", "premium_lounge_access_combined_with_UR", "Hyatt_loyalists_who_will_use_Edit"],
  "synergies_with": ["chase_freedom_unlimited", "chase_freedom_flex", "chase_ink_business_preferred", "chase_ink_business_unlimited"],
  "competing_with_in_wallet": ["amex_platinum", "capital_one_venture_x"],

  "breakeven_logic_notes": "AF $795. Effective net AF requires methodical use of: $500 Edit (medium), $300 dining (hard, often coupon-book in practice), $300 StubHub (medium), $120 Lyft + $300 DoorDash + $120 Peloton + $250 Apple subs (mixed). For a casual user, realistic credit capture is closer to $400-500 of face value. CSR is now justifiable mainly for Hyatt-heavy travelers who will repeatedly hit The Edit + use lounges + use 8x Chase Travel.",

  "recently_changed": true,
  "recently_changed_date": "2025-06-23",
  "data_freshness": "2026-05-01",
  "sources": [
    "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
    "https://account.chase.com/sapphire/reserve/benefits",
    "https://thepointsguy.com/credit-cards/chase-sapphire-reserve-credits/",
    "https://media.chase.com/news/the-most-rewarding-cards-are-here",
    "https://thriftytraveler.com/news/credit-card/new-chase-sapphire-reserve-benefits-now-live/"
  ]
}
```

## programs.json entry (chase_ur)

See `chase_sapphire_preferred.md` for the canonical chase_ur entry. CSR-specific note: post-2025 refresh, the historical 1.5cpp portal redemption on CSR has been replaced. CSR cardholders now redeem at a different floor; the 1.25cpp portal value is preserved on Sapphire Preferred / Ink Preferred.

## issuer_rules.json entry (Chase)

See `chase_sapphire_preferred.md` for canonical Chase issuer_rules entry. Same rules apply.

## perks_dedup.json entries contributed by this card

```json
[
  {
    "perk": "priority_pass_select",
    "card_ids": ["chase_sapphire_reserve"],
    "value_if_unique_usd": 469,
    "value_if_duplicate_usd": 0,
    "notes": "Multiple cards offer PP. CSR includes restaurants; Amex Platinum lost restaurant access years ago; Cap One Venture X excludes guests beyond 2 free, etc. Engine should pick best PP variant."
  },
  {
    "perk": "doordash_dashpass",
    "card_ids": ["chase_sapphire_preferred", "chase_sapphire_reserve"],
    "value_if_unique_usd": 120,
    "value_if_duplicate_usd": 0,
    "notes": "Same DashPass membership; redundant if user already has CSP or Amex Platinum."
  },
  {
    "perk": "global_entry_credit",
    "card_ids": ["chase_sapphire_reserve"],
    "value_if_unique_usd": 120,
    "value_if_duplicate_usd": 0,
    "notes": "Every 4 years. If user has Cap One Venture X, Amex Platinum, etc., they cannot stack — only useful once per cycle."
  },
  {
    "perk": "apple_tv_plus",
    "card_ids": ["chase_sapphire_reserve"],
    "value_if_unique_usd": 119,
    "value_if_duplicate_usd": 0,
    "notes": "Per-Apple-ID benefit. Engine should detect duplicate Apple subs and not double-count."
  },
  {
    "perk": "apple_music",
    "card_ids": ["chase_sapphire_reserve"],
    "value_if_unique_usd": 132,
    "value_if_duplicate_usd": 0
  },
  {
    "perk": "ihg_platinum_status",
    "card_ids": ["chase_sapphire_reserve"],
    "value_if_unique_usd": null,
    "value_if_duplicate_usd": 0
  }
]
```

## destination_perks.json entries this card relevant to

```json
{
  "anywhere_chase_travel_8x_offsets": {
    "relevant_cards": ["chase_sapphire_reserve"],
    "notes": "8x Chase Travel makes prepaid bookings highly competitive vs direct, particularly for users willing to forfeit airline/hotel elite credit on the booking."
  },
  "international_premium_travel": {
    "relevant_cards": ["chase_sapphire_reserve"],
    "notes": "Priority Pass + Sapphire Lounges + 0% FX + primary CDW + emergency evac. Strong international travel posture for users who actually visit lounges."
  }
}
```

## RESEARCH_NOTES.md entries

- **2025 refresh date**: Existing cardholders saw the new pricing/benefits roll out at first renewal on/after 2025-10-26. New applicants paid $795 immediately starting 2025-06-23.
- **The Edit**: Replaced the long-running $300 generic travel credit. Higher face value ($500) but harder to use — must be a 2+ night Pay Now booking at one of ~1,150 curated properties.
- **Coupon-book grade**: With ~10 separate credits split across calendar/H1/H2/monthly windows, CSR has moved firmly into Amex-Platinum-style coupon book territory. Engine should grade ease-of-use conservatively.
- **150k SUB**: Has hit 150k post-refresh as a public offer. Standard floor 100k. Confirm via The Points Guy / Doctor of Credit before publishing rec.
- **Sapphire Reserve for Business**: Launched alongside refresh. Tracked separately; do not confuse.
- **Conflict**: Some sources show 4x flights+hotels direct; others suggest the 4x is hotels-direct only with flights at 1x outside Chase Travel. Resolved via Chase official press release showing flights+hotels direct booked = 4x. Verify against issuer page.
- **Cell phone protection**: $50 deductible, $1,000 max per claim, 3 claims per 12 months — competitive but Wells Fargo Active Cash and others have lower deductibles.
