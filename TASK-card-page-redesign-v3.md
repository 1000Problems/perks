# TASK: Card detail page v3 — arrival hero, official Earning section, Recurring Value section

> Add three new sections to the top of `/wallet/cards/[id]`: a moment-of-arrival hero, an Earning section sourced verbatim from the Citi T&C, and a Recurring Value section that introduces a new perk shape (`per_event_credit`) for repeatable per-stay credits like the Reserve $100 Experience Credit. Leaves CurrencyPanel, ValueThesisHero, FeederPairBlock, CatalogGroup, MechanicsZone, ManageCardDisclosure, and SignalsEditor untouched.

## Context

The card page (canonical example: `/wallet/cards/citi_strata_premier`) has no headline value moment — it opens straight into the currency panel and value-thesis prose. The brief calls for hero typography on a dollar number. This TASK adds that as `<CardArrivalHero />`.

The current "earning" rows live as five plays in the Cash catalog group (`earn_dining_3x`, `earn_supermarkets_3x`, etc.) with editorial headlines. The user wants those replaced by the exact Citi T&C wording, with each row expanding to show the official exclusions language and a visible source link to the T&C URL. New section above the Catalog: `<EarningSection />`.

The Reserve $100 Experience Credit is currently carried as a single row in `ongoing_perks` valued at `$200`. Re-reading the T&C, this is a **per-stay** credit with no annual cap — a frequent traveler captures $400–$800/year, not $200. We have no schema shape for repeatable per-event credits today. This TASK introduces `recurring_credits[]` on the card schema and a new component `<RecurringCreditCard />` that renders a frequency picker (categorical: 0 / 1-2 / 3-5 / 6+), a live projected annual value, the passive companions (breakfast, upgrade, Wi-Fi, early/late check-in/out) inline as sub-bullets, and a "Show stacking math" expand pinned to a $500 reference stay. New section directly below `<EarningSection />`: `<RecurringValueSection />`.

This is the model that future card pages (Amex Plat FHR, CSR Edit, Capital One Premier Collection, Hyatt Brilliant) will reuse.

## Requirements

1. **Schema additions in `scripts/lib/schemas.ts`:**

   On the existing `EarningRule` schema, add three optional fields:

   ```ts
   official_text: z.string().optional(),
   exclusions: z.string().optional(),
   source: z.object({
     url: z.string().url(),
     type: z.enum(["issuer", "network", "partner", "third_party"]),
     label: z.string(),
     verified_at: z.string(),
   }).optional(),
   ```

   On the Card schema, add a new optional array `recurring_credits`:

   ```ts
   recurring_credits: z.array(z.object({
     id: z.string(),
     name: z.string(),
     headline: z.string(),
     event_label: z.string(),
     value_per_event_usd: z.number(),
     max_events_per_year: z.number().nullable(),
     passive_companions: z.array(z.string()),
     stacks_with: z.array(z.string()).default([]),
     stack_caveats: z.array(z.string()).default([]),
     exclusions: z.string(),
     where_to_book_url: z.string().url().optional(),
     source: z.object({
       url: z.string().url(),
       type: z.enum(["issuer", "network", "partner", "third_party"]),
       label: z.string(),
       verified_at: z.string(),
     }),
   })).optional(),
   ```

