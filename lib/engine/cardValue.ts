// Phase 4 of signal-first architecture.
//
// Per-card value computation that reads user signals (Phase 3 storage)
// via the play declarations (Phase 2 reveals_signals/requires_signals).
// Replaces foundMoneyV2 as the canonical card-value entry point;
// foundMoneyV2 stays as a thin compat wrapper so existing call sites
// (wallet row, edit panel) pick up the new behavior with zero diff.
//
// Cutover strategy: cards WITH card_plays use signal-aware per-play
// summation; cards WITHOUT card_plays (238 of 239 today) keep the
// legacy spend × earning + credits × ease math, byte-identical when
// the signal map is empty. Only the one card with plays gets new
// behavior, and only when the user has actually clicked chips.
//
// Pure function. No I/O, no Date.now. The engine module discipline.

import type { Card, CardDatabase, Play, PlayGroupId } from "@/lib/data/loader";
import type { UserProfile, WalletCardHeld } from "./types";
import type { SignalState } from "@/lib/profile/server";
import { derivePerkCapture } from "./perkSignals";

export interface CardValue {
  // Annual value the user is on track to actually capture, after AF.
  // What the wallet row's "Found this year" headline shows.
  confirmed_usd: number;

  // Plays the user marked "On my list" but hasn't confirmed yet.
  // Phase 5 surfaces as a second gauge.
  projected_usd: number;

  // Plays the user explicitly dismissed. Not subtracted from confirmed
  // — the user said no, that's a fact, not a loss. Phase 5 may show
  // "you've ruled out $X here" affordances.
  dismissed_usd: number;

  // Diagnostic — split of the confirmed bucket so we can answer "why
  // did this number change?" without re-running. Sum equals confirmed
  // before AF subtraction.
  confirmed_from_signals_usd: number;
  confirmed_from_spend_estimate_usd: number;

  // Carried forward from foundMoneyV2 — wallet's signals-filled chip
  // depends on these.
  signalsFilled: number;
  signalsTotal: number;
}

// ── shared helpers (also consumed by foundMoney compat wrapper) ────────

const EASE_FACTOR: Record<string, number> = {
  easy: 1.0,
  medium: 0.75,
  hard: 0.4,
  coupon_book: 0.2,
};

const SPEND_PATTERNS: { test: RegExp; cat: keyof UserProfile["spend_profile"] }[] = [
  { test: /grocer|supermarket|wholesale_club/, cat: "groceries" },
  { test: /restaurant|dining|takeout|food_delivery/, cat: "dining" },
  { test: /\bgas\b|gas_station|fuel|ev_charg/, cat: "gas" },
  { test: /flight|airfare|airline|airways/, cat: "airfare" },
  { test: /hotel|lodging|resort/, cat: "hotels" },
  { test: /streaming|netflix|spotify|disney|hulu/, cat: "streaming" },
  { test: /amazon|online_purchas|online_shop/, cat: "shopping" },
  { test: /drugstore|pharmacy|cvs|walgreens/, cat: "drugstore" },
  { test: /transit|rideshare|uber\b|lyft/, cat: "transit" },
  { test: /utilit|phone|cable|internet/, cat: "utilities" },
  { test: /home_improvement|home_depot|lowes/, cat: "home" },
  { test: /everything_else|all_other_purchas|other_purchas|^other$|base_rate/, cat: "other" },
];

function categorize(label: string): keyof UserProfile["spend_profile"] | null {
  const l = label.toLowerCase();
  for (const m of SPEND_PATTERNS) {
    if (m.test.test(l)) return m.cat;
  }
  return null;
}

