# TASK: Card detail page v2 — currency panel, card intro, feeder pair, opened-at pill, cleanup

> Tighten `/wallet/cards/[id]` into three zones: identity (with currency + opened-at), the case (intro + value-thesis + feeder pair), and the catalog (unchanged). Adds three structured data shapes (`card_intro`, `feeder_pair`, derived currency summary), promotes the opened-at control out of the disclosure, and removes the section chip row + the bottom CrossCardTile.

## Context

The page currently jumps from the identity strip ("earns Citi ThankYou Rewards" — name only, no story) into a value-thesis block whose `ecosystem_line` only renders when the user already holds the feeder cards (Double Cash / Custom Cash). That's backwards: the most valuable case is when the user *doesn't* hold the feeders, because that's a recommendation. The page also shows a `value-thesis-chips` row that looks clickable but isn't, and a bottom `CrossCardTile` whose work belongs on `/recommendations`. The opening date — which gates AF clock, retention timing, and ThankYou 24-month SUB rules — is buried inside `ManageCardDisclosure`.

This TASK ships the agreed redesign (Cowork conversation 2026-05-04). Catalog groups (Hotels, Airlines, Travel-services, Shopping, Cash, Niche) and `MechanicsZone` are explicitly out of scope.

## Requirements

1. **Add `card_intro` to the Card schema** in `scripts/lib/schemas.ts`, optional during rollout:

   ```ts
   card_intro: z.object({
     positioning: z.string(),
     differentiator: z.string(),
     ecosystem_role: z.string(),
   }).optional()
   ```

2. **Add `feeder_pair` to the Card schema** in `scripts/lib/schemas.ts`, optional during rollout:

   ```ts
   feeder_pair: z.object({
     feeder_card_ids: z.array(z.string()).min(1),
     pair_role: z.enum(["currency_pooler", "category_specialist", "annual_credit_stacker"]),
     value_when_held: z.string(),
     value_when_missing: z.string(),
     recommendation_priority: z.enum(["first", "high", "normal"]).default("normal"),
   }).optional()
   ```

   The `recommendation_priority` field is authored now but consumed by `/recommendations` in a follow-up TASK. This TASK only renders it on the per-card page.

3. **New `CurrencyPanel` component** at `components/wallet-v2/CurrencyPanel.tsx`. Reads the program by `card.currency_earned` from `db.programById` and renders three lines + a partner tag row:
   - Line 1 (cpp): `"Floor {portal_redemption_cpp}¢ in the {issuer} portal. Median {median_redemption_cpp}¢ if you transfer."` — fall back gracefully if either is missing (skip the missing half).
   - Line 2 (partners count): `"Transfers {ratio} to {airlineCount} airlines and {hotelCount} hotels."` Build the counts from `program.transfer_partners` filtered by `type`. If a partner has `notes` containing "Unique to" or "Best 1:1", flag it.
   - Line 3 (unlock): rendered only when `card.value_thesis?.ecosystem_line` is present, regardless of whether the user holds the feeders. Static text from `value_thesis.ecosystem_line.text` works for v1.
   - Partner tag row: airline partners only, alphabetical, with a star marker on any partner whose `notes` contains "Unique to" (e.g., AAdvantage on TY). Hotel partners excluded from the tag row (avoid clutter; they live in the count line).
   - When `currency_earned` is null, render nothing — this is a no-rewards card.

4. **New `CardIntroBlock` component** at `components/wallet-v2/CardIntroBlock.tsx`. Renders the three sentences from `card.card_intro` as three short paragraphs (`<p>` each), no headings, no bullets. When `card_intro` is undefined, render nothing.

5. **New `FeederPairBlock` component** at `components/wallet-v2/FeederPairBlock.tsx`. Always renders when `card.feeder_pair` is defined (not gated by holdings). Two states:
   - **Held state** — when `cards_held` includes ALL `feeder_card_ids` from the pair. Renders `value_when_held` + a single CTA "Set up pooling" linking to the catalog row whose play_id matches `trifecta_pool` (smooth-scroll via `data-play-id`).
   - **Missing state** — when `cards_held` does NOT include every feeder. Renders `value_when_missing` + one inline button per missing feeder card: `"Add {card.name}"` linking to `/wallet/cards/{feeder_id}?new=1`. Feeder names come from `db.cardById.get(feeder_id)?.name`.

   Resolve missing feeders inside the component. Don't precompute outside.

6. **New `OpenedAtPill` component** at `components/wallet-v2/OpenedAtPill.tsx`. Inline element placed under `card-hero-name` inside the identity header. Two states:
   - `opened_at` set → shows `"Got it {Mon YYYY}"` (e.g., "Got it Apr 2024") with an edit affordance that opens an inline month/year picker.
   - `opened_at` null → shows a primary nudge button `"When did you get this card?"` that opens the same picker.

   Picker writes back via the existing `handlePatch` callback in `CardHero` (passes `{ opened_at: "YYYY-MM-01" }`). Reuse the year/month parsing helpers from `SignalsEditor.tsx` (`parseYM` / `setYM`) — extract them to `lib/utils/openedAt.ts` if they aren't already importable.

