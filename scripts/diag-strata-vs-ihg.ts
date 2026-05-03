// Maintainer smoke test — confirms the TPG-anchored cpp change resolves
// the reviewer's specific gas-category comparison correctly. Not part of
// the Vitest suite; run manually with `npx tsx scripts/diag-strata-vs-ihg.ts`
// when validating cpp-related changes.

import { loadCardDatabase } from "@/lib/data/loader";
import { bestRateForCategory } from "@/lib/engine/scoring";
import type { Card } from "@/lib/data/loader";
import type { RedemptionStyle } from "@/lib/engine/types";

const db = loadCardDatabase();
const get = (id: string): Card => {
  const c = db.cardById.get(id);
  if (!c) throw new Error(`missing: ${id}`);
  return c;
};

const strata = get("citi_strata_premier");
const costco = get("costco_anywhere_visa");
const ihg = get("ihg_premier");

function show(label: string, style: RedemptionStyle) {
  console.log(`\n=== Active card on gas (${label}) ===`);
  for (const cards of [[strata], [costco], [ihg], [strata, costco, ihg]]) {
    const r = bestRateForCategory("gas", cards, db, style);
    const names = cards.map((c) => c.name).join(" + ");
    console.log(`  Wallet: ${names}`);
    console.log(
      `    Best gas rate: ${(r.rate * 100).toFixed(2)}% from ${r.from} (${r.mode})`,
    );
  }
}

show("transfers — TPG May 2026", "transfers");
show("portal_only — conservative cpp", "portal_only");
show("cash_only — every point at 1¢", "cash_only");
