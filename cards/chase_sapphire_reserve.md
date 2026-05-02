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
- **Cell phone protection**: ~~$50 deductible, $1,000 max per claim, 3 claims per 12 months~~ — STALE. Personal CSR does NOT include cell phone protection in 2026; confirmed by Chase's own cell-phone education page (CSR omitted) and WalletHub. The note above is preserved for git-blame context but the soul block below correctly marks `available: false`.

## card_soul.credit_score

```json
{
  "band": "excellent",
  "source": "Issuer page application funnel + Chase marketing screen — https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
  "confidence": "high",
  "notes": "Chase 5/24 rule applies; rejection driver more than FICO."
}
```

## card_soul.annual_credits

```json
[
  {
    "name": "Annual Travel Credit",
    "face_value_usd": 300,
    "period": "anniversary_year",
    "ease_score": 5,
    "realistic_redemption_pct": 0.95,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": true,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Any travel purchase (Chase's broad travel definition)",
    "notes": "Cash-flexible; near-automatic.",
    "source": "$300 annual travel credit. Get the most flexible travel credit compared to any other card, with up to $300 in statement credits for travel purchases each account anniversary year — issuer page",
    "confidence": "high"
  },
  {
    "name": "The Edit Hotel Credit",
    "face_value_usd": 500,
    "period": "calendar_year",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Prepaid bookings at The Edit by Chase Travel ($250 per booking, max 2/yr)",
    "notes": "~1,150 curated properties; min 2-night Pay Now.",
    "source": "$500 credit for stays with The Edit. Receive a statement credit of up to $250 for each prepaid booking with The Edit, up to $500 annually — issuer page",
    "confidence": "high"
  },
  {
    "name": "Sapphire Exclusive Tables Dining Credit",
    "face_value_usd": 300,
    "period": "split_h1_h2",
    "ease_score": 2,
    "realistic_redemption_pct": 0.50,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Sapphire Exclusive Tables restaurants on OpenTable",
    "notes": "$150 H1 + $150 H2; harder outside top-30 metros.",
    "source": "$300 dining credit. Get up to $150 in statement credits from January through June and again from July through December for a maximum of $300 annually when you dine at restaurants part of the Sapphire Exclusive Tables program on OpenTable — issuer page",
    "confidence": "high"
  },
  {
    "name": "StubHub / viagogo Credit",
    "face_value_usd": 300,
    "period": "split_h1_h2",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "StubHub and viagogo (through 12/31/2027)",
    "notes": "$150 H1 + $150 H2.",
    "source": "$300 in StubHub credits. Get up to $150 in statement credits from January through June and again from July through December for a maximum of $300 annually for StubHub and viagogo purchases through 12/31/2027 — issuer page",
    "confidence": "high"
  },
  {
    "name": "Lyft In-App Credit",
    "face_value_usd": 120,
    "period": "monthly",
    "ease_score": 4,
    "realistic_redemption_pct": 0.85,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Lyft rides (through 9/30/2027)",
    "notes": "$10/month.",
    "source": "$120 in Lyft credits + 5x points. Get up to $10 in monthly in-app credits to use on rides through 9/30/2027 — issuer page",
    "confidence": "high"
  },
  {
    "name": "DoorDash Promos",
    "face_value_usd": 300,
    "period": "monthly",
    "ease_score": 3,
    "realistic_redemption_pct": 0.60,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "DoorDash ($5 restaurant + 2x $10 grocery/retail per month, through 12/31/2027)",
    "notes": "Requires DashPass activation.",
    "source": "$300 in DoorDash promos. Up to $25 each month to spend on DoorDash, which includes a $5 monthly promo to spend on restaurant orders and two $10 promos each month to save on groceries, retail orders, and more — issuer page",
    "confidence": "high"
  },
  {
    "name": "Peloton Membership Credit",
    "face_value_usd": 120,
    "period": "monthly",
    "ease_score": 1,
    "realistic_redemption_pct": 0.30,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Active Peloton membership (through 12/31/2027)",
    "notes": "$10/month.",
    "source": "$120 in Peloton credits + 10x points. Get $10 in statement credits per month on eligible Peloton memberships through 12/31/2027 — issuer page",
    "confidence": "high"
  },
  {
    "name": "Apple TV / Apple Music",
    "face_value_usd": 288,
    "period": "calendar_year",
    "ease_score": 4,
    "realistic_redemption_pct": 0.85,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": false,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Apple TV+ + Apple Music (through 6/22/2027)",
    "notes": "Per Apple ID; dedup with other Apple-sub-granting cards.",
    "source": "$288 in Apple TV and Apple Music subscriptions. Get complimentary Apple TV … Plus Apple Music. Subscriptions run through 6/22/2027 - a value of $288 annually — issuer page",
    "confidence": "high"
  },
  {
    "name": "DashPass Membership",
    "face_value_usd": 120,
    "period": "calendar_year",
    "ease_score": 4,
    "realistic_redemption_pct": 0.85,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": false,
    "stackable_with_other_credits": false,
    "qualifying_spend": "DashPass membership (through 12/31/2027)",
    "notes": "12-month complimentary DashPass.",
    "source": "$120 DashPass Membership. Complimentary DashPass membership, a $120 value for 12 months — issuer page",
    "confidence": "high"
  },
  {
    "name": "Global Entry / TSA PreCheck / NEXUS",
    "face_value_usd": 120,
    "period": "every_4_years",
    "ease_score": 5,
    "realistic_redemption_pct": 0.95,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": false,
    "stackable_with_other_credits": false,
    "qualifying_spend": "GE / TSA PreCheck / NEXUS application fee",
    "notes": "Once per 4-year cycle.",
    "source": "Global Entry, TSA PreCheck®, or NEXUS fee credit — issuer page",
    "confidence": "high"
  }
]
```

