// scripts/migrate-cards-to-db.ts
// Parse cards/*.md, transform into the relational catalog shape, insert
// into Postgres. Idempotent. Per-card transactions; broken cards are
// reported and skipped, never abort the run.
//
// DB connection: Neon via lib/db.ts (postgres-js). DATABASE_URL env var.
// No Supabase. No service-role keys. No RLS.
//
// Usage:
//   npm run db:migrate-cards            — apply
//   npm run db:migrate-cards:dry-run    — same, rolls back outer tx
//   npm run db:migrate-cards:report     — re-print last report

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Sql, TransactionSql } from "postgres";
import { getMigrationDb } from "./lib/db-migrate-conn";

// Use the unpooled connection for migrations. The pooled URL trips
// Neon's idle-in-transaction timeout on the dry-run path. See
// scripts/lib/db-migrate-conn.ts for details.
const sql = getMigrationDb();

// Helper: postgres-js types TransactionSql vs Sql separately. Our soul
// helpers can run inside either, so we accept the union and cast inputs
// to JSONValue where Zod-validated data exceeds postgres-js's narrow type.
type AnySql = Sql | TransactionSql<Record<string, never>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;
import {
  CardSchema,
  ProgramSchema,
  SoulCreditScoreSchema,
  SoulAnnualCreditSchema,
  SoulInsuranceSchema,
  SoulProgramAccessEntrySchema,
  SoulCoBrandPerksSchema,
  SoulAbsentPerkSchema,
  type Card,
  type Program,
  type Soul,
  type SoulInsurance,
  type SoulCoBrandPerks,
} from "./lib/schemas";
import { parseCardMarkdown } from "./lib/parse";
import { slugify } from "./lib/slugify";

const ROOT = process.cwd();
const CARDS_DIR = join(ROOT, "cards");
const REPORT_PATH = join(ROOT, "scripts", "migrate-cards-to-db.report.md");

type EaseGrade = "easy" | "medium" | "hard" | "coupon_book";
const EASE_SCORE: Record<EaseGrade, number> = {
  easy: 5, medium: 3, hard: 2, coupon_book: 1,
};
const EASE_PCT: Record<EaseGrade, number> = {
  easy: 0.95, medium: 0.75, hard: 0.5, coupon_book: 0.3,
};

interface ReportEntry {
  filename: string;
  status: "inserted" | "updated" | "skipped";
  reason?: string;
  details?: string;
}

interface Report {
  ran_at: string;
  dry_run: boolean;
  totals: {
    issuers: number;
    networks: number;
    programs: number;
    cards_inserted: number;
    cards_updated: number;
    cards_skipped: number;
  };
  entries: ReportEntry[];
}

function listCardFiles(): string[] {
  return readdirSync(CARDS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "AllCards.md" && !f.startsWith("_"))
    .sort();
}

interface ParsedFile {
  filename: string;
  card?: Card;
  program?: Program;
  soul?: Soul;
  parseError?: string;
}

