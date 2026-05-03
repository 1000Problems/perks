// Markdown extractor. Each card file has six labeled sections, each
// optionally containing a single ```json fenced block. We pull the JSON
// out and ignore the prose around it.
//
// Soul sections (## card_soul.X) are optional and carry the rich
// per-card enrichment data. See docs/SOUL_SCHEMA_PROPOSAL.md.

export interface ParsedCard {
  filename: string;
  card: unknown | null;
  program: unknown | null;
  issuerRules: unknown | null;
  perksDedup: unknown[] | null;
  destinationPerks: Record<string, unknown> | null;
  notes: string;
  // Money-find content per cards/{id}.md. Both optional. Parsed as
  // unknown[] (or null when absent) and validated downstream against
  // PlaySchema / ColdPromptSchema in scripts/build-card-db.ts.
  cardPlays: unknown[] | null;
  coldPrompts: unknown[] | null;
  soul: {
    credit_score: unknown | null;
    annual_credits: unknown | null;
    insurance: unknown | null;
    program_access: unknown | null;
    co_brand_perks: unknown | null;
    absent_perks: unknown | null;
    fetch_log: string;
  };
}

const SECTION_KEYS = {
  card: /^## cards\.json/,
  program: /^## programs\.json/,
  issuerRules: /^## issuer_rules\.json/,
  perksDedup: /^## perks_dedup\.json/,
  destinationPerks: /^## destination_perks\.json/,
  notes: /^## RESEARCH_NOTES/,
  // Money-find page content (additive — both optional)
  cardPlays: /^## card_plays\b/,
  coldPrompts: /^## cold_prompts\b/,
  // Soul sections (additive — all optional)
  soulCreditScore: /^## card_soul\.credit_score\b/,
  soulAnnualCredits: /^## card_soul\.annual_credits\b/,
  soulInsurance: /^## card_soul\.insurance\b/,
  soulProgramAccess: /^## card_soul\.program_access\b/,
  soulCoBrandPerks: /^## card_soul\.co_brand_perks\b/,
  soulAbsentPerks: /^## card_soul\.absent_perks\b/,
  soulFetchLog: /^## card_soul\.fetch_log\b/,
} as const;

type SectionKey = keyof typeof SECTION_KEYS;

// Split markdown by ## headers, return a map of section-key → body text.
function splitSections(md: string): Partial<Record<SectionKey, string>> {
  const lines = md.split("\n");
  const sections: Partial<Record<SectionKey, string>> = {};
  let current: SectionKey | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (current) sections[current] = buffer.join("\n");
    buffer = [];
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flush();
      current = null;
      for (const [key, re] of Object.entries(SECTION_KEYS) as [SectionKey, RegExp][]) {
        if (re.test(line)) {
          current = key;
          break;
        }
      }
    } else if (current) {
      buffer.push(line);
    }
  }
  flush();
  return sections;
}

// Extract the first ```json fenced block from a section body. Returns
// null if the section is prose-only ("see foo.md for canonical version").
function extractJson(section: string | undefined): unknown | null {
  if (!section) return null;
  const fence = section.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!fence) return null;
  try {
    return JSON.parse(fence[1]);
  } catch (e) {
    throw new Error(`malformed JSON: ${(e as Error).message}`);
  }
}

export function parseCardMarkdown(filename: string, md: string): ParsedCard {
  const sections = splitSections(md);

  let card: unknown | null;
  let program: unknown | null;
  let issuerRules: unknown | null;
  let perksDedup: unknown[] | null;
  let destinationPerks: Record<string, unknown> | null;

  let cardPlays: unknown[] | null;
  let coldPrompts: unknown[] | null;

  try {
    card = extractJson(sections.card);
    program = extractJson(sections.program);
    issuerRules = extractJson(sections.issuerRules);
    const dedupRaw = extractJson(sections.perksDedup);
    perksDedup = Array.isArray(dedupRaw) ? dedupRaw : dedupRaw ? [dedupRaw] : null;
    const destRaw = extractJson(sections.destinationPerks);
    destinationPerks =
      destRaw && typeof destRaw === "object" && !Array.isArray(destRaw)
        ? (destRaw as Record<string, unknown>)
        : null;
    const playsRaw = extractJson(sections.cardPlays);
    cardPlays = Array.isArray(playsRaw) ? playsRaw : null;
    const promptsRaw = extractJson(sections.coldPrompts);
    coldPrompts = Array.isArray(promptsRaw) ? promptsRaw : null;
  } catch (e) {
    throw new Error(`${filename}: ${(e as Error).message}`);
  }

  let soulCreditScore: unknown | null = null;
  let soulAnnualCredits: unknown | null = null;
  let soulInsurance: unknown | null = null;
  let soulProgramAccess: unknown | null = null;
  let soulCoBrandPerks: unknown | null = null;
  let soulAbsentPerks: unknown | null = null;

  try {
    soulCreditScore = extractJson(sections.soulCreditScore);
    soulAnnualCredits = extractJson(sections.soulAnnualCredits);
    soulInsurance = extractJson(sections.soulInsurance);
    soulProgramAccess = extractJson(sections.soulProgramAccess);
    soulCoBrandPerks = extractJson(sections.soulCoBrandPerks);
    soulAbsentPerks = extractJson(sections.soulAbsentPerks);
  } catch (e) {
    throw new Error(`${filename} (soul section): ${(e as Error).message}`);
  }

  return {
    filename,
    card,
    program,
    issuerRules,
    perksDedup,
    destinationPerks,
    notes: (sections.notes ?? "").trim(),
    cardPlays,
    coldPrompts,
    soul: {
      credit_score: soulCreditScore,
      annual_credits: soulAnnualCredits,
      insurance: soulInsurance,
      program_access: soulProgramAccess,
      co_brand_perks: soulCoBrandPerks,
      absent_perks: soulAbsentPerks,
      fetch_log: (sections.soulFetchLog ?? "").trim(),
    },
  };
}