## card_soul.insurance

```json
{
  "primary_source_url": "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
  "gtb_pdf_url": "https://www.chasebenefits.com/K113-006/pdf/BGC11479.pdf",
  "auto_rental_cdw": {
    "available": true,
    "coverage_type": "primary",
    "coverage_max_usd": 75000,
    "domestic": true,
    "international": true,
    "liability_included": false,
    "exclusions": ["exotic_cars", "antiques", "off_road_vehicles", "certain_full_size_vans", "motorcycles", "mopeds", "large_passenger_vans"],
    "source": "Auto Rental Collision Damage Waiver. Coverage is primary and provides reimbursement up to $75,000 for theft and collision damage for most rental vehicles in the U.S. and abroad — issuer page",
    "confidence": "high"
  },
  "trip_cancellation_interruption": {
    "available": true,
    "max_per_traveler_usd": 10000,
    "max_per_trip_usd": 20000,
    "source": "Trip Cancellation and Interruption Insurance. If your trip is canceled or cut short … you can be reimbursed up to $10,000 per covered traveler and $20,000 per trip — issuer page",
    "confidence": "high"
  },
  "trip_delay": {
    "available": true,
    "threshold_hours": 6,
    "max_per_traveler_usd": 500,
    "trigger_alt": "or requires an overnight stay",
    "source": "Trip Delay Reimbursement. If your common carrier travel is delayed more than 6 hours or requires an overnight stay … up to $500 per covered traveler — issuer page",
    "confidence": "high"
  },
  "baggage_delay": {
    "available": true,
    "threshold_hours": 6,
    "max_per_day_usd": 100,
    "max_days": 5,
    "source": "Baggage Delay Insurance. Reimburses you up to $100 a day for up to 5 days for essential purchases like toiletries and clothing when baggage is delayed over 6 hours — issuer page",
    "confidence": "high"
  },
  "lost_baggage": {
    "available": true,
    "max_per_traveler_usd": 3000,
    "per_bag_max_usd": 2000,
    "per_trip_max_total_usd": 10000,
    "source": "Lost Luggage Reimbursement. Provides reimbursement up to $3,000 per covered traveler … additionally limited to $2,000 per bag and $10,000 for all covered travelers per trip — issuer page",
    "confidence": "high"
  },
  "cell_phone_protection": {
    "available": false,
    "source": "Personal CSR does NOT include cell phone protection. Chase's own education page lists Freedom Flex, Ink Business Preferred, Ink Business Premier as the cell-phone-protection cards (https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work). WalletHub independently confirms (https://wallethub.com/answers/cc/chase-sapphire-reserve-phone-insurance-1000387-2140714443/). CSR issuer marketing page makes no mention of it.",
    "confidence": "high",
    "notes": "Material correction vs current markdown's stale ongoing_perks entry."
  },
  "emergency_evacuation_medical": {
    "available": true,
    "max_usd": 100000,
    "trigger": "injury or sickness during a trip 100 miles or more from home",
    "source": "Emergency Evacuation and Transportation … you can be covered for medical services and transportation up to $100,000 — issuer page",
    "confidence": "high"
  },
  "emergency_medical_dental": {
    "available": true,
    "max_usd": 2500,
    "deductible_usd": 50,
    "trigger": "100 miles or more from home",
    "source": "Emergency Medical and Dental … you can be reimbursed up to $2,500 for medical expenses, subject to a $50 deductible — issuer page",
    "confidence": "high"
  },
  "travel_accident_insurance": {
    "available": true,
    "max_usd": 1000000,
    "trigger": "when you pay for your air, bus, train or cruise transportation with your card",
    "source": "Travel Accident Insurance … up to $1,000,000 in accidental death or dismemberment coverage — issuer page",
    "confidence": "high"
  },
  "purchase_protection": {
    "available": true,
    "window_days": 120,
    "max_per_item_usd": 10000,
    "max_per_year_usd": 50000,
    "source": "Purchase Protection. Covers your eligible new purchases for 120 days from the date of purchase against damage or theft up to $10,000 per item — issuer page (NY: 90 days)",
    "confidence": "high"
  },
  "extended_warranty": {
    "available": true,
    "extra_year_added": 1,
    "notes": "Issuer page text truncated; full per-claim cap and warranty-length ceiling in GTB.",
    "source": "Extended Warranty Protection. Extends the time period of the manufacturer's U.S. … — issuer page (truncated)",
    "confidence": "medium"
  },
  "return_protection": {
    "available": true,
    "window_days": 90,
    "max_per_item_usd": 500,
    "max_per_12mo_usd": 1000,
    "source": "Return Protection. You can be reimbursed for eligible items that the store won't accept within 90 days of purchase, up to $500 per item, $1,000 per 12-month period — issuer page",
    "confidence": "high"
  },
  "roadside_assistance": {
    "available": true,
    "type": "pay-per-use; via Roadside Assistance hotline",
    "source": "Roadside Assistance. If you have a roadside emergency, you can call for a tow, battery assistance, tire change, locksmith or gas — issuer page",
    "confidence": "medium"
  }
}
```

