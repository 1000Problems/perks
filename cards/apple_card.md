# Apple Card

`card_id`: apple_card
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "apple_card",
  "name": "Apple Card",
  "issuer": "Goldman Sachs (transitioning to alternate issuer in 2026 — verify)",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "apple_daily_cash",

  "earning": [
    {"category": "apple_purchases_or_apple_pay", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "3% on Apple-direct purchases AND select merchants paid via Apple Pay (Walgreens, Duane Reade, Uber, T-Mobile, ExxonMobil, Nike, Panera, Ace Hardware)"},
    {"category": "apple_pay", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "notes": "2% on all Apple Pay purchases not in 3% list"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "No SUB. Periodic $50-200 promotions on specific merchants."
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Daily Cash payouts", "value_estimate_usd": null, "category": "rewards_payout", "notes": "Cash deposited to Apple Cash same day"},
    {"name": "No fees of any kind", "value_estimate_usd": null, "category": "fee_free"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Goldman Sachs single-card-per-customer policy"],

  "best_for": ["heavy_Apple_user_with_iPhone_for_2_pct_Apple_Pay", "users_seeking_zero_fees_low_friction"],
  "synergies_with": [],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_active_cash"],

  "breakeven_logic_notes": "No AF. 2% Apple Pay matches Citi DC for non-bonus spend, with same-day cash. 1% physical card is poor; engine should recommend only when paired with iPhone/Apple Watch user behavior.",

  "recently_changed": true,
  "recently_changed_date": "2026 (issuer transition rumored)",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.apple.com/apple-card/"]
}
```

## programs.json entry

```json
{
  "id": "apple_daily_cash",
  "name": "Apple Daily Cash",
  "type": "fixed_value",
  "issuer": "Goldman Sachs (Apple)",
  "earning_cards": ["apple_card"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.apple.com/apple-card/"]
}
```

## issuer_rules.json entry

```json
{
  "issuer": "Goldman Sachs (Apple Card)",
  "rules": [
    {
      "id": "gs_apple_single_card",
      "name": "One Apple Card per customer",
      "description": "Goldman issues only one Apple Card per Apple ID.",
      "applies_to": "apple_card",
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

- **Issuer transition**: Goldman Sachs has been winding down its consumer business; Apple Card may transfer to a new issuer in 2026. Verify before recommending.
- **No fees**: No FX, no late, no over-limit, no annual. Strong value prop for fee-averse users.
- **Apple Pay terminal acceptance**: 2% only when Apple Pay used at terminal. Physical card swipe = 1%.

## card_soul.credit_score

```json
{
  "band": "very_good",
  "source": "Issuer page lets applicants 'apply in minutes to see if you are approved with no impact to your credit score' before a hard pull — https://www.apple.com/apple-card/. No published minimum FICO; community data points cluster in the 660-720 range with high approval into the very-good band.",
  "confidence": "medium",
  "notes": "Goldman Sachs single-card-per-customer policy applies. Not subject to Chase 5/24 (issuer is currently Goldman; transition to JPMorgan Chase announced 2026-01-07 with ~24-month transition — see fetch_log)."
}
```

## card_soul.annual_credits

```json
[]
```

## card_soul.insurance

```json
{
  "primary_source_url": "https://www.apple.com/apple-card/",
  "gtb_pdf_url": null,
  "auto_rental_cdw": {
    "available": false,
    "source": "'The Apple Card does not offer a rental car insurance benefit.' — WalletHub Apple Card Benefits 2026, https://wallethub.com/edu/cc/apple-card-benefits/144591. Mastercard World Elite default would otherwise provide secondary CDW; Goldman Sachs explicitly declined to offer this benefit on Apple Card.",
    "confidence": "medium",
    "notes": "Network-inheritance note: Mastercard World Elite cards typically include secondary (sometimes primary) auto rental CDW, but the issuer (Goldman Sachs) opted out for Apple Card."
  },
  "trip_cancellation_interruption": {
    "available": false,
    "source": "'No, the Apple Card does not have travel insurance.' — WalletHub Apple Card Benefits 2026.",
    "confidence": "medium",
    "notes": "Mastercard World Elite default includes Trip Cancellation/Interruption; Goldman opted out."
  },
  "trip_delay": {
    "available": false,
    "source": "Not listed on Apple's apple-card page; WalletHub confirms no travel insurance.",
    "confidence": "medium"
  },
  "baggage_delay": {
    "available": false,
    "source": "Not listed on Apple's apple-card page; WalletHub confirms no travel insurance.",
    "confidence": "medium"
  },
  "lost_baggage": {
    "available": false,
    "source": "Not listed on Apple's apple-card page; WalletHub confirms no travel insurance.",
    "confidence": "medium"
  },
  "cell_phone_protection": {
    "available": false,
    "source": "Not listed on Apple's apple-card page or in WalletHub Apple Card Benefits 2026. Mastercard World Elite default would provide $800/claim with $1,000 or 2 claims/year cap, but Goldman Sachs opted out.",
    "confidence": "medium",
    "notes": "Cell phone protection is a Mastercard World Elite default that the issuer chose not to enable."
  },
  "emergency_evacuation_medical": {
    "available": false,
    "source": "Not listed on issuer page or WalletHub.",
    "confidence": "medium"
  },
  "emergency_medical_dental": {
    "available": false,
    "source": "Not listed on issuer page or WalletHub.",
    "confidence": "medium"
  },
  "travel_accident_insurance": {
    "available": false,
    "source": "Not listed on issuer page; WalletHub confirms no travel insurance.",
    "confidence": "medium"
  },
  "purchase_protection": {
    "available": false,
    "source": "'The Apple Card does not have purchase protection anymore, since the benefit was removed as part of an industry-wide shift away from traditional secondary perks on credit card offers.' — WalletHub Apple Card Benefits 2026.",
    "confidence": "high",
    "notes": "Apple Card USED to offer purchase protection; benefit was removed."
  },
  "extended_warranty": {
    "available": false,
    "source": "'No, Apple Card does not offer extended warranty protection.' — WalletHub Apple Card Benefits 2026.",
    "confidence": "high"
  },
  "return_protection": {
    "available": false,
    "source": "Not listed on issuer page or WalletHub.",
    "confidence": "medium"
  },
  "roadside_assistance": {
    "available": false,
    "source": "Not listed on issuer page; not surfaced in WalletHub benefits review. Mastercard Roadside Dispatch (pay-per-use) is technically available to any Mastercard via 1-800-Mastercard but isn't a card-funded benefit.",
    "confidence": "medium"
  }
}
```

## card_soul.program_access

```json
[
  {"program_id": "apple_daily_cash", "access_kind": "included", "overrides": {"redemption_value_cpp": 1.0, "payout_cadence": "daily"}, "notes": "Daily Cash deposits same-day to Apple Cash (or applies as statement credit).", "source": "'Get Daily Cash' — https://www.apple.com/apple-card/", "confidence": "high"},
  {"program_id": "apple_card_installments", "access_kind": "included", "overrides": {}, "notes": "Pay for Apple products in equal monthly installments at 0% APR (Apple Card Monthly Installments).", "source": "Apple Card issuer page references monthly installments for Apple purchases.", "confidence": "high"},
  {"program_id": "mastercard_id_theft_protection", "access_kind": "included", "overrides": {}, "notes": "Mastercard ID Theft Protection — monitoring + resolution specialist.", "source": "'Mastercard ID Theft Protection' — WalletHub Apple Card Benefits 2026.", "confidence": "high"},
  {"program_id": "mastercard_travel_lifestyle_services", "access_kind": "included", "overrides": {}, "notes": "Mastercard Travel & Lifestyle Services / Priceless experiences (booking concierge; not a guaranteed credit).", "source": "'Mastercard travel perks (hotel discounts, car rental benefits, airport concierge); Priceless Experiences' — WalletHub Apple Card Benefits 2026.", "confidence": "medium"},
  {"program_id": "centurion_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "priority_pass_select", "access_kind": "not_available", "overrides": {}, "notes": "Apple Card has no lounge program.", "source": "derived; not on issuer page.", "confidence": "high"},
  {"program_id": "chase_sapphire_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only.", "source": "derived", "confidence": "high"},
  {"program_id": "capital_one_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Capital One-only.", "source": "derived", "confidence": "high"},
  {"program_id": "delta_skyclub", "access_kind": "not_available", "overrides": {}, "notes": "Amex-Delta only.", "source": "derived", "confidence": "high"},
  {"program_id": "fhr", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "chase_the_edit", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only (CSR).", "source": "derived", "confidence": "high"},
  {"program_id": "visa_signature_lhc", "access_kind": "not_available", "overrides": {}, "notes": "Apple Card is Mastercard, not Visa.", "source": "derived", "confidence": "high"},
  {"program_id": "visa_infinite_lhc", "access_kind": "not_available", "overrides": {}, "notes": "Apple Card is Mastercard, not Visa.", "source": "derived", "confidence": "high"},
  {"program_id": "amex_hotel_collection", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"}
]
```

## card_soul.co_brand_perks

```json
{
  "hotel_status_grants": [],
  "rental_status_grants": [],
  "prepaid_hotel_credit": null,
  "free_night_certificates": [],
  "complimentary_dashpass": {"available": false, "source": "Not a feature of Apple Card."},
  "ten_pct_anniversary_bonus": {"available": false, "source": "Not a feature of Apple Card."},
  "spend_threshold_lounge_unlock": null,
  "points_boost_redemption": {"available": false, "source": "Apple Card earns Daily Cash (fixed 1cpp), not transferable points."},
  "daily_cash": {"available": true, "rates": {"apple_or_select_apple_pay_merchants_pct": 3, "apple_pay_pct": 2, "physical_card_pct": 1}, "payout_cadence": "daily", "source": "'1% on physical titanium card; 2% with Apple Pay; 3% at Apple and select merchants with Apple Pay (Nike, Uber, Walgreens, Booking.com, ChargePoint, Duane Reade, Exxon Mobil, Hertz, Ace Hardware, Uber Eats)' — https://www.apple.com/apple-card/. (Note: cards.json entry lists older 3% merchant set including T-Mobile and Panera; current issuer page set is the one above.)"},
  "apple_card_monthly_installments": {"available": true, "apr_pct": 0, "qualifying_purchases": "Apple products purchased with Apple Card", "source": "Apple Card Monthly Installments — Apple's apple-card page."},
  "no_fees_promise": {"available": true, "covers": ["annual_fee", "foreign_transaction_fee", "late_fee", "over_limit_fee"], "source": "'Apple Card doesn't have any fees. No annual, over-the-limit, foreign-transaction, or late fees.' — https://www.apple.com/apple-card/"},
  "welcome_offer_current_public": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "source": "No traditional welcome bonus on Apple Card. Periodic targeted $50–200 promotions on specific merchants surface via the Wallet app.",
    "notes": "Apple Card has never had a public sign-up bonus."
  }
}
```

## card_soul.absent_perks

```json
[
  {"perk_key": "welcome_bonus", "reason": "Apple Card has no traditional sign-up bonus. Targeted merchant promotions (e.g. 5% Daily Cash at Walgreens for a week) are the only acquisition perk.", "workaround": "If sign-up bonus value matters, consider Citi Double Cash, Wells Fargo Active Cash, or Chase Freedom Unlimited.", "confidence": "high"},
  {"perk_key": "purchase_protection", "reason": "Goldman Sachs removed purchase protection from Apple Card; Mastercard network-inherited protection is opt-out.", "workaround": "Use a card with purchase protection (CSP/CSR, Amex Plat, Citi Custom Cash) for big-ticket items.", "confidence": "high"},
  {"perk_key": "extended_warranty", "reason": "Goldman Sachs opted out of the Mastercard World Elite extended warranty.", "workaround": "Use CSP/CSR for +1 year warranty extension.", "confidence": "high"},
  {"perk_key": "travel_insurance_any", "reason": "Apple Card carries no trip cancellation/interruption, trip delay, baggage delay, lost baggage, or travel accident insurance — Goldman opted out.", "workaround": "Pay for travel with CSP, CSR, Cap One Venture X, or any Mastercard issuer that includes the network defaults.", "confidence": "high"},
  {"perk_key": "auto_rental_cdw", "reason": "No rental car coverage despite Mastercard World Elite default.", "workaround": "Use CSP/CSR (primary) or Cap One Venture (secondary) for rental coverage.", "confidence": "high"},
  {"perk_key": "cell_phone_protection", "reason": "Mastercard World Elite default not enabled by Goldman Sachs.", "workaround": "Pair with Chase Freedom Flex or Wells Fargo Autograph Journey.", "confidence": "medium"},
  {"perk_key": "lounge_access_at_all", "reason": "No lounge program on Apple Card.", "workaround": "Use a premium travel card (CSR, Amex Plat, Cap One Venture X).", "confidence": "high"},
  {"perk_key": "transferable_points", "reason": "Daily Cash is fixed-value 1cpp cash back, not transferable to airline/hotel partners.", "workaround": "Pair with a transferable-points card (Sapphire, Cap One Venture, Amex MR).", "confidence": "high"}
]
```

## card_soul.fetch_log

```
WebFetch https://www.apple.com/apple-card/ — 200, ~5KB. Source for issuer (Goldman Sachs Bank USA, Salt Lake City Branch), network (Mastercard), no-fees promise, Daily Cash earning structure (1/2/3%), 3% merchant list (Nike, Uber, Walgreens, Booking.com, ChargePoint, Duane Reade, Exxon Mobil, Hertz, Ace Hardware, Uber Eats), APR range as of 2026-01-01.
WebFetch https://frequentmiler.com/apple-card/ — 200 but the page returned was a March-2020-payment-skip article, not a benefits review. The Frequent Miler 'apple-card' slug is a stub or has been deprecated; no useful insurance data extracted.
WebFetch https://wallethub.com/edu/cc/apple-card-benefits/144591 — 200, ~6KB. Source for explicit absence of purchase protection ('removed'), extended warranty, travel insurance, auto rental CDW. Confirms Mastercard ID Theft Protection + Mastercard travel/lifestyle services + Priceless are the only network-flowed benefits Goldman kept.
WebFetch https://www.mastercard.com/us/en/personal/find-a-card/card-benefits/apple-card-benefits.html — 403 (Mastercard's anti-bot blocked the fetch). Could not extract Apple-specific Mastercard benefit caps directly; fell back to WalletHub.
WebFetch https://upgradedpoints.com/credit-cards/world-elite-mastercard-benefits-cards/ — 200. Confirmed Mastercard World Elite defaults (cell phone $800/claim, secondary CDW, purchase protection 90d, extended warranty doubling up to 24mo, trip cancellation) — used for the network-inheritance note explaining what Goldman opted OUT of.
WebSearch "Apple Card Mastercard World Elite benefits insurance protections 2026" — confirmed Apple Card classification as World Elite Mastercard; confirmed 'availability of insurance benefits on your card may vary by card issuer' caveat that explains Goldman's opt-out.
WebSearch "Apple Card 2026 issuer change Goldman Sachs JPMorgan Synchrony" — confirmed JPMorgan Chase becomes new issuer (announced 2026-01-07; ~24-month transition). Goldman remains issuer of record at the time of this enrichment (2026-05-02). Cards.json entry retains 'Goldman Sachs (transitioning…)' note appropriately.
```