function parseAll(): ParsedFile[] {
  const files = listCardFiles();
  const out: ParsedFile[] = [];
  for (const filename of files) {
    const md = readFileSync(join(CARDS_DIR, filename), "utf8");
    const parsed = parseCardMarkdown(filename, md);
    if (!parsed.card) {
      out.push({ filename, parseError: "missing cards.json entry block" });
      continue;
    }
    const cardCheck = CardSchema.safeParse(parsed.card);
    if (!cardCheck.success) {
      out.push({
        filename,
        parseError: `cards.json: ${cardCheck.error.issues
          .slice(0, 3)
          .map((i) => `${i.path.join(".")} ${i.message}`)
          .join("; ")}`,
      });
      continue;
    }
    let program: Program | undefined;
    if (parsed.program) {
      const pc = ProgramSchema.safeParse(parsed.program);
      if (pc.success) program = pc.data;
    }

    // Parse soul sub-sections defensively. Bad soul = skip card with
    // explanatory error, never abort the whole run.
    const soul: Soul = {};
    let soulErr: string | null = null;
    try {
      if (parsed.soul.credit_score) {
        soul.credit_score = SoulCreditScoreSchema.parse(parsed.soul.credit_score);
      }
      if (parsed.soul.annual_credits) {
        if (!Array.isArray(parsed.soul.annual_credits)) {
          throw new Error("card_soul.annual_credits must be a JSON array");
        }
        soul.annual_credits = (parsed.soul.annual_credits as unknown[]).map((c) =>
          SoulAnnualCreditSchema.parse(c),
        );
      }
      if (parsed.soul.insurance) {
        soul.insurance = SoulInsuranceSchema.parse(parsed.soul.insurance);
      }
      if (parsed.soul.program_access) {
        if (!Array.isArray(parsed.soul.program_access)) {
          throw new Error("card_soul.program_access must be a JSON array");
        }
        soul.program_access = (parsed.soul.program_access as unknown[]).map((p) =>
          SoulProgramAccessEntrySchema.parse(p),
        );
      }
      if (parsed.soul.co_brand_perks) {
        soul.co_brand_perks = SoulCoBrandPerksSchema.parse(parsed.soul.co_brand_perks);
      }
      if (parsed.soul.absent_perks) {
        if (!Array.isArray(parsed.soul.absent_perks)) {
          throw new Error("card_soul.absent_perks must be a JSON array");
        }
        soul.absent_perks = (parsed.soul.absent_perks as unknown[]).map((p) =>
          SoulAbsentPerkSchema.parse(p),
        );
      }
    } catch (e) {
      soulErr = `soul: ${(e as Error).message}`;
    }
    if (soulErr) {
      out.push({ filename, parseError: soulErr });
      continue;
    }

    out.push({
      filename,
      card: cardCheck.data,
      program,
      soul: Object.keys(soul).length > 0 ? soul : undefined,
    });
  }
  return out;
}

// ── seed-side: collect issuers, networks, programs, transfer partners ──

interface SeedSets {
  issuers: Map<string, { id: string; display_name: string }>;
  networks: Map<string, { id: string; display_name: string }>;
  programs: Map<string, Program>;
  programAnchors: Map<string, string>;
  transferPartners: Map<string, { id: string; display_name: string; partner_type: "airline" | "hotel" | "other" }>;
}

function collectSeeds(parsed: ParsedFile[]): SeedSets {
  const seeds: SeedSets = {
    issuers: new Map(),
    networks: new Map(),
    programs: new Map(),
    programAnchors: new Map(),
    transferPartners: new Map(),
  };

  for (const p of parsed) {
    if (!p.card) continue;
    const issuerSlug = slugify(p.card.issuer);
    if (!seeds.issuers.has(issuerSlug)) {
      seeds.issuers.set(issuerSlug, { id: issuerSlug, display_name: p.card.issuer });
    }
    if (p.card.network) {
      const netSlug = slugify(p.card.network);
      if (!seeds.networks.has(netSlug)) {
        seeds.networks.set(netSlug, { id: netSlug, display_name: p.card.network });
      }
    }
    if (p.program && !seeds.programs.has(p.program.id)) {
      seeds.programs.set(p.program.id, p.program);
      seeds.programAnchors.set(p.program.id, p.filename);
      for (const tp of p.program.transfer_partners ?? []) {
        const tpSlug = slugify(tp.partner);
        if (!seeds.transferPartners.has(tpSlug)) {
          seeds.transferPartners.set(tpSlug, {
            id: tpSlug,
            display_name: tp.partner,
            partner_type: tp.type,
          });
        }
      }
    }
  }

  synthesizeStubPrograms(seeds, parsed);
  return seeds;
}

// ── stub-program synthesis ─────────────────────────────────────────────
//
// Two situations create program FK violations on insert:
//
//   1. cards_currency_earned_fkey — A card claims `currency_earned: "X"`
//      but no card markdown anchors program "X" with a programs.json
//      block. (Common for store cards / cashback cobrand currencies.)
//
//   2. card_program_access_program_id_fkey — A card_soul.program_access
//      entry references a known program id (centurion_lounge_network,
//      priority_pass_select, fhr, chase_the_edit, etc.) that's not a
//      currency anyone anchors.
//
// Both classes failed silently with the "validate everything as a
// programs.json anchor" approach. Synthesize stub program rows for any
// referenced id that isn't already seeded. The schema's program_type
// enum is wide enough — we map known ids to their natural type and
// fall back to 'fixed_value' for unknowns.

