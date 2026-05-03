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
  AvailablePerkOut,
  CardScore,
  EarningMode,
  NewPerkOut,
  PassiveFeatureOut,
  PointsBucket,
  RedemptionStyle,
  ScoreLineItem,
  ScoringOptions,
  SubBucket,
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

interface NormalizedEarning {
  byCat: Map<SpendCategoryId, NormalizedRule>;
  base: number;
  mode: EarningMode;
}

// Resolve the cpp the engine should use for a loyalty program given the
// user's redemption style. Three modes:
//   - "transfers"   (default): TPG-tracked median, fall back to portal,
//                   fall back to 1¢. This is what anyone holding 2+
//                   cards from different ecosystems should see.
//   - "portal_only": fall back to portal, then fixed, then 1¢. For users
//                   who never transfer (book travel through the issuer
//                   portal or take statement credit).
//   - "cash_only":  always 1¢. For users who redeem only for cash.
function resolveLoyaltyCpp(
  program: { median_redemption_cpp?: number | null; portal_redemption_cpp?: number | null; fixed_redemption_cpp?: number | null; median_cpp_as_of?: string | null },
  style: RedemptionStyle,
): { cpp: number; cppSource: "median" | "portal" | "fixed" | "cash"; cppAsOf?: string | null } {
  if (style === "cash_only") {
    return { cpp: 1, cppSource: "cash" };
  }
  if (style === "portal_only") {
    if (program.portal_redemption_cpp != null && program.portal_redemption_cpp > 0) {
      return { cpp: program.portal_redemption_cpp, cppSource: "portal" };
    }
    if (program.fixed_redemption_cpp != null && program.fixed_redemption_cpp > 0) {
      return { cpp: program.fixed_redemption_cpp, cppSource: "fixed" };
    }
    return { cpp: 1, cppSource: "cash" };
  }
  // "transfers" — TPG median is the headline. Portal is the fallback
  // for programs we haven't valued yet (the build script enforces fill
  // for transferables/cobrand programs, so this path is rare).
  if (program.median_redemption_cpp != null && program.median_redemption_cpp > 0) {
    return {
      cpp: program.median_redemption_cpp,
      cppSource: "median",
      cppAsOf: program.median_cpp_as_of ?? null,
    };
  }
  if (program.portal_redemption_cpp != null && program.portal_redemption_cpp > 0) {
    return { cpp: program.portal_redemption_cpp, cppSource: "portal" };
  }
  if (program.fixed_redemption_cpp != null && program.fixed_redemption_cpp > 0) {
    return { cpp: program.fixed_redemption_cpp, cppSource: "fixed" };
  }
  return { cpp: 1, cppSource: "cash" };
}

// Classify a card's earned currency in the context of a wallet. Cash
// programs always return cash mode at 1cpp. Loyalty programs return
// loyalty mode at the program's redemption cpp (resolved from the
// user's redemption_style) ONLY when the wallet contains an unlock
// card — Sapphire/Ink Preferred for chase_ur, Strata Premier/Elite for
// citi_thankyou. Cobrand programs (United, Hilton, etc.) and
// fully-open transferable programs (Capital One, Bilt) have empty
// unlock lists and always classify as loyalty.
//
// This is the gate that makes Chase Freedom Unlimited / Citi Double
// Cash earn cash on their own and points when paired — the engine
// can't know the user holds a Sapphire from the candidate alone.
//
// `contextCards` should include the candidate when scoring it (adding
// CSP unlocks UR for itself).
export function classifyEarning(
  card: Card,
  contextCards: Card[],
  db: CardDatabase,
  redemptionStyle: RedemptionStyle = "transfers",
): EarningMode {
  if (!card.currency_earned) {
    return { mode: "cash", cpp: 1, programId: null, programName: null, cppSource: "cash" };
  }
  const program = db.programById.get(card.currency_earned);
  if (!program) {
    return { mode: "cash", cpp: 1, programId: null, programName: null, cppSource: "cash" };
  }
  const programId = program.id;
  const programName = program.name;
  if (program.kind === "cash") {
    return { mode: "cash", cpp: 1, programId, programName, cppSource: "cash" };
  }
  // Loyalty branch. cpp resolves through the redemption_style ladder.
  const resolved = resolveLoyaltyCpp(program, redemptionStyle);
  // Empty unlock list = always loyalty mode (cobrand currencies and
  // fully-open transferables like Capital One Miles, Bilt Rewards).
  if (program.transfer_unlock_card_ids.length === 0) {
    return { mode: "loyalty", cpp: resolved.cpp, programId, programName, cppSource: resolved.cppSource, cppAsOf: resolved.cppAsOf ?? null };
  }
  // Gated transferable. Loyalty if any context card unlocks; otherwise
  // the points sit at fixed cash redemption value, which the engine
  // models as plain cash mode at 1cpp (CFU/CDC default behavior).
  const unlocks = contextCards.some((c) =>
    program.transfer_unlock_card_ids.includes(c.id),
  );
  if (unlocks) {
    return { mode: "loyalty", cpp: resolved.cpp, programId, programName, cppSource: resolved.cppSource, cppAsOf: resolved.cppAsOf ?? null };
  }
  return { mode: "cash", cpp: 1, programId, programName, cppSource: "cash" };
}

