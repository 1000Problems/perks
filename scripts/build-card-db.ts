// Card database compiler.
//
// Reads cards/*.md (one per card), pulls the JSON fenced blocks out of
// each section, validates against Zod schemas, merges using anchor-card
// semantics, and writes the result to data/*.json.
//
// Also rewrites the "## Completed" section of cards/AllCards.md so the
// human-facing index stays in sync with disk state.
//
// Run via: npm run cards:build (also auto-runs as part of build/dev).

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  CardSchema,
  ProgramSchema,
  IssuerRulesSchema,
  PerksDedupEntrySchema,
  DestinationPerkSchema,
  SignalSchema,
  SoulCreditScoreSchema,
  SoulAnnualCreditSchema,
  SoulInsuranceSchema,
  SoulProgramAccessEntrySchema,
  SoulCoBrandPerksSchema,
  SoulAbsentPerkSchema,
  type Card,
  type Program,
  type IssuerRules,
  type PerksDedupEntry,
  type DestinationPerk,
  type Signal,
  type Soul,
} from "./lib/schemas";
import { parseCardMarkdown } from "./lib/parse";

const ROOT = process.cwd();
const CARDS_DIR = join(ROOT, "cards");
const SIGNALS_DIR = join(ROOT, "signals");
const DATA_DIR = join(ROOT, "data");
const ALL_CARDS = join(CARDS_DIR, "AllCards.md");

function log(...args: unknown[]) {
  console.log("[cards]", ...args);
}

function err(msg: string): never {
  console.error("[cards] FAIL:", msg);
  process.exit(1);
}

// ── load ───────────────────────────────────────────────────────────────

function listCardFiles(): string[] {
  if (!existsSync(CARDS_DIR)) err(`cards directory not found: ${CARDS_DIR}`);
  // Skip AllCards.md (auto-generated index) and any file starting with `_`
  // (meta files like _PROMPT_NEW_CARD.md).
  return readdirSync(CARDS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "AllCards.md" && !f.startsWith("_"))
    .sort();
}

function listSignalFiles(): string[] {
  if (!existsSync(SIGNALS_DIR)) return [];
  return readdirSync(SIGNALS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort();
}

// Pulls the first ```json fenced block out of a markdown string. Used
// for signal markdowns where the file has exactly one JSON section
// (under "## signals.json entry"). Returns null when the file has no
// fenced block, throws when the JSON is malformed.
function extractFirstJsonBlock(md: string): unknown | null {
  const fence = md.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!fence) return null;
  try {
    return JSON.parse(fence[1]);
  } catch (e) {
    throw new Error(`malformed JSON: ${(e as Error).message}`);
  }
}

function loadSignals(db: DB): void {
  const seen = new Set<string>();
  for (const file of listSignalFiles()) {
    const md = readFileSync(join(SIGNALS_DIR, file), "utf8");
    let raw: unknown | null;
    try {
      raw = extractFirstJsonBlock(md);
    } catch (e) {
      err(`signals/${file}: ${(e as Error).message}`);
    }
    if (!raw) {
      err(`signals/${file}: missing \`\`\`json fenced block under "## signals.json entry"`);
    }
    let signal: Signal;
    try {
      signal = SignalSchema.parse(raw);
    } catch (e) {
      err(`signals/${file}: signals.json validation: ${(e as Error).message}`);
    }
    if (seen.has(signal.id)) {
      err(`signals/${file}: duplicate signal id "${signal.id}"`);
    }
    seen.add(signal.id);
    db.signals.push(signal);
  }
  db.signals.sort((a, b) => a.id.localeCompare(b.id));
}

// Phase 2: every reveals_signals / requires_signals id on every play
// must reference a signal that exists in the Phase 1 catalog. Run
// after both cards and signals are loaded.
function validateSignalReferences(db: DB): void {
  const known = new Set(db.signals.map((s) => s.id));
  for (const card of db.cards) {
    const plays = [
      ...(card.card_plays ?? []),
      ...(card.community_plays ?? []),
    ];
    for (const play of plays) {
      for (const sig of play.reveals_signals) {
        if (!known.has(sig)) {
          err(
            `cards/${card.id}.md: play "${play.id}" reveals_signals references unknown signal "${sig}"`,
          );
        }
      }
      for (const sig of play.requires_signals) {
        if (!known.has(sig)) {
          err(
            `cards/${card.id}.md: play "${play.id}" requires_signals references unknown signal "${sig}"`,
          );
        }
      }
    }
  }
}

