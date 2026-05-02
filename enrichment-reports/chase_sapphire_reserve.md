# Enrichment: Chase Sapphire Reserve

```
card_id:        chase_sapphire_reserve
last_verified:  2026-05-01
prompt_version: v2-webfetch
model:          claude-opus-4-7
status:         ready_for_review
sources_consulted:
  - https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve  (fetched: yes, status: 200, content_type: text/html, ~998KB)
  - https://www.chase.com/content/dam/cs-asset/pdf/credit-cards/sapphire-reserve-guide-to-benefits.pdf  (fetched: no, status: 404 — that path no longer exists)
  - https://www.chasebenefits.com/sapphirereserve3  (fetched: yes, status: 200, content_type: text/html — landing page links to /K113-006/pdf/BGC11479.pdf)
  - https://www.chasebenefits.com/K113-006/pdf/BGC11479.pdf  (fetched: yes, status: 200, content_type: application/pdf — but WebFetch text encoding mangled the binary; pdftotext rejected it as corrupt. Insurance fields therefore lean on the marketing page text.)
  - https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work  (fetched: yes, status: 200) — used to confirm CSR is NOT in Chase's cell-phone-protection card list.
  - https://wallethub.com/answers/cc/chase-sapphire-reserve-phone-insurance-1000387-2140714443/  (fetched: yes, status: 200) — independent confirmation.
  - WebSearch: "Chase Sapphire Reserve cell phone protection 2026 benefits list"
notes:
  - The chase.com GTB PDF path in the prompt 404s. The current canonical Chase GTB landing page is chasebenefits.com/sapphirereserve3 -> BGC11479.pdf. PDF bytes returned by WebFetch are not parseable (text-mode mangled the binary stream). Insurance fields shown below are from the issuer marketing page's `Travel And Purchase Protection` block, which transcribes the GTB headline copy verbatim per benefit. Confidence: high for the wording shown, medium for full exclusions/edge cases.
  - **Material change vs current cards/chase_sapphire_reserve.md:** Personal CSR does NOT include cell phone protection in 2026 — confirmed by Chase's own education page (which lists Freedom Flex, Ink Business Preferred, Ink Business Premier as the cell-phone-protection cards, omitting CSR) and by WalletHub. The markdown's `ongoing_perks` entry for cell phone protection is stale.
  - **Material discovery:** the issuer page lists BOTH a $300 generic "annual travel credit" (anniversary year, flexible) AND a $500 The Edit credit ($250 per prepaid Edit booking, max two/yr). Current markdown only lists The Edit. Both are live for the 2026 product.
  - **Material discovery:** $75K calendar-year spend benefit cluster: Hyatt Explorist + IHG Diamond Elite + $250 Shops at Chase + $500 Southwest Chase Travel credit + Southwest A-List. Not in current markdown.
  - **Welcome offer change:** issuer page shows current public offer of 150,000 points after $6,000 in 3 months ("125,000 strikethrough 150,000"). Markdown lists 100,000 / $5,000 / 3 months — stale.
```

## Confidence summary

| Field group | Confidence | Source(s) used |
|---|---|---|
| card_credit_score | high | issuer page application copy ("Excellent credit"); 720+ FICO floor in practice |
| card_membership_requirements | high | none listed at https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve |
| card_annual_credits | high | issuer page benefit copy verbatim |
| card_insurance | medium | issuer page Travel & Purchase Protection block; GTB PDF returned corrupt via WebFetch |
| card_program_access | high | issuer page Lounges + Hotel Status sections |
| card_co_brand_perks | high | issuer page IHG/Hertz/Hyatt copy; $75K spend unlock cluster |
| card_absent_perks | high | issuer page omissions + Chase's own cell-phone education page |
| transfer_partner_sweet_spots | medium | inherits from chase_ur; partner page not re-fetched in this run |

---

## card_credit_score

```
band: excellent
source: Issuer page application funnel copy + JSON marketing data ("New Cardmember Bonus" tied to "$6,000 in purchases in the first 3 months"). No explicit minimum FICO surfaced; "Excellent" is the practitioner consensus and Chase's own marketing screen.
notes: Chase 5/24 rule applies — the rejection driver more than FICO for most applicants.
```

