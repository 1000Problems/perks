// Markdown extractor. Each card file has six labeled sections, each
// optionally containing a single ```json fenced block. We pull the JSON
// out and ignore the prose around it.

export interface ParsedCard {
  filename: string;
  card: unknown | null;
  program: unknown | null;
  issuerRules: unknown | null;
  perksDedup: unknown[] | null;
  destinationPerks: Record<string, unknown> | null;
  notes: string;
}

const SECTION_KEYS = {
  card: /^## cards\.json/,
  program: /^## programs\.json/,
  issuerRules: /^## issuer_rules\.json/,
  perksDedup: /^## perks_dedup\.json/,
  destinationPerks: /^## destination_perks\.json/,
  notes: /^## RESEARCH_NOTES/,
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
  } catch (e) {
    throw new Error(`${filename}: ${(e as Error).message}`);
  }

  return {
    filename,
    card,
    program,
    issuerRules,
    perksDedup,
    destinationPerks,
    notes: (sections.notes ?? "").trim(),
  };
}