// ── merge ──────────────────────────────────────────────────────────────

interface DB {
  cards: Card[];
  programs: Map<string, Program>;
  programAnchors: Map<string, string>;
  issuerRules: Map<string, IssuerRules>;
  perksDedup: Map<string, PerksDedupEntry>;
  destinationPerks: Map<string, DestinationPerk>;
  notes: string[];
  // soul: keyed by card_id. Optional per card. See
  // docs/SOUL_SCHEMA_PROPOSAL.md for the shape.
  souls: Map<string, Soul>;
  // Phase 1 of signal-first architecture. Catalog of global facts the
  // system can know about a user. Read from signals/*.md, written to
  // data/signals.json. Not yet consumed by the engine.
  signals: Signal[];
}

function emptyDB(): DB {
  return {
    cards: [],
    programs: new Map(),
    programAnchors: new Map(),
    issuerRules: new Map(),
    perksDedup: new Map(),
    destinationPerks: new Map(),
    notes: [],
    souls: new Map(),
    signals: [],
  };
}

function mergeFile(db: DB, filename: string): void {
  const md = readFileSync(join(CARDS_DIR, filename), "utf8");
  const parsed = parseCardMarkdown(filename, md);

  if (!parsed.card) {
    err(`${filename}: missing required ## cards.json entry`);
  }

  // Money-find content lives in separate ## sections of the markdown
  // but rides on the Card object so the loader sees one shape. Merge
  // before Zod validation so PlaySchema / ColdPromptSchema enforce
  // their constraints alongside the rest of the card.
  const cardWithPlays =
    typeof parsed.card === "object" && parsed.card !== null
      ? {
          ...(parsed.card as Record<string, unknown>),
          ...(parsed.cardPlays != null ? { card_plays: parsed.cardPlays } : {}),
          ...(parsed.communityPlays != null
            ? { community_plays: parsed.communityPlays }
            : {}),
          ...(parsed.disabledNetworkBenefits != null
            ? { disabled_network_benefits: parsed.disabledNetworkBenefits }
            : {}),
          ...(parsed.coldPrompts != null ? { cold_prompts: parsed.coldPrompts } : {}),
        }
      : parsed.card;

  let card: Card;
  try {
    card = CardSchema.parse(cardWithPlays);
  } catch (e) {
    err(`${filename}: cards.json validation: ${(e as Error).message}`);
  }
  if (db.cards.some((c) => c.id === card.id)) {
    err(`${filename}: duplicate card id "${card.id}" already provided by another file`);
  }
  db.cards.push(card);

  if (parsed.program) {
    let program: Program;
    try {
      program = ProgramSchema.parse(parsed.program);
    } catch (e) {
      err(`${filename}: programs.json validation: ${(e as Error).message}`);
    }
    // Derive `kind` if the markdown didn't author it. Transferable and
    // cobrand programs are loyalty currencies; anything else with no
    // transfer partners is cash. The runtime classifier in
    // lib/engine/scoring.ts depends on this field always being set.
    if (!program.kind) {
      const isLoyalty =
        program.type === "transferable" ||
        program.type.startsWith("cobrand_") ||
        program.transfer_partners.length > 0;
      program.kind = isLoyalty ? "loyalty" : "cash";
    }
    if (!db.programs.has(program.id)) {
      // First card to define this program is the anchor; it owns
      // transfer_partners, sweet_spots, redemption rates.
      db.programs.set(program.id, program);
      db.programAnchors.set(program.id, filename);
    } else {
      log(
        `note: ${filename} re-defines program "${program.id}" (anchor is ${db.programAnchors.get(
          program.id,
        )}). Ignoring this definition; only its earning_cards membership matters.`,
      );
    }
  }

  if (parsed.issuerRules) {
    let rules: IssuerRules;
    try {
      rules = IssuerRulesSchema.parse(parsed.issuerRules);
    } catch (e) {
      err(`${filename}: issuer_rules.json validation: ${(e as Error).message}`);
    }
    const existing = db.issuerRules.get(rules.issuer);
    if (!existing) {
      // Spread the parsed object so we don't mutate the Zod output if a
      // future Zod option freezes it.
      db.issuerRules.set(rules.issuer, { issuer: rules.issuer, rules: [...rules.rules] });
    } else {
      // Merge rule lists by rule id, preserving first definition.
      const seen = new Set(existing.rules.map((r) => r.id));
      const merged = [...existing.rules];
      for (const r of rules.rules) {
        if (!seen.has(r.id)) {
          merged.push(r);
          seen.add(r.id);
        }
      }
      db.issuerRules.set(rules.issuer, { issuer: existing.issuer, rules: merged });
    }
  }

  if (parsed.perksDedup) {
    for (const raw of parsed.perksDedup) {
      let entry: PerksDedupEntry;
      try {
        entry = PerksDedupEntrySchema.parse(raw);
      } catch (e) {
        err(`${filename}: perks_dedup.json validation: ${(e as Error).message}`);
      }
      const existing = db.perksDedup.get(entry.perk);
      if (!existing) {
        db.perksDedup.set(entry.perk, { ...entry, card_ids: [...entry.card_ids] });
      } else {
        for (const id of entry.card_ids) {
          if (!existing.card_ids.includes(id)) existing.card_ids.push(id);
        }
      }
    }
  }

  if (parsed.destinationPerks) {
    for (const [key, raw] of Object.entries(parsed.destinationPerks)) {
      let dp: DestinationPerk;
      try {
        dp = DestinationPerkSchema.parse(raw);
      } catch (e) {
        err(`${filename}: destination_perks.json[${key}] validation: ${(e as Error).message}`);
      }
      const existing = db.destinationPerks.get(key);
      if (!existing) {
        db.destinationPerks.set(key, dp);
      } else {
        // Union relevant_cards; first-write wins for prose fields.
        const seen = new Set(existing.relevant_cards);
        for (const c of dp.relevant_cards) if (!seen.has(c)) existing.relevant_cards.push(c);
      }
    }
  }

  if (parsed.notes) {
    db.notes.push(`### ${card.id} (${card.name})\n\n${parsed.notes}`);
  }

  // ── soul (additive; all sub-sections optional) ──────────────────────
  // Validate each present sub-section. Any failure aborts the build (loud
  // by design — bad soul data should never reach the runtime).
  const soul: Soul = {};
  if (parsed.soul.credit_score) {
    try {
      soul.credit_score = SoulCreditScoreSchema.parse(parsed.soul.credit_score);
    } catch (e) {
      err(`${filename}: card_soul.credit_score validation: ${(e as Error).message}`);
    }
  }
  if (parsed.soul.annual_credits) {
    if (!Array.isArray(parsed.soul.annual_credits)) {
      err(`${filename}: card_soul.annual_credits must be a JSON array`);
    }
    try {
      soul.annual_credits = (parsed.soul.annual_credits as unknown[]).map((c) =>
        SoulAnnualCreditSchema.parse(c),
      );
    } catch (e) {
      err(`${filename}: card_soul.annual_credits validation: ${(e as Error).message}`);
    }
  }
  if (parsed.soul.insurance) {
    try {
      soul.insurance = SoulInsuranceSchema.parse(parsed.soul.insurance);
    } catch (e) {
      err(`${filename}: card_soul.insurance validation: ${(e as Error).message}`);
    }
  }
  if (parsed.soul.program_access) {
    if (!Array.isArray(parsed.soul.program_access)) {
      err(`${filename}: card_soul.program_access must be a JSON array`);
    }
    try {
      soul.program_access = (parsed.soul.program_access as unknown[]).map((p) =>
        SoulProgramAccessEntrySchema.parse(p),
      );
    } catch (e) {
      err(`${filename}: card_soul.program_access validation: ${(e as Error).message}`);
    }
  }
  if (parsed.soul.co_brand_perks) {
    try {
      soul.co_brand_perks = SoulCoBrandPerksSchema.parse(parsed.soul.co_brand_perks);
    } catch (e) {
      err(`${filename}: card_soul.co_brand_perks validation: ${(e as Error).message}`);
    }
  }
  if (parsed.soul.absent_perks) {
    if (!Array.isArray(parsed.soul.absent_perks)) {
      err(`${filename}: card_soul.absent_perks must be a JSON array`);
    }
    try {
      soul.absent_perks = (parsed.soul.absent_perks as unknown[]).map((p) =>
        SoulAbsentPerkSchema.parse(p),
      );
    } catch (e) {
      err(`${filename}: card_soul.absent_perks validation: ${(e as Error).message}`);
    }
  }
  if (parsed.soul.fetch_log) {
    soul.fetch_log = parsed.soul.fetch_log;
  }
  // Only store soul if any sub-section was actually populated. Avoids
  // emitting empty {} entries for the 79 not-yet-enriched cards.
  if (Object.keys(soul).length > 0) {
    db.souls.set(card.id, soul);
  }
}