const SOUL_PROGRAM_TYPE_HINTS: Record<string, string> = {
  // Lounge networks
  centurion_lounge_network: "lounge_network",
  priority_pass_select: "lounge_network",
  chase_sapphire_lounge_network: "lounge_network",
  capital_one_lounge_network: "lounge_network",
  delta_skyclub: "lounge_network",
  escape_lounges: "lounge_network",
  airspace_lounges: "lounge_network",
  plaza_premium_lounges: "lounge_network",
  // Luxury hotel programs
  fhr: "luxury_hotel",
  amex_hotel_collection: "luxury_hotel",
  chase_the_edit: "luxury_hotel",
  capital_one_premier_collection: "luxury_hotel",
  capital_one_lifestyle_collection: "luxury_hotel",
  citi_hotel_collection: "luxury_hotel",
  visa_infinite_lhc: "luxury_hotel",
  visa_signature_lhc: "luxury_hotel",
  mastercard_luxury_hotels: "luxury_hotel",
  // Dining programs
  amex_global_dining_access: "dining",
  platinum_nights_resy: "dining",
  capital_one_dining: "dining",
  // Entertainment / experiences / advisor
  amex_presale: "entertainment",
  amex_experiences: "entertainment",
  capital_one_entertainment: "entertainment",
  citi_entertainment: "entertainment",
  mastercard_priceless_cities: "entertainment",
  // Redemption mechanics (treat as advisor / portal feature)
  points_boost_redemption: "advisor",
};

const SOUL_PROGRAM_DISPLAY_NAMES: Record<string, string> = {
  centurion_lounge_network: "The Centurion Lounge",
  priority_pass_select: "Priority Pass Select",
  chase_sapphire_lounge_network: "Chase Sapphire Lounge by The Club",
  capital_one_lounge_network: "Capital One Lounge",
  delta_skyclub: "Delta Sky Club",
  escape_lounges: "Escape Lounges",
  airspace_lounges: "Airspace Lounges",
  plaza_premium_lounges: "Plaza Premium Lounges",
  fhr: "Fine Hotels + Resorts",
  amex_hotel_collection: "The Hotel Collection",
  chase_the_edit: "The Edit by Chase Travel",
  capital_one_premier_collection: "Capital One Premier Collection",
  capital_one_lifestyle_collection: "Capital One Lifestyle Collection",
  citi_hotel_collection: "Citi Hotel Collection",
  visa_infinite_lhc: "Visa Infinite Luxury Hotel Collection",
  visa_signature_lhc: "Visa Signature Hotel Collection",
  mastercard_luxury_hotels: "Mastercard Luxury Hotels & Resorts",
  amex_global_dining_access: "Amex Global Dining Access by Resy",
  platinum_nights_resy: "Platinum Nights by Resy",
  capital_one_dining: "Capital One Dining",
  amex_presale: "Amex Presale Tickets",
  amex_experiences: "Amex Experiences",
  capital_one_entertainment: "Capital One Entertainment",
  citi_entertainment: "Citi Entertainment",
  mastercard_priceless_cities: "Mastercard Priceless Cities",
  points_boost_redemption: "Chase Travel Points Boost",
};

function programTypeFor(id: string): string {
  return SOUL_PROGRAM_TYPE_HINTS[id] ?? "fixed_value";
}

function programDisplayNameFor(id: string): string {
  if (SOUL_PROGRAM_DISPLAY_NAMES[id]) return SOUL_PROGRAM_DISPLAY_NAMES[id];
  // humanize: "target_circle_rewards" -> "Target Circle Rewards"
  return id
    .split("_")
    .map((s) => (s.length === 0 ? s : s[0].toUpperCase() + s.slice(1)))
    .join(" ");
}