2. **Edit `cards/citi_strata_premier.md`** — `cards.json entry` block:

   2a. Replace each entry in the `earning` array with the exact Citi T&C copy. Use this verbatim text for `official_text`:

   - `hotels_cars_attractions_citi_travel` → `"10 ThankYou Points for each $1 spent on hotel, car rental and attraction bookings on the Citi Travel® site via cititravel.com or 1-833-737-1288 (TTY: 711)"`
   - `airlines` → `"3 ThankYou Points for each $1 spent on air travel"`
   - `hotels_other` → `"3 ThankYou Points for each $1 spent on other hotel purchases"`
   - `restaurants` → `"3 ThankYou Points for each $1 spent at restaurants"`
   - `supermarkets` → `"3 ThankYou Points for each $1 spent at supermarkets"`
   - `gas_stations_ev_charging` → `"3 ThankYou Points for each $1 spent at gas and EV charging stations"`
   - `everything_else` → `"1 ThankYou Point for each $1 spent on all other purchases"`

   For each, set `exclusions` to the official Citi T&C exclusion language. Use this verbatim copy for the supermarket entry:

   ```
   Excludes purchases made at general merchandise/discount superstores; freezer/meat locker provisioners; dairy product stores; miscellaneous food/convenience stores; drugstores; warehouse/wholesale clubs; specialty food markets; bakeries; candy, nut, and confectionery stores; and meal kit delivery services. Purchases made at online supermarkets or with grocery delivery services do not qualify if the merchant does not classify itself as a supermarket by using the supermarket merchant code.
   ```

   For categories where the T&C exclusion text is not yet captured in this conversation, set `exclusions: ""` and leave a `<!-- TODO: pull from T&C -->` HTML comment in the markdown (outside the JSON block) listing the categories that still need exclusion text. Do not invent exclusion text.

   On every earning entry, set `source` to:

   ```json
   {
     "url": "https://online.citi.com/US/ag/cards/displayterms?app=UNSOL&HKOP=b5a03a5076668926139dc6d999bcde8adb7310d1f3118cdef81adbb339f30ab0",
     "type": "issuer",
     "label": "Citi Strata Premier card terms",
     "verified_at": "2026-05-04"
   }
   ```

   2b. Add a `recurring_credits` array on the card with one entry:

   ```json
   "recurring_credits": [
     {
       "id": "reserve_experience_credit",
       "name": "The Reserve $100 Experience Credit",
       "headline": "$100 every Reserve hotel stay",
       "event_label": "Reserve hotel stay",
       "value_per_event_usd": 100,
       "max_events_per_year": null,
       "passive_companions": [
         "Daily breakfast for two",
         "Room upgrade (subject to availability)",
         "Complimentary Wi-Fi",
         "Early check-in (subject to availability)",
         "Late check-out (subject to availability)"
       ],
       "stacks_with": ["earn_citi_travel_10x", "hotel_credit_100"],
       "stack_caveats": [
         "Reserve T&C state benefits cannot stack with other Citi offers on the same booking — verify whether the $100 Annual Hotel Benefit can be combined before assuming."
       ],
       "exclusions": "Book at the 'Reserve' rate via CitiTravel.com only. Back-to-back stays at the same hotel within 24 hours count as one stay. Benefits forfeit if unused. Available to Citi Strata Elite, Citi Strata Premier, and Citi Prestige cardmembers.",
       "where_to_book_url": "https://www.citi.com/credit-cards/citi-travel/",
       "source": {
         "url": "https://online.citi.com/US/ag/cards/displayterms?app=UNSOL&HKOP=b5a03a5076668926139dc6d999bcde8adb7310d1f3118cdef81adbb339f30ab0",
         "type": "issuer",
         "label": "Citi Strata Premier card terms",
         "verified_at": "2026-05-04"
       }
     }
   ]
   ```

   2c. In the `ongoing_perks` array, **split** the existing `"The Reserve by Citi Travel"` entry. The $100 experience credit is now expressed by `recurring_credits` above. Replace the existing entry with one that covers ONLY the passive components (breakfast, upgrade, Wi-Fi, check-in/out), set `value_estimate_usd: 60` (breakfast value alone, since the $100 has been lifted out), and update the `notes` to reflect the split. Keep the same source URL.

