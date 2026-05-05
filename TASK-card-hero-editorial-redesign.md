# TASK: Card-Hero Editorial Redesign

> Reskin `/wallet/cards/[id]` with the editorial-financial language from the Claude Design handoff at `docs/design/card-hero-handoff/`. Markup and data flow stay; the look-and-feel changes.

## Context

The current card detail page (`CardHero.tsx` + `wallet-edit-v2.css`) reads as messy and disconnected — Angel called out that the hero/identity/currency feel noisy, the middle sections fight each other, the tristate buttons don't read right, and the Manage panel looks awful. A Claude Design pass produced a self-contained mockup that solves these. The mockup is built around the Strata Premier card but the route is generic, so the new look has to apply to every card at `/wallet/cards/[id]`.

The design intent (full chat in `docs/design/card-hero-handoff/chats/chat1.md`) is:

- **Calm editorial-financial aesthetic** — warm-paper background, deep ink, single Citi-slate-blue accent, generous whitespace.
- **IBM Plex** type stack — Plex Sans for UI, Plex Serif for headlines (replacing Fraunces *on this page only*), Plex Mono for numerics.
- **Hero that reads as one block** — card art (static, NOT sticky), name + AF + currency one-liner, opened-since pill, then a single bordered "Projected rewards this year" card with a 56px serif number.
- **Slim Currency panel** — short intro + the three cpp inputs as bordered cells with a "used here" badge on the active one. Transfer-partner list keeps existing behaviour but visually de-emphasized (it's still in the data, the design just compresses its weight).
- **Catalog groups with the source link inline in the title**, not per row. Group title in Plex Serif, mono summary, optional "Hide group" link.
- **Redesigned tristate as a segmented pill** — `Using / On list / Skip`, dot indicator on the active option, skipped rows soft strike-through.
- **Recurring credits inset** — left-border rule, frequency buttons as mono pills, companion benefits as a 2-col grid.
- **Manage card as a clean 2-column admin grid** — k/v rows with proper inputs (text, toggle, stepper, status pill).

The user clarified: keep all existing sections (`EarningSection`, `ValueThesisHero`, `MechanicsZone`, `SignalsEditor`) — just present the data the new way. Other cards are stubs, but the layout has to work generically.

## Requirements

1. **Add IBM Plex via `next/font/google` and expose it as page-scoped CSS variables.** Plex Sans → `--font-plex-sans`, Plex Serif → `--font-plex-serif`, Plex Mono → `--font-plex-mono`. Variables attach at `<html>` so they're available everywhere, but the new stylesheet only consumes them under `.card-hero-page`. Keep Inter Tight / Fraunces / JetBrains Mono in place — do not remove them.

2. **Create `app/card-hero-redesign.css` and import it from the route.** All selectors must be scoped under `.card-hero-page` so wallet list / edit / signals / recommendations / onboarding are untouched. The file replaces the visual rules in `wallet-edit-v2.css` for the card-hero scope; the markup classes stay the same so existing components keep working. Use the design tokens from `docs/design/card-hero-handoff/project/strata.css` (warm paper `#f6f3ec`, card surface `#fbfaf6`, ink scale `#1c1e23` → `#a0a4ac`, accent `oklch(0.42 0.10 245)`, accent-soft and accent-line variants, radii 6/10/14, shadow-1/2). Wire density to a `data-density="default"` attribute on `.card-hero-page` so we can tighten/loosen later without re-touching every rule.

3. **Restyle the hero region to the editorial layout.** Two-column grid (`360px 1fr`, collapses to single column under 900px). Left column is the card art, right column is `eyebrow → serif name → meta line → positioning paragraph → "Projected rewards this year" panel`. The projected panel uses `--font-plex-serif` for a 56px tabular number with a smaller "/yr" suffix, a 13.5px body block on the right, and a dashed-rule footer with the rewards/fee breakdown. The card art on this page only renders the editorial style (gradient + chip + issuer wordmark + name + last4 + network) — see `docs/design/card-hero-handoff/project/strata.css` `.cc` rules for exact dimensions and the `docs/design/card-hero-handoff/project/primitives.jsx` `CardArt` for layout. Wire it as a new `data-hero-style="editorial"` variant on the existing `CardArt` component — do NOT replace the component. Card art is `position: static`, never sticky.

4. **Restyle CurrencyPanel, EarningSection, RecurringValueSection, ValueThesisHero, MechanicsZone, and the catalog groups + perk rows to the editorial language.** All section heads use the same pattern: `eyebrow` (uppercase 10.5px, letter-spacing 0.16em) → serif title (Plex Serif 22px, optional inline source link in 11.5px ink-3) → optional sub-paragraph in 14px ink-2. The Currency panel keeps the transfer-partner list but reduces its visual weight (smaller type, more spacing, no border). The cpp inputs become the bordered `cpp-cell` style from `docs/design/card-hero-handoff/project/strata.css` with a 9px uppercase "used here" pill on the cell representing the user's headline cpp. Each catalog group renders the source link inline with the title (move the per-row source pill markup into the group head — keep the per-row inline ⓘ flag popover from `PerkSourceLink` for flagging). Perk row tristate becomes the segmented pill from `docs/design/card-hero-handoff/project/primitives.jsx` `StatusControl` (Using / On list / Skip with a dot dot indicator). Skipped rows soft-strikethrough the headline and dim the value. Recurring inset uses left-border accent rule, mono frequency pills, and a 2-col companion grid via `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`.

5. **Restyle the ManageCardDisclosure body (`SignalsEditor`) as a clean 2-column admin grid.** Reference `docs/design/card-hero-handoff/project/manage.jsx` and the `.manage` / `.admin-grid` / `.admin-row` rules in `docs/design/card-hero-handoff/project/strata.css`. Keep all existing controls and persistence — only change visual structure. Each row is `160px | 1fr` with a small label, the existing input, and a muted hint where useful. Replace the current tab/section layout in `SignalsEditor` with this paired-row grid (two-column on desktop, single-column under 900px). Status pill at the top right uses the design's green pill pattern (`.status-pill` rules). Buttons use the new `.btn` / `.btn-primary` / `.btn-link` rules — the existing `.btn` from `globals.css` stays the global default; the editorial overrides apply only inside `.card-hero-page`.

## Implementation Notes

**Files to create**
- `app/card-hero-redesign.css` — new scoped stylesheet, all rules under `.card-hero-page` (or nested selectors that imply that ancestor). Import from `app/(app)/wallet/cards/[id]/page.tsx` *after* the existing `wallet-edit-v2.css` import so it wins on equal specificity.

**Files to modify**
- `app/layout.tsx` — add the three IBM Plex `next/font/google` imports next to the existing Inter Tight / Fraunces / JetBrains Mono imports, append the new CSS variables to the `<html>` className. Keep the old fonts in place.
- `app/(app)/wallet/cards/[id]/page.tsx` — add `import "@/app/card-hero-redesign.css";` after the wallet-edit-v2 import.
- `components/wallet-v2/CardHero.tsx` — wrap the existing markup so it has both `card-hero-page` (already on the `<main>`) and a new `data-hero-style="editorial"` attribute. No structural rewrites — leave the section order and component composition intact.
- `components/perks/CardArt.tsx` — add a `heroStyle?: "editorial"` prop. When set, render the editorial card art (gradient + chip + issuer wordmark + name + last4 + network) using the dimensions from `docs/design/card-hero-handoff/project/strata.css` `.cc` rules. When unset, render exactly as today. Default behaviour must not change.
- `components/wallet-v2/CatalogGroup.tsx` — add a single source-link slot in `.catalog-group-head` (existing class). Look up the group's source URL from the first perk's resolved source, or accept it as an explicit prop wired in `CardHero.tsx`. Keep the per-row `PerkSourceLink` popover trigger — that's the flagging affordance, not the source citation.
- `components/wallet-v2/MoneyFindRow.tsx` — replace the existing tristate markup with the segmented pill structure from `docs/design/card-hero-handoff/project/primitives.jsx` `StatusControl`. Keep the existing handler signatures (`onMarkFind(playId, status)`).
- `components/wallet-v2/SignalsEditor.tsx` — restructure body markup to the `.admin-grid` / `.admin-row` shape. Keep all existing fields, persistence, and the `onPatch` flow.

**Type / data shape contracts to preserve**
- `CardArt` props default behaviour: `<CardArt variant size="xl" />` must render identically to today when `heroStyle` is unset.
- `MoneyFindRow` callback signature: `onMarkFind(playId: string, status: FindStatus)` — `FindStatus` is `"using" | "going_to" | "skip" | "unset"`. Match `"using"` → green dot, `"going_to"` → warn dot, `"skip"` → grey dot, `null` → no dot.
- `CatalogGroup` props: extend with optional `groupSourceUrl?: string; groupSourceLabel?: string;` — when provided, render the inline source link in the head; when missing, head omits the link. `CardHero.tsx` derives these from the existing `playSourceMap` (first perk in the group) so the prop fills naturally for all cards.
- `SignalsEditor` props are untouched (`card, held, profile, db, playState, isNew, onPatch, onPlayStateChange, onCancel, onRemove, onSave`).

**Design tokens to lift verbatim from `docs/design/card-hero-handoff/project/strata.css`**
- `--paper`, `--paper-2`, `--card`, `--rule`, `--rule-2`
- `--ink`, `--ink-2`, `--ink-3`, `--ink-4`
- `--accent`, `--accent-soft`, `--accent-line`
- `--pos`, `--warn`, `--neg` (use these for the tristate dot tones — match the design's oklch values, not the existing `--pos` from globals which is a brighter green)
- `--radius`, `--radius-lg`, `--radius-sm`
- `--shadow-1`, `--shadow-2`

Scope these on `.card-hero-page` so they only override inside the page. The wallet-edit-v2.css custom properties for the rest of the wallet stay untouched.

**Responsive collapse**
Hero, currency grid, admin grid, and perk rows collapse to single-column under 900px. See `@media (max-width: 900px)` block in the design's strata.css.

**The cpp "headline" badge**
Wire the `data-headline="true"` attribute on the cpp cell that matches the user's preferred valuation tier. For transferable programs that's the transfer cell; for portal-only that's portal. The CurrencyPanel already knows which tier is active — just expose it as a `data-headline` on the cell.

## Do Not Change

- `lib/engine/**` — pure scoring/eligibility/ranking. Visual changes only, no engine touches.
- `lib/data/**` — card database loader / serializer. No data shape changes.
- `lib/profile/**` — auth + persistence. Manage panel restyles markup only; persistence flow stays.
- `cards/*.md` — source-of-truth card markdown. No content changes.
- `data/**` — gitignored generated DB. Don't write to it.
- `scripts/build-card-db.ts` and `scripts/lib/schemas.ts` — schema layer.
- `app/wallet-edit-v2.css` — leave intact. The new file overrides on top of it. Touching this file risks breaking `/wallet/edit`, `/wallet/list`, `/signals`, `/onboarding/cards`.
- `app/globals.css` — global tokens, button base, card-art base. New rules must NOT redefine `--paper`, `--ink-*`, etc. at `:root` — scope new tokens to `.card-hero-page`.
- Any component outside `components/wallet-v2/` and `components/perks/CardArt.tsx`. Specifically: do not touch `components/wallet-v2/EarningSection.tsx`, `RecurringValueSection.tsx`, `ValueThesisHero.tsx`, `MechanicsZone.tsx`, `DeadlinesStrip.tsx`, `CurrencyPanel.tsx`, `OpenedAtPill.tsx`, `EarningRateRow.tsx`, `RecurringCreditCard.tsx` markup. They're restyled purely through the new CSS file. The two markup-touching exceptions are `CatalogGroup.tsx` (source link slot) and `MoneyFindRow.tsx` (segmented pill).
- Tests under `lib/engine/__tests__/` — engine-only. The redesign is presentational; tests do not need updating.
- Routes other than `/wallet/cards/[id]`. Verify with `git diff` that no other route file changed.

## Acceptance Criteria

- [ ] `npm run build` passes with zero TypeScript errors and zero new lint warnings.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes (engine tests are presentation-agnostic — they should still pass).
- [ ] Visiting `/wallet/cards/citi_strata_premier` shows the new layout: editorial card art on the left, eyebrow + serif name + projected-rewards panel on the right, slim Currency panel below, then the catalog groups with serif titles, then Manage card as a 2-col admin grid.
- [ ] Card art on the hero is static (no sticky/scroll behaviour).
- [ ] Tristate on each perk row renders as the segmented `Using / On list / Skip` pill with a dot indicator on the active option. Clicking advances state through the existing `onMarkFind` handler with no behaviour change.
- [ ] Skipped perk rows render the headline strike-through and dim the value.
- [ ] Catalog group head shows ONE source link inline with the title; per-row flag-popover affordance still works.
- [ ] Manage card body renders as a 2-col admin grid on desktop, collapses to single column under 900px. All existing fields (nickname, opened, bonus, AU, pool, status) still persist via the existing `onPatch` / `onSave` flow.
- [ ] `/wallet/edit`, `/wallet/list`, `/signals`, `/recommendations`, `/onboarding/*` look pixel-identical to before — verify by spot-check.
- [ ] Visiting `/wallet/cards/<any-other-card-id>` (an empty/stub card) renders without crashing in the new layout.
- [ ] `git diff --stat` shows changes ONLY in: `app/layout.tsx`, `app/card-hero-redesign.css` (new), `app/(app)/wallet/cards/[id]/page.tsx`, `components/wallet-v2/CardHero.tsx`, `components/wallet-v2/CatalogGroup.tsx`, `components/wallet-v2/MoneyFindRow.tsx`, `components/wallet-v2/SignalsEditor.tsx`, `components/perks/CardArt.tsx`, `docs/design/card-hero-handoff/**` (already added), `TASK-card-hero-editorial-redesign.md` (this file).

## Verification

1. `npm run build` — confirm zero errors.
2. `npm run typecheck` — confirm zero errors.
3. `npm test` — confirm engine tests pass.
4. `npm run dev` and visit `/wallet/cards/citi_strata_premier` — visually confirm against `docs/design/card-hero-handoff/project/Strata Premier.html` rendered offline (open it in a browser locally to compare).
5. Spot-check `/wallet/edit` and `/wallet/list` to confirm no visual regression elsewhere in the wallet.
6. Click through the tristate on a perk row and confirm the persisted state in the network tab matches the prior behaviour.
7. Edit a Manage-card field (nickname / AU / pool) and confirm the debounced patch fires and persists.
8. Run `git diff --stat` and confirm the file list matches the Acceptance Criteria.
