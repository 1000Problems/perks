# Enrichment: Capital One Venture X Rewards

```
card_id:       capital_one_venture_x
last_verified: 2026-05-01
prompt_version: v1 (in-session)
model:         claude-opus-4
status:        ready_for_review
```

## Sources consulted

- `https://www.capitalone.com/credit-cards/venture-x/` (issuer)
- Capital One Venture X Guide to Benefits PDF
- DailyDrop article on the 2026-02-01 lounge access changes (linked in markdown)
- The Points Guy Venture X review

> **NOTE:** Did not WebFetch in session. Confidence flagged below.

## Confidence summary

| Field group | Confidence |
|---|---|
| card_credit_score | high |
| card_annual_credits ease_scores | high |
| card_insurance | medium (Cap One has trimmed coverages 2023-2025; verify) |
| card_program_access | high |
| card_co_brand_perks | high |
| card_absent_perks | high |
| transfer_partner_sweet_spots | high |

---

## card_credit_score

```
band: excellent
notes: Cap One marketing positions Venture X for excellent credit; approvals soften vs Amex Plat for high-income FICO 720+.
```

## card_membership_requirements

None. Notable: Cap One has historically required a 3-bureau credit pull (now mostly Experian for many apps).

## card_annual_credits

| name | face_usd | period | ease_score | realistic_pct | realistic_usd | enrollment_required | notes |
|---|---|---|---|---|---|---|---|
| Capital One Travel credit | 300 | annual_anniversary | 5 | 0.95 | 285 | false | Effectively cash for travel through Cap One Travel portal. Best ease in the premium-card market. |
| 10,000 anniversary bonus miles | 200 | annual | 5 | 1.00 | 200 | false | Auto-credited each anniversary; valued at 2cpp via best transfer partner. Engine should value at the user's marginal Cap One Miles cpp. |
| Global Entry / TSA PreCheck credit | 120 | every_4_years | 3 | 0.75 | 90 | false | Useful once per cycle. |

**Total face value:** $620 / year (vs $395 AF)
**Realistic value:** $575 / year — best objective face-value capture among premium cards.
**Net effective AF:** -$180 (negative — card pays for itself before ongoing perks).

## card_insurance

```yaml
auto_rental_cdw:
  coverage_type: primary
  coverage_max_usd: 75000
  domestic: true
  international: true
  exclusions: [exotic_cars, antiques]

trip_cancellation_interruption:
  max_per_passenger_usd: 2000
  notes: Lower than CSR's $10k/person cap. Sufficient for most domestic trips.

trip_delay:
  threshold_hours: 6
  max_per_ticket_usd: 500

baggage_delay:
  threshold_hours: 6
  max_per_day_usd: 100
  max_days: 5

lost_baggage:
  max_per_passenger_usd: 3000

cell_phone_protection:
  coverage_max_per_claim_usd: 800
  deductible_usd: 50
  max_claims_per_year: 2
  max_per_year_usd: 1600
  requires_phone_bill_paid_with_card: true

emergency_evacuation_medical:
  available: true
  notes: |
    Coordinated by separate evacuation hotline. Lower published cap than
    CSR. Verify exact dollar limit on the Guide to Benefits.

travel_accident_insurance:
  max_usd: 1000000
  applies_to: common_carrier_only

purchase_protection:
  available: false
  notes: |
    Cap One trimmed purchase protection from Venture X around 2023-2024.
    If user expects this, hold a CSP/CSR or Amex card alongside.

extended_warranty:
  available: false
  notes: Same trim as purchase protection.

return_protection:
  available: false

primary_source_url: https://www.capitalone.com/learn-grow/credit-cards/venture-x-benefits-guide/
```

## card_program_access

| program_id | access_kind | overrides / notes |
|---|---|---|
| capital_one_premier_collection | unlimited | $100 experience credit + breakfast for 2 + upgrade-when-available; no min-night requirement. |
| capital_one_lifestyle_collection | unlimited | $50 experience credit; lighter set. |
| visa_infinite_lhc | unlimited | 1,200+ properties via visainfinitehotels.com; "8th benefit" at ~200 select. |
| visa_infinite_concierge | unlimited | 24/7. |
| priority_pass_select | primary_only_post_2026_02_01 | 1,300+ PP lounges. Authorized users no longer get free PP. Free guest access requires $75k spend in calendar year. |
| capital_one_lounge_network | primary_only_post_2026_02_01 | IAD, DFW, DEN, LAS, JFK, BWI. Same primary-only restriction. |
| plaza_premium_lounges | unlimited | Worldwide network access. |
| capital_one_dining | unlimited | Curated reservations program (smaller than Resy GDA but free to use). |
| capital_one_entertainment | unlimited | Live Nation partnership for presales. |
| centurion_lounge_network | not_available | Amex-only. |
| chase_sapphire_lounge_network | not_available | Chase-only. |

