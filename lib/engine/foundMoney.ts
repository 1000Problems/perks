// Phase 4 of signal-first architecture: foundMoneyV2 is now a thin
// compat wrapper around computeCardValue. Existing callers (wallet row,
// edit panel) need no change — they keep reading {low, high, point,
// signalsFilled, signalsTotal}; the underlying numbers now come from
// the signal-aware engine when the user has clicked chips.
//
// Cards without card_plays (238 of 239 today) fall into the legacy
// computation path inside computeCardValue, so their numbers are
// byte-identical to the pre-Phase-4 behavior. Only Strata Premier (the
// one card with card_plays) reflects new behavior, and only when the
// user's signal map has confirmed/interested/dismissed entries that
// touch Strata Premier's plays.

import type { Card, CardDatabase } from "@/lib/data/loader";
import type { UserProfile, WalletCardHeld } from "./types";
import type { SignalState } from "@/lib/profile/server";
import { computeCardValue, type CardValue } from "./cardValue";

export interface FoundMoneyV2 {
  low: number;
  high: number;
  point: number;
  signalsFilled: number;
  signalsTotal: number;
}

export function computeFoundMoneyV2(
  card: Card,
  held: WalletCardHeld | null,
  profile: UserProfile,
  db: CardDatabase,
  // Phase 4: optional fifth argument so existing 4-arg call sites (the
  // 238 cards on the legacy path, plus pre-Phase-4 code paths) compile
  // unchanged. When omitted, the signal map is empty and the engine
  // behaves exactly as before for cards without card_plays. Pass a
  // populated map (from getUserSignals merged with deriveHoldingSignals)
  // to get signal-aware behavior on cards with card_plays.
  signals: Map<string, SignalState> = new Map(),
): FoundMoneyV2 {
  const v: CardValue = computeCardValue(card, held, profile, signals, db);

  // Reconstruct the band shape the FoundMoneyTile expects. Confirmed
  // is the floor we're sure about; projected is the upside if the user
  // acts on their on-my-list intent. Point biases toward confirmed so
  // the displayed number stays honest.
  const low = Math.max(0, v.confirmed_usd);
  const high = Math.max(low, v.confirmed_usd + v.projected_usd);
  const point = v.confirmed_usd;

  return {
    low,
    high,
    point,
    signalsFilled: v.signalsFilled,
    signalsTotal: v.signalsTotal,
  };
}