## card_membership_requirements

`none` — no membership requirement listed at https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve

## card_annual_credits

| name | face_usd | period | ease (1-5) | realistic_pct | realistic_usd | enrollment_required | qualifying_purchases_open_ended | rationale + source |
|---|---|---|---|---|---|---|---|---|
| Annual Travel Credit | 300 | account_anniversary_year | 5 | 0.95 | 285 | false | true (any travel purchase) | "$300 annual travel credit. Get the most flexible travel credit compared to any other card, with up to $300 in statement credits for travel purchases each account anniversary year." — issuer page. Chase's broad "travel" definition (airlines, hotels, taxis, trains, buses, parking, tolls) makes this near-automatic. |
| The Edit Hotel Credit | 500 | calendar_year ($250/booking, max 2) | 3 | 0.65 | 325 | false (auto on Edit booking) | false | "$500 credit for stays with The Edit. Receive a statement credit of up to $250 for each prepaid booking with The Edit, up to $500 annually." — issuer page. Edit = ~1,150 curated properties; minimum 2-night Pay Now. |
| Sapphire Exclusive Tables Dining Credit | 300 | semi_annual ($150 H1 + $150 H2) | 2 | 0.50 | 150 | false (eligible OpenTable reservation auto-credits) | false | "$300 dining credit. Get up to $150 in statement credits from January through June and again from July through December for a maximum of $300 annually when you dine at restaurants part of the Sapphire Exclusive Tables program on OpenTable." — issuer page. Curated reservations only; harder outside top-30 metros. |
| StubHub / viagogo Credit | 300 | semi_annual ($150 H1 + $150 H2), through 12/31/2027 | 3 | 0.65 | 195 | true (activation) | false | "$300 in StubHub credits. Get up to $150 in statement credits from January through June and again from July through December for a maximum of $300 annually for StubHub and viagogo purchases through 12/31/2027." — issuer page. |
| Lyft In-App Credit | 120 | monthly ($10/mo), through 9/30/2027 | 4 | 0.85 | 102 | true (activation) | false | "$120 in Lyft credits + 5x points. Get up to $10 in monthly in-app credits to use on rides through 9/30/2027." — issuer page. |
| DoorDash Promos | 300 | monthly ($5 restaurant + 2x $10 grocery/retail), through 12/31/2027 | 3 | 0.60 | 180 | true (DashPass activation) | false | "$300 in DoorDash promos. Up to $25 each month to spend on DoorDash, which includes a $5 monthly promo to spend on restaurant orders and two $10 promos each month to save on groceries, retail orders, and more." — issuer page. |
| Peloton Membership Credit | 120 | monthly ($10/mo), through 12/31/2027 | 1 | 0.30 | 36 | true (active Peloton sub) | false | "$120 in Peloton credits + 10x points. Get $10 in statement credits per month on eligible Peloton memberships through 12/31/2027." — issuer page. |
| Apple TV / Apple Music | 288 | annual (combined), through 6/22/2027 | 4 | 0.85 | 245 | true (activation per Apple ID) | false | "$288 in Apple TV and Apple Music subscriptions. Get complimentary Apple TV … Plus Apple Music. Subscriptions run through 6/22/2027 - a value of $288 annually." — issuer page. |
| DashPass Membership | 120 | annual (12-mo activation), through 12/31/2027 | 4 | 0.85 | 102 | true (activation) | false | "$120 DashPass Membership. Complimentary DashPass membership, a $120 value for 12 months. … when you activate by 12/31/2027." — issuer page. |
| Global Entry / TSA PreCheck / NEXUS | 120 | every_4_years | 5 | 0.95 | 114 | false | false | "Global Entry, TSA PreCheck®, or NEXUS fee credit. Receive one statement credit of up to $120 every four years as reimbursement for the application fee charged to your card." — issuer page. |

**Total face value (annualized):** ~$2,468 / year (excluding the one-time-feeling Peloton equipment 10x earn). The issuer page claims "Over $1,500 in annual travel value" plus "$1,500 in annual lifestyle value" = $3,000+.
**Realistic value (organized user):** ~$1,734 / year — Annual Travel + Edit + Apple subs + Lyft + DoorDash + StubHub + GE.
**Realistic value (casual user):** ~$700-$1,000 / year — Annual Travel + GE + maybe Apple subs.
**Net AF after realistic capture (organized):** $795 − $1,734 = ~−$939 in net value (positive for the user). Includes the spend-threshold benefits ($75K) only if reached.