function synthesizeStubPrograms(seeds: SeedSets, parsed: ParsedFile[]): void {
  const referenced = new Set<string>();
  for (const p of parsed) {
    if (!p.card) continue;
    if (p.card.currency_earned) referenced.add(p.card.currency_earned);
    if (p.soul?.program_access) {
      for (const pa of p.soul.program_access) referenced.add(pa.program_id);
    }
  }

  let stubsCreated = 0;
  for (const id of referenced) {
    if (seeds.programs.has(id)) continue;
    seeds.programs.set(id, {
      id,
      name: programDisplayNameFor(id),
      // ProgramSchema.type is a free-form string; the DB enum will reject
      // anything outside the program_type enum, so we constrain here.
      type: programTypeFor(id),
      issuer: "",
      earning_cards: [],
      transfer_partners: [],
      transfer_unlock_card_ids: [],
      sweet_spots: [],
      sources: [],
    } as Program);
    seeds.programAnchors.set(id, "<synthesized stub>");
    stubsCreated++;
  }
  if (stubsCreated > 0) {
    console.log(
      `  + synthesized ${stubsCreated} stub programs (no programs.json anchor; auto-created from card.currency_earned and card_soul.program_access references)`,
    );
  }
}

// ── upsert helpers (postgres-js) ───────────────────────────────────────

async function upsertIssuers(seeds: SeedSets): Promise<void> {
  for (const v of seeds.issuers.values()) {
    await sql`
      insert into issuers (id, display_name, last_verified)
      values (${v.id}, ${v.display_name}, current_date)
      on conflict (id) do update
        set display_name = excluded.display_name,
            updated_at = now()
    `;
  }
}

async function upsertNetworks(seeds: SeedSets): Promise<void> {
  for (const v of seeds.networks.values()) {
    await sql`
      insert into networks (id, display_name, last_verified)
      values (${v.id}, ${v.display_name}, current_date)
      on conflict (id) do update
        set display_name = excluded.display_name,
            updated_at = now()
    `;
  }
}

async function upsertPrograms(seeds: SeedSets): Promise<void> {
  for (const p of seeds.programs.values()) {
    // Synthesized stub programs (lounge networks, hotel collections,
    // etc.) carry an empty issuer string. issuer_id is nullable in the
    // schema, so we just leave it null instead of inventing an issuer.
    const issuerSlug = p.issuer ? slugify(p.issuer) : null;
    if (issuerSlug && !seeds.issuers.has(issuerSlug)) {
      await sql`
        insert into issuers (id, display_name)
        values (${issuerSlug}, ${p.issuer})
        on conflict (id) do nothing
      `;
    }
    const type = mapProgramType(p.type);
    await sql`
      insert into programs (
        id, display_name, type, issuer_id,
        fixed_redemption_cpp, portal_redemption_cpp, portal_redemption_cpp_notes,
        config, sources, last_verified
      ) values (
        ${p.id}, ${p.name}, ${type}, ${issuerSlug},
        ${p.fixed_redemption_cpp ?? null}, ${p.portal_redemption_cpp ?? null}, ${p.portal_redemption_cpp_notes ?? null},
        ${sql.json({ sweet_spots: p.sweet_spots ?? [] })},
        ${sql.json(p.sources ?? [])},
        current_date
      )
      on conflict (id) do update set
        display_name = excluded.display_name,
        type = excluded.type,
        fixed_redemption_cpp = excluded.fixed_redemption_cpp,
        portal_redemption_cpp = excluded.portal_redemption_cpp,
        config = excluded.config,
        sources = excluded.sources,
        updated_at = now()
    `;
  }
}

function mapProgramType(t: string): string {
  // Project uses freeform strings; map to enum or fall back to fixed_value.
  const norm = t.toLowerCase();
  if (norm === "transferable") return "transferable";
  if (norm === "cobrand_airline") return "cobrand_airline";
  if (norm === "cobrand_hotel") return "cobrand_hotel";
  if (norm === "fixed_value") return "fixed_value";
  if (norm === "luxury_hotel") return "luxury_hotel";
  if (norm === "dining") return "dining";
  if (norm === "lounge_network") return "lounge_network";
  if (norm === "entertainment") return "entertainment";
  if (norm === "advisor") return "advisor";
  return "fixed_value";
}

async function upsertTransferPartners(seeds: SeedSets): Promise<void> {
  for (const tp of seeds.transferPartners.values()) {
    await sql`
      insert into transfer_partners (id, display_name, partner_type, last_verified)
      values (${tp.id}, ${tp.display_name}, ${tp.partner_type}, current_date)
      on conflict (id) do update
        set display_name = excluded.display_name,
            partner_type = excluded.partner_type,
            updated_at = now()
    `;
  }
}