// Conservative yearly earnings: sum (spend × pts/$ × cpp/100) per
// category-matched rule in card.earning. Falls back to portal cpp when
// median is null. Used by the legacy 238-card path.
export function yearlyEarningEstimate(
  card: Card,
  profile: UserProfile,
  db: CardDatabase,
): number {
  if (!card.currency_earned) return 0;
  const program = db.programById.get(card.currency_earned);
  if (!program) return 0;
  const cpp =
    program.median_redemption_cpp ??
    program.portal_redemption_cpp ??
    program.fixed_redemption_cpp ??
    1;

  let total = 0;
  let baseRate = 0.01;
  for (const rule of card.earning) {
    const cat = categorize(rule.category);
    if (!cat) continue;
    const rate = ((rule.rate_pts_per_dollar ?? 0) * cpp) / 100;
    if (cat === "other") {
      if (rate > baseRate) baseRate = rate;
      continue;
    }
    const spend = profile.spend_profile[cat] ?? 0;
    if (spend <= 0) continue;
    const cap = rule.cap_usd_per_year ?? null;
    const inCap = cap == null ? spend : Math.min(spend, cap);
    total += inCap * rate;
  }
  const totalSpend = Object.values(profile.spend_profile).reduce(
    (a, b) => a + (b ?? 0),
    0,
  );
  total += totalSpend * 0.3 * baseRate;
  return total;
}

export function legacyCreditsValue(
  card: Card,
  profile: UserProfile,
): { captured: number; available: number } {
  let captured = 0;
  let available = 0;
  for (const cr of card.annual_credits) {
    const face = cr.value_usd ?? 0;
    if (face <= 0) continue;
    const ease = EASE_FACTOR[cr.ease_of_use ?? "medium"] ?? 0.75;
    const optedIn =
      cr.signal_id && profile.perk_opt_ins?.includes(cr.signal_id);
    if (optedIn) {
      captured += face * Math.max(ease, 0.75);
    } else {
      available += face * ease;
    }
  }
  return { captured, available };
}

export function signalSlotCount(card: Card): number {
  let n = 1;
  n += card.annual_credits.length;
  if (card.accepts_pinned_category && card.accepts_pinned_category.length > 0) n += 1;
  if (card.is_pool_spoke) n += 1;
  if (card.is_cobrand) n += 2;
  return n;
}

export function signalsFilledOnHeld(card: Card, held: WalletCardHeld): number {
  let n = 0;
  if (held.opened_at) n += 1;
  if (held.authorized_users != null) n += 1;
  if (held.pool_status != null) n += 1;
  if (held.pinned_category != null) n += 1;
  if (held.elite_reached != null) n += 1;
  if (held.activity_threshold_met != null) n += 1;
  if (held.card_status_v2 != null) n += 1;
  if (held.nickname) n += 1;
  return Math.min(n, signalSlotCount(card));
}

// ── per-play valuation ─────────────────────────────────────────────────

// Single annual USD figure for a play, BEFORE signal-state gating.
// Returns the conservative cash equivalent for transfer/niche plays;
// face value for credits; spend × multiplier × cpp for category
// multipliers. Protections and mechanics return 0 (they're not yearly
// dollars). Exported for Phase 5 (/wallet/list page renders the same
// per-play value the engine uses).
export function basePlayValue(
  play: Play,
  profile: UserProfile,
  db: CardDatabase,
  cardCurrencyId: string | null,
): number {
  const v = play.value_model;
  switch (v.kind) {
    case "multiplier_on_category": {
      const programId = cardCurrencyId;
      const program = programId ? db.programById.get(programId) : undefined;
      const cpp =
        program?.median_redemption_cpp ??
        program?.portal_redemption_cpp ??
        program?.fixed_redemption_cpp ??
        1;
      const spendMap = profile.spend_profile as Partial<
        Record<keyof UserProfile["spend_profile"], number>
      >;
      const spend = spendMap[v.spend_category as keyof UserProfile["spend_profile"]] ?? 0;
      if (spend <= 0) return 0;
      const cap = v.cap_usd_per_year ?? null;
      const inCap = cap == null ? spend : Math.min(spend, cap);
      return (inCap * v.pts_per_dollar * cpp) / 100;
    }
    case "fixed_credit":
      return v.value_usd;
    case "transfer_redemption":
      // Conservative — low end of the cash-equivalent range. Transfer
      // plays are per-redemption events, but for the annual gauge we
      // assume one usage per year if confirmed.
      return v.cash_equiv_usd_low;
    case "protection_coverage":
    case "system_mechanic":
      return 0;
    case "niche_play":
      return v.estimated_annual_value_usd ?? 0;
    default:
      return 0;
  }
}

export type AggregatedState = "confirmed" | "interested" | "dismissed" | "unknown";