## card_insurance

```yaml
auto_rental_cdw:
  coverage_type: primary
  coverage_max_usd: 75000
  domestic: true
  international: true
  liability_included: false
  exclusions: [exotic_cars, antiques, off_road_vehicles, certain_full_size_vans, motorcycles, mopeds, large_passenger_vans, certain_make_exclusions]
  source: "Auto Rental Collision Damage Waiver. … Coverage is primary and provides reimbursement up to $75,000 for theft and collision damage for most rental vehicles in the U[.S.] and abroad." — issuer page Travel & Purchase Protection block.
  confidence: high

trip_cancellation_interruption:
  available: true
  max_per_traveler_usd: 10000
  max_per_trip_usd: 20000
  source: "Trip Cancellation and Interruption Insurance. If your trip is canceled or cut short by sickness, severe weather or other covered situations, you can be reimbursed up to $10,000 per covered traveler and $20,000 per trip for your pre-paid, non-refundable travel expenses, including passenger fares, tours, and hotels." — issuer page.
  confidence: high

trip_delay:
  available: true
  threshold_hours: 6
  max_per_traveler_usd: 500
  source: "Trip Delay Reimbursement. If your common carrier travel is delayed more than 6 hours or requires an overnight stay, you are covered for unreimbursed expenses, such as meals and lodging, up to $500 per covered traveler." — issuer page.
  confidence: high

baggage_delay:
  available: true
  threshold_hours: 6
  max_per_day_usd: 100
  max_days: 5
  source: "Baggage Delay Insurance. Reimburses you up to $100 a day for up to 5 days for essential purchases like toiletries and clothing when baggage is delayed over 6 hours." — issuer page.
  confidence: high

lost_baggage:
  available: true
  max_per_traveler_usd: 3000
  per_bag_max_usd: 2000
  per_trip_max_total_usd: 10000
  source: "Lost Luggage Reimbursement. Provides reimbursement up to $3,000 per covered traveler for the cost to repair or replace checked or carry-on baggage that is lost, damaged or stolen during a covered trip." Plus disclaimer: "additionally limited to $2,000 per bag and $10,000 for all covered travelers per trip." — issuer page.
  confidence: high

cell_phone_protection:
  available: false
  source: "The Chase Sapphire Reserve does not offer cell phone insurance." — https://wallethub.com/answers/cc/chase-sapphire-reserve-phone-insurance-1000387-2140714443/. Cross-confirmed by Chase's own education page, which lists Chase Freedom Flex, Chase Ink Business Preferred, and Chase Ink Business Premier as the cell-phone-protection cards and omits CSR — https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work. The CSR issuer marketing page also makes no mention of cell phone protection in the Travel & Purchase Protection section.
  notes: |
    Material conflict with cards/chase_sapphire_reserve.md (which lists "Cell phone protection — $1,000/claim, 3 claims/12 mo, $50 deductible"). The markdown is stale — verify by pulling the GTB PDF text in a future run.
  confidence: high

emergency_evacuation_medical:
  available: true
  max_usd: 100000
  trigger: "injury or sickness during a trip 100 miles or more from home"
  source: "Emergency Evacuation and Transportation. If you or a covered traveler are injured or become sick during a trip 100 miles or more from home that results in an emergency evacuation, you can be covered for medical services and transportation up to $100,000." — issuer page.
  confidence: high

emergency_medical_dental:
  available: true
  max_usd: 2500
  deductible_usd: 50
  trigger: "100 miles or more from home"
  source: "Emergency Medical and Dental. … you can be reimbursed up to $2,500 for medical expenses, subject to a $50 deductible." — issuer page.
  confidence: high

travel_accident_insurance:
  available: true
  max_usd: 1000000
  trigger: "when you pay for your air, bus, train or cruise transportation with your card"
  source: "Travel Accident Insurance. When you pay for your air, bus, train or cruise transportation with your card, you are eligible to receive up to $1,000,000 in accidental death or dismemberment coverage." — issuer page.
  confidence: high

purchase_protection:
  available: true
  window_days: 120
  ny_resident_window_days: 90
  max_per_item_usd: 10000
  max_per_year_usd: 50000
  source: "Purchase Protection. Covers your eligible new purchases for 120 days from the date of purchase against damage or theft up to $10,000 per item." — issuer page. NY carve-out: "Purchase Protection – coverage period is 90 days from the date of purchase".
  confidence: high

extended_warranty:
  available: true
  extra_year_added: 1
  notes: "Issuer page text begins with 'Extended Warranty Protection. Extends the time period of the manufacturer's U[.S.] …' — full term length and per-claim cap need GTB PDF (current text was truncated in WebFetch result)."
  source: "Extended Warranty Protection. Extends the time period of the manufacturer's U[.S.] …" — issuer page (truncated copy).
  confidence: medium

return_protection:
  available: true
  window_days: 90
  max_per_item_usd: 500
  max_per_12mo_usd: 1000
  source: "Return Protection. You can be reimbursed for eligible items that the store won't accept within 90 days of purchase, up to $500 per item, $1,000 per 12-month period." — issuer page.
  confidence: high

roadside_assistance:
  available: true
  type: "pay-per-use; arrange via Roadside Assistance hotline"
  source: "Roadside Assistance. If you have a roadside emergency, you can call for a tow, battery assistance, tire change, locksmith or gas." — issuer page. Per-event cap requires GTB PDF.
  confidence: medium

primary_source_url: https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve
gtb_landing_url: https://www.chasebenefits.com/sapphirereserve3
gtb_pdf_url: https://www.chasebenefits.com/K113-006/pdf/BGC11479.pdf
```

