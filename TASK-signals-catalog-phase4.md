# TASK: Engine reads signals (Phase 4 of signal-first architecture)

> Rewrite `computeFoundMoneyV2` as a thin compat wrapper around a new signal-aware `computeCardValue`. Add signal awareness to the recommender's `scoreCard`. Wire pages to load `getUserSignals` server-side.

## Context

Phases 1-3 built the data layer (catalog, play declarations, persistence). Phase 4 cuts the engine over to it. This is the largest TASK of the series and the first one with visible UX impact: the wallet's "Found this year" number starts moving when the user clicks "Got it" / "On my list" / "Not for me" chips, and recommendations begin to dedup at the behavior level instead of the perk-name level.

Current state Phase 4 inherits:
- `computeFoundMoneyV2(card, held, profile, db)` in `lib/engine/foundMoney.ts` — pure-math estimate from spend × earning rules + credits × ease. Ignores chip clicks. Drives the wallet row's headline number.
- `scoreCard(...)` in `lib/engine/scoring.ts` — recommender. Reads spend, brands, trips, perk_opt_ins, cards_held. Ignores chip clicks. Drives the recommendations page.
- `perks_user_signals` table populated by Phase 3 dual-write + backfill. Read via `getUserSignals(userId)` from `lib/profile/server.ts`. Currently unread by any engine code.
- Only one card (`citi_strata_premier`) has `card_plays` populated with `reveals_signals` / `requires_signals`. The other 238 cards still describe value through `annual_credits` and `ongoing_perks` (legacy shape).

The cutover strategy follows the data: cards WITH `card_plays` get signal-aware valuation (per-play summation gated by signal state); cards WITHOUT `card_plays` continue running on today's `derivePerkCapture` + spend math, untouched. As more cards have plays added (the slow-rolling Phase 2.x work), they automatically opt into the new path.

Phase 5 owns the visible UI shifts (dual-gauge wallet rows, on-my-list page, signals dashboard). Phase 4 changes WHAT the existing single gauge shows, not HOW MANY gauges exist.

## Requirements

1. **`computeCardValue(card, held, profile, signals, db)`** in `lib/engine/cardValue.ts` — new function. Returns a structured `CardValue` object with `confirmed_usd`, `projected_usd`, `dismissed_usd`, plus diagnostic counts. Per-play summation when `card.card_plays.length > 0`; falls back to today's logic when not.

2. **Holdings auto-confirmation** — derive `holdings.*` signals from `cards_held` (e.g. wallet contains Citi Double Cash → `holdings.thank_you_feeder = confirmed`). Merge with the user's clicked signals before either engine path consumes the set. Lives in `lib/engine/holdingSignals.ts`. Pure function. Used by both `computeCardValue` and `scoreCard`.

3. **`computeFoundMoneyV2` becomes a compat wrapper** — same signature, calls `computeCardValue`, returns `{low, high, point, signalsFilled, signalsTotal}` where `point = confirmed_usd`. Lets every existing caller (wallet row, edit panel) pick up the new behavior with zero diff at the call site.

