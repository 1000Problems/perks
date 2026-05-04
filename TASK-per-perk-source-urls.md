# TASK: Per-perk source URLs — Strata Premier pilot

> Add a `source` object to every entry in `annual_credits` and `ongoing_perks`. Backfill the 17 perks on Strata Premier with verified URLs. Render an inline ⓘ link next to each perk title on the card detail page so users can click through to the canonical source. Add a one-shot validator script that HEAD-checks every URL and reports broken ones.

## Context

Today the `cards/*.md` markdown carries a top-level `cards.sources` array (2-5 URLs that justify the card overall) and `card_plays[].source_urls` (citations on each money-find play). The fields between — `annual_credits` and `ongoing_perks` — have no per-entry citation. That gap is the trust signal we want to close: every perk on `/wallet/cards/[id]` should let the user click through to the canonical page where the perk is described.

This is the **Strata Premier pilot only.** The other 238 cards keep validating because the new fields are optional. Catalog-wide backfill is a separate TASK; PDF/URL fragility is a separate concern handled by the validator's report rather than blocking deploys.

## Requirements

### 1. Schema additions in `scripts/lib/schemas.ts`

Add a new enum and a reusable `Source` shape near the top of the cards.json section:

```ts
const SourceType = z.enum([
  "issuer",       // citi.com — the bank's own product or T&C page
  "network",      // mastercard.com / visa.com / amex.com network landing
  "underwriter",  // Guide to Benefits PDF, cardbenefitservices.com
  "partner",      // doordash.com, instacart.com, lyft.com partner page
  "community",    // TPG / Frequent Miler — only when nothing official exists
]);

const Source = z.object({
  url: z.string().url(),
  type: SourceType,
  label: z.string().optional(),     // optional display text; UI falls back to hostname
  verified_at: IsoDate.optional(),  // ISO date when a human last hand-checked
});
```

Add `source: Source.optional()` to both `AnnualCredit` and `OngoingPerk`. Optional, so the other 238 cards keep validating.

Single nested `source` object — not `source_url` + `source_type` siblings. Future fields (verification timestamp, label) live together.

### 2. Backfill `cards/citi_strata_premier.md`

Walk every entry in `annual_credits` and `ongoing_perks`. Add a `source` block to each, using the verified URL map below. Stamp `verified_at` to today's date for every entry.

**Annual credits (1):**

| Perk | URL | type |
|---|---|---|
| `$100 hotel credit on $500+ stay via CitiTravel.com` | `https://www.citi.com/credit-cards/citi-strata-premier-credit-card` | issuer |

**Ongoing perks (16):**

| Perk | URL | type |
|---|---|---|
| `Mastercard Luxury Hotels & Resorts` | `https://www.mastercard.com/us/en/personal/find-a-card/credit-card/world-elite-mastercard.html` | network |
| `Citi Entertainment presale tickets` | `https://www.citientertainment.com/` | issuer |
| `Citi Concierge` | `https://www.citi.com/credit-cards/citi-strata-premier-credit-card` | issuer |
| `Trip Delay Protection` | `https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits` | issuer |
| `Trip Cancellation & Interruption` | `https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits` | issuer |
| `Lost or Damaged Luggage` | `https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits` | issuer |
| `MasterRental car insurance` | `https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits` | issuer |
| `Worldwide Travel Accident Insurance` | `https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits` | issuer |
| `Purchase Protection` | `https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits` | issuer |
| `Extended Warranty` | `https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits` | issuer |
| `DoorDash DashPass trial` | `https://www.citi.com/credit-cards/citi-strata-premier-credit-card` | issuer |
| `Lyft monthly credit` | `https://www.lyft.com/mastercard` | partner |
| `Instacart+ trial` | `https://www.instacart.com/p/mastercard-offer` | partner |
| `No foreign transaction fees` | `https://www.citi.com/credit-cards/citi-strata-premier-credit-card` | issuer |
| `Mastercard ID Theft Protection` | `https://mastercardus.idprotectiononline.com/` | network |
| `Citi Quick Lock` | `https://www.citi.com/credit-cards/credit-card-quicklock` | issuer |

**Two design choices reflected in this map:**

- **The 7 protection perks (Trip Delay through Extended Warranty) all share one issuer-hosted URL** — the Citi `citi-strata-premier-travel-benefits` page. The cardbenefits.citi.com Guide-to-Benefits PDFs rotate filenames every release; pointing at the durable Citi-hosted public page avoids URL bitrot.
- **DoorDash DashPass has no published Citi-specific landing page.** The Mastercard World Elite DashPass benefit is described inside the Strata Premier product page. If Mastercard publishes a partner page later, we repoint that one row.

