# Soul schema — proposal v1

**Status:** proposed (2026-05-01)
**Author:** Claude (Cowork) on behalf of Angel
**Decision needed:** Approve / iterate before any per-card enrichments are merged into `cards/*.md`

## Goal

Extend `cards/<card_id>.md` (the editorial source of truth) with structured "soul" sections that map 1:1 to the empty Postgres child tables already provisioned in `db/migrations/0001_init_catalog.sql`. The build script writes derived JSON; the migrate script writes Postgres rows; a verify script confirms the DB faithfully materializes the markdown. The recommendation engine continues to consume from `data/*.json` until enough cards are enriched to refactor scoring against the new shape.

## Design principles

1. **Markdown is the editorial source of truth. Postgres is the runtime source of truth. Verify closes the loop.**
2. **Additive only.** Every existing card stays valid. New sections are optional. No breaking changes to schemas, the build, or the engine.
3. **Section-per-table.** Each `## card_soul.X` markdown section maps to one Postgres child table. No mega-blob JSON. Humans can grep and skim.
4. **Naming mirrors the SQL.** Section names match table names (e.g. `card_soul.insurance` → `card_insurance`). Reduces translation overhead.
5. **Citation-first.** Every populated field carries a `source` string (quoted excerpt + URL). Every value carries a `confidence` enum. This is the editorial discipline that makes the data trustworthy.
6. **Dual-source during transition.** Existing `annual_credits` and `ongoing_perks` arrays in the basic `cards.json entry` stay supported. The new `card_soul.annual_credits` and `card_soul.co_brand_perks` are *richer* alternatives. The migrate script prefers soul data when present, falls back to basic. Once all 84 cards are enriched, we deprecate the basic forms in a sweep.

## New markdown sections

Append in this order at the bottom of `cards/<card_id>.md`, after `## RESEARCH_NOTES.md entries`:

```
## card_soul.credit_score              — JSON object
## card_soul.annual_credits            — JSON array (rich version)
## card_soul.insurance                 — JSON object keyed by coverage_kind
## card_soul.program_access            — JSON array
## card_soul.co_brand_perks            — JSON object with named perk groups
## card_soul.absent_perks              — JSON array
## card_soul.fetch_log                 — free-form (informational; not persisted)
```

All sections are optional. A card without any `card_soul.*` section is still a valid card. Cards in flight will typically grow these sections one-at-a-time over multiple PRs.

## Section schemas

### card_soul.credit_score

```json
{
  "band": "excellent",
  "source": "<quoted issuer-page excerpt> — <url>",
  "confidence": "high",
  "notes": "<optional>"
}
```

`band` ∈ `building | fair | good | very_good | excellent | unknown` (matches Postgres `credit_score_band` enum). `confidence` ∈ `high | medium | low | no_source`. The basic `cards.credit_score_required` text field stays in `cards.json entry` for backward compatibility; this section adds structured band + citation.

### card_soul.annual_credits

```json
[
  {
    "name": "Hotel Credit (FHR / Hotel Collection)",
    "face_value_usd": 600,
    "period": "split_h1_h2",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": null,
    "notes": "...",
    "source": "<quoted + url>",
    "confidence": "high"
  }
]
```

`period` ∈ `calendar_year | anniversary_year | monthly | quarterly | split_h1_h2 | every_4_years | every_5_years` (matches Postgres `credit_period` enum). `ease_score` ∈ 1-5 per the locked heuristic in the enrichment prompt. `realistic_redemption_pct` 0-1.

When this section is present, the migrate script populates `card_annual_credits` from it (full replace) and ignores the basic `cards.annual_credits`. When absent, the migrate script falls back to the basic array (current behavior).

### card_soul.insurance

```json
{
  "auto_rental_cdw": {
    "available": true,
    "coverage_type": "secondary",
    "coverage_max_usd": null,
    "domestic": true,
    "international": true,
    "liability_included": false,
    "exclusions": ["exotic_cars", "antiques", "trucks", "motorcycles"],
    "source": "...",
    "confidence": "medium",
    "notes": "..."
  },
  "trip_cancellation_interruption": {
    "available": true,
    "max_per_trip_usd": 10000,
    "max_per_card_per_12mo_usd": 20000,
    "underwriter": "New Hampshire Insurance Company, an AIG Company",
    "source": "...",
    "confidence": "high"
  },
  "trip_delay": {
    "available": true,
    "threshold_hours": 6,
    "max_per_ticket_usd": 500,
    "max_claims_per_12mo": 2,
    "source": "...",
    "confidence": "high"
  },
  "baggage_delay": { "available": false, "source": "not listed at <url>", "confidence": "high" },
  "lost_baggage": { ... },
  "cell_phone_protection": { ... },
  "emergency_evacuation_medical": { ... },
  "travel_accident_insurance": { ... },
  "purchase_protection": { ... },
  "extended_warranty": { ... },
  "return_protection": { ... },
  "roadside_assistance": { ... },
  "primary_source_url": "https://www.americanexpress.com/us/credit-cards/card/platinum/",
  "gtb_pdf_url": "<url or null>"
}
```

