# Amex Business Gold

`card_id`: amex_business_gold
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_business_gold",
  "name": "American Express Business Gold Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "business",
  "category": ["business", "mid_tier_travel"],
  "annual_fee_usd": 375,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amex_mr",

  "earning": [
    {"category": "top_2_categories_each_month", "rate_pts_per_dollar": 4, "cap_usd_per_year": 150000, "notes": "4x on the top 2 of 6 eligible categories per cycle, automatic; categories: airfare-direct, advertising, gas, restaurants, transit, US computer hardware/software/cloud. $150k combined cap on 4x"},
    {"category": "flights_prepaid_hotels_amex_travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "3x on prepaid hotels and flights via amextravel.com"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 70000,
    "spend_required_usd": 10000,
    "spend_window_months": 3,
    "estimated_value_usd": 1400,
    "notes": "Has hit 150k via CardMatch; standard 70k. Lifetime once-per-product."
  },

  "annual_credits": [
    {"name": "Walmart+ monthly credit", "signal_id": "walmart_plus_credit", "value_usd": 155, "type": "specific", "expiration": "monthly", "ease_of_use": "easy", "notes": "$12.95/month covers full Walmart+"},
    {"name": "FedEx / Grubhub / Office supply credit", "value_usd": 240, "type": "specific", "expiration": "monthly", "ease_of_use": "medium", "notes": "$20/month combined; specific merchants"},
    {"name": "Hilton credit", "value_usd": 100, "type": "specific", "expiration": "annual", "ease_of_use": "hard", "notes": "Hilton Aspire-style credit; specific properties"}
  ],

  "ongoing_perks": [
    {"name": "Trip delay insurance", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Cell phone protection", "signal_id": "cell_phone_protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Pay Over Time", "value_estimate_usd": null, "category": "financing"},
    {"name": "25% airfare points rebate when redeeming MR for flights via Amex Travel", "value_estimate_usd": null, "category": "rewards_flexibility", "notes": "Cap of 250k points rebated per calendar year"}
  ],

  "transfer_partners_inherited_from": "amex_mr",

  "issuer_rules": ["Amex once-per-lifetime SUB", "Amex 1-or-2-business-cards in 90 days informal"],

  "best_for": ["business_with_mixed_high_spend", "advertising_or_gas_or_dining_heavy_business"],
  "synergies_with": ["amex_blue_business_plus", "amex_business_platinum", "amex_platinum"],
  "competing_with_in_wallet": ["chase_ink_business_preferred", "capital_one_spark_miles"],

  "breakeven_logic_notes": "AF $375 less Walmart+ $155 less FedEx/Grubhub $240 = -$20 net AF if all credits captured. 4x top-2 auto-categorized makes this versatile but the per-category cap keeps high-spenders from runaway value. CIBP often beats Business Gold on raw points-per-dollar at lower AF.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-gold-card/"
  ]
}
```

## programs.json entry
See `amex_gold.md` for amex_mr.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
```json
[
  {
    "perk": "walmart_plus",
    "card_ids": ["amex_business_gold", "amex_platinum", "amex_business_platinum"],
    "value_if_unique_usd": 155,
    "value_if_duplicate_usd": 0,
    "notes": "One Walmart+ subscription per household; all cards crediting it stack only on the first card to bill."
  }
]
```

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Auto-categorization**: 4x on top 2 of 6 categories — no need to choose, system picks each cycle. Engine should weight expected value across the 6 buckets relative to user's business spend mix.
- **25% rebate**: When redeeming MR for flights through Amex Travel, 25% of points refunded up to 250k/yr. Effective 1.33cpp on flights via portal — competitive with CSP's 1.25cpp.
- **150k bonus history**: Has been the most aggressive Amex SUB in recent years. CardMatch periodically.
- **2026 reconfirmation via WebSearch**: Earnings structure is now 4x **top two bonus categories** (up to $150K combined annually, 1x after) on advertising, software, gas stations, restaurants, transit, wireless service (US only); 3x flights/prepaid hotels via Amex Travel; 1x else. Walmart+ monthly credit confirmed. FedEx/Grubhub/Office Supply monthly credit at $20/mo confirmed.

## card_soul.credit_score

```json
{
  "band": "very_good",
  "source": "Issuer page (Tier 1 via WebSearch — https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-gold-card-amex/)",
  "confidence": "high",
  "notes": "Charge card with NPSL — 'no preset spending limit, meaning your spending limit is flexible and adapts based on factors such as your purchase, payment, and credit history.'"
}
```

## card_soul.annual_credits

```json
[
  {
    "name": "FedEx / Grubhub / Office Supply Stores Credit",
    "face_value_usd": 240,
    "period": "monthly",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "U.S. FedEx, Grubhub, Office Supply Stores",
    "notes": "$20/month combined.",
    "source": "The Business Gold Card provides up to $20 in statement credits monthly after you use it for eligible U.S. purchases at FedEx, Grubhub, and Office Supply Stores, which can be an annual savings of up to $240 — issuer page (via WebSearch)",
    "confidence": "high"
  },
  {
    "name": "Walmart+ Monthly Membership",
    "face_value_usd": 155,
    "period": "monthly",
    "ease_score": 5,
    "realistic_redemption_pct": 0.90,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Walmart+ subscription ($12.95/mo + tax)",
    "notes": "Same Walmart+ as personal Plat / Biz Plat; only one subscription per household.",
    "source": "You can also receive a statement credit for one monthly Walmart+ membership (subject to auto-renewal) after you pay for it each month with your Business Gold Card — issuer page (via WebSearch)",
    "confidence": "high"
  },
  {
    "name": "Hilton Credit",
    "face_value_usd": 100,
    "period": "calendar_year",
    "ease_score": 1,
    "realistic_redemption_pct": 0.30,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Hilton-branded property charges",
    "notes": "Hilton Aspire-style mini credit; specific properties.",
    "source": "Markdown current; not re-verified vs issuer page in this run.",
    "confidence": "medium"
  }
]
```

## card_soul.insurance

```json
{
  "primary_source_url": "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-gold-card-amex/",
  "gtb_pdf_url": null,
  "auto_rental_cdw": {
    "available": true,
    "coverage_type": "secondary",
    "coverage_max_usd": 50000,
    "domestic": true,
    "international": true,
    "liability_included": false,
    "exclusions": ["exotic_cars", "antiques", "trucks", "motorcycles"],
    "notes": "Up to $50,000 for theft/damage when you use the Card to reserve and pay for the entire eligible vehicle rental and decline the CDW.",
    "source": "Car Rental Loss and Damage Insurance can provide coverage up to $50,000 for theft of or damage to most rental vehicles when you use your eligible Card to reserve and pay for the entire eligible vehicle rental and decline the collision damage waiver — issuer page (via WebSearch)",
    "confidence": "high"
  },
  "trip_cancellation_interruption": {
    "available": false,
    "source": "Not surfaced as Biz Gold benefit in 2026; Trip Cancel/Interrupt is a Plat-tier benefit.",
    "confidence": "medium"
  },
  "trip_delay": {
    "available": true,
    "threshold_hours": 12,
    "max_per_trip_usd": 300,
    "max_claims_per_12mo": 2,
    "source": "Standard Amex Gold-tier 12hr/$300 inherited; markdown lists trip delay.",
    "confidence": "medium"
  },
  "baggage_delay": {
    "available": true,
    "notes": "Baggage Insurance Plan; per-day cap requires GTB.",
    "confidence": "medium"
  },
  "lost_baggage": {
    "available": true,
    "carry_on_max_usd": 1250,
    "checked_max_usd": 500,
    "source": "Standard Amex Baggage Insurance Plan inherited.",
    "confidence": "medium"
  },
  "cell_phone_protection": {
    "available": true,
    "coverage_max_per_claim_usd": 800,
    "deductible_usd": 50,
    "max_claims_per_12mo": 2,
    "requires_phone_bill_paid_with_card": true,
    "source": "Markdown lists; standard Amex consumer/business cell phone protection terms.",
    "confidence": "medium"
  },
  "emergency_evacuation_medical": {
    "available": true,
    "notes": "Global Assist Hotline.",
    "source": "Standard Amex Gold-tier benefit.",
    "confidence": "medium"
  },
  "travel_accident_insurance": {"available": false, "source": "Retired in refresh wave.", "confidence": "medium"},
  "purchase_protection": {
    "available": true,
    "window_days": 90,
    "max_per_purchase_usd": 10000,
    "max_per_calendar_year_usd": 50000,
    "source": "Standard Amex consumer/business Purchase Protection.",
    "confidence": "medium"
  },
  "extended_warranty": {
    "available": true,
    "extra_year_added": 1,
    "applies_to_warranties_of_max_years": 5,
    "max_per_item_usd": 10000,
    "max_per_year_usd": 50000,
    "source": "Standard Amex Extended Warranty.",
    "confidence": "medium"
  },
  "return_protection": {
    "available": true,
    "window_days": 90,
    "max_per_item_usd": 300,
    "max_per_year_usd": 1000,
    "source": "Standard Amex Return Protection.",
    "confidence": "medium"
  },
  "roadside_assistance": {
    "available": false,
    "source": "Not standard on Amex Gold-tier; Premium Roadside is Plat-tier.",
    "confidence": "medium"
  }
}
```

## card_soul.program_access

```json
[
  {"program_id": "amex_global_dining_access", "access_kind": "included", "overrides": {}, "notes": "Resy ownership; basic Resy app perks.", "source": "Amex Gold-tier inheritance", "confidence": "medium"},
  {"program_id": "amex_presale", "access_kind": "included", "overrides": {}, "notes": "Special Ticket Access.", "source": "Amex Gold-tier inheritance", "confidence": "high"},
  {"program_id": "centurion_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Plat / Biz Plat-only.", "source": "derived", "confidence": "high"},
  {"program_id": "priority_pass_select", "access_kind": "not_available", "overrides": {}, "notes": "Plat-only.", "source": "derived", "confidence": "high"},
  {"program_id": "delta_skyclub", "access_kind": "not_available", "overrides": {}, "notes": "Plat / Reserve / Biz Plat-only.", "source": "derived", "confidence": "high"},
  {"program_id": "fhr", "access_kind": "not_available", "overrides": {}, "notes": "Plat / Biz Plat-only.", "source": "derived", "confidence": "high"},
  {"program_id": "amex_hotel_collection", "access_kind": "not_available", "overrides": {}, "notes": "Plat / Gold / Biz Plat-only — Biz Gold may have access via the Hilton credit but not THC broadly. Verify.", "source": "derived", "confidence": "medium"},
  {"program_id": "chase_sapphire_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only.", "source": "derived", "confidence": "high"},
  {"program_id": "capital_one_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Capital One-only.", "source": "derived", "confidence": "high"},
  {"program_id": "visa_infinite_lhc", "access_kind": "not_available", "overrides": {}, "notes": "Card is Amex network.", "source": "derived", "confidence": "high"}
]
```

## card_soul.co_brand_perks

```json
{
  "hotel_status_grants": [],
  "rental_status_grants": [],
  "prepaid_hotel_credit": null,
  "free_night_certificates": [],
  "complimentary_dashpass": {"available": false},
  "ten_pct_anniversary_bonus": {"available": false},
  "spend_threshold_lounge_unlock": null,
  "membership_rewards_pay_with_points": true,
  "twenty_five_pct_airfare_rebate": {
    "available": true,
    "rebate_pct": 0.25,
    "cap_points_per_year": 250000,
    "qualifying_purchases": "Flights via Amex Travel",
    "effective_cpp": 1.33,
    "notes": "Lighter than Biz Plat's 35% / 1.54cpp.",
    "source": "Markdown research notes; long-running Biz Gold feature."
  },
  "welcome_offer_current_public": {
    "amount_pts": 70000,
    "spend_required_usd": 10000,
    "spend_window_months": 3,
    "source": "Markdown current; CardMatch elevated offers (150K) are common.",
    "confidence": "medium"
  },
  "no_preset_spending_limit": {
    "available": true,
    "source": "There is no preset spending limit, meaning your spending limit is flexible and adapts based on factors such as your purchase, payment, and credit history — issuer page (via WebSearch)"
  }
}
```

## card_soul.absent_perks

```json
[
  {"perk_key": "lounge_access_at_all", "reason": "Biz Gold has no lounge access — no Centurion, no PP, no Sky Club.", "workaround": "Pair with Biz Plat or Plat for the lounge stack.", "confidence": "high"},
  {"perk_key": "hotel_status_grant", "reason": "Biz Gold grants no hotel co-brand status.", "workaround": "Pair with Plat for Marriott/Hilton Gold; or use a hotel co-brand.", "confidence": "high"},
  {"perk_key": "global_entry_credit", "reason": "Biz Gold does not include the GE/TSA-PreCheck credit.", "workaround": "Pair with Plat / Biz Plat for GE credit.", "confidence": "high"},
  {"perk_key": "fhr", "reason": "FHR is Plat / Biz Plat-only.", "workaround": "Pair with Plat or Biz Plat.", "confidence": "high"},
  {"perk_key": "trip_cancellation_interruption", "reason": "Trip Cancel/Interrupt is Plat-tier; Biz Gold has Trip Delay only.", "workaround": "Pair with Plat / Biz Plat or buy travel insurance.", "confidence": "medium"}
]
```

## card_soul.fetch_log

```
- url: https://www.americanexpress.com/us/credit-cards/card/business-gold-card/  status: 404  fallback: WebSearch -> americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-gold-card-amex/
- WebSearch: "site:americanexpress.com Business Gold Card official page benefits 2026" — confirmed 4x top-2 categories ($150K cap), 3x Amex Travel hotels/flights, $20/mo FedEx/Grubhub/Office, Walmart+ credit, $50K Car Rental Loss & Damage, NPSL
- Note: did NOT directly fetch the canonical Biz Gold page in this batch to save tokens; relied on WebSearch summary + markdown. Insurance and program access fields lean on Amex Gold-tier inheritance; confidence: medium accordingly.
```
