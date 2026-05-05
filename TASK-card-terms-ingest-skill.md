# TASK: card-terms-ingest skill (Cowork plugin) + disclosures schema/component

> Build a Cowork plugin skill that processes a credit card issuer's official Terms & Conditions URL into structured `cards/*.md` data — handling both greenfield (new card) and update (existing card) scenarios. Ships alongside a new `disclosures` schema block, a `<DisclosuresSection>` component rendered visibly under the identity strip, and a fix to `EarningRateRow` so the empty-exclusions fallback string never renders.

## Context

The v3 redesign established the per-card page as official-source-driven (Citi T&C is the source of truth for earning rates, exclusions, fees). Populating the markdown by hand is slow and error-prone — the Strata Premier rollout left five earning rows with empty `exclusions` because we only had the supermarket paragraph in the conversation, and the page falls back to "No additional exclusions in the card terms." which is wrong for those rows.

This skill turns the T&C URL into the upstream of the card data pipeline. Run once → produce a complete factual layer (earning rates with verbatim exclusions, signup bonus, annual credits, recurring credits, ongoing perks tagged as `source.type: "issuer"`, issuer rules references, disclosures block). Run again later → diff against existing data, produce a curator-approved patch, never silently overwrite editorial fields.

Two complementary changes ship in the same TASK because the skill can't deliver clean output without them: the `disclosures` block (so the skill has a place to write penalty APR, late fees, BT/CA fees) and the `EarningRateRow` fix (so the skill's empty-exclusions case for the catch-all "1 pt on all other purchases" row doesn't display the fallback string).

The page-side disclosures section sits under the identity meta line and above `<CardArrivalHero>`. Always visible, no expand — users comparing transfer fees across cards (3% vs 5%) need this info on first scan.

Future sister skill `network-benefits-ingest` will process mastercard.com / visa.com / amexnetwork.com pages with `source.type: "network"`. Out of scope for this TASK.

## Requirements

1. **Schema addition in `scripts/lib/schemas.ts`.** New optional top-level `disclosures` block on the `Card` schema:

   ```ts
   disclosures: z
     .object({
       cash_advance_apr_pct: z.number().nullable().optional(),
       penalty_apr_pct: z.number().nullable().optional(),
       intro_apr_pct: z.number().nullable().optional(),
       intro_apr_period_months: z.number().nullable().optional(),
       late_payment_fee_max_usd: z.number().nullable().optional(),
       returned_payment_fee_max_usd: z.number().nullable().optional(),
       balance_transfer_fee: z.string().optional(),
       cash_advance_fee: z.string().optional(),
       source: Source,
     })
     .optional(),
   ```

   Fee shapes (`balance_transfer_fee`, `cash_advance_fee`) are strings because Citi/Chase/Amex express them in mixed natural language ("5% or $5, whichever is greater"). Numerical fields stay numeric. `intro_apr_*` are captured but NOT rendered in v1 (kept for completeness so future BT-recommendation features have the data).

2. **New component `components/wallet-v2/DisclosuresSection.tsx`** — server-renderable. Reads `card.disclosures`. Renders a two-column grid below the identity meta line:

   ```
   COSTS TO KNOW                                    Source: Citi terms
     Cash advance APR    29.99%       Late payment fee    up to $41
     Penalty APR         up to 29.99% Returned payment    up to $41
     Balance transfer    5% ($5 min)  Cash advance fee    5% ($10 min)
   ```

   Layout: 2-column desktop, stacked single-column mobile (≤600px). Muted typography (use `--ink-2` / `--ink-3`, no green). Tabular-nums on the value column. Source link at top-right of the section header (anchor with `target="_blank"`). Returns null when `card.disclosures` is undefined.

   Render order in `CardHero.tsx`: insert directly after the identity `<header>` element, BEFORE `<CurrencyPanel />`. Update the existing top-to-bottom comment in CardHero to reflect this.

3. **Fix `EarningRateRow.tsx`** — when `entry.exclusions` is empty/undefined, render the expand body WITHOUT the "No additional exclusions in the card terms." paragraph. The expand body in that case shows only the source link. The row is still expandable; we never hide the source. Remove the `exclusionsText` const and the unconditional paragraph render — only render the `<p className="earning-rate-exclusions">` when non-empty content exists.