// Derive the authoritative `earning_cards` for each program from the
// cards' `currency_earned` field. This is more robust than trusting the
// anchor's hand-written list.
function deriveEarningCards(db: DB): void {
  for (const program of db.programs.values()) {
    const earning = db.cards
      .filter((c) => c.currency_earned === program.id)
      .map((c) => c.id)
      .sort();
    program.earning_cards = earning;
  }
}

// Default median_redemption_cpp for cash and fixed_value programs to 1.0
// so the engine doesn't have to special-case them. Loyalty programs
// (transferable, cobrand_airline, cobrand_hotel) MUST carry an explicit
// median value with an as-of date — see assertMedianCppFreshness.
function defaultCashMedianCpp(db: DB): void {
  for (const program of db.programs.values()) {
    const isLoyalty =
      program.type === "transferable" ||
      program.type.startsWith("cobrand_") ||
      program.transfer_partners.length > 0;
    if (isLoyalty) continue;
    if (program.median_redemption_cpp == null) {
      program.median_redemption_cpp = 1.0;
      program.median_cpp_source_url = "fixed_value";
    }
  }
}

// Build-time guard: every loyalty program must have a median cpp from a
// dated source no older than 60 days. Without this, monthly TPG
// refreshes slip and the recommendation math rots silently. The
// freshness window is intentionally tight — slow-rolling drift is
// exactly what we want surfaced as a build failure.
function assertMedianCppFreshness(db: DB): void {
  const FRESH_DAYS = 60;
  const now = new Date();
  const stale: string[] = [];
  const missing: string[] = [];
  for (const program of db.programs.values()) {
    const isLoyalty =
      program.type === "transferable" ||
      program.type.startsWith("cobrand_") ||
      program.transfer_partners.length > 0;
    if (!isLoyalty) continue;
    if (program.median_redemption_cpp == null) {
      missing.push(`${program.id} (${program.name})`);
      continue;
    }
    if (!program.median_cpp_as_of) {
      missing.push(`${program.id}: missing median_cpp_as_of`);
      continue;
    }
    const asOf = new Date(`${program.median_cpp_as_of}T00:00:00Z`);
    const ageDays = (now.getTime() - asOf.getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > FRESH_DAYS) {
      stale.push(
        `${program.id}: median_cpp_as_of ${program.median_cpp_as_of} (${Math.round(ageDays)} days old)`,
      );
    }
  }
  if (missing.length > 0) {
    err(
      `${missing.length} loyalty programs are missing median_redemption_cpp:\n  - ${missing.join("\n  - ")}\n\nPull current values from https://thepointsguy.com/loyalty-programs/monthly-valuations/`,
    );
  }
  if (stale.length > 0) {
    err(
      `${stale.length} loyalty programs have stale median_cpp_as_of (>${FRESH_DAYS} days):\n  - ${stale.join("\n  - ")}\n\nRefresh from https://thepointsguy.com/loyalty-programs/monthly-valuations/`,
    );
  }
}

