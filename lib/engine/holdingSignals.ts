// Phase 4 of signal-first architecture.
//
// Auto-derived holding signals — facts the system knows about a user
// purely from what's in their wallet, no chip click required. Holding a
// Citi Double Cash means the Citi ThankYou ecosystem is a real lever
// for that user; the engine should treat that as confirmed without
// asking.
//
// Each rule is a predicate over the set of held card_ids. When the
// predicate matches, the signal is auto-confirmed and merged into the
// user's signal map before either computeCardValue or scoreCard runs.
//
// Rules use only card_ids that actually exist in the catalog today
// (verified against cards/ at authoring time). Adding more feeder cards
// later is a matter of extending the OR list, not changing engine code.
//
// Pure functions. No I/O, no Date.now. Mirrors the engine module
// discipline.

import type { WalletCardHeld } from "./types";
import type { SignalState } from "@/lib/profile/server";

// Maps holding signal id → predicate over the set of held card_ids.
// When the predicate is true for a wallet, the signal is auto-confirmed.
//
// Keep this list aligned with the holdings.* signals in signals/. The
// build script doesn't enforce that alignment yet — Phase 6 may add a
// validation pass.
export const HOLDING_RULES: Record<string, (heldIds: Set<string>) => boolean> = {
  "holdings.thank_you_feeder": (h) =>
    h.has("citi_double_cash") || h.has("citi_custom_cash"),
  "holdings.amex_mr_feeder": (h) =>
    h.has("amex_blue_business_plus") || h.has("amex_green"),
  "holdings.ultimate_rewards_feeder": (h) =>
    h.has("chase_freedom_unlimited") || h.has("chase_freedom_flex"),
  "holdings.capital_one_miles_feeder": (h) =>
    h.has("capital_one_quicksilver") || h.has("capital_one_savor_one"),
};

// Walk HOLDING_RULES against the user's wallet. Returns a map of
// signal_id → "confirmed" for every rule that fires.
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

// Combine user-clicked signals with auto-derived holding signals.
// User-clicked entries always win — they're authoritative ("the user
// said no" beats "the wallet implies yes"). Auto-derived entries fill
// in gaps where the user hasn't explicitly opined.
export function mergeSignals(
  userSignals: Map<string, SignalState>,
  derived: Map<string, "confirmed">,
): Map<string, SignalState> {
  const merged: Map<string, SignalState> = new Map(derived);
  for (const [k, v] of userSignals) merged.set(k, v);
  return merged;
}