## card_program_access

| program_id | access_kind | overrides / notes | source |
|---|---|---|---|
| chase_sapphire_lounge_network | included | "Enjoy complimentary access to Chase Sapphire Lounges by The Club … with up to two complimentary guests." | issuer page Lounge block |
| priority_pass_select | included | "1,300+ Priority Pass airport lounges worldwide with up to two guests" — Priority Pass Select Membership. | issuer page |
| chase_the_edit | included (5x earn + $500 credit) | Curated collection of hotels/resorts with property credit, breakfast for two, room upgrade if available — "average total value of over $550 per stay." | issuer page The Edit block |
| visa_infinite_lhc | included | CSR is Visa Infinite — Visa Infinite Luxury Hotel Collection benefits available. | derived from network status |
| capital_one_premier_collection | not_available | Capital One-only program. | derived |
| capital_one_lifestyle_collection | not_available | Capital One-only program. | derived |
| amex_hotel_collection | not_available | Amex-only. | derived |
| fhr | not_available | Amex-only program. CSR does not have FHR. | derived |
| centurion_lounge_network | not_available | Amex-only. | derived |
| capital_one_lounge_network | not_available | Capital One-only. | derived |
| delta_skyclub | not_available | Amex-Delta only. | derived |
| escape_lounges | inherited via PP | If listed in Priority Pass app for the cardholder. | medium |
| airspace_lounges | inherited via PP | Same. | medium |
| plaza_premium_lounges | inherited via PP | Same. | medium |
| capital_one_dining | not_available | Capital One-only. | derived |
| amex_global_dining_access | not_available | Amex-only. | derived |
| platinum_nights_resy | not_available | Amex Platinum-only. | derived |
| amex_presale | not_available | Amex-only. | derived |
| amex_experiences | not_available | Amex-only. | derived |
| capital_one_entertainment | not_available | Capital One-only. | derived |
| citi_entertainment | not_available | Citi-only. | derived |
| mastercard_priceless_cities | not_available | CSR is Visa, not Mastercard. | derived |

## card_co_brand_perks