4. **CSS additions in `app/wallet-edit-v2.css`.** New classes for `.disclosures-section`, `.disclosures-section-head`, `.disclosures-section-source`, `.disclosures-grid`, `.disclosures-row`, `.disclosures-label`, `.disclosures-value`. Match the calm/muted typography of `.earning-section` but with no green tint (this is risk-side, not value-side). Mobile breakpoint at 600px collapses the grid to a single column.

5. **Scaffold the Cowork plugin `card-terms-ingest`.** Use the `cowork-plugin-management:create-cowork-plugin` skill if available; otherwise create the plugin's source files at `~/cowork-plugins/card-terms-ingest/` and follow the standard Cowork plugin layout. Final structure:

   ```
   card-terms-ingest/
     plugin.json                          # plugin manifest
     skills/
       card-terms-ingest/
         SKILL.md                         # router (req 6)
         adapters/
           citi.md                        # Citi T&C parser (req 7)
         workflows/
           greenfield.md                  # new-card flow (req 8)
           update.md                      # diff/merge flow (req 9)
         schemas/
           field-mapping.md               # T&C concept → cards/*.md fields (req 10)
         examples/
           citi_strata_premier_2026-05-04/
             source-url.txt               # the T&C URL used at fixture capture
             raw-extract.json             # parser output (regression fixture)
             expected-card.md             # the markdown the skill should produce
   ```

6. **`SKILL.md` (router)** — top-level entry. Frontmatter fields:

   - `name: card-terms-ingest`
   - `description:` lists trigger phrases ("ingest the [card] terms," "process this T&C," "update [card] from the latest terms"), URL patterns matching `online.citi.com/US/ag/cards/displayterms`, `creditcards.chase.com/.../rates-and-fees`, `americanexpress.com/.../cmaagree`, and the supported issuers.

   Body of SKILL.md tells Claude to:

   1. Detect issuer from URL host pattern. Citi for v1; Chase / Amex are stub adapters (call out to a TODO file).
   2. WebFetch the URL. If WebFetch fails, surface the error and stop — no fallbacks.
   3. Determine card_id via the user prompt + URL inspection. If ambiguous, ASK the user before proceeding.
   4. Detect scenario: if `cards/{card_id}.md` exists in the user's selected `perks` repo, dispatch to `workflows/update.md`. If not, dispatch to `workflows/greenfield.md`.
   5. After the workflow writes/diffs, run `npm run cards:build` from the `perks` repo. If validation fails, roll back the markdown changes and surface the Zod error to the user. Never leave the repo in an invalid state.
   6. Report a summary: fields written, fields verified-unchanged, fields needing curator action.

7. **`adapters/citi.md` (Citi T&C parser)** — the canonical parsing rules for Citi's `displayterms` page. Document:

   - Section detection — the T&C is divided into Pricing Information, Bonus Point Offer, Definitions of Bonus Categories, How You'll Earn (sometimes), Your Reward Benefits, and a Penalty/Fee table.
   - Pairing rule — every "Bonus Point Offer" summary line matches to a paragraph in "Definitions of Bonus Categories" by category keyword (Restaurants → Restaurants:, Supermarkets → Supermarkets:, etc.). Document the keyword-pairing strategy as a table.
   - Field-by-field extraction notes:
     - Annual fee → from the Pricing Information table, "Annual Fee" row.
     - Foreign tx fee → from Pricing Information, "Foreign Transactions" row, parsed as percent.
     - Cash advance APR (fixed) → from Pricing Information, "APR for Cash Advances" row.
     - Penalty APR → from Pricing Information, "Penalty APR" row.
     - Late payment fee max → from the Fees / Penalty Fees table.
     - Returned payment fee max → same table.
     - Balance transfer fee → Fees table, "Transaction Fees — Balance Transfer" row, captured verbatim as a string.
     - Cash advance fee → Fees table, "Transaction Fees — Cash Advance" row, verbatim string.
     - Signup bonus → "Bonus Points Offer" introductory paragraph, extracts amount_pts, spend_required_usd, spend_window_months.
     - Earning rates → Bonus Point Offer summary lines paired with Definitions paragraphs as above.
     - Annual hotel benefit → "Annual Hotel Benefit" or similar named section in Reward Benefits.
     - Reserve $100 Experience Credit → "Reserve Benefits" section under Reward Benefits.
     - Issuer rules references → SUB section's mention of "48-month rule" or "24-month rule" — capture as references; full rule definitions live in `issuer_rules.json`.
   - Self-validation gates:
     - Every Bonus Point Offer summary line MUST pair to a Definitions paragraph. Unmatched → parse failure.
     - Every Definitions paragraph SHOULD consume into an earning entry. Orphan paragraph → parse warning (skill prompts curator).

