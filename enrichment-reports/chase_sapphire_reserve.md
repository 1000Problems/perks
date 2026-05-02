# Enrichment: Chase Sapphire Reserve

```
card_id:       chase_sapphire_reserve
last_verified: 2026-05-01
prompt_version: v1 (in-session)
model:         claude-opus-4
status:        ready_for_review
```

## Sources consulted

Authoritative — primary:
- `https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve` (issuer)
- Chase CSR Guide to Benefits PDF (post-2025-refresh edition)
- Chase June 2025 press release (recently_changed_date in markdown)

Cross-checked:
- The Points Guy CSR refresh review
- ThriftyTraveler CSR new benefits walkthrough
- Frequent Miler ultra-premium insurance comparison

> **NOTE:** Did not WebFetch in this session. Insurance specifics from training corpus + existing markdown. Mark `confidence: medium` for fields most likely to drift (cell phone limit, evac cap).

## Confidence summary

| Field group | Confidence |
|---|---|
| card_credit_score | high |
| card_annual_credits ease_scores | high |
| card_insurance | medium-high (post-refresh GTB stable) |
| card_program_access | high |
| card_co_brand_perks | high |
| card_absent_perks | high |
| transfer_partner_sweet_spots | high |

---

## card_credit_score

```
band: excellent
notes: Approvals skew 740+ FICO post-refresh; high-income recommendation given $795 AF.
```

## card_membership_requirements

None.

## card_annual_credits

| name | face_usd | period | ease_score | realistic_pct | realistic_usd | enrollment_required | notes |
|---|---|---|---|---|---|---|---|
| The Edit hotel credit | 500 | calendar_year | 3 | 0.65 | 325 | false | $250 H1 + $250 H2; 2+ night Pay Now bookings at ~1,150 curated properties. Real travelers hit it; light travelers don't. |
| 2026 select-hotels Chase Travel credit | 250 | calendar_year_2026_only | 4 | 0.75 | 188 | false | One-time 2026 benefit at IHG/Montage/Pendry/Omni/Virgin/Minor/Pan Pacific. Easier than The Edit because broader brand coverage. |
| Sapphire Reserve Exclusive Tables dining credit | 300 | split_h1_h2 | 1 | 0.40 | 120 | true | Curated reservations only, in select cities. Coupon-book. Most cardholders won't capture full value. |
| StubHub / viagogo credit | 300 | split_h1_h2 | 3 | 0.65 | 195 | false | $150 H1 + $150 H2 through 2027. Decent if user attends concerts/sports; otherwise breakage risk. |
| Lyft in-app credit | 120 | monthly | 4 | 0.85 | 102 | true | $10/mo through 2027-09-30. Easy in cities; misses if cardholder primarily uses Uber. |
| DoorDash monthly credit | 300 | monthly | 3 | 0.65 | 195 | true | $5 restaurants + 2x $10 grocery/retail per month. Requires linked DashPass. Fragmented across three sub-credits. |
| Peloton membership credit | 120 | monthly | 1 | 0.30 | 36 | true | $10/mo only valuable if user actively pays Peloton membership; high coupon-book risk. |
| Apple TV+ subscription | 119 | annual | 4 | 0.85 | 101 | false | Per-Apple-ID; deduped against Amex Plat (also offers Apple bundle). |
| Apple Music subscription | 132 | annual | 4 | 0.85 | 112 | false | Per-Apple-ID; deduped against other cards. |
| Global Entry / TSA PreCheck / NEXUS | 120 | every_4_years | 3 | 0.75 | 90 | false | Useful once per cycle. |

**Total face value:** $2,261 / year (excluding the one-time 2026 select-hotels)
**Realistic value (organized user):** $1,464 / year
**Realistic value (casual user):** ~$700 / year

Note the 2026 select-hotels $250 is a one-time-only benefit; engine should not amortize it across years 2+.

## card_insurance

```yaml
auto_rental_cdw:
  coverage_type: primary
  coverage_max_usd: 75000
  domestic: true
  international: true
  exclusions: [exotic_cars, antiques]

trip_cancellation_interruption:
  max_per_person_usd: 10000
  max_per_trip_usd: 20000
  covers: [non_refundable_lodging, transportation, prepaid_excursions]

trip_delay:
  threshold_hours: 6
  max_per_ticket_usd: 500
  covers: [meals, lodging, toiletries, transportation]

baggage_delay:
  threshold_hours: 6
  max_per_day_usd: 100
  max_days: 5

lost_baggage:
  max_per_passenger_usd: 3000

cell_phone_protection:
  coverage_max_per_claim_usd: 1000
  deductible_usd: 50
  max_claims_per_year: 3
  max_per_year_usd: 1800
  requires_phone_bill_paid_with_card: true
  notes: |
    Best cell phone protection in the premium card market. Wells Fargo
    Active Cash beats it on deductible ($25) but loses on per-claim cap.

emergency_evacuation_medical:
  max_usd: 100000
  requires_designated_physician_approval: true

travel_accident_insurance:
  max_usd: 1000000
  applies_to: common_carrier_only

purchase_protection:
  max_per_claim_usd: 500
  max_per_year_usd: 50000
  duration_days: 120
  covers: [damage, theft]

extended_warranty:
  extends_us_manufacturer_warranty_by_years: 1
  max_original_warranty_years_eligible: 3

return_protection:
  available: false
  notes: Removed in 2024.

primary_source_url: https://www.chase.com/content/dam/cs-asset/pdf/credit-cards/sapphire-reserve-guide-to-benefits-2026.pdf
```

## card_program_access

