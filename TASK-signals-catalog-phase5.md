# TASK: Visible payoff — dual-gauge wallet, on-my-list page, signals dashboard (Phase 5)

> Phase 4 made the data flow. Phase 5 makes it visible. Three surfaces: dual-gauge wallet row, `/wallet/list` aggregating "On my list" plays across cards, `/signals` dashboard showing what the system knows about the user.

## Context

Phases 1-4 built the signal-first plumbing. The data layer is live: chip clicks land in `perks_user_signals`, `computeCardValue` returns `{confirmed_usd, projected_usd, dismissed_usd}`, and the wallet's "Found this year" number already moves when the user confirms plays.

What's missing is the rest of the visible story. Today:

- The wallet row shows ONE number (confirmed). The `projected_usd` bucket — the value waiting in plays the user marked "On my list" — is computed but never surfaced.
- There's no aggregated view of "On my list" items across cards. The user has to remember which cards have which pending plays.
- There's no transparency view of what signals the system has captured about the user. Trust suffers when the engine acts on data the user can't see or correct.

Phase 5 ships the three surfaces that close that gap. All three are UI work — no new engine logic, no new server actions, no schema changes. The data already exists; we're rendering it.

Scope discipline: Phase 5 is read-only for the signals dashboard (no chip toggles directly from the dashboard). Editing flows continue to live on the per-card hero page. Phase 6 may add direct edit affordances after we see how users navigate.

## Requirements

1. **Dual-gauge wallet row** — `EditWalletClient.tsx` and the per-row `WalletLinkRow` show both `confirmed_usd` ("Found") and `projected_usd` ("On your list") when the projected value is > 0. Page-level totals at top of the wallet edit page show both sums. Strata Premier — the only card with plays today — is the only row that will display a non-zero projected number; the 238 cards without plays show only the existing single gauge (their projected_usd is always 0).

2. **`/wallet/list` page** — new route. Server loads profile + signals; client component renders a flat list of every play across the user's wallet whose state is `interested`. Each row: card art, play headline, projected value, source card (link to that card's hero), and the play's group label. Sortable by value (default) and grouped/filterable by source card. Empty-state copy when nothing is on-list.

3. **`/signals` dashboard** — new route. Server loads catalog + user signals + auto-derived holdings; client component renders the catalog grouped by namespace (`claims.*`, `transfers.*`, `behaviors.*`, `intents.*`, `holdings.*`). Each row: signal label, prompt, current state (or "no opinion captured"), source card+play that last set it (when applicable), updated_at. Auto-derived holdings rows display "auto-confirmed by [card name]" instead of a clickable state. Read-only — no edit affordances yet.

4. **Navigation hooks** — link from `/wallet/edit` to `/wallet/list` when there's at least one interested play (small button or link near the dual gauge). Link from the user menu / nav to `/signals`. No new top-level nav items unless they fit naturally into the existing layout.

5. **Engine helper extraction** — add `getOnMyListItems(profile, signals, db)` to `lib/engine/cardValue.ts`. Returns `Array<OnMyListItem>` where each item is `{cardId, play, valueUsd, group}`. Used by `/wallet/list` and as the basis for navigation-hook visibility logic. Pure function. No new tests required beyond what already covers `computeCardValue` — this is a thin filter pass.

## Implementation Notes

**`OnMyListItem` type and helper** — extend `lib/engine/cardValue.ts`:

```ts
export interface OnMyListItem {
  cardId: string;
  play: Play;
  valueUsd: number;        // basePlayValue, no haircuts
  group: PlayGroupId;      // copied from play.group for filter convenience
}

export function getOnMyListItems(
  profile: UserProfile,
  signals: Map<string, SignalState>,
  db: CardDatabase,
): OnMyListItem[] {
  const out: OnMyListItem[] = [];
  for (const held of profile.cards_held) {
    const card = db.cardById.get(held.card_id);
    if (!card) continue;
    for (const play of card.card_plays ?? []) {
      if (play.reveals_signals.length === 0) continue;
      // Reuse the existing aggregateRevealState logic. Export it from
      // cardValue.ts if not already exported.
      const state = aggregateRevealState(play.reveals_signals, signals);
      if (state !== "interested") continue;
      const value = basePlayValue(play, profile, db, card.currency_earned ?? null);
      if (value <= 0) continue;
      out.push({
        cardId: card.id,
        play,
        valueUsd: Math.round(value),
        group: play.group,
      });
    }
  }
  // Sort by value desc by default; the page can re-sort.
  out.sort((a, b) => b.valueUsd - a.valueUsd);
  return out;
}
```

`aggregateRevealState` and `basePlayValue` are already in `cardValue.ts` but currently file-local. Export them so the new helper can call them, OR inline the helper alongside them.

**Dual-gauge wallet row** — `components/wallet-v2/EditWalletClient.tsx`:

The current pattern uses `computeFoundMoneyV2(...).point`. For the dual-gauge, switch to `computeCardValue(...)` directly so both `confirmed_usd` and `projected_usd` are accessible in one call:

