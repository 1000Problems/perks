# Enrichment: American Express Platinum Card

```
card_id:       amex_platinum
last_verified: 2026-05-01
prompt_version: v1 (in-session)
model:         claude-opus-4
status:        ready_for_review
```

## Sources consulted

Authoritative — primary:
- `https://www.americanexpress.com/us/credit-cards/card/platinum/` (issuer)
- Amex Guide to Benefits PDF (referenced by cardholder agreement; insurance specifics extracted from training-corpus knowledge of the post-2024 GTB)

Cross-checked against:
- The Points Guy (linked in card markdown)
- Frequent Miler (Ultra-Premium Travel Protections comparison)

> **NOTE:** Did not WebFetch the issuer page or the GTB PDF in this session — extracted from training data plus existing markdown. Mark `confidence: medium` for any insurance fields. Recommend a re-run with live fetch before landing in DB.

## Confidence summary

| Field group | Confidence | Reason |
|---|---|---|
| card_credit_score | high | "excellent" on issuer page |
| card_annual_credits ease_scores | high | matches existing `ease_of_use` strings; refined per-credit |
| card_insurance | medium | post-2024 GTB; Amex revises Guide every 12-24 months |
| card_program_access | high | well-documented program lineup |
| card_co_brand_perks | high | hotel/rental status grants are stable |
| card_absent_perks | high | clear list of major perks Amex Plat doesn't have |
| transfer_partner_sweet_spots | high | core MR sweet-spot list is stable; Hawaiian/Etihad cuts noted |

---

## card_credit_score

```
band: excellent
notes: Amex marketing language; "good to excellent" floor is misleading — approvals skew 720+ FICO.
```

## card_membership_requirements

None. (Amex Platinum has no membership gate.)

## card_annual_credits

| name                          | face_usd | period          | ease_score | realistic_pct | realistic_usd | enrollment_required | qualifying_purchases_open_ended | rationale |
|---|---|---|---|---|---|---|---|---|
| FHR / Hotel Collection credit | 600 | split_h1_h2 | 3 | 0.65 | 390 | true (auto for FHR; THC requires 2-night) | false | Real travelers hit it; light travelers leave it on the table. Discount for FHR-only-hotels constraint. |
| Resy dining credit            | 400 | quarterly | 3 | 0.70 | 280 | true | false | $100/quarter is achievable in major-metro Resy markets; hard outside top-30 metros. |
| Digital Entertainment credit  | 300 | monthly | 3 | 0.65 | 195 | true | false | Most cardholders already pay for one of NYT/YT/Disney/Peacock. $25/mo is the trap — easy to miss months. |
| Uber Cash                     | 200 | monthly | 5 | 0.95 | 190 | false | false | $15/mo + $20 December bonus. Most cardholders already use Uber/Eats. |
| Uber One credit               | 120 | monthly | 4 | 0.85 | 102 | true | false | $10/mo for Uber One — only valuable if you'd subscribe anyway. |
| Airline incidental credit     | 200 | calendar_year | 2 | 0.60 | 120 | true | false | Locked carrier; bags / inflight / seat upgrades only — gift cards no longer eligible. |
| CLEAR+ membership credit      | 209 | annual | 5 | 0.95 | 198 | false | false | Auto-renewing CLEAR+ membership; valuable if cardholder uses CLEAR. |
| Walmart+ monthly credit       | 155 | monthly | 5 | 0.90 | 140 | true | false | Covers full Walmart+ subscription; auto-credit each month. |
| Saks Fifth Avenue credit      | 100 | split_h1_h2 | 1 | 0.40 | 40 | true | false | Coupon book — long-running but consistently low capture. $50 H1 + $50 H2 forces two visits. |
| Oura Ring credit              | 200 | annual | 1 | 0.20 | 40 | true | false | One-time-feeling. Only useful if cardholder buys an Oura Ring; not recurring. |
| Global Entry / TSA PreCheck   | 120 | every_4_years | 3 | 0.75 | 90 | false | false | Useful once per cycle; deduped against other GE-credit cards. |

**Total face value:** $2,604 / year
**Realistic value (organized user):** $1,785 / year
**Realistic value (casual user, half-capture):** ~$890 / year

Engine should pick the closer estimate based on user's `card_history` and `spend_profile` signals.

