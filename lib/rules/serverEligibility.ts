// Server-side bridge from the catalog-driven rules engine to the
// shape the recommendation engine consumes. Composes evaluateBatch
// (rules → {verdict, reasons}) with toEngineEligibility (rules shape
// → engine shape: {status, note}).
//
// Soft-fails to null when the rules subsystem can't run — missing
// migrations, empty catalog, or RULES_ENGINE=client. The rec panel
// falls through to the in-engine eligibility path in that case.

import "server-only";
import { isUndefinedTableError } from "@/lib/db";
import type { EligibilityResult as EngineEligibilityResult } from "@/lib/engine/types";
import { evaluateBatch } from "./load";
import { toEngineEligibility } from "./evaluate";

export type EngineVerdictMap = Record<string, EngineEligibilityResult>;

function rulesEngineDisabled(): boolean {
  return process.env.RULES_ENGINE === "client";
}

export async function loadEngineVerdicts(
  userId: string,
  cardIds: string[],
  today?: Date,
): Promise<EngineVerdictMap | null> {
  if (rulesEngineDisabled()) return null;
  if (cardIds.length === 0) return {};

  try {
    const verdicts = await evaluateBatch({ userId, cardIds, today });
    const out: EngineVerdictMap = {};
    for (const [id, v] of Object.entries(verdicts)) {
      out[id] = toEngineEligibility(v);
    }
    return out;
  } catch (e) {
    // Catalog or user-state tables absent — common on a freshly cloned
    // dev DB before migrations 0001..0003 have run. Drop back to the
    // legacy in-engine path; the user still gets recommendations.
    if (isUndefinedTableError(e)) {
      return null;
    }
    throw e;
  }
}