```ts
const cv = computeCardValue(card, held, profile, signals, db);
// row totals
totalFound  += cv.confirmed_usd;
totalOnList += cv.projected_usd;
// per-row props
<WalletLinkRow
  ...
  found={cv.confirmed_usd}
  onList={cv.projected_usd}
  signalsFilled={cv.signalsFilled}
  signalsTotal={cv.signalsTotal}
/>
```

Update `WalletLinkRow` props to accept `onList` and render it as a small secondary number under or beside the existing "Found" chip. Hide the on-list number when it's 0 — the 238 cards without plays don't need a placeholder. Page-head dual stats:

```
FOUND THIS YEAR     ON YOUR LIST
+$14,135            +$3,200
```

Use the existing `wallet-stats` styles; add a third `<div>` for "On your list" with a different tonal treatment (use `var(--warn-ink)` or a muted blue, distinct from `t-pos`).

**`/wallet/list` page** — new file `app/(app)/wallet/list/page.tsx`:

```ts
export default async function WalletListPage() {
  if (process.env.NEXT_PUBLIC_WALLET_EDIT_V2 !== "1") notFound();
  let profile, userId;
  try {
    profile = await getCurrentProfile();
    userId = await getCurrentUserId();
  } catch {
    redirect("/login");
  }
  const db = loadCardDatabase();
  const userSignals = await getUserSignals(userId);
  const merged = mergeSignals(userSignals, deriveHoldingSignals(profile.cards_held));
  const items = getOnMyListItems(profile, merged, db);
  return (
    <OnMyListClient
      items={items.map(i => ({ cardId: i.cardId, playId: i.play.id, ... }))}
      serializedDb={toSerialized(db)}
    />
  );
}
```

Don't pass `Play` objects across the RSC boundary directly — flatten what the client needs (cardId + playId + headline + value + group + the source card's name and issuer). The client looks up the card from `serializedDb` if it needs more.

