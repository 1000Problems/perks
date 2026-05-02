# Prompt — enrich N cards with soul and deploy them end-to-end

For Claude Code (or any agent with `WebFetch`, `WebSearch`, `Read`, `Write`, `Bash`). Paste this into a fresh session along with the list of `card_id`s to process.

## What this workflow does

For every `card_id` in the input list:

1. Reads `cards/<card_id>.md` to capture current state.
2. Performs WebFetch-grounded research per `cards/_PROMPT_ENRICH_SOUL.md` (the per-card schema spec).
3. Appends the 6 `card_soul.*` markdown sections to `cards/<card_id>.md`.

Then deploys all enriched cards in one batch:

4. `npm run cards:build` — Zod-validates every card.
5. `npm run db:migrate-cards` — upserts to Postgres (per-card transactions; idempotent).
6. `npm run db:verify-cards-soul` — confirms DB matches markdown.
7. `npm run cards:soul-status -- --md` — refreshes `cards/_SOUL_STATUS.md`.

## Input format

The user will provide a list:

```
ENRICH AND DEPLOY:
- amazon_prime_visa
- apple_card
- capital_one_venture
```

`card_id` matches the filename under `cards/` (without `.md`).

## Pre-flight

Run from the repo root: `/Users/angel/1000Problems/perks`.

Confirm `DATABASE_URL_DIRECT` is set:

```bash
grep -c '^DATABASE_URL_DIRECT=' .env.local
```

Should print `1`. If not, run `bash scripts/setup-db-direct.sh` first (or paste the unpooled Neon URL into `.env.local` manually).

Read `cards/_PROMPT_ENRICH_SOUL.md` once to internalize the schema, source hierarchy (`high | medium | low | no_source`), `ease_score` heuristic, and the controlled vocab for `program_id` (centurion_lounge_network, fhr, chase_the_edit, priority_pass_select, etc.).

## Per-card loop

For each `card_id`:

### 1. Inspect current state

```bash
ls cards/<card_id>.md
```

If missing, mark the card `status: missing_markdown` and continue to the next.