JSON shape on each entry:

```jsonc
{
  "name": "Trip Delay Protection",
  // ...existing fields...
  "source": {
    "url": "https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits",
    "type": "issuer",
    "label": "Citi Strata Premier travel benefits",
    "verified_at": "2026-05-04"
  }
}
```

The `label` field is optional. When omitted, the UI derives a label from the hostname (`citi.com`, `lyft.com`, `mastercardus.idprotectiononline.com`). I've included a label in the example because the Travel Benefits page benefits from a clearer human-readable name; on most rows the hostname-only fallback is fine.

### 3. Validator script `scripts/check-sources.ts`

Standalone script invokable as `npm run cards:check-sources`. Adds to `package.json`:

```jsonc
"scripts": {
  // ...
  "cards:check-sources": "tsx scripts/check-sources.ts"
}
```

Behavior:

1. Walk `cards/*.md`. For each card, parse the `cards.json entry` block (reuse the existing reader in `scripts/build-card-db.ts` if exposed; otherwise read raw and `JSON.parse`).
2. Collect every `source.url` from `annual_credits` + `ongoing_perks` across all cards. Dedupe by URL — the 7 Strata Premier protection perks share one URL; we hit it once.
3. For each unique URL, issue a `HEAD` request with a real-browser User-Agent (Akamai blocks bare curl). Tolerate `200`, `301`, `302`, `304`. Anything else is flagged.
4. Write `data/source-validation.json`:

   ```jsonc
   {
     "checked_at": "2026-05-04T12:34:56Z",
     "results": [
       {
         "url": "https://www.citi.com/credit-cards/citi-strata-premier-credit-card",
         "status": "ok",
         "http_code": 200,
         "checked_at": "2026-05-04T12:34:56Z",
         "last_ok_at": "2026-05-04T12:34:56Z",
         "perks": [
           { "card_id": "citi_strata_premier", "perk_name": "$100 hotel credit on $500+ stay via CitiTravel.com" },
           { "card_id": "citi_strata_premier", "perk_name": "Citi Concierge" }
           // ...
         ]
       }
     ]
   }
   ```

5. Print a tidy report to stdout:

   ```
   [sources] checked 12 unique URLs across 1 card
   [sources] ✓ 12 OK
   [sources] ✗ 0 broken
   ```

   When broken: list each, with the card+perk attribution lines under it.

`data/source-validation.json` is gitignored (joins the rest of `data/` per CLAUDE.md). The markdown is the source of truth; this file is a runtime cache.

**Not in v1:** scheduled GitHub Action, admin UI, Postgres persistence. The user runs the script on demand. We can layer those later when there's volume to justify them.

### 4. UI — inline ⓘ next to each perk title

Find the component that renders each perk row on `/wallet/cards/[id]`. From the existing engine path: `scoreFinds` → returns `ScoredFind[]` with the `play` attached → `CatalogGroup` renders. The play's `value_model` references the perk; the perk's `source` lives on `annual_credits` / `ongoing_perks` in the catalog.

**Routing question to settle in the first 5 minutes of implementation:** how do we get from a play to its source? Two options:

**(a) Cross-reference by name match.** Plays carry `headline` and `name`-equivalent text; we walk `card.annual_credits ∪ card.ongoing_perks` in the renderer and find the entry whose `name` matches. Clean — one source of truth in the markdown.

**(b) Stamp `source` directly on the play in the markdown.** Renderer reads from the play. Simpler at render time but duplicates data.

Default to (a). The mapping is stable inside a card and the helper is 10 lines:

```ts
function findSourceForPlay(card: Card, play: Play): Source | undefined {
  const playKey = (play.headline ?? "").toLowerCase();
  const credit = card.annual_credits.find((c) => playKey.includes(c.name.toLowerCase().slice(0, 12)));
  if (credit?.source) return credit.source;
  const perk = card.ongoing_perks.find((p) => playKey.includes(p.name.toLowerCase().slice(0, 12)));
  return perk?.source;
}
```

Verify the heuristic by inspecting Strata Premier's plays vs. its perks side-by-side; tighten the matcher if needed.

**Render:** add an ⓘ link element to the right of the perk title on every row in `CatalogGroup`. When `source` is `undefined`, render nothing — graceful degradation while we backfill the rest of the catalog.