// Walk the play's reveals_signals against the user's signal map and
// reduce to a single state. Latest-wins matches the Phase 3 storage
// rule. Logic:
//   - any reveal is dismissed → dismissed
//   - all reveals confirmed → confirmed
//   - all reveals confirmed-or-interested with at least one interested → interested
//   - otherwise (some unset / no signals revealed) → unknown
//
// Exported for Phase 5 (the /wallet/list page filters on this state
// directly, the /signals dashboard uses it indirectly via the helpers
// below).
export function aggregateRevealState(
  reveals: string[],
  signals: Map<string, SignalState>,
): AggregatedState {
  if (reveals.length === 0) return "unknown";
  let allConfirmed = true;
  let anyInterested = false;
  for (const sig of reveals) {
    const s = signals.get(sig);
    if (s === "dismissed") return "dismissed";
    if (s === "interested") {
      allConfirmed = false;
      anyInterested = true;
    } else if (s === undefined) {
      allConfirmed = false;
    }
    // confirmed: leaves both flags as-is
  }
  if (allConfirmed) return "confirmed";
  if (anyInterested) return "interested";
  return "unknown";
}

// Are all of the play's required signals confirmed? When requires is
// empty (most plays), this is vacuously true.
function requirementsMet(
  requires: string[],
  signals: Map<string, SignalState>,
): boolean {
  for (const sig of requires) {
    if (signals.get(sig) !== "confirmed") return false;
  }
  return true;
}

// Capture rate to apply when a play's reveal state is "unknown" — i.e.
// the user hasn't clicked chips on the play. Uses derivePerkCapture
// against any legacy signal_id hidden in the play's value_model
// (fixed_credit carries this for backward compat). Returns 1.0 for
// multiplier plays (spend itself is the evidence) and 0 for
// niche/transfer/protection (those need explicit user opt-in).
function unknownStateCapture(play: Play, profile: UserProfile): number {
  const v = play.value_model;
  switch (v.kind) {
    case "multiplier_on_category":
      return 1.0;
    case "fixed_credit": {
      const legacySig = (v as { requires_signal_id?: string }).requires_signal_id;
      if (legacySig) return derivePerkCapture(legacySig, profile);
      return EASE_FACTOR.medium ?? 0.75;
    }
    case "transfer_redemption":
    case "niche_play":
    case "protection_coverage":
    case "system_mechanic":
      return 0;
    default:
      return 0;
  }
}

interface PlayBuckets {
  confirmed_from_signals: number;
  confirmed_from_spend_estimate: number;
  projected: number;
  dismissed: number;
}

function emptyBuckets(): PlayBuckets {
  return {
    confirmed_from_signals: 0,
    confirmed_from_spend_estimate: 0,
    projected: 0,
    dismissed: 0,
  };
}

function bucketPlay(
  play: Play,
  profile: UserProfile,
  db: CardDatabase,
  cardCurrencyId: string | null,
  signals: Map<string, SignalState>,
  buckets: PlayBuckets,
): void {
  // Gated play with unmet requirements — no value counted at all.
  if (!requirementsMet(play.requires_signals, signals)) return;

  const base = basePlayValue(play, profile, db, cardCurrencyId);
  if (base <= 0) return;

  const state = aggregateRevealState(play.reveals_signals, signals);
  switch (state) {
    case "confirmed":
      buckets.confirmed_from_signals += base;
      return;
    case "interested":
      buckets.projected += base;
      return;
    case "dismissed":
      buckets.dismissed += base;
      return;
    case "unknown":
      buckets.confirmed_from_spend_estimate +=
        base * unknownStateCapture(play, profile);
      return;
  }
}

// ── two computation paths ──────────────────────────────────────────────

