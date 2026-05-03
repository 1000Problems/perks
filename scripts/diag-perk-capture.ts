// Maintainer smoke — exercises spend-driven perk capture on a sample
// of premium cards. Run manually:
//   npx tsx scripts/diag-perk-capture.ts
//
// Useful when tuning thresholds in lib/engine/perkSignals.ts to see
// how a wallet recomputes against a representative travel-heavy
// profile vs a light spender.

import { loadCardDatabase } from "@/lib/data/loader";
import { scoreCard } from "@/lib/engine/scoring";
import type { ScoringOptions, UserProfile } from "@/lib/engine/types";

const db = loadCardDatabase();
const SCORING: ScoringOptions = {
  creditsMode: "realistic",
  subAmortizeMonths: 24,
};

const heavyTravel: UserProfile = {
  spend_profile: {
    groceries: 8000,
    dining: 4000,
    gas: 2400,
    airfare: 3000,
    hotels: 2000,
    transit: 1200,
    streaming: 480,
    shopping: 4000,
    utilities: 2400,
    other: 12000,
  },
  brands_used: [],
  cards_held: [],
  trips_planned: [],
  credit_score_band: "very_good",
  preferences: {},
};

const cards = [
  "amex_gold",
  "amex_platinum",
  "chase_sapphire_reserve",
  "chase_sapphire_preferred",
  "citi_strata_premier",
  "capital_one_venture_x",
  "capital_one_venture",
  "marriott_bonvoy_boundless",
  "ihg_premier",
];

console.log("=== Heavy-travel profile, scored standalone (empty wallet) ===");
console.log();
for (const id of cards) {
  const card = db.cardById.get(id);
  if (!card) continue;
  const score = scoreCard(card, heavyTravel, [], db, SCORING);
  const c = score.components;
  const ptsValue = c.pointsOngoing?.valueUsd ?? 0;
  console.log(
    `${card.name.padEnd(38)}  delta=${String("$" + Math.round(score.deltaOngoing)).padStart(7)}` +
      `  cash=$${c.cashOngoing}  pts=$${ptsValue}  perks=$${c.perksOngoing}  fee=$${c.feeOngoing}`,
  );
}

// Now mirror the production scenario: 14-card wallet, score each card
// MARGINALLY (i.e. its contribution given everything else in the wallet).
// This is what the user sees on perks.1000problems.com — and where the
// "−$271 CSR" / "+$23 Amex Gold" surprises came from.
console.log();
console.log("=== Marginal contribution against a 14-card wallet ===");
const walletIds = [
  "amex_gold",
  "atmos_rewards_ascent",
  "boa_customized_cash",
  "capital_one_venture",
  "chase_sapphire_preferred",
  "chase_sapphire_reserve",
  "citi_double_cash",
  "citi_strata_premier",
  "costco_anywhere_visa",
  "amex_delta_skymiles_blue",
  "ihg_premier",
  "marriott_bonvoy_boundless",
  "capital_one_walmart_rewards",
  "delta_skymiles_gold",
];
const wallet = walletIds
  .filter((id) => db.cardById.has(id))
  .map((id) => ({ card_id: id, opened_at: "2024-01-01", bonus_received: true }));

console.log(`(wallet: ${wallet.length} cards held)`);
console.log();
for (const id of walletIds) {
  const card = db.cardById.get(id);
  if (!card) {
    console.log(`  ${id}: not in catalog`);
    continue;
  }
  // Score this card AS IF it were not held — i.e. compute its marginal
  // contribution by removing it from the wallet and adding it back.
  const otherWallet = wallet.filter((w) => w.card_id !== id);
  const score = scoreCard(card, heavyTravel, otherWallet, db, SCORING);
  const c = score.components;
  const ptsValue = c.pointsOngoing?.valueUsd ?? 0;
  console.log(
    `${card.name.padEnd(38)}  delta=${String((score.deltaOngoing >= 0 ? "+$" : "-$") + Math.abs(Math.round(score.deltaOngoing))).padStart(8)}` +
      `  pts=$${ptsValue}  perks=$${c.perksOngoing}  fee=$${c.feeOngoing}`,
  );
}

// Score candidate cards (not held) against the full wallet — does the
// engine still recommend Delta Reserve?
console.log();
console.log("=== Candidate cards (not held) — should NOT win for this wallet ===");
const candidates = [
  "delta_skymiles_reserve",
  "amex_platinum",
  "united_club_infinite",
  "bilt_blue",
  "chase_freedom_flex",
  "citi_custom_cash",
];
for (const id of candidates) {
  const card = db.cardById.get(id);
  if (!card) {
    console.log(`  ${id}: not in catalog`);
    continue;
  }
  const score = scoreCard(card, heavyTravel, wallet, db, SCORING);
  const c = score.components;
  console.log(
    `${card.name.padEnd(38)}  delta=${String((score.deltaOngoing >= 0 ? "+$" : "-$") + Math.abs(Math.round(score.deltaOngoing))).padStart(8)}` +
      `  pts=$${c.pointsOngoing?.valueUsd ?? 0}  perks=$${c.perksOngoing}  fee=$${c.feeOngoing}` +
      `  dups=${score.duplicatedPerks.length}`,
  );
}