async function upsertProgramTransferPartnerLinks(seeds: SeedSets): Promise<void> {
  for (const p of seeds.programs.values()) {
    for (const tp of p.transfer_partners ?? []) {
      const partnerSlug = slugify(tp.partner);
      // Ratio comes as "1:1", "5:4", or freeform — store both as 1 if unparseable.
      const [ratioIn, ratioOut] = parseRatio(tp.ratio);
      await sql`
        insert into program_transfer_partners (
          program_id, partner_id, ratio_in, ratio_out, notes, sweet_spots
        ) values (
          ${p.id}, ${partnerSlug}, ${ratioIn}, ${ratioOut},
          ${tp.notes ?? null}, ${[]}::text[]
        )
        on conflict (program_id, partner_id) do update set
          ratio_in = excluded.ratio_in,
          ratio_out = excluded.ratio_out,
          notes = excluded.notes
      `;
    }
  }
}

function parseRatio(raw: string): [number, number] {
  const m = raw.match(/(\d+)\s*[:\s]\s*(\d+)/);
  if (!m) return [1, 1];
  return [parseInt(m[1], 10) || 1, parseInt(m[2], 10) || 1];
}

// ── soul fan-out helpers ───────────────────────────────────────────────

// Coverage-kind keys recognized in soul.insurance. Anything else at the
// top level is treated as metadata (primary_source_url, gtb_pdf_url) and
// not turned into an insurance row.
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

async function insertSoulInsurance(
  tx: AnySql,
  cardId: string,
  insurance: SoulInsurance,
): Promise<void> {
  const primaryUrl = (insurance.primary_source_url ?? insurance.gtb_pdf_url ?? null) as string | null;
  for (const [key, value] of Object.entries(insurance)) {
    if (!COVERAGE_KINDS.has(key)) continue; // skip primary_source_url etc
    if (!value) continue;
    await tx`
      insert into card_insurance (card_id, coverage_kind, config, primary_source_url)
      values (${cardId}, ${key}, ${sql.json(value as Json)}, ${primaryUrl})
      on conflict (card_id, coverage_kind) do update set
        config = excluded.config,
        primary_source_url = excluded.primary_source_url
    `;
  }
}

// Map each top-level co_brand_perks group to one or more rows.
// Arrays produce N rows; single objects produce 1 row.
async function insertSoulCoBrandPerks(
  tx: AnySql,
  cardId: string,
  perks: SoulCoBrandPerks,
): Promise<void> {
  for (const [key, value] of Object.entries(perks)) {
    if (value === null || value === undefined) continue;
    // Arrays → fan out one row per item, perk_kind = singular form
    if (Array.isArray(value)) {
      const singular = key.endsWith("s") ? key.slice(0, -1) : key;
      for (const item of value) {
        await tx`
          insert into card_co_brand_perks (card_id, perk_kind, config, notes)
          values (${cardId}, ${singular}, ${sql.json(item as Json)}, ${null})
        `;
      }
    } else if (typeof value === "object") {
      // Single object → one row, perk_kind = the group name as-is
      await tx`
        insert into card_co_brand_perks (card_id, perk_kind, config, notes)
        values (${cardId}, ${key}, ${sql.json(value as Json)}, ${null})
      `;
    } else {
      // Scalars (booleans like membership_rewards_pay_with_points) →
      // store as {value: <scalar>}
      await tx`
        insert into card_co_brand_perks (card_id, perk_kind, config, notes)
        values (${cardId}, ${key}, ${sql.json({ value } as Json)}, ${null})
      `;
    }
  }
}

// ── per-card insert ────────────────────────────────────────────────────