function computePlaysCardValue(
  card: Card,
  held: WalletCardHeld | null,
  profile: UserProfile,
  signals: Map<string, SignalState>,
  db: CardDatabase,
): CardValue {
  const buckets = emptyBuckets();
  const cardCurrency = card.currency_earned ?? null;
  // Section 3 plays ride on card.community_plays — score uniformly so
  // projected_usd reflects every play on the page.
  const allPlays = [
    ...(card.card_plays ?? []),
    ...(card.community_plays ?? []),
  ];
  for (const play of allPlays) {
    bucketPlay(play, profile, db, cardCurrency, signals, buckets);
  }
  const fee = card.annual_fee_usd ?? 0;
  const confirmed = Math.max(
    0,
    Math.round(
      buckets.confirmed_from_signals +
        buckets.confirmed_from_spend_estimate -
        fee,
    ),
  );
  return {
    confirmed_usd: confirmed,
    projected_usd: Math.round(buckets.projected),
    dismissed_usd: Math.round(buckets.dismissed),
    confirmed_from_signals_usd: Math.round(buckets.confirmed_from_signals),
    confirmed_from_spend_estimate_usd: Math.round(
      buckets.confirmed_from_spend_estimate,
    ),
    signalsFilled: held ? signalsFilledOnHeld(card, held) : 0,
    signalsTotal: signalSlotCount(card),
  };
}

function computeLegacyCardValue(
  card: Card,
  held: WalletCardHeld | null,
  profile: UserProfile,
  db: CardDatabase,
): CardValue {
  const earning = yearlyEarningEstimate(card, profile, db);
  const { captured, available } = legacyCreditsValue(card, profile);
  const fee = card.annual_fee_usd ?? 0;

  // Match the old foundMoneyV2 shape: a low/high band collapses to a
  // point estimate biased low. The band is hidden behind the
  // confirmed/projected split here — captured credits go into confirmed,
  // available go into projected.
  const confirmedRaw = Math.max(0, earning + captured - fee);
  return {
    confirmed_usd: Math.round(confirmedRaw),
    projected_usd: Math.round(available),
    dismissed_usd: 0,
    confirmed_from_signals_usd: 0,
    confirmed_from_spend_estimate_usd: Math.round(earning + captured),
    signalsFilled: held ? signalsFilledOnHeld(card, held) : 0,
    signalsTotal: signalSlotCount(card),
  };
}

// Single entry point. Branches on whether the card has any plays
// declared. Phase 4's cutover strategy: 238 cards stay on the legacy
// path; only cards opting into the new per-play schema get
// signal-aware behavior.
export function computeCardValue(
  card: Card,
  held: WalletCardHeld | null,
  profile: UserProfile,
  signals: Map<string, SignalState>,
  db: CardDatabase,
): CardValue {
  // Branch on the union of card_plays + community_plays so a card that
  // ever moves all its plays into the community array still picks the
  // signal-aware path.
  const playCount =
    (card.card_plays?.length ?? 0) + (card.community_plays?.length ?? 0);
  if (playCount > 0) {
    return computePlaysCardValue(card, held, profile, signals, db);
  }
  return computeLegacyCardValue(card, held, profile, db);
}

// ── Phase 5: cross-card aggregation of "On my list" plays ──────────────

export interface OnMyListItem {
  cardId: string;
  play: Play;
  valueUsd: number;   // basePlayValue, no haircuts
  group: PlayGroupId; // copied from play.group for filter convenience
}

// Walks every held card, finds plays whose reveals_signals aggregate
// to "interested", and returns them as a flat sorted list. Used by the
// /wallet/list page and as the basis for the navigation hook on
// /wallet/edit (link visible when this list is non-empty). Pure
// function — no DB calls, just the loaded catalog plus the user's
// merged signal map.
export function getOnMyListItems(
  profile: UserProfile,
  signals: Map<string, SignalState>,
  db: CardDatabase,
): OnMyListItem[] {
  const out: OnMyListItem[] = [];
  for (const held of profile.cards_held ?? []) {
    const card = db.cardById.get(held.card_id);
    if (!card) continue;
    // Walk both arrays — Section 3 community plays should drive
    // recommendations the same way regular plays do when "On my list".
    const heldPlays = [
      ...(card.card_plays ?? []),
      ...(card.community_plays ?? []),
    ];
    for (const play of heldPlays) {
      if (play.reveals_signals.length === 0) continue;
      const state = aggregateRevealState(play.reveals_signals, signals);
      if (state !== "interested") continue;
      const value = basePlayValue(
        play,
        profile,
        db,
        card.currency_earned ?? null,
      );
      if (value <= 0) continue;
      out.push({
        cardId: card.id,
        play,
        valueUsd: Math.round(value),
        group: play.group,
      });
    }
  }
  out.sort((a, b) => b.valueUsd - a.valueUsd);
  return out;
}