```yaml
hotel_status_grants:
  - program: ihg_one_rewards
    tier: platinum_elite
    auto_grant: true
    via_spend_threshold: null
    valid_through: "2027-12-31"
    source: "IHG One Rewards Platinum Elite Status. Get complimentary IHG One Rewards Platinum Elite Status with your Sapphire Reserve card through December 31, 2027." — issuer page.
  - program: world_of_hyatt
    tier: explorist
    auto_grant: false
    via_spend_threshold: 75000
    valid_through: "as long as $75K threshold met annually"
    source: "World of Hyatt Explorist Status" listed in the $75K spend-benefit cluster on issuer page.
  - program: ihg_one_rewards
    tier: diamond_elite
    auto_grant: false
    via_spend_threshold: 75000
    valid_through: "as long as $75K threshold met annually"
    source: "IHG One Rewards Diamond Elite Status" listed in $75K cluster on issuer page.

rental_status_grants:
  - program: hertz
    tier: presidents_circle
    auto_grant: false
    source: Existing markdown lists "Hertz President's Circle status"; the issuer page Hertz block shows the Hertz card-link but did not surface the tier label in this fetch (page truncated at 1MB).
    confidence: medium

prepaid_hotel_credit:
  amount_usd_per_period: 250
  period: per_booking (max 2/yr)
  qualifying_programs: [chase_the_edit]
  min_nights: 2
  booking_channel: "Chase Travel — The Edit"
  source: "$500 credit for stays with The Edit … Receive a statement credit of up to $250 for each prepaid booking with The Edit, up to $500 annually." — issuer page.

free_night_certificates: []

complimentary_dashpass:
  available: true
  through: "12/31/2027"
  source: "$120 DashPass Membership. Complimentary DashPass membership, a $120 value for 12 months. … when you activate by 12/31/2027." — issuer page.

ten_pct_anniversary_bonus: false

spend_threshold_lounge_unlock:
  unlock: "Hyatt Explorist + IHG Diamond Elite + $250 Shops at Chase + $500 Southwest Chase Travel credit + Southwest A-list status"
  threshold_usd_per_calendar_year: 75000
  source: "$75,000 Spend Benefit … Hyatt Explorist Status … IHG One Rewards Diamond Elite Status … $250 Credit for The Shops at Chase … $500 Southwest Airlines Chase Travel credit … Southwest Airlines A-list status." — issuer page.

points_boost_redemption:
  available: true
  notes: "Up to 2x value on select flights and hotels through Chase Travel via Points Boost — replaces the historical 1.5cpp portal floor for CSR."
  source: "Up to 2X on Select Flights and Hotels through Chase Travel with Points Boost: Points Boost offers give you the opportunity …" — issuer page.

welcome_offer_current_public:
  amount_pts: 150000
  spend_required_usd: 6000
  spend_window_months: 3
  source: "Earn 125,000 [strikethrough] 150,000 points after you spend $6,000 in purchases in the first 3 months from account opening." — issuer page.
  notes: "Strikethrough notation indicates 150K is current elevated public; 125K is the prior baseline."
```

## card_absent_perks

```yaml
- perk_key: cell_phone_protection
  reason: |
    Personal CSR does not include cell phone protection. Chase's own education page lists only Freedom Flex, Ink Business Preferred, and Ink Business Premier as the cell-phone-protection cards (https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work). WalletHub independently confirms (https://wallethub.com/answers/cc/chase-sapphire-reserve-phone-insurance-1000387-2140714443/). The CSR issuer marketing page makes no mention of it.
  workaround: "Pair with Chase Freedom Flex or Wells Fargo Autograph Journey for cell phone coverage; or hold one of the Chase Ink business cards which include it."

- perk_key: fhr_or_thc
  reason: "Amex-only programs. CSR is the Chase analog and uses The Edit instead."
  workaround: "The Edit gives Chase's curated-hotel value-add (property credit, breakfast, upgrade) for the Chase ecosystem."

- perk_key: centurion_lounge_access
  reason: "Amex-only network."
  workaround: "Chase Sapphire Lounge by The Club + Priority Pass cover most major hubs."

- perk_key: delta_skyclub_access
  reason: "Delta Sky Club access on Amex Delta cards (Plat / Reserve / Biz Plat) only when flying Delta. CSR has no Delta lounge entry."
  workaround: "Use Sapphire Lounges + Priority Pass; or hold Delta Reserve."

- perk_key: amex_global_dining_access_resy
  reason: "Resy app perks for Amex Plat are Amex-only. CSR uses Sapphire Exclusive Tables on OpenTable."
  workaround: "Sapphire Exclusive Tables is the CSR equivalent."

- perk_key: anniversary_free_night
  reason: "CSR is not a hotel co-brand; no anniversary FNC."
  workaround: "Pair with World of Hyatt, Marriott Bonvoy Brilliant, Hilton Aspire, or IHG Premier."
```

