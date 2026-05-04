// Runtime loader for the compiled card database. The build script
// (scripts/build-card-db.ts) produces these JSON files from cards/*.md
// markdown sources before each Next.js build.
//
// This loader validates the JSON again at startup with the same Zod
// schemas — defense in depth, since data/*.json is gitignored and
// regenerated. Catches the case where someone hand-edits the output.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import {
  CardSchema,
  ProgramSchema,
  IssuerRulesSchema,
  PerksDedupEntrySchema,
  DestinationPerkSchema,
  SignalSchema,
} from "../../scripts/lib/schemas";

const DATA_DIR = join(process.cwd(), "data");

const ManifestSchema = z.object({
  compiled_at: z.string(),
  counts: z.object({
    cards: z.number(),
    programs: z.number(),
    issuers: z.number(),
    perks_dedup: z.number(),
    destinations: z.number(),
    // souls / signals are additive — older manifests may omit them, so
    // they're optional for forward compatibility, but the build script
    // always writes them.
    souls: z.number().optional(),
    signals: z.number().optional(),
  }),
});

// Use the schemas' parsed output types directly. Zod's z.infer can drop
// defaults under certain compiler settings, so we type via _output.
type ParsedCard = z.output<typeof CardSchema>;
type ParsedProgram = z.output<typeof ProgramSchema>;
type ParsedIssuerRules = z.output<typeof IssuerRulesSchema>;
type ParsedPerksDedup = z.output<typeof PerksDedupEntrySchema>;
type ParsedDestinationPerk = z.output<typeof DestinationPerkSchema>;
type ParsedSignal = z.output<typeof SignalSchema>;

export interface CardDatabase {
  cards: ParsedCard[];
  programs: ParsedProgram[];
  issuerRules: ParsedIssuerRules[];
  perksDedup: ParsedPerksDedup[];
  destinationPerks: Record<string, ParsedDestinationPerk>;
  // Phase 1: signal catalog. Loaded but not yet consumed by the engine.
  signals: ParsedSignal[];
  manifest: z.infer<typeof ManifestSchema>;
  // Lookup helpers
  cardById: Map<string, ParsedCard>;
  programById: Map<string, ParsedProgram>;
  issuerRulesByIssuer: Map<string, ParsedIssuerRules>;
  signalById: Map<string, ParsedSignal>;
}

function readJSON<T>(filename: string, schema: z.ZodType<T>): T {
  const path = join(DATA_DIR, filename);
  if (!existsSync(path)) {
    throw new Error(
      `Missing data/${filename}. Run \`npm run cards:build\` to compile from cards/*.md.`,
    );
  }
  const raw = JSON.parse(readFileSync(path, "utf8"));
  return schema.parse(raw);
}

let cached: CardDatabase | null = null;

export function loadCardDatabase(): CardDatabase {
  if (cached) return cached;

  const cards = readJSON("cards.json", z.array(CardSchema)) as ParsedCard[];
  const programs = readJSON(
    "programs.json",
    z.array(ProgramSchema),
  ) as ParsedProgram[];
  const issuerRules = readJSON(
    "issuer_rules.json",
    z.array(IssuerRulesSchema),
  ) as ParsedIssuerRules[];
  const perksDedup = readJSON(
    "perks_dedup.json",
    z.array(PerksDedupEntrySchema),
  ) as ParsedPerksDedup[];
  const destinationPerks = readJSON(
    "destination_perks.json",
    z.record(DestinationPerkSchema),
  ) as Record<string, ParsedDestinationPerk>;
  const signals = readJSON(
    "signals.json",
    z.array(SignalSchema),
  ) as ParsedSignal[];
  const manifest = readJSON("manifest.json", ManifestSchema);

  const db: CardDatabase = {
    cards,
    programs,
    issuerRules,
    perksDedup,
    destinationPerks,
    signals,
    manifest,
    cardById: new Map(cards.map((c) => [c.id, c])),
    programById: new Map(programs.map((p) => [p.id, p])),
    issuerRulesByIssuer: new Map(issuerRules.map((r) => [r.issuer, r])),
    signalById: new Map(signals.map((s) => [s.id, s])),
  };

  cached = db;
  return db;
}

// Re-export types for convenience.
export type {
  Card,
  Program,
  IssuerRules,
  PerksDedupEntry,
  DestinationPerk,
  Signal,
  Play,
  PlayGroupId,
  PlayQuestionId,
  ColdPrompt,
} from "../../scripts/lib/schemas";