3. **New component `components/wallet-v2/CardArrivalHero.tsx`.** Sits in `CardHero.tsx` between `<BackLink />` and `<DeadlinesStrip />`. Two pieces:

   - **Hero number** (large typography, 3xl-equivalent): projected annual rewards from the user's spend profile against this card. Compute as `Σ (profile.spend_profile[category] × matching earning[].rate_pts_per_dollar × program.portal_redemption_cpp / 100)` for every category where the user has spend > 0 AND the card has an earning entry. Use `program.portal_redemption_cpp` (cash floor) for the multiplier, NOT `median_redemption_cpp`. If the user has no spend profile (cold start), show `—` and the subline "Add your spend to see projected rewards."
   - **Hero subline** (smaller, muted): `"projected rewards from your spend"` when held; `"projected rewards if you add this card"` when `isNew`.

   Add a tiny pure helper `computeRewardsFromSpend(profile, card, program)` in `lib/engine/cardValue.ts` (or co-located with the existing per-card scoring helpers — Code: locate the most natural insertion point, do not duplicate math the engine already has). Add a unit test in `tests/engine/cardValue.test.ts` that loads the real DB and asserts the helper returns a positive number for a Strata Premier holder with non-zero spend.

4. **New component `components/wallet-v2/EarningSection.tsx`** + child `components/wallet-v2/EarningRateRow.tsx`. EarningSection receives `card.earning[]` and renders one EarningRateRow per entry. Each row:

   - Headline: `entry.official_text` (falls back to a short generated string from `category` + `rate_pts_per_dollar` if `official_text` is missing — every Strata earning entry will have it after req 2a, so this fallback is for other cards mid-rollout).
   - Right-aligned chip: `{rate_pts_per_dollar}× pts/$1` (or `1× pts/$1` for the everything_else row).
   - Click anywhere on the row to expand. Expanded body shows:
     - `entry.exclusions` as a paragraph, OR the string `"No additional exclusions in the card terms."` if `exclusions` is empty.
     - A visible source link rendered as `<a href={source.url} target="_blank" rel="noopener noreferrer">Source: {source.label}</a>` followed by ` · verified {source.verified_at}` in muted text.
   - **No yes/no probe.** This is informational; passive perk shape.

   EarningSection sits in `CardHero.tsx` directly below `<ValueThesisHero />` and above `<FeederPairBlock />`.

5. **New component `components/wallet-v2/RecurringValueSection.tsx`** + child `components/wallet-v2/RecurringCreditCard.tsx`. RecurringValueSection receives `card.recurring_credits[]` and renders one RecurringCreditCard per entry. Each card:

   - Headline (large): `credit.headline` (e.g., "$100 every Reserve hotel stay").
   - Subline below headline: `"Repeats — no annual cap"` when `max_events_per_year === null`, else `"Up to {max} per year"`.
   - **Frequency picker** — chip group with four options labeled `0`, `1–2`, `3–5`, `6+`. Selection persists via the existing `handlePatch` mechanism in `CardHero` against a new signal key `claims.recurring_credit_frequency.{credit.id}` storing the string label. Default selection if no signal exists: `1–2`.
   - **Projected value line** (live): `"Projected: ${midpoint × value_per_event_usd}/year"` where the midpoint per chip is `0 → 0`, `1–2 → 1.5`, `3–5 → 4`, `6+ → 7`. Round to nearest dollar.
   - **Companions list**: render `passive_companions` as a bulleted list with the eyebrow text `"Each stay also includes:"`.
   - **Stacking math expand** — collapsed by default, button labeled `"Show stacking math"`. Expanded body renders a pinned worked example for a $500 Reserve stay using these line items in order:
     - `$500 hotel charge`
     - `– $100 Annual Hotel Benefit (one-time/year)` — value `−$100`
     - `– $100 Reserve Experience Credit (per stay)` — value `−$100`
     - `+ Breakfast (~$60 value), upgrade, Wi-Fi, check-in/out` — value `free`
     - `+ 10× earn on $500 = 5,000 ThankYou pts × {program.median_redemption_cpp}¢` — value computed live from the program's median cpp.
     - Effective cost line, total savings vs cash.
     - Below the math: render `stack_caveats` as a small italic note prefixed with `"Verify: "`.
   - **Where-to-book CTA** — anchor button labeled `"Find Reserve hotels"` linking to `where_to_book_url` with `target="_blank" rel="noopener noreferrer"`. Renders only if `where_to_book_url` is present.
   - **Source link** — visible in the card body (not inside the stacking expand): `<a href={source.url} target="_blank" rel="noopener noreferrer">Source: {source.label}</a>` followed by ` · verified {source.verified_at}` muted.

   RecurringValueSection sits in `CardHero.tsx` directly below `<EarningSection />` and above the catalog `<CatalogGroup />` map.