8. **`workflows/greenfield.md` (new-card flow)** — instructs Claude to:

   1. Run the parser per the issuer adapter.
   2. Build the new `cards/{card_id}.md` with every parser-derived field populated. `data_freshness` and per-field `source.verified_at` set to today's date (read from the `bash date` tool, not Claude's training prior).
   3. Stub editorial fields with `<!-- TODO: ... -->` HTML comments inside the JSON block where the field is expected. Editorial fields list: `card_intro`, `value_thesis`, `feeder_pair`, `card_plays` (empty array OK), `cold_prompts` (empty array OK), `category` (best-guess from card name + ask user to confirm), `best_for`, `synergies_with`, `competing_with_in_wallet`, `breakeven_logic_notes`.
   4. Write a `RESEARCH_NOTES.md entries` block at the bottom listing what's still needed: programs.json data (transfer partners, sweet spots, cpps), card art, editorial copy.
   5. Run `npm run cards:build`. If validation fails, surface the error and DO NOT leave the broken markdown in place.
   6. Report: "Wrote `cards/{card_id}.md`. Populated N factual fields. Curator owes M editorial fields — see `RESEARCH_NOTES.md entries` block."

9. **`workflows/update.md` (diff/merge flow)** — instructs Claude to:

   1. Run the parser per the issuer adapter.
   2. Read the existing `cards/{card_id}.md`.
   3. Diff the parsed data against the existing markdown, field-by-field. Categorize each field as:
      - **Unchanged** (same value): auto-bump `source.verified_at` to today silently. Do not surface in the diff doc.
      - **Changed** (different value): include in the diff with before / after.
      - **New in T&C, missing from card**: include in the diff for review.
      - **In card but missing from T&C**: include in the diff with an "INVESTIGATE" tag — almost always a Mastercard network benefit moved to a different doc, never a real removal. The skill MUST NOT auto-remove these.
   4. Produce a diff document in this format and present to the user in chat:

      ```
      # {card.name} — T&C update
      # Source: {url}
      # Fetched: {today}

      ## Changed (N)
      - {field}: {before} → {after} [apply?]
      - ...

      ## New in T&C, not in card (M)
      - {field}: {value} [add?]
      - ...

      ## In card but missing from T&C (K) — INVESTIGATE
      - {field}: {existing_value}
        Likely reason: ...
      - ...

      ## Auto-applied: {V} fields' verified_at bumped to {today}
      ```

   5. Wait for the user to approve which deltas to apply. Default behavior: nothing auto-applied except the verified_at bumps.
   6. Apply the approved deltas to `cards/{card_id}.md`. Preserve formatting (don't reflow JSON unnecessarily).
   7. Run `npm run cards:build`. Roll back on validation failure.
   8. Report: "{card.name} updated. {X} deltas applied, {Y} fields verified unchanged, {Z} items left for curator investigation."

10. **`schemas/field-mapping.md`** — reference table of T&C-field-name → `cards/*.md` schema-path. Used by the adapter and workflows. Single canonical document so adapters stay consistent. Lists every field the skill writes, with the source-section name from the T&C and the destination JSONPath in the card markdown.

11. **Regression fixture `examples/citi_strata_premier_2026-05-04/`.** Three files:

    - `source-url.txt` — the URL the fixture was captured from (recorded for forensic purposes; the URL itself may have rotated session tokens by re-fetch time).
    - `raw-extract.json` — what the adapter pulled out of the page, in the structure the workflow consumes. Captured by running the skill once and snapshotting the intermediate.
    - `expected-card.md` — the markdown the skill produces from `raw-extract.json`. Should match the current `cards/citi_strata_premier.md` byte-for-byte for the factual layer (earning, signup_bonus, annual_credits, recurring_credits, ongoing_perks issuer-typed entries, disclosures, issuer_rules), modulo the editorial fields that weren't authored by the skill.

    The fixture is a regression target: future skill changes can run against `raw-extract.json` and assert the output matches `expected-card.md`. Catches accidental skill regressions without requiring a live T&C re-fetch.

12. **Test the skill end-to-end** by running it on Citi Strata Premier in update mode against the existing markdown:

    - Skill should produce a diff doc with 0 changed fields, 0 new fields, 1 INVESTIGATE entry (the Reserve passive companions ongoing_perks entry has been hand-edited to split out the $100 — the skill might flag this depending on how generously it pairs entries; document the expected behavior in the example fixture).
    - 5 earning rows whose `exclusions` were empty (everything but supermarkets) should be populated by the parser. After the curator approves, the markdown's earning entries all carry their verbatim T&C exclusion paragraphs.
    - Disclosures block populated with cash_advance_apr_pct, penalty_apr_pct, late_payment_fee_max_usd, returned_payment_fee_max_usd, balance_transfer_fee, cash_advance_fee, source.

## Implementation Notes

- The plugin source lives outside the `perks` repo. Standard Cowork-plugin convention: a directory under the user's plugin-development workspace, registered with Cowork via the plugin manifest. Use the `cowork-plugin-management:create-cowork-plugin` skill to scaffold; it knows the canonical install path.
- The skill itself does not need to be tested by `npm test` — it's a Claude-side runtime artifact, not application code. The application-side changes (schema, components, CSS) ARE tested by the existing test suite + a new test for `DisclosuresSection`.
- Add a snapshot test for `DisclosuresSection` rendering at `tests/components/disclosuresSection.test.tsx` if vitest's React testing environment is set up. If not, skip the test and rely on `npm run typecheck` + visual verification.
- The Citi adapter doesn't need a real HTML parser. WebFetch returns markdown-converted text; the adapter's pattern matching works on the converted form. Document in `adapters/citi.md` what the converted form looks like, with examples.
- The fee fields (`balance_transfer_fee`, `cash_advance_fee`) are strings rather than structured objects because Citi expresses them as natural-language sentences ("5% or $5, whichever is greater"). Future schema enrichment can introduce structured `{percent, min_usd, max_usd}` if needed; the string is the conservative v1 shape.
- The skill should NEVER edit `programs.json`, `issuer_rules.json` (full rule definitions), `perks_dedup.json`, or any file other than `cards/{card_id}.md`. The factual layer is the scope.
- Removed-from-T&C items (req 9 step 3 last bullet) are almost always Mastercard / Visa / underwriter-side perks the skill has no authority over. Hard rule: skill never deletes those. The diff doc says "INVESTIGATE" and the curator decides.
- For the `<DisclosuresSection>` source link, use the same `target="_blank" rel="noopener noreferrer"` pattern as `EarningRateRow` and `RecurringCreditCard`.

## Do Not Change

- `lib/engine/**` — engine remains a pure function. No skill output reaches the engine; it reaches the schema layer.
- `lib/data/loader.ts`, `lib/data/serialized.ts` — schema additions in `scripts/lib/schemas.ts` flow through automatically.
- `lib/db.ts`, `lib/profile/**`, `app/(app)/layout.tsx` — out of scope.
- `app/(app)/wallet/cards/[id]/page.tsx` — route file unchanged.
- `components/wallet-v2/CardArrivalHero.tsx`, `EarningSection.tsx` (other than EarningRateRow per req 3), `RecurringValueSection.tsx`, `RecurringCreditCard.tsx`, `ValueThesisHero.tsx`, `FeederPairBlock.tsx`, `CurrencyPanel.tsx`, `OpenedAtPill.tsx`, `CatalogGroup.tsx`, `MoneyFindRow.tsx`, `MechanicsZone.tsx`, `ManageCardDisclosure.tsx`, `SignalsEditor.tsx` — all stay.
- `data/*.json` — never edit by hand. Always go through `npm run cards:build`.
- `cards/*.md` other than the markdown the skill modifies (Strata Premier in the test scenario; whatever card_id the user invokes the skill against in production).
- `programs.json`, `issuer_rules.json`, `perks_dedup.json`, `destination_perks.json` — the skill is forbidden from editing these. Errors out if a workflow attempts it.
- The editorial fields enumerated in req 8 step 3 — the skill stubs them on greenfield, never overwrites them on update.
- The `?new=1` add-card flow, the auth gate, the rules engine — out of scope.

## Acceptance Criteria

- [ ] `npm run cards:build` passes with the new `disclosures` schema field.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] `npm test` passes — no test breakage from the schema addition.
- [ ] On `/wallet/cards/citi_strata_premier`, after the curator (or skill) populates `card.disclosures` for Strata Premier, the DisclosuresSection renders directly under the identity strip with all six fields visible in the two-column grid, source link top-right, no green tint.
- [ ] The "No additional exclusions in the card terms." string is gone from the codebase. `grep -r "No additional exclusions"` returns zero hits in `components/`.
- [ ] The Cowork plugin `card-terms-ingest` is installed and invocable. Trigger phrase test: typing "ingest the Citi Strata Premier terms at <URL>" loads the skill.
- [ ] Skill end-to-end test: running the skill against `cards/citi_strata_premier.md` (existing) in update mode produces a diff doc that:
  - Shows the 5 unauthored `exclusions` fields (airlines, hotels_other, restaurants, gas_stations_ev_charging, hotels_cars_attractions_citi_travel) as "Changed" (empty → verbatim T&C paragraph).
  - Shows the new `disclosures` block as "New" (curator approval required).
  - Lists the issuer-tagged ongoing_perks as "Verified unchanged."
  - Does NOT list any Mastercard-network perks (Lyft, Peacock, Instacart, Luxury Hotels & Resorts) as "removed" — they're tagged `source.type: "network"` and the Citi adapter ignores them.