Read `cards/<card_id>.md`. Note the existing `cards.json entry` (current AF, earning, signup bonus), `RESEARCH_NOTES.md entries`, and any soul sections already present (re-enrichment is OK; replace, don't duplicate).

### 2. WebFetch the issuer's primary card URL

The URL is in the `sources` array of the existing `cards.json entry`. If that 404s, run a `WebSearch` for `"<card name> official page site:<issuer-domain>"` and use the canonical URL.

If both fail, mark the card `status: blocked` and continue.

Common issuer URL patterns:
- Chase: `https://creditcards.chase.com/rewards-credit-cards/<family>/<card>`
- Amex: `https://www.americanexpress.com/us/credit-cards/card/<card>/`
- Capital One: `https://www.capitalone.com/credit-cards/<card>/`
- Apple Card: `https://www.apple.com/apple-card/`
- Amazon Prime Visa: `https://www.amazon.com/gp/cobrandcard/marketing.html`

### 3. WebFetch one Tier 2 cross-check

Frequent Miler preferred (`https://frequentmiler.com/...`). If their slug 404s, `WebSearch site:frequentmiler.com <card name>` to find the canonical. Otherwise WalletHub or Doctor of Credit.

### 4. WebSearch refresh-watch

`WebSearch "<card name> 2026 changes"` — catch issuer-side refreshes (new credits, AF moves, status grants added/removed).

### 5. Compose the 6 soul sections

Per `_PROMPT_ENRICH_SOUL.md`:

```
## card_soul.credit_score      — JSON object
## card_soul.annual_credits    — JSON array (rich, with ease_score + realistic_pct)
## card_soul.insurance         — JSON object keyed by coverage_kind
## card_soul.program_access    — JSON array (include not_available rows for major missing programs)
## card_soul.co_brand_perks    — JSON object with named perk groups
## card_soul.absent_perks      — JSON array
## card_soul.fetch_log         — fenced ``` (not json) block, free-form
```

Every populated field carries a `source` (quoted excerpt + URL) and `confidence` (`high | medium | low | no_source`). Insurance fields where the GTB PDF wasn't directly extractable get `confidence: medium`.

### 6. Append to the card markdown

Add the new sections AFTER the existing `## RESEARCH_NOTES.md entries` section. Do not touch the existing `cards.json entry`, `programs.json entry`, `issuer_rules.json entry`, `perks_dedup.json entries`, or `destination_perks.json entries` blocks.

If the card already has soul sections (re-enrichment), replace them in place, don't duplicate.

### 7. Validate JSON locally

Quick parse check:

```bash
node -e '
const fs = require("fs");
const md = fs.readFileSync("cards/<card_id>.md", "utf8");
const lines = md.split("\n");
let inSoul = null, inFence = false, buf = [], errors = [];
for (const line of lines) {
  if (line.startsWith("## card_soul.")) { inSoul = line.replace("## ", "").trim(); inFence = false; buf = []; continue; }
  if (line.startsWith("## ")) { inSoul = null; continue; }
  if (!inSoul) continue;
  if (line.startsWith("```json")) { inFence = true; buf = []; continue; }
  if (line.startsWith("```") && inFence) { try { JSON.parse(buf.join("\n")); } catch (e) { errors.push(`${inSoul}: ${e.message}`); } inFence = false; buf = []; continue; }
  if (inFence) buf.push(line);
}
if (errors.length) { console.error("FAIL:"); errors.forEach(e => console.error("  -", e)); process.exit(1); }
console.log("OK");
'
```

If errors, fix the JSON in the markdown and re-check.

## Deploy (after all cards processed)

### 8. Build

```bash
npm run cards:build
```

This runs Zod on every card. If it errors, the message names the card and the schema path. Fix and re-run until clean.

### 9. Migrate to Postgres

```bash
npm run db:migrate-cards
```

Watch per-25-cards progress. The script writes a report to `scripts/migrate-cards-to-db.report.md` listing every card's outcome (`inserted | updated | skipped` with reason). Per-card transactions: a broken card gets reported and skipped, the run continues.

If any of the cards being enriched in this batch end up `skipped`, read the reason in the report and fix. Re-run is safe (idempotent).

### 10. Verify parity

```bash
npm run db:verify-cards-soul
```

Reads markdown soul sections, queries Postgres, diffs them. Each enriched card should print `✅ clean`. If any prints `❌`, the report at `scripts/verify-cards-soul-parity.report.md` shows exactly which field drifted.

Exit code 1 means drift; exit code 0 means clean. Don't proceed past drift — investigate.

### 11. Refresh status

```bash
npm run cards:soul-status -- --md
```

Updates `cards/_SOUL_STATUS.md` with the new merged count. Pure read; no side effects.

## Final summary

Print this to the user:

```
Cards enriched:    <list of card_ids that completed all steps>
Cards blocked:     <list with reason>
Build:             passed | failed
Migrate:           X inserted, Y updated, Z skipped (of N total)
Verify:            N/M clean
Status:            <previous merged count> → <new merged count> of <total>
```

## Rules

- **No fallback to training data.** Every populated field cites a fetched URL.
- **Source hierarchy (locked):** issuer page > issuer GTB PDF > Frequent Miler > TPG/UP/OMAAT > Reddit. When sources conflict, trust the issuer.
- **Confidence honest:** if a value can't be sourced, `null` with `confidence: no_source`.
- **Don't edit `cards.json entry` blocks.** Soul is purely additive.
- **Don't write to `data/` or `db/`.** Always go through `npm` scripts.
- **PDF gotcha:** Chase GTB PDFs come back binary-corrupted via `WebFetch`. Fall back to issuer benefits HTML page, mark insurance `confidence: medium`.
- **Halt on issuer-page failure.** If WebFetch fails for a card's primary issuer page, mark `blocked` for that card and continue. Don't hallucinate from Tier 2 alone.

## Failure recovery cheatsheet

| Failure | Next step |
|---|---|
| `cards:build` Zod error | Read the error path; it names the card + field. Fix in markdown, re-run. |
| `db:migrate-cards` says `cards_currency_earned_fkey` violation | The currency_earned program isn't seeded. The `synthesizeStubPrograms` step should auto-create stubs. If still failing, the program_id is malformed. |
| `db:migrate-cards` says `card_program_access_program_id_fkey` violation | A program_id in soul.program_access references something not in the controlled vocab. Check `SOUL_PROGRAM_TYPE_HINTS` in `scripts/migrate-cards-to-db.ts`. |
| `db:verify-cards-soul` exits 1 | Drift between markdown and DB. Read `scripts/verify-cards-soul-parity.report.md`. Most common cause: re-running migrate after editing markdown without first running cards:build (data/ JSON went stale). Fix: `npm run cards:build && npm run db:migrate-cards && npm run db:verify-cards-soul`. |
| Connection drops during migrate | Confirm `DATABASE_URL_DIRECT` is set (unpooled URL). The pooled URL trips Neon's idle-in-transaction timeout. |

## What this workflow is NOT for

- Adding a new card from scratch — use `cards/_PROMPT_NEW_CARD.md` for that, then come back here for enrichment.
- Editing existing card basics (AF, earning, signup bonus) — those live in `cards.json entry` and require manual editing + cards:build.
- Bulk re-enriching the entire catalog — fine in principle but token-heavy. Process in batches of 3-10.
