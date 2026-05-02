// scripts/verify-cards-soul-parity.ts
//
// Confirms the Postgres catalog faithfully materializes the markdown
// source for every soul-enriched card. Run after `npm run db:migrate-cards`
// or before any deploy that depends on soul data being current.
//
// Compares (per card_id with at least one soul section):
//   - card_annual_credits         row count + names
//   - card_insurance              coverage_kind set + each row's confidence
//   - card_program_access         (program_id, access_kind) set
//   - card_co_brand_perks         perk_kind row count
//   - card_absent_perks           perk_key set
//
// Drift is reported, never auto-corrected. Exit code 1 on any drift so
// CI can gate.
//
// Usage:
//   npm run db:verify-cards-soul          — print summary, exit 1 on drift
//   npm run db:verify-cards-soul -- --json — emit JSON parity report

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
// Use the unpooled connection — verification reads many rows per card
// and benefits from the same generous timeouts as the migration script.
import { getMigrationDb } from "./lib/db-migrate-conn";
const sql = getMigrationDb();
import {
  CardSchema,
  SoulCreditScoreSchema,
  SoulAnnualCreditSchema,
  SoulInsuranceSchema,
  SoulProgramAccessEntrySchema,
  SoulCoBrandPerksSchema,
  SoulAbsentPerkSchema,
  type Soul,
} from "./lib/schemas";
import { parseCardMarkdown } from "./lib/parse";

const ROOT = process.cwd();
const CARDS_DIR = join(ROOT, "cards");
const REPORT_PATH = join(ROOT, "scripts", "verify-cards-soul-parity.report.md");

const COVERAGE_KINDS = new Set([
  "auto_rental_cdw",
  "trip_cancellation_interruption",
  "trip_delay",
  "baggage_delay",
  "lost_baggage",
  "cell_phone_protection",
  "emergency_evacuation_medical",
  "emergency_medical_dental",
  "travel_accident_insurance",
  "purchase_protection",
  "extended_warranty",
  "return_protection",
  "roadside_assistance",
]);

interface Drift {
  card_id: string;
  field: string;
  markdown: unknown;
  db: unknown;
}

interface CardSummary {
  card_id: string;
  has_soul: boolean;
  in_db: boolean;
  drift: Drift[];
}

function listCardFiles(): string[] {
  return readdirSync(CARDS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "AllCards.md" && !f.startsWith("_"))
    .sort();
}

function parseSoulFromMarkdown(filename: string): { card_id: string; soul: Soul } | null {
  const md = readFileSync(join(CARDS_DIR, filename), "utf8");
  const parsed = parseCardMarkdown(filename, md);
  if (!parsed.card) return null;
  const cardCheck = CardSchema.safeParse(parsed.card);
  if (!cardCheck.success) return null;

  const soul: Soul = {};
  if (parsed.soul.credit_score) {
    const r = SoulCreditScoreSchema.safeParse(parsed.soul.credit_score);
    if (r.success) soul.credit_score = r.data;
  }
  if (parsed.soul.annual_credits && Array.isArray(parsed.soul.annual_credits)) {
    soul.annual_credits = (parsed.soul.annual_credits as unknown[])
      .map((c) => SoulAnnualCreditSchema.safeParse(c))
      .filter((r) => r.success)
      .map((r) => r.data!);
  }
  if (parsed.soul.insurance) {
    const r = SoulInsuranceSchema.safeParse(parsed.soul.insurance);
    if (r.success) soul.insurance = r.data;
  }
  if (parsed.soul.program_access && Array.isArray(parsed.soul.program_access)) {
    soul.program_access = (parsed.soul.program_access as unknown[])
      .map((p) => SoulProgramAccessEntrySchema.safeParse(p))
      .filter((r) => r.success)
      .map((r) => r.data!);
  }
  if (parsed.soul.co_brand_perks) {
    const r = SoulCoBrandPerksSchema.safeParse(parsed.soul.co_brand_perks);
    if (r.success) soul.co_brand_perks = r.data;
  }
  if (parsed.soul.absent_perks && Array.isArray(parsed.soul.absent_perks)) {
    soul.absent_perks = (parsed.soul.absent_perks as unknown[])
      .map((p) => SoulAbsentPerkSchema.safeParse(p))
      .filter((r) => r.success)
      .map((r) => r.data!);
  }

  return { card_id: cardCheck.data.id, soul };
}

function expectedCoBrandRowCount(perks: NonNullable<Soul["co_brand_perks"]>): number {
  let n = 0;
  for (const v of Object.values(perks)) {
    if (v === null || v === undefined) continue;
    if (Array.isArray(v)) n += v.length;
    else n += 1; // single object or scalar
  }
  return n;
}

