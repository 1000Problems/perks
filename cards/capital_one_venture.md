# Capital One Venture Rewards

`card_id`: capital_one_venture
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_venture",
  "name": "Capital One Venture Rewards Credit Card",
  "issuer": "Capital One",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "capital_one_miles",

  "earning": [
    {"category": "hotels_and_rentals_capital_one_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "estimated_value_usd": 1300,
    "notes": "Often paired with $250 travel credit. Has hit 100k via CardMatch."
  },

  "annual_credits": [
    {"name": "Global Entry / TSA PreCheck credit", "signal_id": "global_entry_tsa", "value_usd": 120, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Travel accident insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Hertz Five Star status", "value_estimate_usd": null, "category": "rental_status"}
  ],

  "transfer_partners_inherited_from": "capital_one_miles",

  "issuer_rules": ["Capital One 1-per-month", "Capital One 2-personal-card-max", "Capital One 48-month bonus rule (some products)"],

  "best_for": ["flat_2x_transferable_points", "no_FX_fee_simple_travel"],
  "synergies_with": ["capital_one_savor", "capital_one_quicksilver", "capital_one_venture_x"],
  "competing_with_in_wallet": ["chase_sapphire_preferred", "amex_gold", "citi_strata_premier"],

  "breakeven_logic_notes": "AF $95. 2x flat = effectively 4cpp via Turkish Miles+Smiles transfers. Beats CSP for users who don't dine out heavily and want simple flat earning.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.capitalone.com/credit-cards/venture/"
  ]
}
```

## programs.json entry
See `capital_one_venture_x.md`.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
```json
[{"perk": "global_entry_credit", "card_ids": ["capital_one_venture"], "value_if_unique_usd": 120, "value_if_duplicate_usd": 0}]
```

## destination_perks.json entries
See `capital_one_venture_x.md` for Turkish/United sweet spot.

## RESEARCH_NOTES.md entries

- Simpler than Venture X. No lounge access. Best as a "set and forget" 2x earner with transferability.
- 48-month rule applies between Venture and Venture X bonus eligibility per Capital One pop-up.

## card_soul.credit_score

```json
{
  "band": "excellent",
  "source": "Issuer page lists 'Excellent Credit' as the credit profile — https://www.capitalone.com/credit-cards/venture/. No specific FICO published.",
  "confidence": "high",
  "notes": "Capital One 1-per-month and 2-personal-card-max rules apply. 48-month rule between Venture and Venture X bonus eligibility (per Capital One pop-up)."
}
```

## card_soul.annual_credits

```json
[
  {
    "name": "Global Entry / TSA PreCheck Application Fee Credit",
    "face_value_usd": 120,
    "period": "every_5_years",
    "ease_score": 1,
    "realistic_redemption_pct": 0.30,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": false,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Global Entry ($120) or TSA PreCheck application fee charged to the card",
    "notes": "One statement credit per account every 4 years per issuer terms; the underlying TSA PreCheck/Global Entry membership is itself 5 years, so the realistic re-trigger cadence is once per 4-5 years per cardholder. Heavy duplication risk — most premium-travel cardholders already have this credit elsewhere.",
    "source": "'Receive up to a $120 credit for Global Entry or TSA PreCheck® … One statement credit will be processed per account every 4 years.' — https://www.capitalone.com/credit-cards/venture/",
    "confidence": "high"
  }
]
```

## card_soul.insurance

```json
{
  "primary_source_url": "https://www.capitalone.com/credit-cards/venture/",
  "gtb_pdf_url": null,
  "auto_rental_cdw": {
    "available": true,
    "coverage_type": "secondary",
    "coverage_max_usd": null,
    "domestic": true,
    "international": true,
    "liability_included": false,
    "exclusions": ["large_passenger_vans", "trucks", "exotic_cars", "impaired_driving", "wear_and_tear"],
    "source": "'For eligible Venture cards, coverage is secondary, meaning when a claim is made on your rental car, your personal auto insurance is applied before your rental car insurance.' — https://www.capitalone.com/help-center/credit-cards/rental-car-insurance/. 'Auto Rental Collision Damage Waiver' — https://www.capitalone.com/credit-cards/venture/.",
    "confidence": "high",
    "notes": "Venture is secondary; Venture X is primary. To activate, decline rental company's CDW and pay full rental with the card."
  },
  "trip_cancellation_interruption": {
    "available": false,
    "source": "Not listed on Venture issuer page or WalletHub Capital One Venture Card Benefits 2026 — https://wallethub.com/edu/cc/capital-one-venture-card-benefits/144657. Trip cancellation/interruption is a Venture X benefit, not Venture.",
    "confidence": "high"
  },
  "trip_delay": {
    "available": false,
    "source": "Not listed on Venture issuer page or WalletHub Venture benefits review.",
    "confidence": "high"
  },
  "baggage_delay": {
    "available": false,
    "source": "Not listed on Venture issuer page or WalletHub Venture benefits review.",
    "confidence": "high"
  },
  "lost_baggage": {
    "available": false,
    "source": "Not listed on Venture issuer page or WalletHub Venture benefits review.",
    "confidence": "high"
  },
  "cell_phone_protection": {
    "available": false,
    "source": "Not listed on Venture issuer page or WalletHub Capital One Venture Card Benefits 2026.",
    "confidence": "high"
  },
  "emergency_evacuation_medical": {
    "available": false,
    "source": "Not listed on Venture issuer page; this is a Venture X-tier Capital One benefit.",
    "confidence": "high"
  },
  "emergency_medical_dental": {
    "available": false,
    "source": "Not listed on Venture issuer page; not on Venture-tier travel benefits.",
    "confidence": "high"
  },
  "travel_accident_insurance": {
    "available": true,
    "max_usd": 1000000,
    "trigger": "when you use the card to purchase your common-carrier fare",
    "source": "'travel accident insurance, which could cover you, your spouse or domestic partner, and dependent children for up to $1 million if there's an accidental loss of life, limb, sight, speech, or hearing while traveling on a common carrier' — Capital One learn-grow / WebSearch summary citing Capital One. 'Travel with accident insurance' confirmed on issuer page — https://www.capitalone.com/credit-cards/venture/.",
    "confidence": "medium"
  },
  "purchase_protection": {
    "available": false,
    "source": "Not surfaced on Venture issuer page or WalletHub Venture benefits review. (Capital One's general Visa Signature Mass Purchase Security has been wound back across the lineup.)",
    "confidence": "medium"
  },
  "extended_warranty": {
    "available": true,
    "extra_year_added": 1,
    "applies_to_warranties_of_max_years": null,
    "source": "'Enjoy an extended warranty — additional protection on eligible purchases at no charge' — https://www.capitalone.com/credit-cards/benefits/venture/. Specific terms not surfaced on the consumer page; relies on Visa Signature inheritance.",
    "confidence": "medium"
  },
  "return_protection": {
    "available": false,
    "source": "Not listed on Venture issuer page or benefits page.",
    "confidence": "high"
  },
  "roadside_assistance": {
    "available": true,
    "type": "24-hour travel assistance — emergency cash, replacement card, dispatch (pay-per-use)",
    "source": "'Get 24-hour travel assistance' / 'Call a dedicated line 24/7 to get emergency cash or get a replacement card while you're traveling' — https://www.capitalone.com/credit-cards/benefits/venture/.",
    "confidence": "high"
  }
}
```

## card_soul.program_access

```json
[
  {"program_id": "capital_one_miles", "access_kind": "included", "overrides": {"redemption_value_cpp": 1.0}, "notes": "Capital One Miles transferable to 15+ airline/hotel partners; 1cpp toward paid travel via Capital One Travel; ~1.45cpp via Reasonable Redemption Values per Frequent Miler.", "source": "Issuer transfer-partner page; Frequent Miler valuation summary.", "confidence": "high"},
  {"program_id": "capital_one_travel_portal", "access_kind": "included", "overrides": {"earn_multiplier_via_portal": 5}, "notes": "5x miles on hotels, vacation rentals, and rental cars booked via Capital One Travel.", "source": "'Earn 5X miles on hotels, vacation rentals, and rental cars booked through Capital One Travel' — https://www.capitalone.com/credit-cards/venture/", "confidence": "high"},
  {"program_id": "capital_one_entertainment", "access_kind": "included", "overrides": {"earn_multiplier_via_portal": 5}, "notes": "5x miles on Capital One Entertainment purchases.", "source": "Frequent Miler 2026 review summary citing Capital One.", "confidence": "high"},
  {"program_id": "hertz_five_star", "access_kind": "included", "overrides": {}, "notes": "Complimentary Hertz Five Star status (Gold Plus Rewards mid-tier) — skip the counter, wider car selection. Activation required.", "source": "'Get Hertz® Five Star status — skip rental counter, wider car selection. Requires activation through online account or app.' — https://www.capitalone.com/credit-cards/benefits/venture/", "confidence": "high"},
  {"program_id": "global_entry_credit", "access_kind": "included", "overrides": {"max_per_period_usd": 120, "period": "every_4_years"}, "notes": "Up to $120 statement credit every 4 years for Global Entry or TSA PreCheck application fee.", "source": "'Receive up to a $120 credit for Global Entry or TSA PreCheck' — https://www.capitalone.com/credit-cards/venture/", "confidence": "high"},
  {"program_id": "visa_signature_lhc", "access_kind": "included", "overrides": {}, "notes": "Venture is Visa Signature; Visa Signature Luxury Hotel Collection access applies.", "source": "Issuer page network designation.", "confidence": "high"},
  {"program_id": "capital_one_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Standard Venture has never had complimentary Capital One Lounge access. Pay-per-visit pricing applies: $45 adult / $25 child 2-17 effective 2026-02-01 (was previously available pay-per-visit at $45 adult).", "source": "'No complimentary lounge membership included. No ongoing complimentary Capital One Lounge or Capital One Landing visits included.' — Upgraded Points Capital One Venture lounge-access history, https://upgradedpoints.com/credit-cards/reviews/capital-one-venture-rewards-credit-card/lounge-access-history/. 'Beginning February 1, 2026, guests at Capital One Lounges and Landings will incur a fee of $45 per adult and $25 for children ages 2 through 17.' — Daily Drop / WebSearch summary.", "confidence": "high"},
  {"program_id": "priority_pass_select", "access_kind": "not_available", "overrides": {}, "notes": "'The Capital One Venture card has never come with a Priority Pass membership, which is reserved for the Capital One Venture X card.' Limited 2 visits/year that some Venture cardholders received in late-2021–2024 ended Jan 1, 2025. No grandfathered Feb-2026 carve-out for Venture.", "source": "Upgraded Points Capital One Venture lounge-access history.", "confidence": "high"},
  {"program_id": "centurion_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "chase_sapphire_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only (CSR).", "source": "derived", "confidence": "high"},
  {"program_id": "delta_skyclub", "access_kind": "not_available", "overrides": {}, "notes": "Amex-Delta only.", "source": "derived", "confidence": "high"},
  {"program_id": "fhr", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "amex_hotel_collection", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "chase_the_edit", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only (CSR).", "source": "derived", "confidence": "high"}
]
```

## card_soul.co_brand_perks

```json
{
  "hotel_status_grants": [],
  "rental_status_grants": [
    {"program": "hertz", "tier": "Five Star (Gold Plus Rewards)", "auto_grant": false, "source": "'Get Hertz® Five Star status' — https://www.capitalone.com/credit-cards/benefits/venture/", "confidence": "high", "notes": "Activation required through online account or app — not auto-granted on card-open."}
  ],
  "prepaid_hotel_credit": null,
  "free_night_certificates": [],
  "complimentary_dashpass": {"available": false, "source": "Not a feature of Venture; DashPass is a Chase / Cap One Venture X / Sapphire benefit family."},
  "ten_pct_anniversary_bonus": {"available": false, "source": "Not a feature of Venture."},
  "spend_threshold_lounge_unlock": null,
  "points_boost_redemption": {"available": false, "source": "Capital One does not have a Chase-style Points Boost; Capital One Travel redemptions are 1cpp."},
  "global_entry_credit": {"amount_usd_per_period": 120, "period": "every_4_years", "qualifying_programs": ["global_entry", "tsa_precheck"], "source": "'Receive up to a $120 credit for Global Entry or TSA PreCheck® … One statement credit will be processed per account every 4 years' — https://www.capitalone.com/credit-cards/venture/"},
  "twenty_four_hour_travel_assistance": {"available": true, "source": "'Get 24-hour travel assistance' — https://www.capitalone.com/credit-cards/benefits/venture/"},
  "welcome_offer_current_public": {
    "amount_pts": 75000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "source": "'Earn 75,000 bonus miles once you spend $4,000 on purchases within the first 3 months from account opening.' — https://www.capitalone.com/credit-cards/venture/",
    "notes": "CardMatch has historically pushed elevated 100K offers paired with $250 travel credit. Subject to Capital One 48-month rule between Venture and Venture X bonus eligibility."
  }
}
```

## card_soul.absent_perks

```json
[
  {"perk_key": "lounge_access_at_all", "reason": "Venture has zero complimentary lounge access — never had Priority Pass, no included Capital One Lounge visits. Pay-per-visit only ($45/adult, $25/child 2-17 from 2026-02-01).", "workaround": "Upgrade to Venture X for Capital One Lounge + Priority Pass; or pair with CSR / Amex Plat.", "confidence": "high"},
  {"perk_key": "trip_cancellation_interruption", "reason": "Trip cancellation/interruption is a Venture X benefit, not on Venture.", "workaround": "Pay travel with Venture X, CSP/CSR, or buy travel insurance.", "confidence": "high"},
  {"perk_key": "trip_delay", "reason": "Not on Venture-tier travel benefits.", "workaround": "Pay common-carrier fare with Venture X, CSP, or CSR.", "confidence": "high"},
  {"perk_key": "cell_phone_protection", "reason": "Not on Venture; Capital One does not offer cell phone protection on the Venture-tier product.", "workaround": "Pay phone bill with Chase Freedom Flex, Wells Fargo Autograph Journey, or Cap One Savor.", "confidence": "high"},
  {"perk_key": "primary_auto_rental_cdw", "reason": "Auto Rental CDW on Venture is secondary; Venture X is primary.", "workaround": "Use CSP/CSR or Cap One Venture X for primary CDW domestically.", "confidence": "high"},
  {"perk_key": "annual_travel_credit", "reason": "No ongoing annual travel credit on Venture (the $250 sometimes paired in CardMatch is a welcome-offer add-on, not recurring). Venture X has $300 annually.", "workaround": "CSR ($300) or Venture X ($300) for recurring travel credits.", "confidence": "high"},
  {"perk_key": "anniversary_free_night", "reason": "Venture is not a hotel co-brand.", "workaround": "Pair with World of Hyatt, Marriott Brilliant, Hilton Aspire, or IHG Premier.", "confidence": "high"},
  {"perk_key": "hotel_status_grant", "reason": "Venture grants no hotel co-brand status.", "workaround": "Hold a hotel co-brand or add Venture X for Premier Collection booking benefits.", "confidence": "high"}
]
```

## card_soul.fetch_log

```
WebFetch https://www.capitalone.com/credit-cards/venture/ — 200, ~5KB. Source for $95 AF, no FX, 75K/$4K/3mo welcome offer, 2x flat / 5x C1 Travel (hotels + vacation rentals + rental cars), $120 Global Entry credit (every 4 years), Hertz Five Star, travel accident insurance ('travel with accident insurance'), Auto Rental CDW listed.
WebFetch https://www.capitalone.com/credit-cards/benefits/venture/ — 200, ~3KB. Source for 24-hour travel assistance, Hertz Five Star activation requirement, extended warranty, exclusions on Auto Rental CDW (large vans, trucks, exotic cars, impaired driving, wear/tear). Confirms no lounge access and no cell phone protection on issuer benefits page.
WebFetch https://frequentmiler.com/capital-one-venture/ — 200. Confirmed earning structure including 5x on Capital One Entertainment; 75K/$4K offer; valuation 1cpp paid travel / ~1.45cpp Reasonable Redemption Values.
WebFetch https://upgradedpoints.com/credit-cards/reviews/capital-one-venture-rewards-credit-card/lounge-access-history/ — 200. Confirmed standard Venture has zero complimentary lounge access; never had Priority Pass; the limited 2 complimentary visits/year ran late-2021–2024 and ended Jan 1, 2025. No special grandfathered carve-out for Feb 2026 changes since Venture wasn't part of the included-access cohort affected by them.
WebFetch https://www.dailydrop.com/pages/capital-one-lounge-access-changes — 200. Page focuses on Venture X / Venture X Business; confirmed no Venture-specific impact from the Feb 2026 changes (which target included-access cards, not pay-per-visit Venture).
WebFetch https://wallethub.com/edu/cc/capital-one-venture-card-benefits/144657 — 200. Confirmed Venture has no specific dollar amount listed for travel accident insurance on issuer page; Auto Rental primary/secondary not explicitly stated on issuer page (resolved via Capital One help center page below); no purchase security mention; no lounge; no cell phone protection.
WebSearch "Capital One Venture 2026 Hertz Five Star travel accident insurance auto rental" — confirmed: Travel Accident Insurance up to $1M (per Capital One learn-grow); Auto Rental CDW is secondary on Venture (per Capital One help center: 'For eligible Venture cards, coverage is secondary'); Hertz Five Star confirmed.
WebSearch "Capital One Venture lounge access 2026 Priority Pass changes February" — confirmed Feb 1, 2026 changes target Venture X (not Venture); $45 adult / $25 child guest fee applies at Capital One Lounges/Landings; $35 PP guest fee at Priority Pass; $75K spend threshold unlocks complimentary guest access — none of which apply to Venture (no included access to gate-keep).
```