async function upsertCard(card: Card, soul?: Soul): Promise<"inserted" | "updated"> {
  const issuerSlug = slugify(card.issuer);
  const networkSlug = card.network ? slugify(card.network) : null;
  const exists = await sql<{ id: string }[]>`select id from cards where id = ${card.id}`;
  const isUpdate = exists.length > 0;

  await sql.begin(async (tx) => {
    // cards
    await tx`
      insert into cards (
        id, display_name, issuer_id, network_id, card_type,
        annual_fee_usd, annual_fee_first_year_waived, foreign_tx_fee_pct,
        credit_score_required, currency_earned, membership_required,
        closed_to_new_apps, recently_changed, breakeven_logic_notes,
        data_freshness, sources, raw, last_verified
      ) values (
        ${card.id}, ${card.name}, ${issuerSlug}, ${networkSlug}, ${card.card_type},
        ${card.annual_fee_usd}, ${card.annual_fee_first_year_waived ?? false}, ${card.foreign_tx_fee_pct ?? null},
        ${card.credit_score_required ?? null}, ${card.currency_earned}, ${(card as unknown as { membership_required?: string }).membership_required ?? null},
        ${card.closed_to_new_apps ?? false}, ${card.recently_changed ?? false}, ${card.breakeven_logic_notes ?? null},
        ${card.data_freshness ?? null}, ${sql.json(card.sources ?? [])}, ${sql.json(card)}, current_date
      )
      on conflict (id) do update set
        display_name = excluded.display_name,
        issuer_id = excluded.issuer_id,
        network_id = excluded.network_id,
        card_type = excluded.card_type,
        annual_fee_usd = excluded.annual_fee_usd,
        annual_fee_first_year_waived = excluded.annual_fee_first_year_waived,
        foreign_tx_fee_pct = excluded.foreign_tx_fee_pct,
        credit_score_required = excluded.credit_score_required,
        currency_earned = excluded.currency_earned,
        membership_required = excluded.membership_required,
        closed_to_new_apps = excluded.closed_to_new_apps,
        recently_changed = excluded.recently_changed,
        breakeven_logic_notes = excluded.breakeven_logic_notes,
        data_freshness = excluded.data_freshness,
        sources = excluded.sources,
        raw = excluded.raw,
        last_verified = current_date,
        updated_at = now()
    `;

    // categories — full replace
    await tx`delete from card_categories where card_id = ${card.id}`;
    for (const cat of card.category) {
      await tx`
        insert into card_categories (card_id, category)
        values (${card.id}, ${cat})
      `;
    }

    // earning — full replace
    await tx`delete from card_earning where card_id = ${card.id}`;
    for (const e of card.earning) {
      await tx`
        insert into card_earning (card_id, category, rate_pts_per_dollar, cap_usd_per_year, notes)
        values (${card.id}, ${e.category}, ${e.rate_pts_per_dollar}, ${e.cap_usd_per_year ?? null}, ${e.notes ?? null})
      `;
    }

    // signup bonus — full replace, single current row
    await tx`delete from card_signup_bonuses where card_id = ${card.id}`;
    if (card.signup_bonus) {
      await tx`
        insert into card_signup_bonuses (
          card_id, amount_pts, spend_required_usd, spend_window_months,
          estimated_value_usd, notes, effective_from
        ) values (
          ${card.id},
          ${card.signup_bonus.amount_pts},
          ${card.signup_bonus.spend_required_usd},
          ${card.signup_bonus.spend_window_months},
          ${card.signup_bonus.estimated_value_usd},
          ${card.signup_bonus.notes ?? null},
          current_date
        )
      `;
    }

    // annual credits — full replace
    // If soul provides rich annual_credits, prefer those. Otherwise fall
    // back to the basic card.annual_credits with ease_of_use → ease_score
    // mapping.
    await tx`delete from card_annual_credits where card_id = ${card.id}`;
    if (soul?.annual_credits && soul.annual_credits.length > 0) {
      for (const c of soul.annual_credits) {
        await tx`
          insert into card_annual_credits (
            card_id, name, face_value_usd, realistic_redemption_pct,
            ease_score, period, enrollment_required, qualifying_purchases_open_ended,
            expires_if_unused, stackable_with_other_credits, qualifying_spend, notes
          ) values (
            ${card.id}, ${c.name}, ${c.face_value_usd}, ${c.realistic_redemption_pct},
            ${c.ease_score}, ${c.period ?? null},
            ${c.enrollment_required ?? null}, ${c.qualifying_purchases_open_ended ?? null},
            ${c.expires_if_unused ?? true}, ${c.stackable_with_other_credits ?? false},
            ${c.qualifying_spend ?? null}, ${c.notes ?? null}
          )
        `;
      }
    } else {
      for (const c of card.annual_credits ?? []) {
        const ease = (c.ease_of_use ?? "medium") as EaseGrade;
        await tx`
          insert into card_annual_credits (
            card_id, name, face_value_usd, realistic_redemption_pct,
            ease_score, period, qualifying_spend, notes
          ) values (
            ${card.id}, ${c.name}, ${c.value_usd ?? null}, ${EASE_PCT[ease]},
            ${EASE_SCORE[ease]}, null,
            ${c.type ?? null}, ${c.notes ?? null}
          )
        `;
      }
    }

    // co_brand_perks — full replace.
    // Two paths: legacy ongoing_perks → perk_kind=ongoing_perk rows
    // (preserved when soul absent), OR soul.co_brand_perks → fanned-out
    // structured rows (when soul present, ongoing_perk rows are wiped
    // too to avoid double-counting).
    if (soul?.co_brand_perks) {
      await tx`delete from card_co_brand_perks where card_id = ${card.id}`;
      await insertSoulCoBrandPerks(tx, card.id, soul.co_brand_perks);
    } else {
      await tx`
        delete from card_co_brand_perks
        where card_id = ${card.id} and perk_kind = 'ongoing_perk'
      `;
      for (const op of card.ongoing_perks ?? []) {
        await tx`
          insert into card_co_brand_perks (card_id, perk_kind, config, notes)
          values (
            ${card.id}, 'ongoing_perk',
            ${sql.json({
              name: op.name,
              value_estimate_usd: op.value_estimate_usd ?? null,
              category: op.category,
            })},
            ${op.notes ?? null}
          )
        `;
      }
    }

    // card_insurance — full replace from soul if present; no fallback.
    await tx`delete from card_insurance where card_id = ${card.id}`;
    if (soul?.insurance) {
      await insertSoulInsurance(tx, card.id, soul.insurance);
    }

    // card_program_access — full replace from soul if present.
    await tx`delete from card_program_access where card_id = ${card.id}`;
    if (soul?.program_access) {
      for (const p of soul.program_access) {
        await tx`
          insert into card_program_access (card_id, program_id, access_kind, overrides, notes)
          values (
            ${card.id}, ${p.program_id}, ${p.access_kind},
            ${sql.json((p.overrides ?? {}) as Json)}, ${p.notes ?? null}
          )
          on conflict (card_id, program_id) do update set
            access_kind = excluded.access_kind,
            overrides = excluded.overrides,
            notes = excluded.notes
        `;
      }
    }

    // card_absent_perks — full replace from soul if present.
    await tx`delete from card_absent_perks where card_id = ${card.id}`;
    if (soul?.absent_perks) {
      for (const a of soul.absent_perks) {
        await tx`
          insert into card_absent_perks (card_id, perk_key, reason, workaround)
          values (${card.id}, ${a.perk_key}, ${a.reason}, ${a.workaround ?? null})
          on conflict (card_id, perk_key) do update set
            reason = excluded.reason, workaround = excluded.workaround
        `;
      }
    }

    // Stash the credit_score band on cards.credit_score_required if soul
    // provides the structured form. The basic card.credit_score_required
    // already handled above; this overrides with the soul band when both.
    if (soul?.credit_score) {
      await tx`
        update cards set credit_score_required = ${soul.credit_score.band}
        where id = ${card.id}
      `;
    }
  });

  return isUpdate ? "updated" : "inserted";
}