7. **Re-order and prune `CardHero.tsx` render tree.** The new top-to-bottom order:

   ```
   <main>
     <BackLink />
     <DeadlinesStrip />
     <header className="card-hero-identity">
       <CardArt />
       <div className="card-hero-identity-body">
         <eyebrow>{issuer}</eyebrow>
         <h1>{nickname || name}</h1>
         <CardHeroMeta />          // network · AF · earns {currency name}
         <OpenedAtPill />          // ← new, replaces the buried control
         {isNew && <hero-new-badge>}
       </div>
     </header>
     <CurrencyPanel />             // ← new
     <CardIntroBlock />            // ← new
     <ValueThesisHero />           // ← reused, with chip row removed (req 8)
     <FeederPairBlock />           // ← new
     {ALL_GROUPS.map(group => <CatalogGroup … />)}   // ← unchanged
     <MechanicsZone />             // ← unchanged
     <ManageCardDisclosure>
       <SignalsEditor … />         // ← opened-at row inside REMOVED (req 9)
     </ManageCardDisclosure>
   </main>
   ```

   `HeroAdaptive` is no longer needed as a wrapper — `value_thesis` always renders via `ValueThesisHero` directly. Delete the `HeroAdaptive` component entirely. The `HotHero` and `WarmHero` variants and their `QuickWinTile` helper are also removed (catalog headers carry that load now). Remove the `valueThesis`, `topFinds`, `summary` plumbing in `CardHero` that only fed `HeroAdaptive` — keep `groupedFinds` (catalog still uses it).

8. **Remove the section chip row from `ValueThesisHero.tsx`.** Delete the `<div className="value-thesis-chips">` block and the `sumGroupValue` helper. Keep the eyebrow + three body lines. The component no longer needs the `groupedFinds` prop — drop it from the `Props` interface.

9. **Remove `CrossCardTile`** from `CardHero.tsx` and delete `components/wallet-v2/CrossCardTile.tsx`. Drop the `catalogAnswered` derivation in `CardHero` if it's only consumed there (verify via grep before deletion — it may also feed `heroSummary`).

10. **Hoist opened-at out of `ManageCardDisclosure` → `SignalsEditor`.** In `SignalsEditor.tsx`, remove the opened-date row from the rendered output (the inputs around `parseYM(held.opened_at)` near line 84 and the dual `setYM` updates at lines 156 and 178). The pill on the identity strip is the canonical control. Leave the underlying `held.opened_at` field, the `handlePatch` plumbing, and the persistence path untouched.

11. **Author `card_intro` and `feeder_pair` on Citi Strata Premier** in `cards/citi_strata_premier.md` inside the `cards.json entry` block, using exactly this copy:

    ```json
    "card_intro": {
      "positioning": "Citi's $95 mid-tier travel card with broad 3x earn across the categories most people actually spend on — groceries, gas, dining, air, and hotel.",
      "differentiator": "One of two transferable currencies in America that transfer 1:1 to American AAdvantage.",
      "ecosystem_role": "The card that unlocks transfer-partner access for Citi's no-AF cards. Pool Double Cash and Custom Cash points here to turn cashback into transferable miles."
    },
    "feeder_pair": {
      "feeder_card_ids": ["citi_double_cash", "citi_custom_cash"],
      "pair_role": "currency_pooler",
      "value_when_held": "Pooling Double Cash and Custom Cash points into your Strata Premier converts 2% / 5% cashback into 1:1 transferable points — about a 30% value boost on every dollar.",
      "value_when_missing": "Add Citi Double Cash or Custom Cash next. Their cashback pools into this card and converts to transferable miles — about a 30% boost on every dollar.",
      "recommendation_priority": "first"
    }
    ```

12. **Rebuild the card DB.** `npm run cards:build` must regenerate `data/cards.json` and `data/manifest.json` without schema errors. `npm run typecheck` and `npm run build` must pass.

## Implementation Notes

- Route file `app/(app)/wallet/cards/[id]/page.tsx` — no changes expected. It already passes `serializedDb`, `profile`, `initialHeld`, etc. to `CardHero`.
- `CardHero.tsx` — this is where most rendering changes land. Keep `handlePatch`, `flushPatch`, `queuePatch`, and the play-state writers untouched. The opened-at pill calls `handlePatch({ opened_at })` exactly the way `SignalsEditor` does today.
- `db.programById.get(card.currency_earned)` already returns the typed program with `transfer_partners[]`, `portal_redemption_cpp`, `median_redemption_cpp`. No new loader work.
- Feeder-pair "missing state" buttons must use the existing `?new=1` add-card route. Reference: `components/wallet-v2/EditWalletClient.tsx` line 110 — `router.push(\`/wallet/cards/${card.id}?new=1\` as Route)`.
- "Held state" CTA in `FeederPairBlock` should target the catalog row by `data-play-id="trifecta_pool"`. Add the attribute on the existing `MoneyFindRow` if it isn't already there (search before adding).
- CSS — extend `app/wallet-edit-v2.css` with classes for `.currency-panel`, `.card-intro-block`, `.feeder-pair-block`, `.feeder-pair-block[data-state="missing"]`, `.opened-at-pill`. Match the visual language of the existing `.value-thesis-line` (calm, dollar-anchored, no decoration).
- Strict TypeScript — `card_intro` and `feeder_pair` are optional in the schema, so all consumers must narrow with `if (!card.card_intro) return null;` before accessing fields.
- `parseYM` / `setYM` — currently inside `SignalsEditor.tsx`. If they aren't exported, move them to `lib/utils/openedAt.ts` and import from both `SignalsEditor` and the new `OpenedAtPill`. Keep behavior bit-for-bit identical.
- The recommendations engine (`/recommendations` page) does NOT need to read `feeder_pair` in this TASK. That's a follow-up. Author the field, render it on the per-card page, ship.