// ── write ──────────────────────────────────────────────────────────────

function writeJSON(filename: string, value: unknown): void {
  const path = join(DATA_DIR, filename);
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function writeOutputs(db: DB): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  writeJSON("cards.json", db.cards);
  writeJSON("programs.json", [...db.programs.values()]);
  writeJSON("issuer_rules.json", [...db.issuerRules.values()]);
  writeJSON("perks_dedup.json", [...db.perksDedup.values()]);

  // destination_perks is keyed by destination, kept as object for fast lookup.
  const destObj: Record<string, DestinationPerk> = {};
  for (const [k, v] of db.destinationPerks.entries()) destObj[k] = v;
  writeJSON("destination_perks.json", destObj);

  // Soul: keyed by card_id. Only cards with at least one populated
  // soul sub-section appear in this file. The runtime loader treats
  // missing entries as "card not yet enriched."
  const soulObj: Record<string, Soul> = {};
  for (const [k, v] of db.souls.entries()) soulObj[k] = v;
  writeJSON("card_soul.json", soulObj);

  // Signal catalog (Phase 1). Sorted array. Loaded by lib/data/loader.ts
  // and exposed on CardDatabase.signals — not yet consumed by engine.
  writeJSON("signals.json", db.signals);

  // Compiled at: stamp + counts so the loader can surface freshness.
  writeJSON("manifest.json", {
    compiled_at: new Date().toISOString(),
    counts: {
      cards: db.cards.length,
      programs: db.programs.size,
      issuers: db.issuerRules.size,
      perks_dedup: db.perksDedup.size,
      destinations: db.destinationPerks.size,
      souls: db.souls.size,
      signals: db.signals.length,
    },
  });

  // Concatenated research notes.
  const notesPath = join(DATA_DIR, "RESEARCH_NOTES.md");
  const header = `# Research notes\n\nAuto-compiled from cards/*.md research-notes sections. Generated ${new Date().toISOString()}. Do not edit by hand.\n\n`;
  writeFileSync(notesPath, header + db.notes.join("\n\n---\n\n") + "\n", "utf8");
}