- [ ] Greenfield smoke test: pick any Citi card NOT in `cards/` (e.g., `citi_strata_elite` if absent) and run the skill against its T&C URL. Skill produces a complete factual-layer markdown, stubs editorial fields with TODOs, runs `cards:build` cleanly.
- [ ] Regression fixture `examples/citi_strata_premier_2026-05-04/` exists with all three files. Future skill runs can diff against `expected-card.md` to detect skill regressions.
- [ ] `git diff` in the perks repo shows changes ONLY in: `scripts/lib/schemas.ts`, `cards/citi_strata_premier.md` (only the curator-approved deltas from the end-to-end test), `components/wallet-v2/CardHero.tsx`, `components/wallet-v2/EarningRateRow.tsx`, `app/wallet-edit-v2.css`, plus the new `components/wallet-v2/DisclosuresSection.tsx`. No other application files modified.
- [ ] Plugin source is in the Cowork plugin workspace (path determined by `create-cowork-plugin`), NOT inside the perks repo.

## Verification

1. Run `npm run cards:build`. Confirm validation passes.
2. Run `npm run typecheck && npm run build && npm test`.
3. Start dev server (`npm run dev`). Visit `/wallet/cards/citi_strata_premier`. Confirm:
   - DisclosuresSection visible right under the identity strip, two-column grid on desktop.
   - On a narrow viewport (≤600px), grid collapses to single column.
   - Source link in DisclosuresSection opens the Citi T&C URL in a new tab.
   - EarningRateRow expand on the catch-all "1 pt on all other purchases" row shows ONLY the source link, not the fallback string.
4. Install the `card-terms-ingest` plugin in Cowork. Start a fresh Cowork session. Type: "ingest the Citi Strata Premier terms at <URL>" and confirm the skill loads.
5. Run the end-to-end update test from the Acceptance Criteria. Confirm the diff doc matches expectations.
6. Run the greenfield smoke test against a Citi card not in the catalog. Confirm the markdown is produced and `npm run cards:build` succeeds.
7. `git diff --stat` in the perks repo. Confirm only the listed files are touched.
