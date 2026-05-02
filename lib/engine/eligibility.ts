// Eligibility engine. Pure function: given a candidate card, the user's
// wallet history, the loaded card database, and "today," return a chip
// status and a short note. No I/O, no Date.now() — uses the `today` arg
// for deterministic testing.
//
// Implements the rules that show up most often in real applications:
//   - Chase 5/24: personal cards opened (any issuer) in the last 24 months.
//   - Amex once-per-lifetime: same card with bonus_received already.
//   - Amex 2/90: two Amex personal approvals in 90 days warns yellow.
//   - Citi family rules: light heuristic (24-month gap on family product).
//   - Capital One ~1-per-6-months pacing.
//   - BoA 2/3/4 and 7/12 across BoA products.
//   - Sapphire 48-month rule: SUB only if no Sapphire SUB in last 48 months.
//   - Business card warning: yellow if issuer is in our personal-only set.
//
// Deliberately conservative — we surface risk, we don't gatekeep.

import type { Card, CardDatabase } from "@/lib/data/loader";
import type { CreditScoreBand, EligibilityResult, WalletCardHeld } from "./types";
import { CREDIT_BAND_RANK } from "./types";
import {
  getMembershipStatus,
  membershipRequired,
} from "./brandAffinity";

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function monthsBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / MONTH_MS;
}
function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / DAY_MS;
}