## card_soul.program_access

```json
[
  {"program_id": "chase_sapphire_lounge_network", "access_kind": "included", "overrides": {"guests_free": 2}, "notes": "Up to 2 complimentary guests.", "source": "Enjoy complimentary access to Chase Sapphire Lounges by The Club … with up to two complimentary guests — issuer page", "confidence": "high"},
  {"program_id": "priority_pass_select", "access_kind": "included", "overrides": {"guests_free": 2, "lounges": "1,300+"}, "notes": "Priority Pass Select Membership.", "source": "1,300+ Priority Pass airport lounges worldwide with up to two guests — issuer page", "confidence": "high"},
  {"program_id": "chase_the_edit", "access_kind": "included", "overrides": {"earn_5x": true, "credit_usd_per_yr": 500}, "notes": "Curated hotels with property credit, breakfast, upgrade.", "source": "issuer page The Edit block", "confidence": "high"},
  {"program_id": "visa_infinite_lhc", "access_kind": "included", "overrides": {}, "notes": "CSR is Visa Infinite.", "source": "derived from network status", "confidence": "high"},
  {"program_id": "centurion_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "capital_one_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Capital One-only.", "source": "derived", "confidence": "high"},
  {"program_id": "delta_skyclub", "access_kind": "not_available", "overrides": {}, "notes": "Amex-Delta only.", "source": "derived", "confidence": "high"},
  {"program_id": "fhr", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only program.", "source": "derived", "confidence": "high"},
  {"program_id": "amex_hotel_collection", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "capital_one_premier_collection", "access_kind": "not_available", "overrides": {}, "notes": "Capital One-only.", "source": "derived", "confidence": "high"},
  {"program_id": "amex_global_dining_access", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only; CSR uses Sapphire Exclusive Tables.", "source": "derived", "confidence": "high"}
]
```

## card_soul.co_brand_perks