// ── main ───────────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const reportOnly = process.argv.includes("--report");

  if (reportOnly) {
    if (!existsSync(REPORT_PATH)) {
      console.log("No report yet. Run `npm run db:migrate-cards` first.");
      return;
    }
    console.log(readFileSync(REPORT_PATH, "utf8"));
    return;
  }

  const parsed = parseAll();
  const seeds = collectSeeds(parsed);
  const report: Report = {
    ran_at: new Date().toISOString(),
    dry_run: dryRun,
    totals: {
      issuers: seeds.issuers.size,
      networks: seeds.networks.size,
      programs: seeds.programs.size,
      cards_inserted: 0,
      cards_updated: 0,
      cards_skipped: 0,
    },
    entries: [],
  };

  console.log(`Parsed ${parsed.length} markdown files.`);
  const valid = parsed.filter((p) => p.card);
  console.log(`  ${valid.length} validate; ${parsed.length - valid.length} skipped.`);
  console.log(`  ${seeds.issuers.size} issuers, ${seeds.networks.size} networks, ${seeds.programs.size} programs, ${seeds.transferPartners.size} transfer partners.`);

  // We bracket the whole run in one outer transaction in dry-run mode so
  // nothing persists. In normal mode we commit per card.
  const runBody = async () => {
    console.log("Seeding issuers…");
    await upsertIssuers(seeds);
    console.log(`  ✓ ${seeds.issuers.size} issuers`);
    console.log("Seeding networks…");
    await upsertNetworks(seeds);
    console.log(`  ✓ ${seeds.networks.size} networks`);
    console.log("Seeding programs…");
    await upsertPrograms(seeds);
    console.log(`  ✓ ${seeds.programs.size} programs`);
    console.log("Seeding transfer partners…");
    await upsertTransferPartners(seeds);
    console.log(`  ✓ ${seeds.transferPartners.size} transfer partners`);
    console.log("Seeding program ↔ transfer-partner links…");
    await upsertProgramTransferPartnerLinks(seeds);
    console.log(`  ✓ links seeded`);

    console.log(`Migrating ${parsed.length} cards…`);
    let i = 0;
    for (const p of parsed) {
      i++;
      if (i % 25 === 0) console.log(`  …${i}/${parsed.length}`);
      if (!p.card) {
        report.totals.cards_skipped++;
        report.entries.push({
          filename: p.filename,
          status: "skipped",
          reason: p.parseError ?? "unknown",
        });
        continue;
      }
      try {
        const result = await upsertCard(p.card, p.soul);
        if (result === "inserted") report.totals.cards_inserted++;
        else report.totals.cards_updated++;
        report.entries.push({
          filename: p.filename,
          status: result,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        report.totals.cards_skipped++;
        report.entries.push({
          filename: p.filename,
          status: "skipped",
          reason: "insert failed",
          details: msg,
        });
      }
    }
  };

  if (dryRun) {
    try {
      await sql.begin(async () => {
        await runBody();
        throw new Error("__dry_run_rollback__");
      });
    } catch (e) {
      if (!(e instanceof Error) || e.message !== "__dry_run_rollback__") throw e;
    }
  } else {
    await runBody();
  }

  writeFileSync(REPORT_PATH, renderReport(report), "utf8");
  console.log(`\nWrote ${REPORT_PATH}`);
  console.log(
    `Inserted: ${report.totals.cards_inserted}; ` +
    `Updated: ${report.totals.cards_updated}; ` +
    `Skipped: ${report.totals.cards_skipped}.`,
  );
}

function renderReport(r: Report): string {
  const skipped = r.entries.filter((e) => e.status === "skipped");
  const inserted = r.entries.filter((e) => e.status === "inserted");
  const updated = r.entries.filter((e) => e.status === "updated");
  const lines: string[] = [];
  lines.push(`# Cards migration report`);
  lines.push("");
  lines.push(`Run at: ${r.ran_at}`);
  lines.push(`Dry run: ${r.dry_run ? "yes (no rows committed)" : "no"}`);
  lines.push("");
  lines.push(`## Totals`);
  lines.push("");
  lines.push(`- Issuers seeded: ${r.totals.issuers}`);
  lines.push(`- Networks seeded: ${r.totals.networks}`);
  lines.push(`- Programs seeded: ${r.totals.programs}`);
  lines.push(`- Cards inserted: ${r.totals.cards_inserted}`);
  lines.push(`- Cards updated: ${r.totals.cards_updated}`);
  lines.push(`- Cards skipped: ${r.totals.cards_skipped}`);
  lines.push("");
  if (skipped.length) {
    lines.push(`## Skipped (${skipped.length})`);
    lines.push("");
    for (const e of skipped) {
      lines.push(`- \`${e.filename}\` — ${e.reason ?? "unknown"}${e.details ? ` (${e.details})` : ""}`);
    }
    lines.push("");
  }
  if (inserted.length) {
    lines.push(`## Inserted (${inserted.length})`);
    lines.push("");
    for (const e of inserted) lines.push(`- \`${e.filename}\``);
    lines.push("");
  }
  if (updated.length) {
    lines.push(`## Updated (${updated.length})`);
    lines.push("");
    for (const e of updated) lines.push(`- \`${e.filename}\``);
    lines.push("");
  }
  return lines.join("\n");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(() => sql.end());
