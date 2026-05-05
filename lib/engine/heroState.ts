// Hero-state derivation. Pure function. Maps "how much have we learned
// about this card from this user" into a three-state Hero region
// (cold / warm / hot). The Hero component renders different content
// per state — questions in cold, running progress in warm, ranked
// money-finds in hot.
//
// Thresholds:
//   cold = no answers anywhere
//   warm = some answers but data depth < 60%
//   hot  = data depth ≥ 60%

import type { Card } from "@/lib/data/loader";
import type { CardPlayState } from "@/lib/profile/types";

export type HeroState = "cold" | "warm" | "hot";

export interface HeroSummary {
  state: HeroState;
  dataDepth: number;        // 0..1
  catalogTotal: number;
  catalogAnswered: number;
  coldPromptsAnswered: number;
  coldPromptsTotal: number;
}

export function deriveHeroState(
  card: Card,
  playState: CardPlayState[],
): HeroSummary {
  const plays = [
    ...(card.card_plays ?? []),
    ...(card.community_plays ?? []),
  ];
  const coldPrompts = card.cold_prompts ?? [];

  // Real-play state (excludes synthetic ids).
  const playIdSet = new Set(plays.map((p) => p.id));
  const catalogAnswered = playState.filter(
    (p) =>
      playIdSet.has(p.play_id) &&
      p.state !== "unset",
  ).length;

  const coldPromptsAnswered = coldPrompts.filter((cp) =>
    playState.some(
      (p) => p.play_id === `cold:${cp.id}` && p.state === "got_it",
    ),
  ).length;

  const catalogTotal = plays.length;
  const dataDepth = catalogTotal === 0 ? 0 : catalogAnswered / catalogTotal;

  let state: HeroState;
  if (catalogAnswered === 0 && coldPromptsAnswered === 0) {
    state = "cold";
  } else if (dataDepth >= 0.6) {
    state = "hot";
  } else {
    state = "warm";
  }

  return {
    state,
    dataDepth,
    catalogTotal,
    catalogAnswered,
    coldPromptsAnswered,
    coldPromptsTotal: coldPrompts.length,
  };
}