function parseOpenedAt(s: string): Date {
  // Accept "YYYY-MM-DD" or "YYYY-MM" — pad missing day to "-01".
  const norm = /^\d{4}-\d{2}$/.test(s) ? `${s}-01` : s;
  const d = new Date(norm);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

interface HeldWithCard {
  held: WalletCardHeld;
  card: Card | undefined;
}

function expand(wallet: WalletCardHeld[], db: CardDatabase): HeldWithCard[] {
  return wallet.map((h) => ({ held: h, card: db.cardById.get(h.card_id) }));
}

// 5/24 — count personal cards opened (any issuer) in last 24 months.
// Business cards from most issuers don't report to personal credit; treat
// them as not counting unless explicitly flagged.
function compute524(expanded: HeldWithCard[], today: Date): number {
  return expanded.filter(({ held, card }) => {
    if (!card || card.card_type !== "personal") return false;
    const opened = parseOpenedAt(held.opened_at);
    return monthsBetween(today, opened) <= 24;
  }).length;
}

function chaseEligibility(
  candidate: Card,
  expanded: HeldWithCard[],
  today: Date,
): EligibilityResult {
  const count = compute524(expanded, today);

  // Sapphire 48-month rule: any Sapphire SUB received in last 48 months
  // disqualifies a new Sapphire SUB.
  const isSapphire = /sapphire/i.test(candidate.id) || /sapphire/i.test(candidate.name);
  if (isSapphire) {
    const recentSapphireSub = expanded.some(({ held, card }) => {
      if (!card) return false;
      if (!/sapphire/i.test(card.id)) return false;
      if (!held.bonus_received) return false;
      return monthsBetween(today, parseOpenedAt(held.opened_at)) <= 48;
    });
    if (recentSapphireSub) {
      return {
        status: "red",
        note: "Sapphire 48-month rule — bonus already taken",
      };
    }
  }

  if (count >= 5) {
    return { status: "red", note: `At ${count}/24 — Chase will likely deny` };
  }
  if (count === 4) {
    return { status: "yellow", note: `At ${count}/24 — risky` };
  }
  return { status: "green", note: `Eligible · ${count}/24` };
}

function amexEligibility(
  candidate: Card,
  wallet: WalletCardHeld[],
  expanded: HeldWithCard[],
  today: Date,
): EligibilityResult {
  // Once-per-lifetime: same card_id, bonus already received → red.
  const heldSame = wallet.find(
    (h) => h.card_id === candidate.id && h.bonus_received,
  );
  if (heldSame) {
    return {
      status: "red",
      note: "Once-per-lifetime — bonus already received",
    };
  }

  // 2/90: two Amex personal approvals in last 90 days → yellow.
  const recentAmex = expanded.filter(({ held, card }) => {
    if (!card || card.issuer !== "Amex" || card.card_type !== "personal") return false;
    return daysBetween(today, parseOpenedAt(held.opened_at)) <= 90;
  });
  if (recentAmex.length >= 2) {
    return { status: "yellow", note: "Heavy recent Amex activity — 2/90 risk" };
  }

  // 5-credit-card cap (charge cards exempt — tag heuristic).
  const amexCredit = expanded.filter(({ card }) => {
    if (!card || card.issuer !== "Amex") return false;
    return card.card_type === "personal" && (card.annual_fee_usd ?? 0) < 695; // proxy: charge cards usually $695+
  });
  if (amexCredit.length >= 5) {
    return { status: "yellow", note: "5-credit-card Amex cap — verify" };
  }

  return { status: "green", note: "Eligible" };
}

function citiEligibility(
  candidate: Card,
  expanded: HeldWithCard[],
  today: Date,
): EligibilityResult {
  // 8/65/95 family heuristics — cap on ThankYou family applications.
  const recentCiti48 = expanded.filter(({ held, card }) => {
    if (!card || card.issuer !== "Citi") return false;
    return daysBetween(today, parseOpenedAt(held.opened_at)) <= 95;
  });

  // 1-in-8-days
  const recentCiti8 = expanded.some(({ held, card }) => {
    if (!card || card.issuer !== "Citi") return false;
    return daysBetween(today, parseOpenedAt(held.opened_at)) <= 8;
  });
  if (recentCiti8) {
    return { status: "red", note: "Citi 8-day rule blocks new approvals" };
  }
  if (recentCiti48.length >= 2) {
    return { status: "yellow", note: "Citi 65/95-day pacing — risky" };
  }

  // ThankYou family 24-month bonus rule (heuristic).
  const isTYFamily = /strata|premier|prestige|preferred|rewards.*plus/i.test(candidate.id);
  if (isTYFamily) {
    const recentFamilySub = expanded.some(({ held, card }) => {
      if (!card || card.issuer !== "Citi") return false;
      if (!held.bonus_received) return false;
      return monthsBetween(today, parseOpenedAt(held.opened_at)) <= 24;
    });
    if (recentFamilySub) {
      return { status: "yellow", note: "Citi family 24-month SUB rule" };
    }
  }

  return { status: "green", note: "Eligible" };
}

function capOneEligibility(
  expanded: HeldWithCard[],
  today: Date,
): EligibilityResult {
  // Cap One pacing: 1 personal application per ~6 months is the stated
  // soft rule. Surface yellow when the most recent CapOne open was within
  // 6 months.
  const latest = expanded
    .filter(({ card }) => card?.issuer === "Capital One" && card.card_type === "personal")
    .sort((a, b) =>
      parseOpenedAt(b.held.opened_at).getTime() -
      parseOpenedAt(a.held.opened_at).getTime(),
    )[0];

  if (latest) {
    const months = monthsBetween(today, parseOpenedAt(latest.held.opened_at));
    if (months < 6) {
      return { status: "yellow", note: "Capital One 6-month pacing — risky" };
    }
  }

  return { status: "green", note: "Eligible" };
}

function boaEligibility(
  expanded: HeldWithCard[],
  today: Date,
): EligibilityResult {
  const boa = expanded.filter(({ card }) => card?.issuer === "Bank of America");

  const last30 = boa.filter(({ held }) =>
    daysBetween(today, parseOpenedAt(held.opened_at)) <= 30,
  ).length;
  const last12mo = boa.filter(({ held }) =>
    monthsBetween(today, parseOpenedAt(held.opened_at)) <= 12,
  ).length;
  const last24mo = boa.filter(({ held }) =>
    monthsBetween(today, parseOpenedAt(held.opened_at)) <= 24,
  ).length;

  // Check the 7/12 ceiling first — it's the more specific (and severe)
  // diagnostic. The 2/3/4 rule subsumes it counting-wise (anyone at 7/12
  // is also at ≥3/12), so without this ordering the 7/12 message would
  // never surface.
  if (last12mo >= 7) {
    return { status: "red", note: "BoA 7/12 rule blocks new approvals" };
  }
  if (last30 >= 2 || last12mo >= 3 || last24mo >= 4) {
    return { status: "red", note: "BoA 2/3/4 rule blocks new approvals" };
  }

  return { status: "green", note: "Eligible" };
}

// Yellow-flag cards that require a club / co-op / credit-union
// membership the user hasn't signaled. Costco, Sam's Club, REI, Amazon
// Prime, USAA, NFCU, PenFed, AAA — all fall through here. When the
// user's brand picks satisfy the requirement we suppress the flag
// entirely; otherwise we render the requirement string verbatim so the
// user sees what they'd need to qualify.
function membershipFlag(
  card: Card,
  brandsUsed: string[],
): EligibilityResult | null {
  const status = getMembershipStatus(card, brandsUsed);
  if (status !== "missing") return null;
  const req = membershipRequired(card);
  return {
    status: "yellow",
    note: req ? `Requires ${req}` : "Requires a separate membership",
  };
}

function businessFlag(card: Card): EligibilityResult | null {
  if (card.card_type === "business") {
    return {
      status: "yellow",
      note: "Business card — needs business income to apply",
    };
  }
  return null;
}

// Heuristic credit-band floor by card. We don't have a per-card column
// populated yet — derive it from card_type and annual fee, which are
// already in the schema. Premium cards typically need very_good (740+),
// mid-tier need good (670+), entry-level need fair (580+), and the
// secured/student tiers accept anyone building credit. Conservative —
// matches public approval-data ranges and intentionally undershoots
// rather than promising approval the user might not get.
export function creditBandFloorForCard(card: Card): CreditScoreBand {
  if (card.card_type === "secured" || card.card_type === "student") return "building";
  const fee = card.annual_fee_usd ?? 0;
  if (fee >= 550) return "very_good";
  if (fee >= 95) return "good";
  return "fair";
}

const BAND_LABEL: Record<CreditScoreBand, string> = {
  building: "building credit",
  fair: "fair (580–669)",
  good: "good (670–739)",
  very_good: "very good (740–799)",
  excellent: "excellent (800+)",
  unknown: "unknown",
};

function creditBandFlag(
  card: Card,
  userBand: CreditScoreBand | null | undefined,
): EligibilityResult | null {
  if (!userBand || userBand === "unknown") return null;
  const floor = creditBandFloorForCard(card);
  if (CREDIT_BAND_RANK[userBand] >= CREDIT_BAND_RANK[floor]) return null;
  return {
    status: "yellow",
    note: `Approvals typically at ${BAND_LABEL[floor]}; you reported ${BAND_LABEL[userBand]}`,
  };
}

function pickStricter(...results: EligibilityResult[]): EligibilityResult {
  // red > yellow > green
  const order = { red: 2, yellow: 1, green: 0 } as const;
  return results.reduce((acc, r) =>
    order[r.status] > order[acc.status] ? r : acc,
  );
}

export function evaluateEligibility(
  card: Card,
  wallet: WalletCardHeld[],
  db: CardDatabase,
  today: Date,
  userBand?: CreditScoreBand | null,
  brandsUsed: string[] = [],
): EligibilityResult {
  const expanded = expand(wallet, db);

  // Chase 5/24 applies to Chase cards specifically.
  // Other issuers: their own rules.
  let issuerResult: EligibilityResult;
  switch (card.issuer) {
    case "Chase":
      issuerResult = chaseEligibility(card, expanded, today);
      break;
    case "Amex":
      issuerResult = amexEligibility(card, wallet, expanded, today);
      break;
    case "Citi":
      issuerResult = citiEligibility(card, expanded, today);
      break;
    case "Capital One":
      issuerResult = capOneEligibility(expanded, today);
      break;
    case "Bank of America":
      issuerResult = boaEligibility(expanded, today);
      break;
    default:
      issuerResult = { status: "green", note: "Eligible" };
  }

  const biz = businessFlag(card);
  const credit = creditBandFlag(card, userBand);
  const membership = membershipFlag(card, brandsUsed);
  const flags = [issuerResult, biz, credit, membership].filter(
    (r): r is EligibilityResult => r != null,
  );
  return pickStricter(...flags);
}
