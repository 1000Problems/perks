// Scoring engine. Pure function. Given a candidate card, the user's
// profile, and the loaded card database, compute the marginal annual
// value of adding this card to their wallet — broken into auditable
// line items the drill-in panel can render.
//
// The engine treats card-database categories as free-form labels and
// maps them onto the user's SpendCategoryId taxonomy via SPEND_MATCHERS
// below. Add patterns as new card categories appear; the function
// degrades gracefully when nothing matches (the everything_else rate
// catches anything we missed).

import type { Card, CardDatabase } from "@/lib/data/loader";
import type { SpendCategoryId } from "@/lib/data/types";
import type {
  CardScore,
  NewPerkOut,
  ScoreLineItem,
  ScoringOptions,
  UserProfile,
  WalletCardHeld,
} from "./types";
import { getBrandFit } from "./brandAffinity";

const ALL_CATS: SpendCategoryId[] = [
  "groceries",
  "dining",
  "gas",
  "airfare",
  "hotels",
  "streaming",
  "shopping",
  "drugstore",
  "transit",
  "utilities",
  "home",
  "other",
];

// Card-database earning labels to SpendCategoryId. Substring match on the
// lowercased label. First match wins; specific labels precede generic.
const SPEND_MATCHERS: { test: RegExp; cat: SpendCategoryId }[] = [
  { test: /grocer|supermarket|wholesale_club|costco|whole_food/, cat: "groceries" },
  { test: /restaurant|dining|takeout|food_delivery|doordash|grubhub|uber_eats/, cat: "dining" },
  { test: /\bgas\b|gas_station|fuel|ev_charg/, cat: "gas" },
  { test: /flight|airfare|airline|airways/, cat: "airfare" },
  { test: /hotel|lodging|resort|marriott|hyatt|hilton|ihg|wyndham/, cat: "hotels" },
  { test: /streaming|netflix|spotify|disney|hulu|peacock|paramount/, cat: "streaming" },
  { test: /amazon|online_purchas|online_shop|wayfair|select_online_retail/, cat: "shopping" },
  { test: /drugstore|pharmacy|cvs|walgreens/, cat: "drugstore" },
  { test: /transit|rideshare|uber\b|lyft|public_transport|commut|parking|toll/, cat: "transit" },
  { test: /utilit|phone|cable|internet|cellular|wireless/, cat: "utilities" },
  { test: /home_improvement|home_depot|lowes|hardware/, cat: "home" },
  // Travel portals — for v1, route to airfare (the dominant assumption).
  { test: /chase_travel|amex_travel|capital_one_travel|portal|travel\b/, cat: "airfare" },
  { test: /everything_else|all_other_purchas|other_purchas|^other$|base_rate/, cat: "other" },
];

export function categorizeEarningLabel(label: string): SpendCategoryId | null {
  const l = label.toLowerCase();
  for (const m of SPEND_MATCHERS) {
    if (m.test.test(l)) return m.cat;
  }
  return null;
}

interface NormalizedRule {
  category: SpendCategoryId;
  rate: number; // dollar value per dollar spent (0.05 = 5¢/$)
  cap_usd_per_year: number | null;
}

// Effective cents-per-point for a card's earned currency. Conservative:
// uses portal_redemption_cpp when present (Chase Travel 1.25, US Bank
// FlexPoints 1.5 etc.), otherwise fixed_redemption_cpp, otherwise 1.
// We deliberately do NOT model peak transfer-partner sweet spots here
// (Hyatt at 2¢, ANA biz at 4¢). Those are the why-sentence story; the
// rec score stays conservative so the headline number is defensible.
//
// Cards without a currency_earned (no-rewards builder/secured cards)
// get 1¢/pt because their rate_pts_per_dollar is already a percent
// (or is null and falls through to 0).
function cppForCurrency(currencyId: string | null | undefined, db: CardDatabase): number {
  if (!currencyId) return 1;
  const prog = db.programById.get(currencyId);
  if (!prog) return 1;
  const portal = prog.portal_redemption_cpp ?? 0;
  const fixed = prog.fixed_redemption_cpp ?? 0;
  return Math.max(portal, fixed, 1);
}

// Per-process memoization of normalizeEarning. Keyed by card.id since
// the card database is loaded once and immutable. The map is reset at
// process boundaries (serverless cold start), which is fine.
const normalizeCache = new Map<
  string,
  { byCat: Map<SpendCategoryId, NormalizedRule>; base: number }
>();