6. **CardHero.tsx render-tree update.** New top-to-bottom order, with the three new sections inserted:

   ```
   <main>
     <BackLink />
     <CardArrivalHero />              // ← new (req 3)
     <DeadlinesStrip />
     <header className="card-hero-identity">…</header>
     <CurrencyPanel />
     <ValueThesisHero />
     <EarningSection />               // ← new (req 4)
     <RecurringValueSection />        // ← new (req 5)
     <FeederPairBlock />
     {ALL_GROUPS.map(group => <CatalogGroup … />)}
     <MechanicsZone />
     <ManageCardDisclosure>
       <SignalsEditor … />
     </ManageCardDisclosure>
   </main>
   ```

   No other render-order changes. No prop changes to existing components.

7. **Filter the five earn plays out of the Cash CatalogGroup rendering.** The plays `earn_dining_3x`, `earn_supermarkets_3x`, `earn_gas_ev_3x`, `earn_air_hotels_3x`, and `earn_citi_travel_10x` live in `cards/citi_strata_premier.md` under `card_plays` and currently render as rows in the Cash group. Now that `<EarningSection />` carries the official-source version above the Catalog, those five rows must not also appear in Cash. **Do this without deleting from the markdown** — the engine and `lib/engine/foundMoney.ts` may still consume them. Filter at the rendering layer: in `CardHero.tsx` (or wherever plays are bucketed into groups before being passed to CatalogGroup), exclude any play whose `value_model.kind === "multiplier_on_category"`. The `trifecta_pool` play stays in Cash.

8. **CSS additions in `app/wallet-edit-v2.css`** — new classes for the three new sections, matching the calm/dollar-anchored visual language of `.value-thesis-line`. Required selectors (Code may add more as needed):

   - `.card-arrival-hero`, `.card-arrival-hero-number`, `.card-arrival-hero-subline`
   - `.earning-section`, `.earning-rate-row`, `.earning-rate-row[data-expanded="true"]`, `.earning-rate-headline`, `.earning-rate-chip`, `.earning-rate-body`, `.earning-rate-source`
   - `.recurring-value-section`, `.recurring-credit-card`, `.recurring-credit-headline`, `.recurring-credit-frequency`, `.recurring-credit-frequency-chip`, `.recurring-credit-frequency-chip[data-selected="true"]`, `.recurring-credit-projected`, `.recurring-credit-companions`, `.recurring-credit-stacking`, `.recurring-credit-source`, `.recurring-credit-cta`

9. **Rebuild + verify.** `npm run cards:build` succeeds with the updated schema and `citi_strata_premier.md`. `npm run typecheck`, `npm run build`, and `npm test` all pass with zero errors.

10. **Visual check on `/wallet/cards/citi_strata_premier`** with `NEXT_PUBLIC_WALLET_EDIT_V2=1`, in this exact order from top:

    Back link → CardArrivalHero (large dollar number) → DeadlinesStrip → identity header → CurrencyPanel → ValueThesisHero → EarningSection (6 rows, each with a chip on the right, click expands to exclusions + visible source link) → RecurringValueSection (1 Reserve card with frequency picker, projected value updates live as the user taps a chip, companions list, stacking expand, source link, "Find Reserve hotels" CTA) → FeederPairBlock → catalog groups (Cash group has only `trifecta_pool`, the five earn rows are gone) → MechanicsZone → ManageCardDisclosure.

## Implementation Notes