Top-level keys are `coverage_kind` values (controlled vocab — see "Coverage kinds" below). The inner object is what lands in the Postgres `config jsonb` column. `available: false` is valid and means "explicitly confirmed absent" (vs. silently omitted = "not yet researched").

`primary_source_url` and `gtb_pdf_url` are sibling top-level fields (not coverage kinds) — they populate `card_insurance.primary_source_url` per row.

**Coverage kinds (controlled vocab):**
`auto_rental_cdw`, `trip_cancellation_interruption`, `trip_delay`, `baggage_delay`, `lost_baggage`, `cell_phone_protection`, `emergency_evacuation_medical`, `emergency_medical_dental`, `travel_accident_insurance`, `purchase_protection`, `extended_warranty`, `return_protection`, `roadside_assistance`. New kinds get added to the Zod enum + this list together.

### card_soul.program_access

```json
[
  {
    "program_id": "centurion_lounge_network",
    "access_kind": "included",
    "overrides": { "guest_policy": "2 free; unlimited at $75K spend" },
    "notes": "...",
    "source": "...",
    "confidence": "high"
  },
  {
    "program_id": "fhr",
    "access_kind": "not_available",
    "overrides": {},
    "notes": "Amex-only program",
    "source": "derived",
    "confidence": "high"
  }
]
```

`access_kind` ∈ `included | not_available | inherited_via_pp | spend_unlock | conditional`. `overrides` is free-form jsonb. `program_id` must be a known program in the catalog (cross-validated at build time once we extend the program-access controlled vocab; for now: warning, not error).

The migrate script writes one row per entry. `not_available` rows are valuable — they let the engine know "this card explicitly lacks Centurion access" vs. "we don't know."

### card_soul.co_brand_perks

```json
{
  "hotel_status_grants": [
    {
      "program": "marriott_bonvoy",
      "tier": "gold_elite",
      "auto_grant": true,
      "via_spend_threshold": null,
      "valid_through": "ongoing",
      "source": "...",
      "confidence": "high"
    }
  ],
  "rental_status_grants": [
    { "program": "hertz", "tier": "presidents_circle", "auto_grant": false, "source": "...", "confidence": "medium" }
  ],
  "prepaid_hotel_credit": {
    "amount_usd_per_period": 300,
    "period": "split_h1_h2",
    "qualifying_programs": ["fhr", "amex_hotel_collection"],
    "min_nights": 2,
    "booking_channel": "Amex Travel",
    "source": "..."
  },
  "free_night_certificates": [],
  "complimentary_dashpass": { "available": false },
  "ten_pct_anniversary_bonus": { "available": false },
  "spend_threshold_lounge_unlock": {
    "unlock": "Unlimited Centurion guests + unlimited Sky Club",
    "threshold_usd_per_calendar_year": 75000,
    "source": "..."
  },
  "welcome_offer_current_public": {
    "amount_pts": 80000,
    "spend_required_usd": 8000,
    "spend_window_months": 6,
    "source": "...",
    "notes": "..."
  },
  "additional_cardholders": {
    "fee_first_n": 5,
    "fee_per_card_after": 35,
    "source": "..."
  }
}
```

The migrate script fans out: each top-level key becomes a `perk_kind` row (or N rows for arrays). `perk_kind` values include `hotel_status_grant`, `rental_status_grant`, `prepaid_hotel_credit`, `free_night_certificate`, `complimentary_dashpass`, `ten_pct_anniversary_bonus`, `spend_threshold_lounge_unlock`, `welcome_offer_current_public`, `additional_cardholders`. New named groups can be added; the migrate script's fan-out is a switch on top-level key.

The legacy `ongoing_perks` array in `cards.json entry` stays supported — those continue to land as `perk_kind=ongoing_perk` rows. Once a card has `card_soul.co_brand_perks`, the migrate script also clears its `ongoing_perk` rows to avoid double-counting.

### card_soul.absent_perks

```json
[
  {
    "perk_key": "chase_offers_dynamic",
    "reason": "Chase-issued benefit; not on Amex products. Not listed at <url>.",
    "workaround": "Pair with a Chase card.",
    "confidence": "high"
  }
]
```

`perk_key` is a controlled-vocab tag; new keys get added as we encounter them. Each entry maps to one row in `card_absent_perks`.

### card_soul.fetch_log

Free-form markdown/YAML. Documents which URLs were fetched, their HTTP status, content type, and any fallbacks used. **Not persisted to the DB** — purely an editorial trail kept in the markdown so the next enrichment pass knows what was already tried.