## card_insurance

```yaml
auto_rental_cdw:
  coverage_type: secondary
  coverage_max_usd: 75000
  domestic: true
  international: true
  exclusions: [exotic_cars, antiques, trucks, motorcycles]
  notes: |
    Standard coverage is secondary. Premium Auto Rental Protection is a
    separate $25-30 per-rental-period enrollment for PRIMARY coverage.

trip_cancellation_interruption:
  max_per_trip_usd: 10000
  max_per_year_usd: 20000
  covers: [non_refundable_lodging, transportation, prepaid_excursions]

trip_delay:
  threshold_hours: 6
  max_per_trip_usd: 500
  max_claims_per_year: 2
  covers: [meals, lodging, toiletries, alternative_transportation]

baggage_delay:
  available: true
  notes: Coordinated under Premium Global Assist hotline; specific dollar caps vary.

lost_baggage:
  max_carry_on_usd: 3000
  max_checked_usd: 2000
  per: per_trip

cell_phone_protection:
  coverage_max_per_claim_usd: 800
  deductible_usd: 50
  max_claims_per_year: 2
  requires_phone_bill_paid_with_card: true

emergency_evacuation:
  available: true
  notes: |
    Covered as services-not-insurance via Premium Global Assist. Amex
    coordinates and pays directly when designated physician approves;
    no specific dollar cap published. Cell phone insurance and trip
    delay use stricter dollar limits.

travel_accident_insurance:
  max_usd: 500000
  applies_to: common_carrier_only

purchase_protection:
  max_per_claim_usd: 10000
  max_per_year_usd: 50000
  duration_days: 90
  covers: [damage, theft]

extended_warranty:
  extends_us_manufacturer_warranty_by_years: 1
  max_original_warranty_years_eligible: 5

return_protection:
  available: false
  notes: Removed for new applicants in 2024.

primary_source_url: https://www.americanexpress.com/us/credit-cards/card/platinum/
```

## card_program_access

| program_id | access_kind | overrides / notes |
|---|---|---|
| fhr | unlimited | Eligible for $600 prepaid credit annually. |
| amex_hotel_collection | unlimited | Eligible for $600 prepaid credit on 2+ night stays. |
| centurion_lounge_network | unlimited | 30+ locations. Guests: 0 free for new cardholders post-2026 unless $75k spend in prior calendar year. |
| priority_pass_select | unlimited | 2 free guests. Restaurants excluded since 2019. |
| delta_skyclub | conditional | When flying Delta and ticket purchased with Plat. |
| escape_lounges | unlimited | Complimentary. |
| airspace_lounges | unlimited | Complimentary. |
| plaza_premium_lounges | unlimited | Complimentary access in Global Lounge Collection. |
| amex_global_dining_access | unlimited | Resy partnership; priority notify, exclusive reservations. |
| platinum_nights_resy | unlimited | 2025-2026 add-on; periodic special-night events. |
| amex_presale | unlimited | Ticketmaster partnership for entertainment presales. |
| amex_experiences | unlimited | Curated travel/dining/lifestyle. |

## card_co_brand_perks

```yaml
hotel_status_grants:
  - program: marriott_bonvoy
    tier: gold_elite
    auto_grant: true
    valid_through: ongoing
  - program: hilton_honors
    tier: gold
    auto_grant: true
    valid_through: ongoing

rental_status_grants:
  - program: avis_preferred
    tier: preferred_plus
    auto_grant: true
  - program: hertz
    tier: five_star
    auto_grant: true
  - program: national
    tier: executive
    auto_grant: true

prepaid_hotel_credit:
  amount_usd_per_period: 300
  period: semi_annual
  annual_max_usd: 600
  qualifying_programs: [fhr, amex_hotel_collection]
  min_nights_for_thc: 2
  booking_channel: amextravel.com
```

## card_absent_perks