// Convert a card's earning rules into a normalized shape keyed by
// SpendCategoryId. Rates are dollar value per dollar spent: a 4× MR
// rule with MR at 1.25¢/pt becomes rate = 0.05.
function normalizeEarning(
  card: Card,
  db: CardDatabase,
): { byCat: Map<SpendCategoryId, NormalizedRule>; base: number } {
  const cached = normalizeCache.get(card.id);
  if (cached) return cached;

  const cpp = cppForCurrency(card.currency_earned, db);
  const byCat = new Map<SpendCategoryId, NormalizedRule>();
  let base = 0.01; // default 1% baseline if not specified

  for (const rule of card.earning) {
    const cat = categorizeEarningLabel(rule.category);
    if (cat == null) continue;
    // pts/$ × ¢/pt / 100 = $/$
    const rate = ((rule.rate_pts_per_dollar ?? 0) * cpp) / 100;
    if (cat === "other") {
      if (rate > base) base = rate;
      continue;
    }
    const existing = byCat.get(cat);
    if (!existing || existing.rate < rate) {
      byCat.set(cat, {
        category: cat,
        rate,
        cap_usd_per_year: rule.cap_usd_per_year ?? null,
      });
    }
  }

  const result = { byCat, base };
  normalizeCache.set(card.id, result);
  return result;
}

// Best earning rate the user gets in a category given a list of cards.
// Returns the rate and the source card name (for "from" labels).
function bestRateForCategory(
  category: SpendCategoryId,
  cards: Card[],
  db: CardDatabase,
): { rate: number; from: string } {
  let best = { rate: 0, from: "—" };
  for (const c of cards) {
    const norm = normalizeEarning(c, db);
    const r = norm.byCat.get(category)?.rate ?? norm.base;
    if (r > best.rate) {
      best = { rate: r, from: c.name };
    }
  }
  return best;
}

// Compute earnings on $S of spend at a given normalized rule (with cap).
// If spend exceeds cap, the cap'd portion earns at `rule.rate` and the
// remainder falls back to `baseRate`.
function earningsOnCategory(
  spend: number,
  rule: NormalizedRule | undefined,
  baseRate: number,
): number {
  if (!rule) return spend * baseRate;
  if (rule.cap_usd_per_year == null) return spend * rule.rate;
  const inCap = Math.min(spend, rule.cap_usd_per_year);
  const overCap = Math.max(spend - rule.cap_usd_per_year, 0);
  return inCap * rule.rate + overCap * baseRate;
}

const EASE_MULT: Record<string, number> = {
  easy: 1.0,
  medium: 0.75,
  hard: 0.4,
  coupon_book: 0.2,
};