## Confidence enum (used everywhere)

```
high     — direct fetch from issuer page or GTB PDF, value quoted verbatim
medium   — fetched from Tier 2 source (FrequentMiler etc.) without issuer confirmation;
            OR per-claim caps inherited from Visa/Mastercard network GTB without re-fetch
low      — inferred from related fields; or fetched source was ambiguous
no_source — fetch failed; value is NULL; field is included only to mark "tried, failed"
```

## Pipeline changes

### Build (additive)

`scripts/build-card-db.ts` learns to extract the new sections, validates them against new Zod schemas, and emits two new derived files for engine/UI consumption:

- `data/card_soul.json` — keyed by `card_id`, contains the full soul block per card
- `data/coverage_kinds.json` — list of `coverage_kind` values seen across all cards (manifest-style)

The existing five derived files (`cards.json`, `programs.json`, etc.) are unchanged. The engine continues to read them; the soul data is available alongside but unused until the engine refactor.

### Migrate (extends existing script)

`scripts/migrate-cards-to-db.ts` gains four new INSERT blocks per card:

1. `card_annual_credits` — replaced from soul if present, fallback to basic
2. `card_insurance` — full replace from soul (no fallback; absent = no insurance rows)
3. `card_program_access` — full replace from soul
4. `card_co_brand_perks` — fan out from soul; legacy `ongoing_perk` rows cleared when soul present
5. `card_absent_perks` — full replace from soul

Per-card transactions stay; per-card rollback on validation failure stays. Idempotent.

### Verify (new script)

`scripts/verify-cards-soul-parity.ts` reads every `cards/*.md`, parses soul sections, fetches the corresponding rows from Postgres, and emits a parity report:

```
$ npm run db:verify-cards-soul

Parity report — 2026-05-01 14:32 UTC
amex_platinum: ✅ 11 credits / 12 insurance kinds / 12 programs / 9 perks / 7 absent
chase_sapphire_reserve: ✅ ...
amex_gold: ⚠️  insurance.cell_phone_protection caps differ (markdown: $800/$50, db: null)
...

Drift detected on 1 card. See parity-report.md for diff details.
```

Run before any deploy that depends on soul data being current.

### Engine (deferred)

No changes this round. Engine continues to read `data/*.json`. Once 30-50 cards are enriched, we revisit `lib/engine/scoring.ts` to use insurance richness, status grants, and absent-perk penalties.

## Worked example: amex_platinum

The five enrichment reports we produced map to the new format like this:

| Report section | Markdown section | Postgres table |
|---|---|---|
| `card_credit_score` | `card_soul.credit_score` | `cards.credit_score_required` (text) + jsonb in `cards.raw` |
| `card_annual_credits` table | `card_soul.annual_credits` | `card_annual_credits` |
| `card_insurance` YAML | `card_soul.insurance` | `card_insurance` (one row per coverage_kind) |
| `card_program_access` table | `card_soul.program_access` | `card_program_access` (one row per program) |
| `card_co_brand_perks` YAML | `card_soul.co_brand_perks` | `card_co_brand_perks` (fanned out) |
| `card_absent_perks` YAML | `card_soul.absent_perks` | `card_absent_perks` |
| `transfer_partner_sweet_spots` | (not card-scoped — lives on `program_transfer_partners.sweet_spots`) | program-side, separate enrichment task |
| `Conflicts found` + `Diff vs current markdown` + `Fetch log` | `card_soul.fetch_log` (compressed) | not persisted |

## Open questions before we start merging

1. **Should soul sections live in the same `cards/<card_id>.md` file, or a sibling `cards/<card_id>.soul.md`?** Recommend same file. Discoverability + git-blame coherence.
2. **YAML vs JSON in soul sections?** JSON for parser consistency. We considered YAML for human-friendliness; rejected because the existing parser is JSON-only and we don't want to fork it.
3. **Should `card_soul.fetch_log` be required?** Recommend optional. It's an editorial trail; not every enrichment will produce one.
4. **Do we want a `card_soul.confidence_summary` aggregate field?** Recommend NO — it's derivable from the per-field confidences.

## Approval criteria

This proposal is approved when:

1. The five existing enrichment reports under `enrichment-reports/` map cleanly into the section shapes above (✅ verified during this proposal pass).
2. Adding the soul sections to a card does not break `npm run cards:build` (✅ designed as additive).
3. The Postgres column shapes match (✅ verified against `0001_init_catalog.sql`).
4. The migrate script extension is mechanical (no transform magic) (✅ designed as fan-out).
5. The verify script gives a clear yes/no parity answer (✅ specified).

If you sign off, step 2 (vertical slice on amex_platinum) starts immediately.