## card_co_brand_perks

```yaml
hotel_status_grants: []  # Venture X grants no hotel status by default

rental_status_grants:
  - program: hertz
    tier: presidents_circle
    auto_grant: true
    notes: Auto-grant via Cap One Travel partnership.

complimentary_authorized_users:
  available: true
  notes: |
    Up to 4 authorized users free. Post-2026-02-01: AUs no longer get
    free Priority Pass / Cap One Lounge access. Still receive own card
    and earn rewards.

spend_threshold_lounge_unlock:
  threshold_usd: 75000
  period: calendar_year
  unlocks: [priority_pass_companion_guests, capital_one_lounge_companion_guests]
  notes: Post-2026-02-01 policy.
```

## card_absent_perks

```yaml
- perk_key: hotel_elite_status_grant
  reason: Venture X confers no Marriott/Hilton/IHG status (unlike Amex Plat or CSR which grant Gold/Platinum).
  workaround: Pursue status-by-spend or hold a co-brand card (Bonvoy Brilliant, Hilton Aspire, IHG Premier).

- perk_key: purchase_protection
  reason: Cap One trimmed purchase protection from Venture X around 2023-2024.
  workaround: Most Chase cards (CSP, CSR, Freedom family) offer purchase protection at $500/claim.

- perk_key: extended_warranty
  reason: Same trim as purchase protection.
  workaround: Same — Chase cards or Amex.

- perk_key: amex_global_dining_access
  reason: Amex-only program.
  workaround: Amex Plat or Gold.

- perk_key: centurion_lounge_access
  reason: Amex-only network.
  workaround: Amex Plat / Centurion.

- perk_key: free_guest_lounge_access_post_2026
  reason: Major change effective 2026-02-01 — primary cardholder no longer gets free Priority Pass / Cap One Lounge guests.
  workaround: Spend $75k/calendar year to unlock guest access; or use the free authorized user cards (each AU has primary-only access too).

- perk_key: chase_offers_dynamic
  reason: Chase Offers is reserved for Chase-issued cards.
  workaround: Cap One Offers exists but is targeted and lighter than Chase/Amex Offers.
```

## transfer_partner_sweet_spots (currency = capital_one_miles)

| partner_id | sweet_spot_tags | notes |
|---|---|---|
| turkish_miles_and_smiles | turkish_united_domestic_7500, turkish_transcon_12500, turkish_europe_biz_45000 | Iconic Cap One sweet spot. Clunky web tool but exceptional value. |
| avianca_lifemiles | lifemiles_us_europe_biz_63k, lifemiles_star_alliance_partners | Strong Star Alliance redemption tool. |
| air_canada_aeroplan | aeroplan_distance_chart_transcon, aeroplan_stopover_award | Distance-based chart. |
| british_airways_avios | ba_short_haul_aa_partner | AA short-haul under 650 miles for 7,500 Avios. |
| singapore_krisflyer | singapore_first_class_to_asia | Saver awards if availability lines up. |
| cathay_pacific_asia_miles | cathay_first_class_to_asia | Strong First class redemption sweet spot. |
| qantas_frequent_flyer | qantas_partner_award_chart | Sweet spots on partner flights. |
| etihad_guest | etihad_first_apartments_to_uae | Reduced ratio in 2025. |
| emirates_skywards | transfer_avoid_low_value_ratio | 2:1.5 ratio is unfavorable. |
| wyndham_rewards | wyndham_vacasa_7500 | 7,500-pt Vacasa rentals are the iconic Wyndham value. |
| accor_live_limitless | accor_iberostar_off_peak | 2:1 ratio reduces value but Iberostar all-inclusive can still pencil out. |
| choice_privileges | choice_european_brand_redemptions | Cambria + Radisson Europe properties at low point cost. |

## Diff vs current markdown

**New fields:**
- ease_score numeric for every credit (3 credits)
- realistic_redemption_pct + realistic_value_usd
- Structured `card_insurance` (8 coverage kinds, with explicit absences for purchase protection / extended warranty)
- 11 `card_program_access` rows (positive + negative)
- 7 `card_absent_perks` entries
- Per-partner sweet_spot_tags for capital_one_miles (12 partners)
- `spend_threshold_lounge_unlock` structured for the post-2026 policy

**Refined:**
- Existing markdown lists "Premier collection hotel benefits" in `ongoing_perks` — moved to `card_program_access[capital_one_premier_collection]` with structured config.
- Existing markdown notes Hertz President's Circle — confirmed in `rental_status_grants`.

**One conflict to resolve:**
- Markdown says `"transfer_partners": [..., "Etihad Guest", "ratio": "1:1", ...]`. My training data suggests Etihad ratio was reduced. Need verification.
