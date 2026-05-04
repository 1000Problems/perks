// Pure helper that overlays a user's per-program cpp overrides onto a
// program's shipped cpp fields. Returns a new Program object — never
// mutates input. Per CLAUDE.md "User-driven cpp.": engine reads
// getEffectiveProgram(programId, userOverrides, programDefaults) and
// uses the highest filled value as the headline cpp for scoring.
//
// Field mapping (override → program default it replaces):
//   transfer_cpp → median_redemption_cpp
//   portal_cpp   → portal_redemption_cpp
//   cash_cpp     → not consumed by the engine in v1; reserved for a
//                  future "cash_only" redemption-style picker. Storing
//                  it now means a future migration isn't needed.
//
// When override is undefined or null for a field, the program's
// shipped default flows through unchanged. When override is non-null,
// it replaces the field — including when the override is *lower*
// than the default, so users who say "I redeem at portal-only 1¢"
// get a smaller cpp than the TPG median.

import type { Program } from "@/lib/data/loader";

export interface ProgramCppOverride {
  cash_cpp: number | null;
  portal_cpp: number | null;
  transfer_cpp: number | null;
}

export function applyProgramOverride(
  program: Program,
  override: ProgramCppOverride | undefined,
): Program {
  if (!override) return program;
  const next: Program = { ...program };
  if (override.transfer_cpp != null) {
    next.median_redemption_cpp = override.transfer_cpp;
  }
  if (override.portal_cpp != null) {
    next.portal_redemption_cpp = override.portal_cpp;
  }
  // cash_cpp has no engine field today — see comment above.
  return next;
}

// Convenience wrapper that pulls the override out of a map for the
// caller. Returns the unmodified program when no override exists for
// the program (fast path).
export function getEffectiveProgram(
  program: Program,
  overrides: Map<string, ProgramCppOverride> | undefined,
): Program {
  if (!overrides) return program;
  const override = overrides.get(program.id);
  if (!override) return program;
  return applyProgramOverride(program, override);
}