async function verifyCard(
  card_id: string,
  soul: Soul,
): Promise<CardSummary> {
  const summary: CardSummary = {
    card_id,
    has_soul: Object.keys(soul).length > 0,
    in_db: false,
    drift: [],
  };

  // Confirm card exists
  const exists = await sql<{ id: string }[]>`select id from cards where id = ${card_id}`;
  summary.in_db = exists.length > 0;
  if (!summary.in_db) {
    summary.drift.push({
      card_id,
      field: "_card_not_in_db",
      markdown: "present",
      db: "missing",
    });
    return summary;
  }

  // annual_credits
  if (soul.annual_credits) {
    const rows = await sql<{ name: string }[]>`
      select name from card_annual_credits where card_id = ${card_id}
    `;
    const dbNames = new Set(rows.map((r) => r.name));
    const mdNames = new Set(soul.annual_credits.map((c) => c.name));
    if (dbNames.size !== mdNames.size || [...mdNames].some((n) => !dbNames.has(n))) {
      summary.drift.push({
        card_id,
        field: "annual_credits.names",
        markdown: [...mdNames].sort(),
        db: [...dbNames].sort(),
      });
    }
  }

  // insurance — compare set of coverage_kinds present
  if (soul.insurance) {
    const rows = await sql<{ coverage_kind: string }[]>`
      select coverage_kind from card_insurance where card_id = ${card_id}
    `;
    const dbKinds = new Set(rows.map((r) => r.coverage_kind));
    const mdKinds = new Set(
      Object.entries(soul.insurance)
        .filter(([k, v]) => COVERAGE_KINDS.has(k) && v)
        .map(([k]) => k),
    );
    const extraInDb = [...dbKinds].filter((k) => !mdKinds.has(k));
    const missingInDb = [...mdKinds].filter((k) => !dbKinds.has(k));
    if (extraInDb.length || missingInDb.length) {
      summary.drift.push({
        card_id,
        field: "insurance.coverage_kinds",
        markdown: [...mdKinds].sort(),
        db: [...dbKinds].sort(),
      });
    }
  }

  // program_access — compare (program_id, access_kind) set
  if (soul.program_access) {
    const rows = await sql<{ program_id: string; access_kind: string }[]>`
      select program_id, access_kind from card_program_access where card_id = ${card_id}
    `;
    const dbSet = new Set(rows.map((r) => `${r.program_id}:${r.access_kind}`));
    const mdSet = new Set(soul.program_access.map((p) => `${p.program_id}:${p.access_kind}`));
    if (
      dbSet.size !== mdSet.size ||
      [...mdSet].some((k) => !dbSet.has(k))
    ) {
      summary.drift.push({
        card_id,
        field: "program_access.entries",
        markdown: [...mdSet].sort(),
        db: [...dbSet].sort(),
      });
    }
  }

  // co_brand_perks — fan-out row count check (lower-fidelity than the
  // others; structural drift in the fan-out logic shows up here).
  if (soul.co_brand_perks) {
    const rows = await sql<{ count: string }[]>`
      select count(*)::text as count from card_co_brand_perks where card_id = ${card_id}
    `;
    const dbCount = parseInt(rows[0]?.count ?? "0", 10);
    const mdCount = expectedCoBrandRowCount(soul.co_brand_perks);
    if (dbCount !== mdCount) {
      summary.drift.push({
        card_id,
        field: "co_brand_perks.row_count",
        markdown: mdCount,
        db: dbCount,
      });
    }
  }

  // absent_perks — compare perk_key set
  if (soul.absent_perks) {
    const rows = await sql<{ perk_key: string }[]>`
      select perk_key from card_absent_perks where card_id = ${card_id}
    `;
    const dbKeys = new Set(rows.map((r) => r.perk_key));
    const mdKeys = new Set(soul.absent_perks.map((p) => p.perk_key));
    if (
      dbKeys.size !== mdKeys.size ||
      [...mdKeys].some((k) => !dbKeys.has(k))
    ) {
      summary.drift.push({
        card_id,
        field: "absent_perks.keys",
        markdown: [...mdKeys].sort(),
        db: [...dbKeys].sort(),
      });
    }
  }

  // credit_score band
  if (soul.credit_score) {
    const rows = await sql<{ credit_score_required: string | null }[]>`
      select credit_score_required from cards where id = ${card_id}
    `;
    const dbBand = rows[0]?.credit_score_required ?? null;
    if (dbBand !== soul.credit_score.band) {
      summary.drift.push({
        card_id,
        field: "credit_score.band",
        markdown: soul.credit_score.band,
        db: dbBand,
      });
    }
  }

  return summary;
}

async function main(): Promise<void> {
  const jsonOut = process.argv.includes("--json");
  const files = listCardFiles();
  const summaries: CardSummary[] = [];

  for (const f of files) {
    const parsed = parseSoulFromMarkdown(f);
    if (!parsed) continue;
    if (Object.keys(parsed.soul).length === 0) continue; // not enriched
    const s = await verifyCard(parsed.card_id, parsed.soul);
    summaries.push(s);
  }

  const drifted = summaries.filter((s) => s.drift.length > 0);

  // Emit report
  const lines: string[] = [];
  lines.push(`# Soul parity report — ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`Cards checked: ${summaries.length}`);
  lines.push(`Drift detected on: ${drifted.length}`);
  lines.push("");

  for (const s of summaries) {
    if (s.drift.length === 0) {
      lines.push(`- ✅ \`${s.card_id}\` — clean`);
    } else {
      lines.push(`- ❌ \`${s.card_id}\` — ${s.drift.length} drift(s):`);
      for (const d of s.drift) {
        lines.push(`    - **${d.field}**`);
        lines.push(`      - markdown: \`${JSON.stringify(d.markdown)}\``);
        lines.push(`      - db:       \`${JSON.stringify(d.db)}\``);
      }
    }
  }

  writeFileSync(REPORT_PATH, lines.join("\n") + "\n", "utf8");

  if (jsonOut) {
    console.log(JSON.stringify({ summaries, drifted_count: drifted.length }, null, 2));
  } else {
    console.log(lines.join("\n"));
    console.log("");
    console.log(`Wrote report → ${REPORT_PATH}`);
  }

  await sql.end();
  process.exit(drifted.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("FAIL:", e);
  process.exit(2);
});
