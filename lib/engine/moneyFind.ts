// Money-find engine for the per-card hero page. Pure function. Given a
// card, the user's profile, and the per-card play state, return a
// ranked list of money-find rows with personalized $value, status, and
// visibility flags.
//
// ── Synthetic play_id namespaces ─────────────────────────────────────
//
// The page persists three kinds of state into one table —
// `user_card_play_state` — by reserving prefixes on `play_id`:
//
//   <play.id>              → real play state (using / going_to / skip)
//   group:<group_name>     → group-level skip toggle (state="skip")
//   cold:<prompt_id>       → cold-prompt answer (state="got_it",
//                                                 notes=chip_value)
//
// Decoding lives in this file (isGroupSkipped / getColdPromptAnswer).
// The server-side write path is the existing updateCardPlayState
// action; no schema changes needed.

import type { Card, CardDatabase, Play, PlayGroupId } from "@/lib/data/loader";
import type { SpendCategoryId } from "@/lib/data/types";
import type { CardPlayState, UserProfile } from "@/lib/profile/types";

export type FindStatus = "using" | "going_to" | "skip" | "unset";

export interface ScoredFind {
  play: Play;
  score: number;             // 0-100; drives ranking within group
  visible: boolean;          // hide low-score / no-fit rows in compact mode
  personalSentence: string;  // rendered from personalization_template
  valueUsd: number | null;   // null when value depends on a missing signal
  valueRange: [number, number] | null;
  status: FindStatus;
  groupSkipped: boolean;
  needsProbe: boolean;
  probeQuestion: string | null;
}

const STATE_TO_FIND_STATUS: Record<string, FindStatus> = {
  got_it: "using",
  want_it: "going_to",
  skip: "skip",
  unset: "unset",
};

// ── helpers exposed for components ─────────────────────────────────────

export function isGroupSkipped(playState: CardPlayState[], group: string): boolean {
  return playState.some(
    (p) => p.play_id === `group:${group}` && p.state === "skip",
  );
}

export function getColdPromptAnswer(
  playState: CardPlayState[],
  promptId: string,
): string | null {
  const row = playState.find((p) => p.play_id === `cold:${promptId}`);
  if (!row || row.state !== "got_it") return null;
  return row.notes ?? null;
}

export function getPlayStatus(
  playState: CardPlayState[],
  playId: string,
): FindStatus {
  const row = playState.find((p) => p.play_id === playId);
  if (!row) return "unset";
  return STATE_TO_FIND_STATUS[row.state] ?? "unset";
}

// ── personalization template renderer ─────────────────────────────────
//
// Supports a small mustache-ish syntax. Tokens:
//   {spend.<category>}           → user's annual spend in that category, formatted "$X,XXX"
//   {value.<id>}                 → derived value the engine computed for this row
//   {cold:<prompt_id>}           → user's cold-prompt answer label, or empty
//   {destinations.contains:<x>}  → "yes" if user has destination x, "no" otherwise
//
// Any unresolved token returns "" (the sentence still renders, just
// missing that fragment). The engine sets needsProbe=true when a
// {cold:...} token is missing AND the row's prerequisites point at a
// matching cold prompt.

interface PersonalizationContext {
  profile: UserProfile;
  coldAnswers: Record<string, string>;
  derivedValues: Record<string, string>;
}

function renderTemplate(tpl: string, ctx: PersonalizationContext): string {
  return tpl.replace(/\{([^}]+)\}/g, (_, raw) => {
    const token = String(raw).trim();
    if (token.startsWith("spend.")) {
      const cat = token.slice("spend.".length) as SpendCategoryId;
      const spend = ctx.profile.spend_profile as Partial<Record<SpendCategoryId, number>>;
      const v = spend[cat];
      return v != null && v > 0 ? formatUsd(v) : "your spend";
    }
    if (token.startsWith("value.")) {
      const key = token.slice("value.".length);
      return ctx.derivedValues[key] ?? "";
    }
    if (token.startsWith("cold:")) {
      const id = token.slice("cold:".length);
      return ctx.coldAnswers[id] ?? "";
    }
    if (token.startsWith("destinations.contains:")) {
      const dest = token.slice("destinations.contains:".length).toLowerCase();
      const matches =
        ctx.profile.trips_planned?.some((t) =>
          (t.destination ?? "").toLowerCase().includes(dest),
        ) ?? false;
      return matches ? "yes" : "no";
    }
    return "";
  });
}

function formatUsd(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

// ── value computation ─────────────────────────────────────────────────

function computeValue(
  play: Play,
  profile: UserProfile,
  db: CardDatabase,
  cardCurrencyId: string | null,
): { value: number | null; range: [number, number] | null } {
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
      const spendMap = profile.spend_profile as Partial<Record<SpendCategoryId, number>>;
      const spend = spendMap[v.spend_category as SpendCategoryId] ?? 0;
      if (spend <= 0) return { value: null, range: null };
      const cap = v.cap_usd_per_year ?? null;
      const inCap = cap == null ? spend : Math.min(spend, cap);
      const value = (inCap * v.pts_per_dollar * cpp) / 100;
      return { value: Math.round(value), range: null };
    }
    case "fixed_credit": {
      // Show face value; capture-rate adjustment lives in the page UX
      // (status pill: claimed / planned / skip). The displayed $value
      // is the upper bound — what's available, not what's been used.
      return { value: Math.round(v.value_usd), range: null };
    }
    case "transfer_redemption": {
      return {
        value: null,
        range: [v.cash_equiv_usd_low, v.cash_equiv_usd_high],
      };
    }
    case "protection_coverage": {
      // No $value displayed — protections show as questions, not amounts.
      return { value: null, range: null };
    }
    case "system_mechanic": {
      return { value: null, range: null };
    }
    case "niche_play": {
      const est = v.estimated_annual_value_usd ?? null;
      return { value: est, range: null };
    }
    default:
      return { value: null, range: null };
  }
}