```json
{
  "hotel_status_grants": [
    {"program": "ihg_one_rewards", "tier": "platinum_elite", "auto_grant": true, "via_spend_threshold": null, "valid_through": "2027-12-31", "source": "IHG One Rewards Platinum Elite Status. Get complimentary IHG One Rewards Platinum Elite Status with your Sapphire Reserve card through December 31, 2027 — issuer page", "confidence": "high"},
    {"program": "world_of_hyatt", "tier": "explorist", "auto_grant": false, "via_spend_threshold": 75000, "valid_through": "as long as $75K threshold met annually", "source": "World of Hyatt Explorist Status — $75K spend cluster, issuer page", "confidence": "high"},
    {"program": "ihg_one_rewards", "tier": "diamond_elite", "auto_grant": false, "via_spend_threshold": 75000, "valid_through": "as long as $75K threshold met annually", "source": "IHG One Rewards Diamond Elite Status — $75K spend cluster, issuer page", "confidence": "high"}
  ],
  "rental_status_grants": [
    {"program": "hertz", "tier": "presidents_circle", "auto_grant": false, "source": "Markdown legacy + issuer page Hertz card-link; tier label not surfaced in this fetch.", "confidence": "medium"}
  ],
  "prepaid_hotel_credit": {
    "amount_usd_per_period": 250,
    "period": "calendar_year",
    "qualifying_programs": ["chase_the_edit"],
    "min_nights": 2,
    "booking_channel": "Chase Travel — The Edit",
    "source": "$500 credit for stays with The Edit. Receive a statement credit of up to $250 for each prepaid booking with The Edit, up to $500 annually — issuer page"
  },
  "free_night_certificates": [],
  "complimentary_dashpass": {"available": true, "through": "12/31/2027", "source": "$120 DashPass Membership. Complimentary DashPass membership, a $120 value for 12 months. … when you activate by 12/31/2027 — issuer page"},
  "ten_pct_anniversary_bonus": {"available": false},
  "spend_threshold_lounge_unlock": {
    "unlock": "Hyatt Explorist + IHG Diamond Elite + $250 Shops at Chase + $500 Southwest Chase Travel credit + Southwest A-list status",
    "threshold_usd_per_calendar_year": 75000,
    "source": "$75,000 Spend Benefit … Hyatt Explorist Status … IHG One Rewards Diamond Elite Status … $250 Credit for The Shops at Chase … $500 Southwest Airlines Chase Travel credit … Southwest Airlines A-list status — issuer page"
  },
  "points_boost_redemption": {
    "available": true,
    "max_multiplier": 2,
    "source": "Up to 2X on Select Flights and Hotels through Chase Travel with Points Boost — issuer page"
  },
  "welcome_offer_current_public": {
    "amount_pts": 150000,
    "spend_required_usd": 6000,
    "spend_window_months": 3,
    "source": "Earn 125,000 [strikethrough] 150,000 points after you spend $6,000 in purchases in the first 3 months from account opening — issuer page"
  },
  "additional_cardholders": {"fee_per_au": 195, "source": "$195 for each authorized user — issuer page"}
}
```

## card_soul.absent_perks

```json
[
  {
    "perk_key": "cell_phone_protection",
    "reason": "Personal CSR does not include cell phone protection. Chase's education page omits CSR; WalletHub confirms.",
    "workaround": "Pair with Chase Freedom Flex or Wells Fargo Autograph Journey for cell phone coverage; or hold a Chase Ink business card.",
    "confidence": "high"
  },
  {"perk_key": "fhr_or_thc", "reason": "Amex-only programs. CSR uses The Edit instead.", "workaround": "The Edit gives Chase's curated-hotel value-add.", "confidence": "high"},
  {"perk_key": "centurion_lounge_access", "reason": "Amex-only network.", "workaround": "Sapphire Lounge by The Club + Priority Pass cover most major hubs.", "confidence": "high"},
  {"perk_key": "delta_skyclub_access", "reason": "Amex-Delta only.", "workaround": "Use Sapphire Lounges + PP; or hold Delta Reserve.", "confidence": "high"},
  {"perk_key": "amex_global_dining_access_resy", "reason": "Amex-only program.", "workaround": "Sapphire Exclusive Tables is the CSR equivalent.", "confidence": "high"},
  {"perk_key": "anniversary_free_night", "reason": "CSR is not a hotel co-brand; no anniversary FNC.", "workaround": "Pair with World of Hyatt, Marriott Brilliant, Hilton Aspire, or IHG Premier.", "confidence": "high"}
]
```

## card_soul.fetch_log

```
- url: https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve  status: 200  bytes: ~999K
- url: https://www.chase.com/content/dam/cs-asset/pdf/credit-cards/sapphire-reserve-guide-to-benefits.pdf  status: 404  fallback: chasebenefits.com landing
- url: https://www.chasebenefits.com/sapphirereserve3  status: 200
- url: https://www.chasebenefits.com/K113-006/pdf/BGC11479.pdf  status: 200  pdf_extract: failed (binary mangled)
- url: https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work  status: 200  used_for: confirming CSR absent from cell-phone-protection list
- url: https://wallethub.com/answers/cc/chase-sapphire-reserve-phone-insurance-1000387-2140714443/  status: 200  used_for: independent cell-phone-protection absence
- WebSearch: "Chase Sapphire Reserve cell phone protection 2026 benefits list"
```