`OnMyListClient` (new): renders a list of `OnMyListRow`. Each row:
- Left: small `CardArt` (size="sm") + card name (issuer + nickname)
- Center: play.headline + group eyebrow
- Right: $value + "Open" button (links to `/wallet/cards/[cardId]?play=playId` — the hero page can accept a `play` query param to scroll/highlight; if the param isn't wired today, just navigate to the card hero and the user finds the row).

Sort control at top: "By value", "By card". No deadline sort yet — most plays don't carry `expires_at` consistently. Empty state when the list is zero-length: a friendly nudge to "Mark plays 'On my list' from any card's page to see them here."

**`/signals` dashboard** — new file `app/(app)/signals/page.tsx`:

```ts
export default async function SignalsDashboardPage() {
  let profile, userId;
  try {
    profile = await getCurrentProfile();
    userId = await getCurrentUserId();
  } catch {
    redirect("/login");
  }
  const db = loadCardDatabase();
  const userSignals = await getUserSignals(userId);
  const holdingSignals = deriveHoldingSignals(profile.cards_held);
  return (
    <SignalsDashboardClient
      catalog={db.signals}
      userSignals={Object.fromEntries(userSignals)}
      holdingSignals={Object.fromEntries(holdingSignals)}
    />
  );
}
```

Server doesn't merge here — the dashboard wants to *show the difference* between user-clicked and auto-derived. Pass both maps separately.

`SignalsDashboardClient` (new): groups `db.signals` by the part before the first `.` in the id (`claims`, `transfers`, etc.). For each group, render a section with an h2 (use `GROUP_LABELS` analogue: "Behaviors you've confirmed", "Transfer partners you use", etc.) and a list of signal rows. Each row:

- Signal label (left, primary text)
- Signal prompt (left, secondary text, smaller)
- State chip on the right:
  - `holdingSignals` map has it: chip reads "Auto-confirmed" with a subtle marker (e.g. icon or tooltip "From cards in your wallet")
  - `userSignals` map has it: chip reads `"Confirmed"` / `"On my list"` / `"Not for me"` with appropriate color
  - Neither: chip reads "No opinion captured" in muted tone

Don't make chips clickable in Phase 5. Add a small "Edit on card →" link when source_card_id is known (Phase 3 stores this; query if needed) — the link navigates to the card hero where the user can change the chip.

For the source card linkout, an optional optimization: extend `getUserSignals` to return `{state, source_card_id, source_play_id}` so the dashboard can render the link. Today's helper returns only state — add an extension OR a sibling helper `getUserSignalsWithSource` that returns the full row.

**Navigation hooks**:

- `EditWalletClient.tsx`: under the dual gauge, add a small inline link "Open list →" when `totalOnList > 0`. Routes to `/wallet/list`.
- Existing nav (find via grep — there's likely a layout file with a header): add "Signals" link routing to `/signals`. If there's no clear nav layout, defer to the user menu or just leave an explicit link in the wallet edit page header for Phase 5.

**Styling**:

All new pages use the existing `wallet-edit-v2.css` patterns. New layout primitives only when nothing reusable exists. Keep the visual vocabulary tight — eyebrow, num, t-pos / t-warn / t-muted color tokens.

For the on-my-list rows: reuse `wallet-row` styles or create a slim variant `on-my-list-row` if the layout calls for different proportions.

For the signals dashboard: a section grid pattern (h2 + table-ish rows). Don't over-design — this is a read-only transparency view, density beats prettiness.

## Do Not Change

- `lib/engine/cardValue.ts` core logic (per-play summation, bucketing, requirements gating) — Phase 4 territory. Phase 5 only adds the `getOnMyListItems` filter helper and exports `aggregateRevealState` / `basePlayValue` if needed.
- `lib/engine/scoring.ts`, `lib/engine/ranking.ts`, `lib/engine/foundMoney.ts` — Phase 4 stable. Phase 5 doesn't change scoring, ranking, or the wallet-row math (it just calls `computeCardValue` directly instead of through the wrapper).
- `lib/profile/actions.ts` — no new server actions. Chip clicks continue to dual-write via Phase 3.
- `db/migrations/*.sql`, `signals/*.md`, `cards/*.md` — no schema, catalog, or card data changes.
- The `/wallet/edit` URL or its primary layout — Phase 5 only adds a small inline link out to `/wallet/list`.
- The `/wallet/cards/[id]` hero page — Phase 5 doesn't refactor this. If Phase 5b/c want to highlight a specific play via `?play=playId`, that's a small addition; otherwise the link from On My List just navigates to the card and the user scrolls.
- `auth/`, `db.ts`, session — orthogonal.

## Acceptance Criteria

- [ ] `/wallet/edit` shows two numbers in the page-head stats area when any held card has projected_usd > 0
- [ ] Strata Premier's wallet row shows a small "On your list" sub-number when the user has marked plays interested; row hides the sub-number when projected is 0
- [ ] All other 238 cards' wallet rows continue to show only the single "Found" number (their projected_usd is 0)
- [ ] `/wallet/list` route exists and renders. With no interested plays, shows the empty state. With one or more, lists each item with card art + play headline + value + source-card link
- [ ] Sort control on `/wallet/list` toggles between "By value" and "By card" without page navigation (client-side state)
- [ ] `/signals` route exists and renders all `db.signals` grouped by namespace
- [ ] Each signal row shows the correct state: "Confirmed" / "On my list" / "Not for me" for user-clicked, "Auto-confirmed" for holdings.* signals when the corresponding wallet card is held, "No opinion captured" otherwise
- [ ] Auto-confirmed signals are visually distinct from user-clicked confirmed signals (different chip styling or label)
- [ ] `getOnMyListItems` is callable from anywhere in the engine; type signature matches the spec
- [ ] `npm run typecheck` clean
- [ ] `npm run build` passes
- [ ] All existing 122 tests still pass; no new tests required (Phase 5 is UI; the engine logic is covered by Phase 4 tests)
- [ ] Manual: click "On my list" on Strata Premier's `hyatt_park_tokyo`, navigate to `/wallet/list`, see it listed at ~$600. Click through, lands on Strata Premier hero page.
- [ ] Manual: open `/signals`, see `transfers.to_hyatt`, `intents.aspires_japan`, `intents.aspires_premium_hotel` all marked "On my list" (set by the same chip click); see `holdings.thank_you_feeder` auto-confirmed if Citi Double Cash is held
- [ ] `git diff --stat` touches only: `lib/engine/cardValue.ts` (new helper, possibly export adjustments), `components/wallet-v2/EditWalletClient.tsx`, new `components/wallet-v2/OnMyListClient.tsx`, new `app/(app)/wallet/list/page.tsx`, new `app/(app)/signals/page.tsx`, new `components/signals/SignalsDashboardClient.tsx`, possibly `lib/profile/server.ts` if extending `getUserSignals` with source columns, `app/wallet-edit-v2.css` for any new style classes. No edits to engine, profile actions, scoring, ranking, or the card hero page beyond the optional `?play=` highlight.

## Verification

1. `npm run cards:build && npm run typecheck && npm run build && npm test` — all green
2. Walk the manual smoke tests in acceptance criteria
3. Verify navigation: from `/wallet/edit`, the "Open list →" link appears only when projected > 0; clicking lands on `/wallet/list`
4. Verify the signals dashboard shows the expected grouping and that auto-confirmed holdings have distinct visual treatment from user-clicked confirmations
5. Click "Got it" on a play with reveals_signals on Strata Premier; refresh `/signals`; verify the signal flipped from "On my list" to "Confirmed"

## Handoff back to Cowork

PR description should cover:
- Screenshot or visual sketch of the dual-gauge wallet row
- Screenshot of `/wallet/list` with at least one item
- Screenshot of `/signals` dashboard showing the namespace grouping
- Whether you wired the `?play=playId` highlight on the card hero page (optional in Phase 5; nice-to-have)
- Any styling friction — if the dual-gauge layout fights `wallet-stats`'s two-column grid, flag it for design review

Phase 6 (cleanup pass — deprecate legacy `requires_signal_id`, drop `synergies_with`, consolidate `derivePerkCapture` into the new path) is the final TASK in the series. After Phase 5 lands and we've watched real users for a week or two, Phase 6 closes out the legacy pieces.