## Do Not Change

- `lib/engine/**` — the engine is a pure function; no changes belong in this TASK.
- `lib/data/loader.ts`, `lib/data/serialized.ts` — the database surface stays as-is. Schema additions in `scripts/lib/schemas.ts` are picked up automatically by the existing loader.
- `cards/*.md` other than `citi_strata_premier.md` — other cards get `card_intro` / `feeder_pair` in a follow-up TASK. The new fields are optional, so unauthored cards keep rendering without those blocks.
- `app/(app)/wallet/cards/[id]/page.tsx` — server-side prop wiring is correct; don't refactor it.
- `components/wallet-v2/CatalogGroup.tsx`, `MoneyFindRow.tsx`, `MechanicsZone.tsx`, `DeadlinesStrip.tsx` — catalog and mechanics zones are explicitly out of scope.
- `components/wallet-v2/SignalsEditor.tsx` other than removing the opened-date row (req 10) — the rest of the editor (AU count, pooling, pinned category, elite, activity threshold, status) stays.
- `lib/profile/**` — server actions, types, persistence layer untouched.
- `data/*.json` — never edit by hand. Always go through `npm run cards:build`.
- `lib/db.ts`, auth gate `app/(app)/layout.tsx` — out of scope.
- The `?new=1` add-card flow — reuse it; don't replace it.

## Acceptance Criteria

- [ ] `npm run cards:build` succeeds with the updated schema and `citi_strata_premier.md`.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` passes with zero errors.
- [ ] `npm test` passes — the engine integration test still loads the card DB cleanly.
- [ ] On `/wallet/cards/citi_strata_premier` (NEXT_PUBLIC_WALLET_EDIT_V2=1), in this exact order from top:
  - Back link, DeadlinesStrip, identity header (art + name + meta), opened-at pill under the name, CurrencyPanel, CardIntroBlock (3 paragraphs), ValueThesisHero (eyebrow + 3 lines, no chip row), FeederPairBlock, catalog groups, MechanicsZone, ManageCardDisclosure.
- [ ] CurrencyPanel shows the 1¢ / 1.9¢ line, partner counts, the unlock sentence, and the airline tag row with AAdvantage starred.
- [ ] FeederPairBlock — when neither feeder is held, shows the `value_when_missing` text and two buttons "Add Citi Double Cash" / "Add Citi Custom Cash" linking to `/wallet/cards/citi_double_cash?new=1` and `/wallet/cards/citi_custom_cash?new=1`.
- [ ] FeederPairBlock — when both feeders are held, shows the `value_when_held` text and a single "Set up pooling" CTA that smooth-scrolls to the `trifecta_pool` row in the catalog.
- [ ] Opened-at pill — clicking it opens an inline month/year picker; selecting a value persists via `handlePatch` (verify by reload).
- [ ] No section chip row visible on the page (`value-thesis-chips` is gone).
- [ ] No "For your wallet — cards that fit how you use this" tile at the bottom.
- [ ] Opened-date inputs no longer appear inside the Manage disclosure.
- [ ] `git diff` shows changes ONLY in: `scripts/lib/schemas.ts`, `cards/citi_strata_premier.md`, `components/wallet-v2/CardHero.tsx`, `components/wallet-v2/ValueThesisHero.tsx`, `components/wallet-v2/SignalsEditor.tsx`, `app/wallet-edit-v2.css`, plus the four new component files and (if extracted) `lib/utils/openedAt.ts`. `components/wallet-v2/HeroAdaptive.tsx` and `components/wallet-v2/CrossCardTile.tsx` deleted.

## Verification

1. Run `npm run cards:build` and confirm `data/manifest.json` lists `citi_strata_premier` and there are no validation errors.
2. Run `npm run typecheck && npm run build`.
3. Run `npm test`.
4. Start the dev server (`npm run dev`) and walk through `/wallet/cards/citi_strata_premier` in two states:
   - Logged-in user with no Citi Double Cash / Custom Cash held → confirm "missing" state of FeederPairBlock with both Add buttons.
   - Logged-in user with both feeders in wallet → confirm "held" state with the pooling CTA.
5. Toggle the opened-at pill from set → cleared → reset; reload; confirm persistence.
6. `git diff --stat` — verify only the files listed above are modified, plus the two deletions.