- Route file `app/(app)/wallet/cards/[id]/page.tsx` — no changes expected. Continue passing `serializedDb`, `profile`, `initialHeld`, `userSignals`, `programOverrides` to `CardHero`.
- `CardHero.tsx` — most rendering changes land here. Keep `handlePatch`, `flushPatch`, `queuePatch`, `playState` writers untouched. The frequency picker in `RecurringCreditCard` calls `handlePatch` with the same shape that `OpenedAtPill` and `SignalsEditor` use today — identify the existing signal-write path and reuse it. Pass `userSignals` and `handlePatch` (or whatever the current callback names are) into `RecurringValueSection` so each card can read and write its own frequency signal independently.
- `CardArrivalHero` is server-renderable. The math is pure. Mark it as a server component (no `"use client"`) unless `OpenedAtPill` or another nearby component forces the parent to be client-side.
- `EarningSection` and `EarningRateRow` need client interactivity (expand/collapse), so mark `EarningRateRow` as `"use client"` and keep `EarningSection` as a thin server-render wrapper that maps `card.earning[]` to children.
- `RecurringCreditCard` is fully client (frequency picker, expand state, live computed value). `RecurringValueSection` can be a thin server-render wrapper.
- `program.median_redemption_cpp` for ThankYou is `1.9` (already in `programs.json`). Read it via `db.programById.get(card.currency_earned)` — same pattern `CurrencyPanel` uses.
- For the cold-start case (no spend profile) in `CardArrivalHero`: render `—` and the prompt subline. Don't compute against zeros — that produces $0 which reads worse than "add your spend."
- The default frequency chip selection (`1–2`) must NOT auto-write a signal on first render. Only write when the user explicitly taps a chip. Otherwise we'd invent user intent.
- `lib/engine/foundMoney.ts` reads from `card_plays` — confirm by `grep` that removing the five earn plays from the rendered set (req 7) does not change foundMoney output. The filter happens at rendering, not at the engine layer, so this should hold; verify with `npm test`.
- The catalog group bucketing logic — find where in `CardHero.tsx` (or a helper it imports) plays are grouped by `play.group` and passed to `<CatalogGroup />`. Add the filter there. Reference: req 6 in the v2 task and the `groupedFinds` derivation.
- Strict TypeScript — `card_intro`, `feeder_pair`, `recurring_credits`, and the new `EarningRule` fields are optional. Narrow with `if (!card.recurring_credits || card.recurring_credits.length === 0) return null;` before mapping.
- The user has not yet supplied verbatim T&C exclusion text for categories other than supermarkets. Leave those `exclusions: ""` per req 2a and add a markdown comment outside the JSON block listing what's still needed. Do not paraphrase or invent.
- The `stack_caveats` text in req 2b explicitly flags that we have NOT verified whether the $100 Annual Hotel Benefit and $100 Reserve Experience Credit stack on the same booking. The stacking math expand renders this caveat. Do not assume or assert the stack works.

## Do Not Change

- `lib/engine/**` — engine is a pure function. The `computeRewardsFromSpend` helper added in req 3 is the only engine-touching change permitted, and only if no equivalent helper already exists.
- `lib/data/loader.ts`, `lib/data/serialized.ts` — the database surface stays as-is. Schema additions in `scripts/lib/schemas.ts` are picked up automatically.
- `lib/db.ts`, auth gate `app/(app)/layout.tsx`, profile server actions in `lib/profile/**` — out of scope.
- `app/(app)/wallet/cards/[id]/page.tsx` — route file unchanged; props are correct.
- `components/wallet-v2/CurrencyPanel.tsx` — out of scope. Currency editing stays where it is.
- `components/wallet-v2/ValueThesisHero.tsx` — out of scope. Three-line thesis stays exactly as-is.
- `components/wallet-v2/FeederPairBlock.tsx` — out of scope.
- `components/wallet-v2/CatalogGroup.tsx`, `MoneyFindRow.tsx`, `MechanicsZone.tsx`, `DeadlinesStrip.tsx`, `ManageCardDisclosure.tsx`, `SignalsEditor.tsx`, `OpenedAtPill.tsx` — all unchanged.
- `components/wallet-v2/PerkSourceLink.tsx` — the existing inline ⓘ popover stays for catalog rows. The new visible source-line treatment in EarningRateRow and RecurringCreditCard is a separate pattern; do not merge them.
- `cards/*.md` other than `citi_strata_premier.md` — other cards get `recurring_credits` and earning enrichment in a follow-up TASK.
- `data/*.json` — never edit by hand. Always go through `npm run cards:build`.
- The five earn plays in `card_plays` of `citi_strata_premier.md` (`earn_dining_3x`, `earn_supermarkets_3x`, `earn_gas_ev_3x`, `earn_air_hotels_3x`, `earn_citi_travel_10x`) — do NOT delete from the markdown. Filter at the render layer per req 7.
- `lib/engine/foundMoney.ts` and the rest of `lib/engine/` (other than the optional helper in req 3) — do not refactor.
- The `?new=1` add-card flow — do not touch.