// ── AllCards.md regen ──────────────────────────────────────────────────

function regenAllCards(db: DB): void {
  const lines: string[] = [];
  lines.push("# All Cards Researched");
  lines.push("");
  lines.push(
    "This file tracks every card that has been fully researched and written to a card file in this directory. Before researching a new card, check this list to avoid duplication.",
  );
  lines.push("");
  lines.push("Format: `card_id` — `Card Name` (Issuer)");
  lines.push("");
  lines.push("Target: 80 cards.");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Completed");
  lines.push("");
  lines.push(`_Auto-generated. ${db.cards.length} cards. Re-run \`npm run cards:build\` to refresh._`);
  lines.push("");

  const sorted = [...db.cards].sort((a, b) => a.id.localeCompare(b.id));
  sorted.forEach((c, i) => {
    lines.push(`${i + 1}. \`${c.id}\` — ${c.name} (${c.issuer})`);
  });
  lines.push("");

  writeFileSync(ALL_CARDS, lines.join("\n"), "utf8");
}

// ── main ───────────────────────────────────────────────────────────────

function main(): void {
  const files = listCardFiles();
  log(`reading ${files.length} card files from cards/`);

  const db = emptyDB();
  for (const f of files) {
    mergeFile(db, f);
  }

  loadSignals(db);
  log(`reading ${db.signals.length} signal files from signals/`);

  validateSignalReferences(db);

  deriveEarningCards(db);
  defaultCashMedianCpp(db);
  assertMedianCppFreshness(db);
  writeOutputs(db);
  regenAllCards(db);

  log(
    `wrote ${db.cards.length} cards, ${db.programs.size} programs, ${db.issuerRules.size} issuers, ` +
      `${db.perksDedup.size} dedup perks, ${db.destinationPerks.size} destinations, ` +
      `${db.souls.size} souls, ${db.signals.length} signals to data/`,
  );
}

main();