4. **`scoreCard` signal awareness** in `lib/engine/scoring.ts` — accept `signals: Map<string, SignalState>` as a new input. For candidate cards with `card_plays`: weight per-play value based on signal state (confirmed = full, interested = +score boost, dismissed = score penalty, unknown = today's spend-derived estimate). Behavior-level dedup: if user has `confirmed` for `claims.dining_credit.standard` via any held card, candidate cards revealing the same signal get a duplication penalty.

5. **Page wiring** — `app/(app)/wallet/edit/page.tsx`, `app/(app)/wallet/cards/[id]/page.tsx`, `app/(app)/recommendations/page.tsx`: load `getUserSignals(userId)` server-side, pass through `toSerialized` (extend `SerializedDb` to include `userSignals: Record<string, SignalState>`), reconstruct as a Map in client components, thread to the engine.

## Implementation Notes

**`CardValue` shape** — `lib/engine/cardValue.ts`:

```ts
export interface CardValue {
  // Annual value the user is on track to actually capture, after AF.
  // = sum(confirmed_play_values) + spend_earning_estimate − annual_fee
  // For wallet row's "Found this year" headline.
  confirmed_usd: number;

  // Value sitting in plays the user marked "On my list" but hasn't
  // confirmed. Phase 5 surfaces as a second gauge.
  projected_usd: number;

  // Value of plays the user explicitly dismissed. Used by Phase 5
  // for "you've ruled out $X here" affordances. Not subtracted from
  // confirmed — the user said no, that's a fact, not a loss.
  dismissed_usd: number;

  // Diagnostic — how the confirmed bucket was sourced. Lets Phase 4+
  // debugging answer "why did this number change?" without rerunning.
  confirmed_from_signals_usd: number;
  confirmed_from_spend_estimate_usd: number;

  // Carried forward from foundMoneyV2 so the wallet's signals-filled
  // chip stays accurate. Compat wrapper exposes these directly.
  signalsFilled: number;
  signalsTotal: number;
}

export function computeCardValue(
  card: Card,
  held: WalletCardHeld | null,
  profile: UserProfile,
  signals: Map<string, SignalState>,
  db: CardDatabase,
): CardValue;
```

**Per-play valuation rules** (when `card.card_plays.length > 0`):

For each play in `card.card_plays`:

```
playValue = computePlayValue(play, profile, db)   // existing logic from moneyFind.ts:computeValue
revealSet = play.reveals_signals
state = aggregateState(revealSet, signals)         // see below

if state === "confirmed":
  confirmed_from_signals_usd += playValue
elif state === "interested":
  projected_usd += playValue
elif state === "dismissed":
  dismissed_usd += playValue
elif play.requires_signals.length > 0 && !allConfirmed(play.requires_signals, signals):
  // Gated play with unmet requirements — no value counted.
  continue
else:
  // Unknown state. Fall back to spend-derived estimate for this perk class.
  capture = legacyCaptureRate(play, profile)       // 0..1 from derivePerkCapture or similar
  confirmed_from_spend_estimate_usd += playValue * capture
```

`aggregateState(revealSet, signals)`: returns `confirmed` if all reveals are confirmed; `dismissed` if ANY reveal is dismissed; `interested` if all reveals are interested-or-better and at least one is interested; otherwise `null` (unknown). Latest-wins matches the Phase 3 storage rule.

`computeCardValue` then totals:

```
confirmed_usd = confirmed_from_signals_usd + confirmed_from_spend_estimate_usd − (card.annual_fee_usd ?? 0)
confirmed_usd = max(0, confirmed_usd)
```

projected and dismissed are NOT reduced by AF — those are aspirational totals, AF subtraction is a deliberate "what you actually keep" framing for the headline only.

**Per-play valuation rules** (legacy path, when `card.card_plays.length === 0`):

Run today's `computeFoundMoneyV2` math but funnel the result entirely into `confirmed_from_spend_estimate_usd`. `projected_usd` and `dismissed_usd` stay zero. This is the 238-card backwards-compat path.

**Holdings auto-confirmation** — `lib/engine/holdingSignals.ts`:

```ts
// Maps holding signal id → predicate over the wallet. When predicate
// matches the user's cards_held, the signal is auto-confirmed.
export const HOLDING_RULES: Record<string, (heldIds: Set<string>) => boolean> = {
  "holdings.thank_you_feeder": (h) =>
    h.has("citi_double_cash") || h.has("citi_custom_cash") || h.has("citi_rewards_plus"),
  "holdings.amex_mr_feeder": (h) =>
    h.has("amex_blue_business_plus") || h.has("amex_everyday_preferred") || h.has("amex_green"),
  "holdings.ultimate_rewards_feeder": (h) =>
    h.has("chase_freedom_unlimited") || h.has("chase_freedom_flex") ||
    h.has("ink_cash") || h.has("ink_unlimited"),
  "holdings.capital_one_miles_feeder": (h) =>
    h.has("capital_one_quicksilver") || h.has("capital_one_savor_one"),
};

export function deriveHoldingSignals(
  cardsHeld: WalletCardHeld[],
): Map<string, "confirmed"> {
  const heldIds = new Set(cardsHeld.map((c) => c.card_id));
  const out = new Map<string, "confirmed">();
  for (const [signalId, pred] of Object.entries(HOLDING_RULES)) {
    if (pred(heldIds)) out.set(signalId, "confirmed");
  }
  return out;
}

export function mergeSignals(
  user: Map<string, SignalState>,
  derived: Map<string, "confirmed">,
): Map<string, SignalState> {
  // User-clicked signals win over auto-derived (they're more recent and
  // more authoritative). Holding-derived signals fill in gaps.
  const merged = new Map(derived);
  for (const [k, v] of user) merged.set(k, v);
  return merged;
}
```

Both `computeCardValue` and `scoreCard` should call `mergeSignals(getUserSignals(...), deriveHoldingSignals(profile.cards_held))` before reading the signal map.

**`scoreCard` signal awareness** — extend the signature in `lib/engine/scoring.ts`:

```ts
// Before
export function scoreCard(card, profile, db, opts);

// After
export function scoreCard(
  card,
  profile,
  signals: Map<string, SignalState>,  // NEW
  db,
  opts,
);
```

Internal changes:

- For candidate cards with `card_plays`: replace the existing perk-by-perk capture loop with a per-play summation that mirrors `computeCardValue`'s logic, but treat `interested` as a +10% score boost (user wants this) and `dismissed` as a -50% penalty (user said no).
- **Behavior-level dedup**: walk every card the user already holds, collect the union of all `reveals_signals` from their plays whose state is `confirmed`. For the candidate card, any play whose `reveals_signals` overlaps this set is "duplicative" — apply a 50% haircut to its contribution. This replaces today's perk-name-based dedup (which only catches exact perk_dedup.json matches).
- For candidate cards WITHOUT `card_plays`: keep today's logic unchanged. `signals` is unused.

**Compat wrapper** — `lib/engine/foundMoney.ts`:

```ts
import { computeCardValue } from "./cardValue";

export function computeFoundMoneyV2(
  card: Card,
  held: WalletCardHeld | null,
  profile: UserProfile,
  db: CardDatabase,
  signals: Map<string, SignalState> = new Map(),  // NEW optional, defaults empty
): FoundMoneyV2 {
  const v = computeCardValue(card, held, profile, signals, db);
  return {
    low: Math.max(0, Math.round(v.confirmed_usd * 0.85)),
    high: Math.round(v.confirmed_usd + v.projected_usd),
    point: Math.round(v.confirmed_usd),
    signalsFilled: v.signalsFilled,
    signalsTotal: v.signalsTotal,
  };
}
```

The wallet row keeps reading `point` as today; the number now reflects signal state.

**Page wiring** — three pages need the new signal load:

1. `app/(app)/wallet/edit/page.tsx`:
   ```ts
   const profile = await getCurrentProfile();
   const signals = await getUserSignals((await getCurrentUser())!.id);
   const db = loadCardDatabase();
   return <EditWalletClient
     initialProfile={profile}
     serializedDb={toSerialized(db)}
     userSignals={Object.fromEntries(signals)}  // serializable
   />;
   ```

2. `app/(app)/wallet/cards/[id]/page.tsx`: same pattern.

3. `app/(app)/recommendations/page.tsx`: same pattern, then thread `signals` into `RecPanelDesktop` / `RecPanelMobile` and into `rankCards` / `scoreCard`.

`SerializedDb` doesn't need to carry signals — they're per-user, not per-DB. Pass them as a separate prop.

Client components reconstruct: `useMemo(() => new Map(Object.entries(props.userSignals)), [props.userSignals])`.

**Tests** — add to `tests/engine/`:

- `cardValue.test.ts` — confirmed signal lights full play value, dismissed zeros it, interested counts in projected bucket, unknown falls back to spend math, gated plays with unmet requirements zero out, AF subtracted from confirmed only. Test the 238-card legacy path returns identical results to today's `computeFoundMoneyV2` when signals map is empty.
- `holdingSignals.test.ts` — every rule in `HOLDING_RULES` fires when expected, doesn't fire otherwise. Merge precedence: user signals win over auto-derived.
- `scoring-signals.test.ts` — confirmed signal lifts candidate card score, dismissed penalizes, behavior-level dedup haircut applies when held card and candidate card share a confirmed signal.

Existing 95 tests must continue to pass — when no signals exist, the engine should behave identically to today.

## Do Not Change

- `signals/*.md` (Phase 1 catalog), `cards/*.md` (Phase 2 declarations), `db/migrations/0006_user_signals.sql` (Phase 3 schema) — Phase 4 reads what these established. No edits.
- Phase 3's `updateUserSignalsForPlay`, dual-write at chip-click sites, backfill script — all stable. Phase 4 only adds READ paths.
- The `state` column in `user_card_play_state` continues to be written by `updateCardPlayState`. Don't deprecate it in Phase 4 — Phase 6 does that after Phase 5 confirms the new path is solid.
- The legacy `requires_signal_id` field inside `value_model.fixed_credit` — leave alone. Phase 6 deprecates.
- `derivePerkCapture` and `perkSignals.ts` — keep as-is. Phase 4's spend-fallback path uses them. Phase 6 may consolidate later.
- `auth/*`, `db.ts` (postgres-js wrapper), session/cookie code — orthogonal.
- `data/*.json` — derived. Edit markdown sources only.
- The wallet UI — Phase 5 owns the dual-gauge / on-my-list / signals-dashboard work. Phase 4 changes WHAT the existing wallet row shows; it does not add new gauges or pages.

## Acceptance Criteria

- [ ] `lib/engine/cardValue.ts` exists, exports `computeCardValue` and `CardValue` type
- [ ] `lib/engine/holdingSignals.ts` exists, exports `deriveHoldingSignals`, `mergeSignals`, `HOLDING_RULES`
- [ ] `computeFoundMoneyV2` is a compat wrapper around `computeCardValue`; existing callers compile and run with no signature change required (the new `signals` param has a default)
- [ ] `scoreCard` accepts and uses `signals: Map<string, SignalState>`. `rankCards` plumbs signals through.
- [ ] `app/(app)/wallet/edit/page.tsx`, `app/(app)/wallet/cards/[id]/page.tsx`, `app/(app)/recommendations/page.tsx` all load `getUserSignals` server-side and pass to client components
- [ ] `npm run cards:build` clean
- [ ] `npm run typecheck` clean
- [ ] `npm run build` passes
- [ ] All existing 95 tests still pass — engine behavior identical when signals map is empty
- [ ] New tests in `tests/engine/cardValue.test.ts`, `tests/engine/holdingSignals.test.ts`, `tests/engine/scoring-signals.test.ts` cover the signal-aware paths
- [ ] Manual smoke test: log into the app, click "Got it" on Strata Premier's `hyatt_park_tokyo` play, navigate back to /wallet/edit. The Strata Premier row's "Found this year" number is HIGHER than before the click (the play's value model contributes to confirmed_usd now that all three reveals_signals are confirmed)
- [ ] Manual smoke test: click "Not for me" on the same play. The number drops below the original baseline (those plays now sit in dismissed_usd, not confirmed_usd from spend fallback)
- [ ] Manual smoke test: open /recommendations. With Strata Premier held + `claims.hotel_credit.portal` confirmed, no other portal-hotel-credit-class card should appear in the top 5 unless it offers something else materially differentiated
- [ ] `git diff --stat` touches only: `lib/engine/cardValue.ts` (new), `lib/engine/holdingSignals.ts` (new), `lib/engine/foundMoney.ts` (compat wrapper rewrite), `lib/engine/scoring.ts` (signals param + dedup), `lib/engine/ranking.ts` (plumb signals), `app/(app)/wallet/edit/page.tsx`, `app/(app)/wallet/cards/[id]/page.tsx`, `app/(app)/recommendations/page.tsx`, `components/wallet-v2/EditWalletClient.tsx`, `components/wallet-v2/CardHero.tsx`, `components/recommender/RecPanelDesktop.tsx`, `components/recommender/RecPanelMobile.tsx`, `tests/engine/cardValue.test.ts` (new), `tests/engine/holdingSignals.test.ts` (new), `tests/engine/scoring-signals.test.ts` (new). No edits to `data/`, `cards/`, `signals/`, `db/`, `scripts/`, `lib/profile/`.

## Verification

1. `npm run cards:build && npm run typecheck && npm run build && npm test` — all green
2. Walk the manual smoke tests in acceptance criteria. Use `psql` to spot-check `perks_user_signals` after each chip click.
3. Compare `computeFoundMoneyV2` output for a card WITHOUT `card_plays` (e.g. `chase_freedom_unlimited`) before and after Phase 4 — must be byte-identical when signals map is empty
4. Compare `computeFoundMoneyV2` output for `citi_strata_premier` (the one card WITH `card_plays`) before and after Phase 4, with empty signals — should be in the same ballpark (the per-play summation might land slightly differently than the old spend × earning + credits × ease formula because they value perks through different lenses; document the delta in the PR if it's >10%)
5. Run rec engine for a synthetic profile holding only `citi_double_cash` with confirmed `claims.dining_credit.standard`, verify the recommendations differ from a profile holding the same card with no signals (the dining-credit-class candidates should rank lower in the signal'd profile)

## Handoff back to Cowork

PR description should cover:
- The before/after `computeFoundMoneyV2` comparison from Verification step 4 (the documented delta)
- The signals-driven recommendation diff from Verification step 5 — concrete: which cards rose, which fell
- Any tuning calls made on the score-boost / penalty multipliers (interested = +10%? confirmed dedup haircut = 50%?). Cowork's spec values are starting points; Code's hands-on test of "does this feel right" trumps them.
- Which page-wiring file felt awkward (passing the userSignals object through serialization, then reconstructing as Map client-side, then handing to the engine — three hops; if there's a cleaner pattern please flag).

Phase 5 (dual-gauge wallet UI + on-my-list page + signals dashboard) is next. Phase 6 (deprecate legacy `requires_signal_id`, consolidate `derivePerkCapture` into the new path, drop `synergies_with`) is the cleanup pass.