## Acceptance Criteria

- [ ] `npm run cards:build` succeeds with the updated schema and `citi_strata_premier.md`. `data/manifest.json` lists `citi_strata_premier`.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` passes with zero errors.
- [ ] `npm test` passes — engine integration and the new `cardValue` test both green.
- [ ] On `/wallet/cards/citi_strata_premier` (NEXT_PUBLIC_WALLET_EDIT_V2=1) with a logged-in user who has a non-empty spend profile:
  - Hero strip shows a dollar number > $0 and the subline "projected rewards from your spend."
  - Earning section shows 6 rows with the official Citi T&C wording. The supermarkets row, when expanded, shows the verbatim exclusion text in req 2a and a visible "Source: Citi Strata Premier card terms · verified 2026-05-04" link going to the T&C URL.
  - Recurring Value section shows one card titled "$100 every Reserve hotel stay" with a frequency picker. Tapping `3–5` updates the projected line to `Projected: $400/year`. The companions list shows breakfast, upgrade, Wi-Fi, early check-in, late check-out as bullets. Tapping "Show stacking math" reveals the worked $500 example with the "Verify:" caveat. The "Find Reserve hotels" CTA opens CitiTravel in a new tab. The Source link is visible in the card body.
  - Cash catalog group shows only `trifecta_pool` — the five earn rows are gone.
  - All other sections (CurrencyPanel, ValueThesisHero, FeederPairBlock, other catalog groups, MechanicsZone, ManageCardDisclosure) render exactly as before.
- [ ] Frequency picker writes through `handlePatch` and persists across reload.
- [ ] `git diff` shows changes ONLY in: `scripts/lib/schemas.ts`, `cards/citi_strata_premier.md`, `components/wallet-v2/CardHero.tsx`, `app/wallet-edit-v2.css`, plus the five new component files (`CardArrivalHero.tsx`, `EarningSection.tsx`, `EarningRateRow.tsx`, `RecurringValueSection.tsx`, `RecurringCreditCard.tsx`), the new helper in `lib/engine/cardValue.ts` (or wherever Code locates it), and the new test file. No deletions.

## Verification

1. `npm run cards:build` and confirm validation passes.
2. `npm run typecheck && npm run build`.
3. `npm test` — confirm engine integration is green and the new helper test passes.
4. Start the dev server (`npm run dev`) and walk through `/wallet/cards/citi_strata_premier` in three states:
   - Held holder with non-empty spend → CardArrivalHero shows a real number, all three new sections render in order, frequency picker persists through reload.
   - Held holder with empty spend profile → CardArrivalHero shows `—` and the prompt subline.
   - `?new=1` (prospect view) → CardArrivalHero subline reads "projected rewards if you add this card."
5. Tap each Earning row to expand; confirm exclusion text appears for supermarkets and the source link opens the Citi T&C URL in a new tab.
6. Tap the Recurring Credit card's stacking-math expand; confirm the worked example renders with the live cpp number and the "Verify:" caveat is visible.
7. Scroll to the Cash catalog group; confirm only `trifecta_pool` is rendered there.
8. `git diff --stat` — verify only the files in the Acceptance Criteria are modified, plus the new files.