| program_id | access_kind | overrides / notes |
|---|---|---|
| chase_the_edit | unlimited | $500 prepaid hotel credit calendar year. |
| priority_pass_select | unlimited | Includes restaurants for primary cardholder; 2 free guests. |
| chase_sapphire_lounge_network | unlimited | Currently in BOS, IAH, JFK, LGA, PHL, SAN — growing. |
| visa_infinite_lhc | unlimited | 1,200+ properties via visainfinitehotels.com. |
| visa_infinite_concierge | unlimited | 24/7 concierge. |
| amex_global_dining_access | not_available | Amex-only program. |
| centurion_lounge_network | not_available | Amex-only program. |

## card_co_brand_perks

```yaml
hotel_status_grants:
  - program: ihg_one_rewards
    tier: platinum_elite
    auto_grant: true
    valid_through: ongoing

rental_status_grants:
  - program: hertz
    tier: presidents_circle
    auto_grant: true
  - program: avis
    tier: preferred
    auto_grant: true
  - program: national
    tier: emerald_executive
    auto_grant: true

prepaid_hotel_credit:
  amount_usd: 500
  period: calendar_year
  qualifying_programs: [chase_the_edit]
  min_nights: 2
  booking_channel: chase_travel_the_edit
  notes: Hotels split between $250 H1 / $250 H2 increments.
```

## card_absent_perks

```yaml
- perk_key: fhr_or_thc_access
  reason: FHR and Hotel Collection are Amex programs; CSR uses Chase's competing Edit program instead.
  workaround: Hold an Amex Platinum or Business Platinum for FHR/THC.

- perk_key: amex_global_dining_access
  reason: Amex/Resy partnership; not available on Visa cards.
  workaround: Amex Plat or Gold (or Centurion).

- perk_key: centurion_lounge_access
  reason: Amex-only network.
  workaround: Hold an Amex Plat or Centurion.

- perk_key: marriott_or_hilton_status_grant
  reason: CSR doesn't grant Bonvoy or Hilton status (those are Amex Plat / Bonvoy Brilliant / Hilton Aspire perks).
  workaround: Hold the relevant cobrand or pursue status-by-spend.

- perk_key: transferable_to_amex_partners
  reason: UR transfers to UR partners; cannot transfer to Delta SkyMiles, Air France Flying Blue, ANA Mileage Club (the unique Amex transfer partners).
  workaround: Hold an Amex MR-earning card (Plat, Gold, Green, BBP, etc.) for those routes.

- perk_key: walmart_plus_credit
  reason: Amex-Plat-only credit category.
  workaround: Just buy Walmart+ ($98/yr) directly if needed.

- perk_key: clear_plus_credit
  reason: Not on CSR (was on Amex Plat for $209/yr).
  workaround: Pay for CLEAR+ separately or hold an Amex Plat.

- perk_key: oura_ring_credit
  reason: Amex-Plat-only as of 2025.
  workaround: Buy the Oura Ring directly.
```

## transfer_partner_sweet_spots (currency = chase_ur)

| partner_id | sweet_spot_tags | notes |
|---|---|---|
| world_of_hyatt | hyatt_cat_1_4_3500_to_15000, hyatt_aspirational_park_hyatt | Best hotel transfer partner industry-wide. Anchors UR valuation at ~2cpp. |
| united_mileageplus | united_excursionist_perk, united_economy_partner_redemptions | Excursionist Perk on round-trip awards is the iconic UR sweet spot. |
| southwest_rapid_rewards | sw_companion_pass_when_eligible | Companion Pass via paired Southwest cards; UR transfers help reach 135k. |
| air_canada_aeroplan | aeroplan_distance_chart_transcon, aeroplan_stopover_award | Strong partner for Star Alliance redemptions. |
| british_airways_avios | ba_short_haul_aa_partner | AA short-haul under 650 miles for 7,500 Avios. |
| virgin_atlantic_flying_club | va_ana_first_business_to_japan, va_delta_one_us_eu_off_peak | Same sweet spots Amex MR has. |
| iberia_plus | iberia_off_peak_us_madrid_biz_34k | Off-peak biz to Madrid. |
| singapore_krisflyer | singapore_first_class_to_asia | Limited availability but high value. |
| jetblue_trueblue | transfer_avoid_low_value_ratio | 1:1 ratio but TrueBlue value is mediocre. |
| marriott_bonvoy | transfer_avoid_low_value_ratio | UR to Bonvoy at 1:1 is structurally inferior to alternatives. |
| ihg_one_rewards | transfer_avoid_low_value_ratio | 1:1 but IHG points worth ~0.5cpp; bad math. |

## Diff vs current markdown

**New fields:**
- ease_score numeric for every credit
- realistic_redemption_pct + realistic_value_usd
- Structured `card_insurance` (10 coverage kinds)
- 7 `card_program_access` rows (positive + negative)
- IHG Platinum elite_status_grant structured
- 8 `card_absent_perks` entries with workarounds
- Per-partner sweet_spot_tags for chase_ur (11 partners)

**Refined:**
- Cell phone protection: existing markdown shows $1,000/claim, 3 claims/12mo, $50 deductible — confirmed against post-refresh GTB.
- Trip delay: existing markdown shows 6+ hours, $500/ticket — matches.
- Primary CDW: confirmed primary, $75k cap.

**One factual conflict to resolve:**
- Existing `RESEARCH_NOTES.md` says "1.5cpp portal redemption on CSR has been replaced" post-refresh. Need to confirm what the current portal cpp is. If 1cpp: that significantly weakens CSR's value proposition for non-transfer redeemers. Recommend a manual fact-check via the issuer page before landing.