// Per-process memoization of normalizeEarning. Keyed by card.id PLUS
// the resolved earning mode, because the same card normalizes
// differently depending on whether the wallet unlocks transfers
// (CFU = 1.5% cash alone, 1.875¢ UR with Sapphire). The map is reset
// at process boundaries (serverless cold start), which is fine.
const normalizeCache = new Map<string, NormalizedEarning>();

function normKey(cardId: string, mode: EarningMode): string {
  return `${cardId}::${mode.mode}:${mode.cpp}`;
}

// Convert a card's earning rules into a normalized shape keyed by
// SpendCategoryId. Rates are dollar value per dollar spent: a 4× MR
// rule with MR at 1.25¢/pt becomes rate = 0.05.
function normalizeEarning(
  card: Card,
  contextCards: Card[],
  db: CardDatabase,
  redemptionStyle: RedemptionStyle = "transfers",
): NormalizedEarning {
  const mode = classifyEarning(card, contextCards, db, redemptionStyle);
  const key = normKey(card.id, mode);
  const cached = normalizeCache.get(key);
  if (cached) return cached;

  const cpp = mode.cpp;
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

  const result: NormalizedEarning = { byCat, base, mode };
  normalizeCache.set(key, result);
  return result;
}

// Best earning rate the user gets in a category given a list of cards.
// Returns the rate, source card name, and the currency mode of that
// winning rate. The classifier walks the same `cards` list so that
// paired-mode resolution applies — when the wallet holds CSP, CFU's
// chase_ur earnings are evaluated at portal cpp, not at 1cpp.
function bestRateForCategory(
  category: SpendCategoryId,
  cards: Card[],
  db: CardDatabase,
  redemptionStyle: RedemptionStyle = "transfers",
): { rate: number; from: string; mode: "cash" | "loyalty" | null } {
  let best: { rate: number; from: string; mode: "cash" | "loyalty" | null } = {
    rate: 0,
    from: "—",
    mode: null,
  };
  for (const c of cards) {
    const norm = normalizeEarning(c, cards, db, redemptionStyle);
    const r = norm.byCat.get(category)?.rate ?? norm.base;
    if (r > best.rate) {
      best = { rate: r, from: c.name, mode: norm.mode.mode };
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
  const redemptionStyle: RedemptionStyle =
    userProfile.redemption_style ?? "transfers";
  const optIns = new Set(userProfile.perk_opt_ins ?? []);

  // Spend impact — best rate per category, before vs after, with
  // source-card attribution and cap info for the drill-in's per-row math.
  // The candidate's normalized earning resolves against `walletPlus` so
  // the candidate counts toward unlocking transfers for its own program
  // (e.g. scoring CSP unlocks UR for itself).
  const cardNorm = normalizeEarning(card, walletPlus, db, redemptionStyle);
  const spendImpact = {} as CardScore["spendImpact"];
  for (const cat of ALL_CATS) {
    const curBest = bestRateForCategory(cat, walletCards, db, redemptionStyle);
    const newBest = bestRateForCategory(cat, walletPlus, db, redemptionStyle);
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
      newMode: newBest.mode,
    };
  }

  // Earnings delta — only the marginal portion this card contributes.
  // All marginal earnings for this candidate land in one bucket
  // (cardNorm.mode.mode), since a card earns into exactly one program.
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

  // Annual credits — perk-capture gating. Each credit's value contributes
  // to the score ONLY when its activation is "signal_gated" AND the
  // user has opted into its signal_id via perk_opt_ins. Passive credits
  // (no FX, primary CDW, etc) are listed as features and never valued.
  // Un-opted gated credits are listed under availablePerks at $0 — the
  // user toggles them on via the Perks Settings page.
  let creditsValue = 0;
  const availablePerks: AvailablePerkOut[] = [];
  const passiveFeatures: PassiveFeatureOut[] = [];
  for (const cr of card.annual_credits) {
    const face = cr.value_usd ?? 0;
    const activation = cr.activation ?? "signal_gated";
    if (activation === "passive") {
      passiveFeatures.push({ name: cr.name, note: cr.notes ?? undefined });
      continue;
    }
    // signal_gated. signal_id must match an opt-in to count.
    const signalId = cr.signal_id ?? null;
    const optedIn = signalId != null && optIns.has(signalId);
    if (face > 0 && optedIn) {
      creditsValue += face;
      breakdown.push({
        label: cr.name,
        value: Math.round(face),
        kind: "credit",
      });
    } else if (face > 0) {
      availablePerks.push({
        name: cr.name,
        faceValue: Math.round(face),
        signal_id: signalId,
        note: cr.notes ?? undefined,
      });
    }
  }

  // Ongoing perks — same gating. Dedup-trumped names (lounge access
  // already covered by another wallet card) drop to duplicatedPerks
  // regardless of opt-in state — the value is already captured.
  const covered = alreadyCoveredPerks(walletCardIds, db);
  const newPerks: NewPerkOut[] = [];
  const duplicatedPerks: string[] = [];
  let perksValue = 0;
  for (const p of card.ongoing_perks) {
    const key = normalizePerkKey(p.name);
    const isCovered = covered.has(key);
    const value = p.value_estimate_usd ?? 0;
    const activation = p.activation ?? "signal_gated";
    if (isCovered) {
      duplicatedPerks.push(p.name);
      continue;
    }
    if (activation === "passive") {
      passiveFeatures.push({ name: p.name, note: p.notes ?? undefined });
      continue;
    }
    const signalId = p.signal_id ?? null;
    const optedIn = signalId != null && optIns.has(signalId);
    if (value > 0 && optedIn) {
      newPerks.push({ name: p.name, value: Math.round(value), note: p.notes ?? undefined });
      perksValue += value;
      breakdown.push({
        label: p.name,
        value: Math.round(value),
        kind: "perk",
      });
    } else if (value > 0) {
      availablePerks.push({
        name: p.name,
        faceValue: Math.round(value),
        signal_id: signalId,
        note: p.notes ?? undefined,
      });
    } else {
      // Zero-dollar "unlocks" perk (e.g. travel insurance, status). List
      // under newPerks with the unlock marker — these don't depend on
      // opt-in because they have no dollar value to capture.
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

  // Cash vs points vs brand-fit split. Earnings deltas land in either
  // cashOngoing or pointsOngoing based on the candidate's resolved mode
  // (a card earns into exactly one program). Brand-fit gets its own
  // bucket — it's a soft cobrand estimate, not derived from the user's
  // reported spend, so the UI presents it as a muted secondary line
  // rather than rolling it into the green CASH pillar. It still counts
  // toward `spendOngoing` and `deltaOngoing` so the ranker treats a
  // Costco-shopper's Costco card the way it should.
  //
  // Each component is rounded so the spend-side invariant reconciles:
  //   spendOngoing == cashOngoing + (pointsOngoing?.valueUsd ?? 0)
  //                                + (brandFitOngoing?.valueUsd ?? 0)
  //
  // Pts derive from the rounded $ value (not from raw earningsDelta) so
  // the displayed "X pts ≈ $Y" reverse-reconciles cleanly when the user
  // does X × cpp / 100 in their head. Drifts otherwise — see code review #4.
  const earningsDeltaRounded = Math.round(earningsDelta);
  const brandFitRounded = Math.round(brandFitValue);
  const mode = cardNorm.mode;
  const isLoyalty = mode.mode === "loyalty";
  const cashOngoing = isLoyalty ? 0 : earningsDeltaRounded;
  const pointsValueUsd = isLoyalty ? earningsDeltaRounded : 0;
  const pointsRaw =
    isLoyalty && mode.cpp > 0
      ? Math.round((pointsValueUsd * 100) / mode.cpp)
      : 0;
  const pointsOngoing: PointsBucket | null =
    isLoyalty && pointsRaw > 0 && mode.programId && mode.programName
      ? {
          pts: pointsRaw,
          valueUsd: pointsValueUsd,
          programId: mode.programId,
          programName: mode.programName,
          cpp: mode.cpp,
          cppSource: mode.cppSource,
          cppAsOf: mode.cppAsOf ?? null,
        }
      : null;
  const brandFitOngoing =
    brandFit && brandFitRounded > 0
      ? {
          valueUsd: brandFitRounded,
          brand: brandFit.brand,
          whyPhrase: brandFit.whyPhrase,
        }
      : null;
  const spendOngoing = cashOngoing + pointsValueUsd + brandFitRounded;
  const perksOngoing = Math.round(creditsValue + perksValue);
  const feeOngoing = fee > 0 ? -fee : 0;
  const deltaOngoing = spendOngoing + perksOngoing + feeOngoing;

  // Year-1 SUB amortized. Cash-mode cards record the dollar value with
  // pts: 0; loyalty-mode cards split out the amortized point count too
  // so the UI can show "+15,000 UR pts y1" in addition to the dollar.
  const subDollar = card.signup_bonus?.estimated_value_usd ?? 0;
  const subPtsRaw = card.signup_bonus?.amount_pts ?? 0;
  const subYear1 =
    subDollar > 0 ? Math.round((subDollar * 12) / options.subAmortizeMonths) : 0;
  const subPtsAmortized =
    subPtsRaw > 0 ? Math.round((subPtsRaw * 12) / options.subAmortizeMonths) : 0;
  const subYear1Detail: SubBucket | null =
    subYear1 > 0
      ? {
          mode: mode.mode,
          pts: isLoyalty ? subPtsAmortized : 0,
          valueUsd: subYear1,
          programId: mode.programId,
          programName: mode.programName,
        }
      : null;
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
      cashOngoing,
      pointsOngoing,
      brandFitOngoing,
      spendOngoing,
      perksOngoing,
      feeOngoing,
      subYear1,
      subYear1Detail,
    },
    breakdown,
    spendImpact,
    newPerks,
    duplicatedPerks,
    availablePerks,
    passiveFeatures,
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
