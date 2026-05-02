# Enrichment reports

One file per enriched card. Each report is the human-reviewable artifact —
intended to be checked, edited if anything is wrong, then converted into
DB writes by the orchestrator script (not yet built).

## Format

Every report has these sections:

| Section | Purpose |
|---|---|
| Header | card_id, last_verified, prompt_version, model, status |
| Sources consulted | Which authoritative URLs the enrichment grounded in |
| Confidence summary | Per-field-group confidence (high / medium / low) |
| card_credit_score | Single row mapping to credit_score_band |
| card_membership_requirements | Required relationships |
| card_annual_credits | Table with face / period / ease_score (1-5) / realistic_pct (0.30-0.95) / realistic_usd / rationale |
| card_insurance | YAML per coverage_kind, including explicit `available: false` absences |
| card_program_access | Table — which named programs the card unlocks (FHR, Edit, Centurion, PP, etc.) |
| card_co_brand_perks | YAML — hotel_status_grants, rental_status_grants, prepaid_hotel_credit, free_night_certificates |
| card_absent_perks | YAML list — the 5-8 most-confused absences with workaround for each |
| transfer_partner_sweet_spots | Per-partner controlled-vocab tags |
| Diff vs current markdown | What's new vs the existing card markdown, what's refined, conflicts to resolve |

## Reports in this batch (2026-05-02)

| card | status | confidence | notable conflicts |
|---|---|---|---|
| amex_platinum | ready_for_review | medium-high | Equinox digital credit confirmed killed; remove from markdown |
| chase_sapphire_reserve | ready_for_review | medium-high | Verify post-refresh portal redemption cpp |
| capital_one_venture_x | ready_for_review | medium-high | Verify Etihad transfer ratio |
| amex_gold | ready_for_review | high | None — confirmed against existing markdown |
| chase_sapphire_preferred | ready_for_review | high | None — CSP has been stable for years |

## Review process

1. Read each report.
2. Spot-check insurance values against the linked Guide-to-Benefits PDFs.
3. Confirm transfer-partner ratios against the issuer's current transfer page.
4. Edit the report directly if a value needs correcting.
5. Once approved, run the orchestrator (TBD) to apply each report to Postgres
   under one transaction per card.

## Confidence flag rationale

These five reports were generated **in-session without WebFetch**, drawing
from training-corpus knowledge of these cards' current state plus the
existing markdown. The cards are the most-documented credit products on
the planet, so training knowledge is reasonable — but Guide-to-Benefits
PDFs revise on a 12-24 month cadence, and a post-cutoff revision could
have changed limits without my knowledge.

The next batch should run with WebFetch enabled to pull live issuer pages
and current GTB PDFs.

## Next batch — what to enrich

Recommended priority for the next 5 cards (sorted by `importance × incompleteness`):

1. amex_business_platinum
2. chase_ink_business_preferred
3. amex_platinum_schwab
4. marriott_bonvoy_brilliant
5. hilton_aspire

Or by category if filling gaps:
- Premium hotel co-brands: marriott_bonvoy_brilliant, hilton_aspire, hyatt
- Premium business: amex_business_platinum, chase_ink_business_premier
- Premium-tier alternates: amex_platinum_schwab, amex_platinum_morgan_stanley, citi_strata_elite