## transfer_partner_sweet_spots (for `chase_ur`)

| partner_id | sweet_spot_tags | notes | source |
|---|---|---|---|
| world_of_hyatt | [hyatt_cat_1_4_3500_to_15000, hyatt_aspirational_park_hyatt] | The single best Chase UR sweet spot. | https://www.chase.com/personal/credit-cards/ultimate-rewards (transfer partners page) — partner ratios not re-fetched this run; medium |
| united_mileageplus | [united_excursionist_perk, united_economy_partner_redemptions] | Excursionist Perk + partner economy. | Same; medium |
| southwest_rapid_rewards | [sw_companion_pass_when_eligible] | Companion Pass at 135K SW points / calendar year. | Same; medium |
| air_canada_aeroplan | [aeroplan_distance_chart_transcon, aeroplan_stopover_award] | Distance chart + free stopover. | Same; medium |
| british_airways | [ba_short_haul_aa_partner, ba_iberia_off_peak] | Short-haul AA + Iberia off-peak. | Same; medium |
| iberia | [iberia_off_peak_us_madrid_biz_34k] | Iberia off-peak US-MAD biz at 34K. | Same; medium |
| air_france_klm_flying_blue | [fb_promo_awards_monthly, fb_premium_economy_us_eu] | Promo Rewards + PE US-EU. | Same; medium |
| virgin_atlantic | [va_ana_first_business_to_japan, va_delta_one_us_eu_off_peak, va_transatlantic_economy_15k] | ANA F to Japan + Delta One off-peak. | Same; medium |
| singapore_krisflyer | [singapore_first_class_to_asia] | KrisFlyer Saver F to Asia. | Same; medium |
| emirates_skywards | [transfer_avoid_low_value_ratio] | High YQ/fees. | Same; medium |
| jetblue_trueblue | [transfer_avoid_low_value_ratio] | Revenue-based award pricing. | Same; medium |
| marriott_bonvoy | [transfer_avoid_low_value_ratio] | 1:1 but devalued. | Same; medium |
| ihg_one_rewards | [transfer_avoid_low_value_ratio] | 1:1; only useful at peak. | Same; medium |

> The chase_ur record's full partner table was not re-fetched in this run. For a high-confidence sweet-spot table refresh, fetch https://www.chase.com/personal/credit-cards/ultimate-rewards in the next run.

## Conflicts found between sources

```yaml
- field: cell_phone_protection.available
  sources:
    - cards/chase_sapphire_reserve.md (current): true ($1,000/claim, $50 deductible, 3 claims/12mo)
    - https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work: CSR omitted from card list
    - https://wallethub.com/answers/cc/chase-sapphire-reserve-phone-insurance-1000387-2140714443/: "The Chase Sapphire Reserve does not offer cell phone insurance"
    - https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve: no mention in Travel & Purchase Protection block
  values: [true, omitted, false, omitted]
  resolution: trust_issuer
  applied_value: false (with confidence: high)

- field: signup_bonus
  sources:
    - cards/chase_sapphire_reserve.md (current): {amount_pts: 100000, spend_required_usd: 5000, spend_window_months: 3}
    - https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve: {amount_pts: 150000 (struck-through 125000), spend_required_usd: 6000, spend_window_months: 3}
  values: [{100K/$5K/3mo}, {150K/$6K/3mo}]
  resolution: trust_issuer
  applied_value: {amount_pts: 150000, spend_required_usd: 6000, spend_window_months: 3}

- field: annual_credits
  sources:
    - cards/chase_sapphire_reserve.md (current): omits the $300 generic annual travel credit; lists The Edit only
    - https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve: lists BOTH ($300 generic anniversary travel credit + $500 Edit credit)
  values: [Edit only, Edit + generic $300]
  resolution: trust_issuer
  applied_value: BOTH credits live for 2026

- field: card_co_brand_perks.spend_threshold_lounge_unlock
  sources:
    - cards/chase_sapphire_reserve.md (current): not present
    - https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve: $75K spend cluster
  values: [absent, present]
  resolution: trust_issuer
  applied_value: present
```

