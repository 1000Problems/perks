// Stub found-money engine for the wallet-edit-v2 page. Computes a
// per-card dollar value from card metadata + the user's spend profile
// and signals.
//
// This is a deliberate placeholder until the audit engine ships in
// TASK-strata-audit-v0. Once that lands, this file is replaced with
// a thin wrapper that delegates to `computeAudit` and returns the
// gauge's pillar totals. Keeping it in its own module so the swap is
// a single import change at the call sites.
//
// The shape returned matches what FoundMoneyTile expects: a low/high
// range that collapses to a single point estimate once enough signals
// are filled in.
//
// Design intent (preserved from the prototype):
//   - Range when signals_filled / signals_total < 0.7
//   - Single point estimate otherwise
//   - Numbers feel honest, not aspirational. Ease-of-use multipliers
//     on credits already do most of the work; we add a conservative
//     yearly earning estimate on top.

import type { Card, CardDatabase } from "@/lib/data/loader";
import type { UserProfile, WalletCardHeld } from "./types";

export interface FoundMoneyV2 {
  low: number;
  high: number;
  point: number;
  signalsFilled: number;
  signalsTotal: number;
}

const EASE_FACTOR: Record<string, number> = {
  easy: 1.0,
  medium: 0.75,
  hard: 0.4,
  coupon_book: 0.2,
};

// Map our 12 spend categories onto the card's `earning` rules. Substring
// match against the rule's `category` label, lowercased. Mirrors the
// scoring engine's matchers but kept local so this file stays
// dependency-free.
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
// category-matched rule. Falls back to portal cpp when median is null.
function yearlyEarningEstimate(
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
  // Approximate "everything else" — treat 30% of the total spend as
  // non-bonus. Conservative estimate; the real audit engine breaks this
  // down per category.
  const totalSpend = Object.values(profile.spend_profile).reduce(
    (a, b) => a + (b ?? 0),
    0,
  );
  total += totalSpend * 0.3 * baseRate;
  return total;
}

// Sum of annual_credits captured at face × ease_factor. Subjective
// signal-gated credits (perk_opt_ins) capture full when opted in; otherwise
// they still count toward `available` but at half value (range only).
function creditsValue(card: Card, profile: UserProfile): { captured: number; available: number } {
  let captured = 0;
  let available = 0;
  for (const cr of card.annual_credits) {
    const face = cr.value_usd ?? 0;
    if (face <= 0) continue;
    const ease = EASE_FACTOR[cr.ease_of_use ?? "medium"] ?? 0.75;
    const optedIn =
      cr.signal_id && profile.perk_opt_ins?.includes(cr.signal_id);
    if (optedIn) {
      captured += face * Math.max(ease, 0.75); // opt-in implies easier capture
    } else {
      available += face * ease;
    }
  }
  return { captured, available };
}

// Total signal slots a user could fill on this card. Conservative count:
//   - 1 base slot (opening details)
//   - 1 per claimable annual credit (claim toggle)
//   - 1 if the card has a 5x category picker
//   - 1 if pool-eligible
//   - 2 if cobrand (elite reached + activity met)
function signalSlotCount(card: Card): number {
  let n = 1;
  n += card.annual_credits.length;
  if (card.accepts_pinned_category && card.accepts_pinned_category.length > 0) n += 1;
  if (card.is_pool_spoke) n += 1;
  if (card.is_cobrand) n += 2;
  return n;
}

function signalsFilledOnHeld(card: Card, held: WalletCardHeld): number {
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

export function computeFoundMoneyV2(
  card: Card,
  held: WalletCardHeld | null,
  profile: UserProfile,
  db: CardDatabase,
): FoundMoneyV2 {
  const earning = yearlyEarningEstimate(card, profile, db);
  const { captured, available } = creditsValue(card, profile);
  const fee = card.annual_fee_usd ?? 0;

  // Range: low = guaranteed cash floor (conservative — earning at 60% of
  // estimate, only captured credits, minus fee). High = full estimate
  // plus available credits captured. Point = midpoint, biased toward
  // low so the displayed number feels honest.
  const low = Math.max(0, Math.round(earning * 0.6 + captured - fee));
  const high = Math.max(0, Math.round(earning + captured + available - fee));
  const point = Math.round(low * 0.55 + high * 0.45);

  const signalsTotal = signalSlotCount(card);
  const signalsFilled = held ? signalsFilledOnHeld(card, held) : 0;

  return { low, high, point, signalsFilled, signalsTotal };
}
