// Spend-driven perk capture. The user's spend_profile is the implicit
// signal: if they spend on dining, dining-credit captures; if they fly
// enough, lounge access activates. This replaces the opt-in flow on
// the assumption that spend pattern is a stronger behavioral signal
// than a checkbox would be.
//
// Each `signal_id` on a card's annual_credit / ongoing_perk maps to a
// capture function returning a 0–1 multiplier. The engine multiplies
// the perk's face value by the capture rate. Subjective perks
// (Equinox, Saks, Clear, Peloton) have no spend signal that infers
// usage — they stay at 0 by default and rely on profile.perk_opt_ins
// to flip on. That keeps the floor honest: we don't fabricate value.
//
// Tuning these thresholds is the lever for calibration. They live in
// one place so a single review pass against real wallets can tighten
// or loosen across the board.

import type { SpendCategoryId } from "@/lib/data/types";
import type { UserProfile } from "./types";

type SpendMap = UserProfile["spend_profile"];

function s(p: SpendMap, k: SpendCategoryId): number {
  return p[k] ?? 0;
}

// Linear ramp: 0 below floor, 1 at full, linear in between.
function linear(spend: number, floor: number, full: number): number {
  if (spend <= floor) return 0;
  if (spend >= full) return 1;
  return (spend - floor) / (full - floor);
}

// Binary: 1 if condition holds, 0 otherwise. Used for activation-style
// perks (lounge access, hotel status) where partial-capture doesn't
// make sense — you either fly enough to use the lounge or you don't.
function step(condition: boolean): number {
  return condition ? 1 : 0;
}

// Maps `signal_id` to a capture-rate function. Add a new perk class
// here, then tag the matching annual_credits/ongoing_perks in
// cards/*.md with the signal_id.
const SIGNAL_RULES: Record<string, (p: SpendMap) => number> = {
  // ── travel-driven credits ──────────────────────────────────────
  // Airline-incidental: $200-class credit covering bag fees, seat
  // selection, in-flight wifi. Anyone flying ≥1 trip a year burns
  // through it without effort.
  airline_incidental_credit: (p) => linear(s(p, "airfare"), 300, 1500),

  // CSR / Cap One / Venture-style "travel credit" (broad scope —
  // applies to airfare OR hotels spend). $300-class.
  travel_credit: (p) => linear(s(p, "airfare") + s(p, "hotels"), 500, 2000),

  // Hotel credit (FHR resort credit, IHG hotel credit, etc.) — only
  // captures when the user actually stays at hotels. Higher full
  // threshold than airline incidentals because the credit usually
  // requires booking through a specific channel.
  hotel_credit: (p) => linear(s(p, "hotels"), 500, 2500),

  // Prepaid hotel collection (Hilton Aspire, Marriott Brilliant) —
  // only captures with serious hotel spend.
  prepaid_hotel_collection: (p) => linear(s(p, "hotels"), 1000, 4000),

  // ── lifestyle credits ─────────────────────────────────────────
  // Uber / rideshare credits. Used by Amex Gold, Amex Plat.
  uber_credit: (p) => linear(s(p, "transit"), 200, 1200),

  // DoorDash credits (CSR, Amex Plat business). Tied to dining
  // spend on the assumption that DoorDash users have dining spend.
  doordash_credit: (p) => linear(s(p, "dining"), 500, 2500),

  // Restaurant / dining credit (Amex Gold dining credit, Resy).
  // Lower full threshold than DoorDash because broad dining spend
  // is more common than DoorDash specifically.
  dining_credit: (p) => linear(s(p, "dining"), 300, 1500),

  // Grocery credit (none in current catalog but ready for future).
  grocery_credit: (p) => linear(s(p, "groceries"), 500, 3000),

  // Streaming credit (Disney+ on Amex Plat business, etc.) — binary
  // because most users either subscribe to streaming or don't, and
  // even modest streaming spend implies active use.
  streaming_credit: (p) => step(s(p, "streaming") > 0),

  // Walmart+ credit (Amex Plat). Triggers only when shopping spend
  // is high enough to plausibly use grocery delivery.
  walmart_plus_credit: (p) => step(s(p, "shopping") >= 1000),

  // ── behavioral perks (binary thresholds) ──────────────────────
  // Lounge access (Priority Pass, Centurion, Delta Sky Club).
  // Activates only when the user flies enough to actually use it.
  lounge_access: (p) => step(s(p, "airfare") >= 1500),

  // Free checked bag — used on every flight, low threshold.
  free_checked_bag: (p) => step(s(p, "airfare") >= 400),

  // Priority boarding — usually paired with checked bag perks.
  priority_boarding: (p) => step(s(p, "airfare") >= 400),

  // Global Entry / TSA PreCheck — captures once every ~4 years, so
  // the threshold reflects "do you fly enough to want it".
  global_entry_tsa: (p) => step(s(p, "airfare") >= 800),

  // Hotel automatic status (Gold/Platinum elite). Useful only for
  // people who actually stay at the brand.
  hotel_status: (p) => step(s(p, "hotels") >= 1500),

  // Trip insurance (cancellation, delay, baggage). Activates with
  // any travel spend — the protection's expected value scales with
  // travel volume, but binary capture is fine for first pass.
  trip_insurance: (p) => step(s(p, "airfare") + s(p, "hotels") > 0),

  // Cell-phone protection — gated on phone bill (utilities).
  cell_phone_protection: (p) => step(s(p, "utilities") > 0),

  // Always-on protections (purchase, extended warranty). These
  // strictly speaking should be "passive" features, not signal-
  // gated. Listed here as a fallback so a perk tagged with this
  // signal still captures even if its activation field defaults to
  // signal_gated.
  purchase_protection: () => 1,
  extended_warranty: () => 1,
};

// Resolve a perk's capture multiplier. Falls through three layers:
//   1. signal_id matches a SIGNAL_RULES entry → capture per spend
//   2. signal_id is in profile.perk_opt_ins → 1.0 (subjective opt-in)
//   3. otherwise → 0
//
// The opt-in fallback is the override for perks where spend doesn't
// imply usage (Equinox, Saks, Clear, Peloton). When/if a Settings
// page ships, those signal_ids land in perk_opt_ins. Until then they
// quietly stay at 0 — better to under-credit than over-credit.
export function derivePerkCapture(
  signalId: string | null,
  profile: UserProfile,
): number {
  if (!signalId) return 0;
  const rule = SIGNAL_RULES[signalId];
  if (rule) return rule(profile.spend_profile);
  if (profile.perk_opt_ins?.includes(signalId)) return 1;
  return 0;
}

// Exported for tests and a future calibration tool.
export { SIGNAL_RULES };