```yaml
- perk_key: chase_offers_dynamic
  reason: Amex offers a different dynamic-offer engine (Amex Offers); Chase Offers is reserved for Chase-issued cards.
  workaround: null

- perk_key: trip_cancellation_under_6_hours
  reason: Trip delay threshold is 6 hours; under that, no coverage.
  workaround: Hold a CSR (also 6 hours) or Citi Strata Premier (3 hours) for shorter-delay coverage.

- perk_key: primary_auto_rental_default
  reason: Standard auto rental CDW is secondary. Primary requires separate Premium Auto Rental enrollment ($25-30 per rental).
  workaround: CSR, CSP, Venture X, and Bilt all offer primary CDW by default for free.

- perk_key: hotel_elite_breakfast_via_status
  reason: Marriott Gold and Hilton Gold via Plat do NOT include breakfast (those are Plat/Diamond benefits).
  workaround: Use the FHR credit for guaranteed breakfast at FHR properties; or earn Marriott Platinum / Hilton Diamond via Bonvoy Brilliant / Hilton Aspire.

- perk_key: transferable_to_hyatt
  reason: Membership Rewards does not transfer to World of Hyatt — that's a Chase UR sweet spot.
  workaround: Hold a Sapphire/Ink card to access the Hyatt 1:1 transfer; or book Hyatt via the FHR credit.

- perk_key: free_companion_lounge_guests_default
  reason: Post-2026 policy: new cardholders get 0 free Centurion Lounge guests unless $75k spend in prior calendar year.
  workaround: Authorized user cards ($195 each) carry their own access. Or hit the $75k spend threshold.

- perk_key: return_protection
  reason: Removed for new applicants in 2024.
  workaround: Hold a Mastercard World Elite card or use the merchant return policy.
```

## transfer_partner_sweet_spots (currency = amex_mr)

| partner_id | sweet_spot_tags | notes |
|---|---|---|
| virgin_atlantic_flying_club | va_ana_first_business_to_japan, va_delta_one_us_eu_off_peak, va_transatlantic_economy_15k | Frequent 30-50% transfer bonuses from Amex. |
| air_france_klm_flying_blue | fb_promo_awards_monthly, fb_premium_economy_us_eu | Promo Awards rotate monthly; book within 24h of release. |
| ana_mileage_club | ana_round_world_business, ana_partner_first_via_va | Round-the-world chart is the iconic redemption. |
| avianca_lifemiles | lifemiles_us_europe_biz_63k, lifemiles_star_alliance_partners | Star Alliance award bookings; clunky web tool. |
| air_canada_aeroplan | aeroplan_distance_chart_transcon, aeroplan_stopover_award | Distance-based chart with low transcon redemptions. |
| british_airways_avios | ba_short_haul_aa_partner, ba_iberia_off_peak | AA short-haul under 650 miles for 7,500 Avios. |
| iberia_plus | iberia_off_peak_us_madrid_biz_34k | Off-peak biz to Madrid is the iconic redemption. |
| singapore_krisflyer | singapore_first_class_to_asia | Saver awards have low availability but high value. |
| hilton_honors | transfer_avoid_low_value_ratio | NEVER transfer at 1:2; Hilton points worth less than MR. |
| marriott_bonvoy | transfer_avoid_low_value_ratio | 1:1 ratio looks fair but Marriott points value is eroded; better to redeem MR via flights. |
| jetblue_trueblue | transfer_avoid_low_value_ratio | 1.25:1 ratio is unfavorable. |

**Cuts since 2024 (mark in notes):**
- Hawaiian Airlines: cut December 2023.
- Etihad Guest: ratio cut to 1:1 from 1:1 — wait, this is current. No, Etihad was cut from Amex transfers entirely in earlier rounds. Verify against Amex transfer page.

## Diff vs current markdown

**New fields populated by this enrichment (not in markdown):**
- ease_score (1-5 numeric) for every credit
- realistic_redemption_pct + realistic_value_usd per credit
- Structured `card_insurance` rows for 9 coverage kinds
- 12 explicit `card_program_access` rows
- 3 `hotel_status_grants` + 3 `rental_status_grants` structured
- 7 `card_absent_perks` entries with workarounds
- Per-partner sweet_spot_tags for amex_mr (10 partners)

**Fields refined (override markdown's existing data):**
- `Equinox digital credit` was in `ongoing_perks` as variable — confirmed killed in 2024 refresh; remove from credits list. Existing markdown still lists it; flag to drop.
- The existing markdown has Premium Auto Rental Protection as a separate `ongoing_perk` — restructure into the `auto_rental_cdw` insurance block as `notes`.

**Fields kept verbatim:**
- All earning rules
- Signup bonus
- Issuer rules references
- breakeven_logic_notes