```tsx
{source && (
  <a
    href={source.url}
    target="_blank"
    rel="noopener noreferrer"
    className="perk-source-link"
    title={`Source: ${source.label ?? hostnameOf(source.url)} — verified ${formatDate(source.verified_at)}`}
    aria-label={`Source for ${perkName} (opens in new tab)`}
  >
    ⓘ
  </a>
)}
```

CSS in `app/wallet-edit-v2.css`:

```css
.perk-source-link {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  font-size: 12px;
  color: var(--ink-3);
  text-decoration: none;
  vertical-align: middle;
  cursor: help;
}
.perk-source-link:hover {
  color: var(--ink-1);
}
```

Tooltip via `title=` for v1 — accessible, cross-platform, no popover library. Upgrade to a real tooltip later if/when the title attribute proves too coarse.

### 5. Prompt updates — out of scope for this TASK

`cards/_PROMPT_NEW_CARD.md` and `_PROMPT_ENRICH_SOUL.md` are explicitly **not** updated here. We're piloting on one card; expanding the research workflow to require these fields on every future card is a follow-on TASK once we know the schema is right.

## Implementation Notes

- **`Source` shape lives in schemas.ts only.** No engine code reads it. UI plumbing is isolated to `CatalogGroup` (or wherever the perk row lives) plus the optional helper. Engine pure-function rule untouched.
- **`scripts/migrate-cards-to-db.ts`** — read it before assuming a SQL migration is needed. If it serializes annual_credits / ongoing_perks as JSONB, `source` lands inside the existing column unchanged. If it has typed columns, add migration `0008_per_perk_source.sql` adding `source_url`, `source_type`, `source_label`, `source_verified_at` columns. My guess: JSONB. We confirm in step one.
- **HEAD requests in the validator.** Several issuers (Citi, Mastercard) return `403` to bare curl due to Akamai. Use `User-Agent: Mozilla/5.0 ...` to bypass. If a URL still 403s with a real UA, fall back to `GET` with the same headers and verify the body isn't a 404 page (rare, but the cardbenefits.citi.com root does this).
- **`verified_at` is human-stamped.** The validator does NOT update this field — it writes its own status to `data/source-validation.json`. Two distinct signals.
- **No Strata or Strata Elite changes.** Pilot is `citi_strata_premier.md` only.

## Do Not Change

- `lib/engine/*.ts` — engine doesn't read sources.
- `cards/_PROMPT_NEW_CARD.md`, `cards/_PROMPT_ENRICH_SOUL.md` — prompt updates are a follow-on TASK.
- The top-level `cards.sources` array — still required, additive.
- `card_plays[].source_urls` — already carries citations on plays. Different shape, different purpose. Don't unify in this TASK.
- `EarningRule` schema — earning rates source from top-level `cards.sources`. Out of scope.
- `cards/citi_strata.md` and `cards/citi_strata_elite.md` — pilot is Premier only.

## Acceptance Criteria

- [ ] `npm run typecheck`, `npm run lint`, `npm test` all pass.
- [ ] `npm run cards:build` parses `citi_strata_premier.md` cleanly with the new schema.
- [ ] All 17 entries (1 annual_credit + 16 ongoing_perks) on `cards/citi_strata_premier.md` carry a `source` block with `url`, `type`, and `verified_at`.
- [ ] `npm run cards:check-sources` reports 12 unique URLs OK, 0 broken.
- [ ] On `/wallet/cards/citi_strata_premier`, every visible perk row has an ⓘ icon next to its title that opens the matching URL in a new tab.
- [ ] Hovering the ⓘ shows a tooltip with the source label and `verified May 2026`.
- [ ] On any other card without a backfilled source, the ⓘ icon does not render — no errors.
- [ ] `git diff` is scoped to: `scripts/lib/schemas.ts`, `cards/citi_strata_premier.md`, `scripts/check-sources.ts` (new), `package.json` (new script entry), `components/wallet-v2/CatalogGroup.tsx` (or the actual row component) + helper, `app/wallet-edit-v2.css`, optionally `db/migrations/0008_per_perk_source.sql` if columns are needed.

## Verification

1. `npm run cards:build` passes — Zod validates the new schema.
2. `npm run typecheck` — no type drift.
3. `npm run cards:check-sources` — all URLs return 200/301/302.
4. Open `/wallet/cards/citi_strata_premier` in the dev app — visually confirm every perk row has an ⓘ that links out and a hover tooltip with the verified date.
5. Open `/wallet/cards/citi_premier` (or any other card) — confirm no ⓘ icons render and no console errors.
6. `git diff --stat` matches the allowed scope.