// ── personal score formula (kept simple for v0) ────────────────────────

function scorePlay(
  play: Play,
  profile: UserProfile,
  groupSkipped: boolean,
  status: FindStatus,
): number {
  let score = 50;
  // Profile-signal match.
  const signals = play.prerequisites?.profile_signals ?? [];
  const userSignals = new Set<string>([
    ...(profile.brands_used ?? []),
    ...(profile.perk_opt_ins ?? []),
    ...(profile.trips_planned ?? []).map((t) =>
      `destination_${(t.destination ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    ),
  ]);
  if (signals.some((s: string) => userSignals.has(s))) score += 30;

  // Destination match for transfer redemptions.
  const v = play.value_model;
  if (v.kind === "transfer_redemption" && v.destination_signal) {
    if (userSignals.has(v.destination_signal)) score += 15;
  }

  // Spend-category present for multipliers.
  if (v.kind === "multiplier_on_category") {
    const spendMap = profile.spend_profile as Partial<Record<SpendCategoryId, number>>;
    const s = spendMap[v.spend_category as SpendCategoryId];
    if (s && s > 0) score += 20;
  }

  // Risk-tier modifier on niche plays.
  if (v.kind === "niche_play") {
    if (v.risk_tier === "yellow") score -= 10;
    else score += 10;
  }

  // Group-skip penalty unless the user explicitly opted into this row.
  if (groupSkipped && status !== "going_to" && status !== "using") {
    score -= 40;
  }

  return Math.max(0, Math.min(100, score));
}

// ── prerequisite check ─────────────────────────────────────────────────

function prerequisitesMet(
  play: Play,
  profile: UserProfile,
): boolean {
  const heldIds = new Set((profile.cards_held ?? []).map((h) => h.card_id));
  const anyOf: string[] = play.prerequisites?.cards_held_any_of ?? [];
  const allOf: string[] = play.prerequisites?.cards_held_all_of ?? [];
  if (anyOf.length > 0 && !anyOf.some((id: string) => heldIds.has(id))) return false;
  if (allOf.length > 0 && !allOf.every((id: string) => heldIds.has(id))) return false;
  return true;
}

// ── main entry point ───────────────────────────────────────────────────

export function scoreFinds(
  card: Card,
  profile: UserProfile,
  playState: CardPlayState[],
  db: CardDatabase,
  _today: string,
): ScoredFind[] {
  const plays = card.card_plays ?? [];
  const coldPrompts = card.cold_prompts ?? [];

  // Build the cold-answer map once.
  const coldAnswers: Record<string, string> = {};
  for (const cp of coldPrompts) {
    const answer = getColdPromptAnswer(playState, cp.id);
    if (answer) {
      const chip = cp.answer_chips.find((c) => c.value === answer);
      coldAnswers[cp.id] = chip?.label ?? answer;
    }
  }

  return plays.map((play) => {
    const status = getPlayStatus(playState, play.id);
    const groupSkipped = isGroupSkipped(playState, play.group);

    // Derived $value from the value model.
    const { value, range } = computeValue(
      play,
      profile,
      db,
      card.currency_earned ?? null,
    );

    // Build personalization context with derived values for tokens.
    const derivedValues: Record<string, string> = {};
    if (play.value_model.kind === "multiplier_on_category" && value != null) {
      derivedValues[`${play.value_model.spend_category}_${play.value_model.pts_per_dollar}x`] =
        formatUsd(value);
    }

    const personalSentence = renderTemplate(play.personalization_template, {
      profile,
      coldAnswers,
      derivedValues,
    });

    // Probe detection: does the template reference a cold-prompt key
    // we haven't answered yet?
    const probeMatch = play.personalization_template.match(/\{cold:([^}]+)\}/);
    const probePromptId = probeMatch ? probeMatch[1] : null;
    const needsProbe =
      probePromptId != null && !coldAnswers[probePromptId];
    const probeQuestion =
      needsProbe && probePromptId
        ? coldPrompts.find((c) => c.id === probePromptId)?.question ?? null
        : null;

    const score = scorePlay(play, profile, groupSkipped, status);
    const visible =
      prerequisitesMet(play, profile) && (score > 20 || status !== "unset");

    return {
      play,
      score,
      visible,
      personalSentence,
      valueUsd: value,
      valueRange: range,
      status,
      groupSkipped,
      needsProbe,
      probeQuestion,
    };
  });
}

// Group helpers for the page.

export const ALL_GROUPS: PlayGroupId[] = [
  "hotels",
  "airlines",
  "travel_services",
  "shopping",
  "cash",
  "niche",
];

export const GROUP_LABELS: Record<PlayGroupId, string> = {
  hotels: "Hotels",
  airlines: "Airlines",
  travel_services: "Travel services",
  shopping: "Shopping",
  cash: "Earning",
  niche: "Niche & advanced",
};

export function findsByGroup(
  finds: ScoredFind[],
): Map<PlayGroupId, ScoredFind[]> {
  const m = new Map<PlayGroupId, ScoredFind[]>();
  for (const g of ALL_GROUPS) m.set(g, []);
  for (const f of finds) {
    const arr = m.get(f.play.group) ?? [];
    arr.push(f);
    m.set(f.play.group, arr);
  }
  // Sort within each group by score desc, then status (unset last).
  for (const g of ALL_GROUPS) {
    const arr = m.get(g)!;
    arr.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const order: Record<FindStatus, number> = {
        going_to: 0,
        using: 1,
        unset: 2,
        skip: 3,
      };
      return order[a.status] - order[b.status];
    });
  }
  return m;
}