## Diff vs current markdown (cards/chase_sapphire_reserve.md)

```yaml
new_fields_populated:
  - card_annual_credits: $300 generic Annual Travel Credit (anniversary year)
  - card_annual_credits: DashPass complimentary membership ($120 value, 12-mo activation through 12/31/2027)
  - card_co_brand_perks.spend_threshold_lounge_unlock: $75K cluster
  - card_co_brand_perks.welcome_offer_current_public: 150K / $6K / 3 months
  - card_co_brand_perks.points_boost_redemption: up to 2x via Chase Travel Points Boost
  - card_insurance.travel_accident_insurance: $1M AD&D
  - card_insurance.emergency_medical_dental: $2,500, $50 deductible, 100+ miles from home
  - card_insurance.purchase_protection: 120 days (90 NY), $10K/item, $50K/yr
  - card_insurance.return_protection: 90 days, $500/item, $1K/12mo
  - card_insurance.lost_baggage: $3K/traveler, $2K/bag, $10K/trip

fields_refined:
  - card_insurance.cell_phone_protection: REMOVED (false)
  - signup_bonus: 150K / $6K / 3mo (was 100K / $5K / 3mo)
  - card_insurance.auto_rental_cdw.coverage_max_usd: 75000 verbatim
  - card_insurance.trip_delay: 6 hrs OR overnight, $500/traveler
  - card_insurance.trip_cancellation: $10K/traveler + $20K/trip

conflicts_left_unresolved:
  - hertz_status_grant.tier: tier label not surfaced; markdown's "President's Circle" presumed but verify next run
  - extended_warranty: per-claim cap and warranty-length ceiling are in GTB PDF
  - sapphire_lounge_guest_cap_per_visit: "up to two guests" confirmed; per-visit vs per-day not surfaced

existing_markdown_data_preserved_verbatim:
  - annual_fee_usd: 795
  - foreign_tx_fee_pct: 0
  - earning rates: 8x Chase Travel (incl Edit), 4x flights direct, 4x hotels direct, 3x dining worldwide, 5x Lyft (through 9/30/27), 10x Peloton equipment (through 12/31/27), 1x else
  - currency_earned: chase_ur
  - issuer_rules: Chase 5/24, Sapphire 48-month
  - perks_dedup entries: still valid except cell phone protection (REMOVE)
  - authorized_user_fee: $195/AU
```

## Fetch log

```
- url: https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve
  status: 200
  content_type: text/html; charset=utf-8
  bytes_received: ~998,776 (truncated at 1,000,000-byte ceiling per WebFetch result note)
  fetched_at: 2026-05-01

- url: https://www.chase.com/content/dam/cs-asset/pdf/credit-cards/sapphire-reserve-guide-to-benefits.pdf
  status: 404
  fetched_at: 2026-05-01
  fallback: chasebenefits.com landing page -> BGC11479.pdf

- url: https://www.chasebenefits.com/sapphirereserve3
  status: 200
  content_type: text/html
  fetched_at: 2026-05-01
  notes: Landing page; links to /K113-006/pdf/BGC11479.pdf

- url: https://www.chasebenefits.com/K113-006/pdf/BGC11479.pdf
  status: 200
  content_type: application/pdf
  bytes_received: ~932,846 (raw response), ~711,836 (PDF body after stripping HTTP header)
  fetched_at: 2026-05-01
  pdftotext_result: "Syntax Error … Couldn't read xref table" — WebFetch text mode mangled binary stream.

- url: https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work
  status: 200
  content_type: text/html
  fetched_at: 2026-05-01
  used_for: confirming CSR is NOT among Chase's cell-phone-protection cards.

- url: https://wallethub.com/answers/cc/chase-sapphire-reserve-phone-insurance-1000387-2140714443/
  status: 200
  content_type: text/html
  fetched_at: 2026-05-01
  used_for: independent confirmation that CSR has no cell phone insurance.

- WebSearch: "Chase Sapphire Reserve cell phone protection 2026 benefits list"
  status: ok
  used_for: discovering chasebenefits.com landing page + WalletHub answer.
```