// Lowercase + collapse internal whitespace so "TSA PreCheck" and
// "tsa  precheck" key the same. Also trims leading/trailing whitespace.
function normalizePerkKey(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

// Sum of dedup-trumped perk names already covered by the user's wallet.
function alreadyCoveredPerks(
  walletCardIds: string[],
  db: CardDatabase,
): Set<string> {
  const covered = new Set<string>();
  for (const entry of db.perksDedup) {
    const intersects = entry.card_ids.some((id) => walletCardIds.includes(id));
    if (intersects) covered.add(normalizePerkKey(entry.perk));
  }
  return covered;
}

export function scoreCard(
  card: Card,
  userProfile: UserProfile,
  wallet: WalletCardHeld[],
  db: CardDatabase,
  options: ScoringOptions,
): CardScore {
  const breakdown: ScoreLineItem[] = [];
  const walletCards = wallet
    .map((h) => db.cardById.get(h.card_id))
    .filter((c): c is Card => Boolean(c));
  const walletPlus = [...walletCards, card];
  const walletCardIds = walletCards.map((c) => c.id);

  // Spend impact — best rate per category, before vs after, with
  // source-card attribution and cap info for the drill-in's per-row math.
  const cardNorm = normalizeEarning(card, db);
  const spendImpact = {} as CardScore["spendImpact"];
  for (const cat of ALL_CATS) {
    const curBest = bestRateForCategory(cat, walletCards, db);
    const newBest = bestRateForCategory(cat, walletPlus, db);
    const spend = userProfile.spend_profile[cat] ?? 0;
    const candidateWins = newBest.from === card.name && newBest.rate > curBest.rate;
    const candidateRule = candidateWins ? cardNorm.byCat.get(cat) : undefined;
    spendImpact[cat] = {
      current: curBest.rate,
      new: newBest.rate,
      currentFrom: curBest.from,
      newFrom: newBest.from,
      spend,
      delta: 0, // populated below
      newCap: candidateRule?.cap_usd_per_year ?? null,
      newBase: candidateWins ? cardNorm.base : null,
    };
  }

  // Earnings delta — only the marginal portion this card contributes.
  let earningsDelta = 0;
  for (const cat of ALL_CATS) {
    const impact = spendImpact[cat];
    if (impact.spend <= 0) continue;
    if (impact.new <= impact.current) continue; // no improvement
    const cardRule = cardNorm.byCat.get(cat);
    const cardEarnings = earningsOnCategory(impact.spend, cardRule, cardNorm.base);
    const currentEarnings = impact.spend * impact.current;
    const delta = Math.max(cardEarnings - currentEarnings, 0);
    if (delta > 0) {
      earningsDelta += delta;
      impact.delta = Math.round(delta);
      breakdown.push({
        label: `${labelFor(cat)} $${Math.round(impact.spend).toLocaleString()} × ${(impact.new * 100).toFixed(1)}% (was ${(impact.current * 100).toFixed(1)}%)`,
        value: Math.round(delta),
        kind: "earning",
      });
    }
  }

  // Annual credits — apply ease multiplier in realistic mode.
  let creditsValue = 0;
  for (const cr of card.annual_credits) {
    const face = cr.value_usd ?? 0;
    if (face <= 0) continue;
    const mult = options.creditsMode === "realistic" ? (EASE_MULT[cr.ease_of_use] ?? 0.75) : 1;
    const captured = face * mult;
    if (captured > 0) {
      creditsValue += captured;
      breakdown.push({
        label: `${cr.name} (${options.creditsMode === "realistic" ? cr.ease_of_use : "face"})`,
        value: Math.round(captured),
        kind: "credit",
      });
    }
  }

  // Perks — split into newPerks and duplicatedPerks.
  const covered = alreadyCoveredPerks(walletCardIds, db);
  const newPerks: NewPerkOut[] = [];
  const duplicatedPerks: string[] = [];
  let perksValue = 0;
  for (const p of card.ongoing_perks) {
    const key = normalizePerkKey(p.name);
    const isCovered = covered.has(key);
    const value = p.value_estimate_usd ?? 0;
    if (isCovered) {
      duplicatedPerks.push(p.name);
    } else if (value > 0) {
      newPerks.push({ name: p.name, value: Math.round(value), note: p.notes ?? undefined });
      perksValue += value;
      breakdown.push({
        label: p.name,
        value: Math.round(value),
        kind: "perk",
      });
    } else {
      newPerks.push({ name: p.name, value: "unlocks", note: p.notes ?? undefined });
    }
  }

  // Brand fit — captured cobrand value (Costco voucher, Target POS
  // discount, Amazon-Prime 5%) the spend taxonomy underestimates. Fires
  // only when the user picked the matching brand on /onboarding/brands,
  // so it's a self-reported signal, not a guess.
  const brandFit = getBrandFit(card, userProfile.brands_used);
  let brandFitValue = 0;
  if (brandFit) {
    brandFitValue = brandFit.bonus;
    breakdown.push(brandFit.lineItem);
  }

  // Annual fee.
  const fee = card.annual_fee_usd ?? 0;
  if (fee > 0) {
    breakdown.push({
      label: `Annual fee`,
      value: -fee,
      kind: "fee",
    });
  }

  // Two-pillar split. Spend = earnings delta + brand-fit cobrand bonus
  // (both spend-conditional). Perks = annual credits + ongoing perks
  // (both claim-conditional). Fee is its own component, signed negative.
  // Each component is rounded independently so deltaOngoing equals the
  // sum of the rendered pillars exactly — no off-by-one between the
  // hero and the breakdown view.
  const spendOngoing = Math.round(earningsDelta + brandFitValue);
  const perksOngoing = Math.round(creditsValue + perksValue);
  const feeOngoing = fee > 0 ? -fee : 0;
  const deltaOngoing = spendOngoing + perksOngoing + feeOngoing;

  // Year-1 SUB amortized.
  const sub = card.signup_bonus?.estimated_value_usd ?? 0;
  const subYear1 = sub > 0 ? Math.round((sub * 12) / options.subAmortizeMonths) : 0;
  const deltaYear1 = deltaOngoing + subYear1;

  if (subYear1 > 0) {
    breakdown.push({
      label: `Sign-up bonus, amortized over ${options.subAmortizeMonths} months`,
      value: subYear1,
      kind: "sub",
    });
  }

  // If we computed nothing meaningful, surface a single placeholder line.
  if (breakdown.length === 0) {
    breakdown.push({ label: "Insufficient data", value: 0, kind: "other" });
  }

  return {
    deltaOngoing,
    deltaYear1,
    components: {
      spendOngoing,
      perksOngoing,
      feeOngoing,
      subYear1,
    },
    breakdown,
    spendImpact,
    newPerks,
    duplicatedPerks,
  };
}

function labelFor(cat: SpendCategoryId): string {
  const map: Record<SpendCategoryId, string> = {
    groceries: "Groceries",
    dining: "Dining",
    gas: "Gas",
    airfare: "Airfare",
    hotels: "Hotels",
    streaming: "Streaming",
    shopping: "Online shopping",
    drugstore: "Drugstore",
    transit: "Transit / rideshare",
    utilities: "Utilities",
    home: "Home improvement",
    other: "Everything else",
  };
  return map[cat];
}

// Re-exported helpers used by the rec panel for the wallet's left column.
export { bestRateForCategory };
