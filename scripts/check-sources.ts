// scripts/check-sources.ts
//
// Validator for per-perk source URLs (TASK-per-perk-source-urls).
// Walks every card's annual_credits + ongoing_perks, dedupes URLs,
// fires HEAD requests with a real-browser User-Agent, and writes
// the report to data/source-validation.json.
//
// Akamai bot-detection is real on citi.com / mastercard.com. Bare curl
// or default fetch UAs come back 403; a Chrome UA bypasses. When HEAD
// returns 405 (some CDNs disallow HEAD), we retry once as GET.
//
// Run via: npm run cards:check-sources
//
// The markdown stays canonical. data/source-validation.json is a
// build-time cache (gitignored alongside the rest of data/).

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadCardDatabase } from "../lib/data/loader";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/124.0.0.0 Safari/537.36";

interface PerkAttribution {
  card_id: string;
  perk_name: string;
  perk_kind: "annual_credit" | "ongoing_perk";
}

interface UrlResult {
  url: string;
  status: "ok" | "broken";
  http_code: number;
  checked_at: string;
  last_ok_at: string | null;
  perks: PerkAttribution[];
}

interface Report {
  checked_at: string;
  results: UrlResult[];
}

const OK_CODES: ReadonlySet<number> = new Set([200, 301, 302, 304]);

async function checkUrl(url: string): Promise<{ ok: boolean; code: number }> {
  // Try HEAD first. Some CDNs serve 405 / 403 on HEAD even with a real
  // UA — fall back to GET in that case. We never read the body; we only
  // care about status codes.
  for (const method of ["HEAD", "GET"] as const) {
    try {
      const r = await fetch(url, {
        method,
        redirect: "follow",
        headers: {
          "User-Agent": UA,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      // Drain the body so the connection can be reused.
      try {
        await r.body?.cancel();
      } catch {
        /* ignore */
      }
      if (OK_CODES.has(r.status)) return { ok: true, code: r.status };
      // 405 or 403 on HEAD → try GET. Otherwise call it a failure.
      if (method === "HEAD" && (r.status === 405 || r.status === 403)) {
        continue;
      }
      return { ok: false, code: r.status };
    } catch (e) {
      // Network error — tag as broken with code 0.
      if (method === "GET") {
        const msg = e instanceof Error ? e.message : String(e);
        process.stderr.write(`  ! fetch error on ${url}: ${msg}\n`);
        return { ok: false, code: 0 };
      }
      // HEAD threw (some servers RST on HEAD) — try GET.
    }
  }
  return { ok: false, code: 0 };
}

async function main() {
  const db = loadCardDatabase();
  const now = new Date().toISOString();

  // Collect (url → list of perks). Dedupe URLs across cards / perks.
  const byUrl = new Map<string, PerkAttribution[]>();
  for (const card of db.cards) {
    for (const c of card.annual_credits) {
      if (!c.source) continue;
      const list = byUrl.get(c.source.url) ?? [];
      list.push({
        card_id: card.id,
        perk_name: c.name,
        perk_kind: "annual_credit",
      });
      byUrl.set(c.source.url, list);
    }
    for (const p of card.ongoing_perks) {
      if (!p.source) continue;
      const list = byUrl.get(p.source.url) ?? [];
      list.push({
        card_id: card.id,
        perk_name: p.name,
        perk_kind: "ongoing_perk",
      });
      byUrl.set(p.source.url, list);
    }
  }

  const cards = new Set(
    [...byUrl.values()].flat().map((p) => p.card_id),
  );
  console.log(
    `[sources] checking ${byUrl.size} unique URLs across ${cards.size} card(s)`,
  );

  // Run checks in parallel with a small concurrency cap so we don't
  // hammer issuer CDNs and trip rate limiting.
  const urls = [...byUrl.keys()];
  const CONCURRENCY = 4;
  const results: UrlResult[] = [];

  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const checked = await Promise.all(
      batch.map(async (url) => {
        const { ok, code } = await checkUrl(url);
        const result: UrlResult = {
          url,
          status: ok ? "ok" : "broken",
          http_code: code,
          checked_at: now,
          last_ok_at: ok ? now : null,
          perks: byUrl.get(url) ?? [],
        };
        return result;
      }),
    );
    results.push(...checked);
  }

  const report: Report = { checked_at: now, results };

  const outPath = join(process.cwd(), "data", "source-validation.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n", "utf8");

  const okCount = results.filter((r) => r.status === "ok").length;
  const brokenCount = results.length - okCount;

  console.log(`[sources] ✓ ${okCount} OK`);
  console.log(`[sources] ✗ ${brokenCount} broken`);

  if (brokenCount > 0) {
    console.log("");
    console.log("[sources] broken URLs:");
    for (const r of results.filter((x) => x.status === "broken")) {
      console.log(`  ✗ ${r.http_code} ${r.url}`);
      for (const p of r.perks) {
        console.log(`      ${p.card_id} → ${p.perk_kind}: ${p.perk_name}`);
      }
    }
  }

  console.log(`[sources] report: ${outPath}`);

  // Don't exit non-zero on broken URLs — this is a report tool, not a
  // CI gate. CI can call this and parse the JSON if it wants to fail
  // loudly.
}

main().catch((e) => {
  console.error("[sources] FAIL:", e);
  process.exit(1);
});
