"use client";

import { useMemo, useState } from "react";
import { CardArt } from "@/components/perks/CardArt";
import { EligibilityChip } from "@/components/perks/EligibilityChip";
import { Eyebrow } from "@/components/perks/Eyebrow";
import { Money } from "@/components/perks/Money";
import { Section } from "@/components/perks/Section";
import { SPEND_CATEGORIES } from "@/lib/categories";
import type { CardDatabase } from "@/lib/data/loader";
import type { SpendCategory } from "@/lib/data/types";
import { variantForCard } from "@/lib/cardArt";
import type {
  CardScore,
  CardScoreComponents,
  RankedRecommendation,
  UserProfile,
} from "@/lib/engine/types";
import { fmt, heatColor, heatTextColor } from "@/lib/utils/format";
import type { ViewMode } from "./Header";

interface Props {
  recommendation: RankedRecommendation;
  view: ViewMode;
  userProfile: UserProfile;
  db: CardDatabase;
  // True when the recommendation is already in the Considering set —
  // the action button reads "Stop considering" instead of "Try".
  isConsidering: boolean;
  onTry: (cardId: string) => void;
  onUntry: (cardId: string) => void;
}

const TRIP_KEY_NORMALIZERS = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

function findDestination(
  trips: UserProfile["trips_planned"],
  db: CardDatabase,
): { trip: { destination: string; month?: string }; key: string } | null {
  for (const trip of trips) {
    const norm = TRIP_KEY_NORMALIZERS(trip.destination);
    const keys = Object.keys(db.destinationPerks);
    if (keys.includes(norm)) return { trip, key: norm };
    for (const k of keys) {
      const kn = TRIP_KEY_NORMALIZERS(k);
      if (kn.includes(norm) || norm.includes(kn)) return { trip, key: k };
    }
  }
  return null;
}

export function DrillIn({
  recommendation: r,
  view,
  userProfile,
  db,
  isConsidering,
  onTry,
  onUntry,
}: Props) {
  const { card, score, eligibility } = r;
  const delta = view === "ongoing" ? score.deltaOngoing : score.deltaYear1;

  // Transfer partners for the card's currency_earned program.
  const program = card.currency_earned ? db.programById.get(card.currency_earned) : null;
  const transferPartners = program ? program.transfer_partners.map((tp) => tp.partner) : [];

  // Destination match — only show this section if a real match exists.
  const dest = findDestination(userProfile.trips_planned, db);
  const destPerk = dest ? db.destinationPerks[dest.key] : null;
  const destMatchPartner = destPerk
    ? findPartnerInPhrases(transferPartners, [
        ...(destPerk.hotel_chains_strong ?? []),
        ...(destPerk.airline_routes_strong ?? []),
      ])
    : null;

  return (
    <div>
      <Eyebrow>Card detail</Eyebrow>
      <div style={{ marginTop: 14, display: "flex", gap: 16, alignItems: "flex-start" }}>
        <CardArt variant={variantForCard(card)} name={card.name} issuer={card.issuer} network={card.network} size="lg" />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{card.name}</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{card.issuer}</div>
          {/* The pillars in the selected list card show the spend-side
              breakdown. The drill-in header now carries the full math
              walkthrough — components stack into a mini-ledger that
              terminates in the NET headline. Makes the gap between the
              CASH pillar (e.g. $106) and the NET (e.g. $186) self-
              explanatory: the brand-fit row is right there. */}
          <DrillInLedger score={score} view={view} delta={delta} />
          <div style={{ marginTop: 12 }}>
            <EligibilityChip status={eligibility.status} label={eligibility.note} />
          </div>
        </div>
      </div>

      <Section num="1" title="Spend impact">
        <SpendImpactList score={score} />
      </Section>

      {score.newPerks.filter((p) => p.value !== 0).length > 0 && (
        <Section num="2" title="New perks gained">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {score.newPerks
              .filter((p) => p.value !== 0)
              .map((p) => (
                <li
                  key={p.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "baseline",
                    gap: 12,
                    padding: "8px 0",
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                    {p.note && (
                      <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{p.note}</div>
                    )}
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 13, color: "var(--pos)", whiteSpace: "nowrap" }}
                  >
                    {p.value === "unlocks" ? "unlocks" : "+$" + p.value}
                  </div>
                </li>
              ))}
          </ul>
        </Section>
      )}

      {score.duplicatedPerks.length > 0 && (
        <Section num="3" title="Perks you'd duplicate">
          <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--ink-4)" }}>
            {score.duplicatedPerks.map((p) => (
              <li
                key={p}
                style={{
                  fontSize: 12.5,
                  padding: "4px 0",
                  textDecoration: "line-through",
                  textDecorationColor: "var(--ink-4)",
                }}
              >
                {p}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 8, lineHeight: 1.5 }}>
            We don&apos;t count these toward the value above.
          </p>
        </Section>
      )}

      {transferPartners.length > 0 && (
        <Section num="4" title="Transfer partners unlocked">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {transferPartners.slice(0, 12).map((p) => (
              <span
                key={p}
                style={{
                  fontSize: 11.5,
                  padding: "4px 9px",
                  borderRadius: 999,
                  border: "1px solid var(--rule-2)",
                  color: "var(--ink-2)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
          {dest && destMatchPartner && destPerk && (
            <div
              style={{
                marginTop: 14,
                padding: "12px 14px",
                background: "var(--paper-2)",
                borderRadius: 10,
                borderLeft: "2px solid var(--pos)",
                fontSize: 12.5,
                lineHeight: 1.55,
                color: "var(--ink-2)",
              }}
            >
              <b style={{ color: "var(--ink)" }}>For your {dest.trip.destination} trip:</b>{" "}
              {destPerk.notes ?? `transfer to ${destMatchPartner.split(/\s+/).slice(0, 2).join(" ")}.`}
            </div>
          )}
        </Section>
      )}

      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 6 }}>
        {isConsidering ? (
          <button
            className="btn"
            style={{ justifyContent: "center" }}
            type="button"
            onClick={() => onUntry(card.id)}
          >
            Stop considering
          </button>
        ) : (
          <button
            className="btn btn-primary"
            style={{ justifyContent: "center" }}
            type="button"
            onClick={() => onTry(card.id)}
          >
            Try in wallet
          </button>
        )}
        <span
          style={{
            fontSize: 11,
            color: "var(--ink-3)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Trying simulates having this card so you can see how the rest of
          the rec list shifts. Doesn&apos;t save until you click{" "}
          <em>I have this card</em>.
        </span>
      </div>
    </div>
  );
}

function findPartnerInPhrases(partners: string[], phrases: string[]): string | null {
  if (partners.length === 0 || phrases.length === 0) return null;
  for (const p of partners) {
    const pLower = p.toLowerCase();
    const firstTwo = pLower.split(/\s+/).slice(0, 2).join(" ");
    for (const phrase of phrases) {
      const phLower = phrase.toLowerCase();
      if (phLower.includes(pLower) || phLower.includes(firstTwo)) return p;
    }
  }
  return null;
}

// Mini ledger that walks through the components contributing to NET.
// Lives in the drill-in header so the user can tell at a glance why the
// NET (e.g. $186) doesn't match the CASH pillar from the rec-list card
// (e.g. $106) — the brand-fit row sits there explicitly. Single-
// component cards skip the ledger and just show NET.
//
// Order: spend-side first (cash, points, brand-fit), then perks, then
// fee, then SUB (year-1 view only). Brand-fit gets an "(estimated)"
// flag in its label so the user reads it as a soft adjustment rather
// than calculated dollars.
interface LedgerRow {
  key: string;
  label: string;
  value: number;
  caption?: string;
  negative?: boolean;
}

function buildLedgerRows(c: CardScoreComponents, view: ViewMode): LedgerRow[] {
  const rows: LedgerRow[] = [];
  if (c.cashOngoing > 0) {
    rows.push({ key: "cash", label: "from spending", value: c.cashOngoing });
  }
  if (c.pointsOngoing) {
    const pts = c.pointsOngoing;
    rows.push({
      key: "points",
      label: "in points",
      value: pts.valueUsd,
      caption: `${fmtPtsShort(pts.pts)} ${shortenProgram(pts.programName)} @ ${fmtCpp(pts.cpp)}`,
    });
  }
  if (c.brandFitOngoing) {
    rows.push({
      key: "brandfit",
      label: `${c.brandFitOngoing.brand} fit (estimated)`,
      value: c.brandFitOngoing.valueUsd,
    });
  }
  if (c.perksOngoing > 0) {
    rows.push({
      key: "perks",
      label: "perks (if claimed)",
      value: c.perksOngoing,
    });
  }
  if (c.feeOngoing < 0) {
    rows.push({
      key: "fee",
      label: "annual fee",
      value: c.feeOngoing,
      negative: true,
    });
  }
  if (view === "year1" && c.subYear1 > 0) {
    rows.push({
      key: "sub",
      label: "SUB year 1",
      value: c.subYear1,
      caption:
        c.subYear1Detail?.mode === "loyalty" && c.subYear1Detail.pts > 0
          ? `${fmtPtsShort(c.subYear1Detail.pts)} pts/yr amortized`
          : "amortized over 24 months",
    });
  }
  return rows;
}

function DrillInLedger({
  score,
  view,
  delta,
}: {
  score: CardScore;
  view: ViewMode;
  delta: number;
}) {
  const rows = buildLedgerRows(score.components, view);
  const showLedger = rows.length >= 2;

  return (
    <div style={{ marginTop: 16 }}>
      {showLedger && (
        <div
          style={{
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: 11.5,
            color: "var(--ink-3)",
            lineHeight: 1.6,
            marginBottom: 10,
          }}
        >
          {rows.map((row) => (
            <div
              key={row.key}
              style={{ display: "flex", flexDirection: "column", marginBottom: 3 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                }}
              >
                <span style={{ color: "var(--ink-3)" }}>{row.label}</span>
                <span
                  className="num"
                  style={{
                    color: row.negative ? "var(--neg)" : "var(--ink-2)",
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.value >= 0 ? "+" : "−"}
                  {fmt.usd(Math.abs(row.value))}
                </span>
              </div>
              {row.caption && (
                <span
                  style={{
                    fontSize: 10.5,
                    color: "var(--ink-4)",
                    marginTop: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {row.caption}
                </span>
              )}
            </div>
          ))}
          <hr
            style={{
              border: 0,
              borderTop: "1px solid var(--rule)",
              margin: "8px 0 0",
            }}
          />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontSize: 11,
            color: "var(--ink-3)",
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            letterSpacing: "0.06em",
          }}
        >
          {view === "ongoing" ? "NET / YEAR" : "NET, YEAR 1"}
        </span>
        <Money value={delta} sign size="md" />
      </div>
    </div>
  );
}

function fmtPtsShort(n: number): string {
  if (n >= 10000) {
    const k = n / 1000;
    return (k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")) + "k";
  }
  return n.toLocaleString("en-US");
}

// Trim verbose program names to a short tag. "Chase Ultimate Rewards" →
// "UR"; "American Express Membership Rewards" → "MR"; "Citi ThankYou
// Points" → "ThankYou". Falls back to the first capitalized word.
function shortenProgram(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("ultimate rewards")) return "UR";
  if (lower.includes("membership rewards")) return "MR";
  if (lower.includes("thankyou")) return "TY";
  if (lower.includes("mileageplus")) return "MileagePlus";
  if (lower.includes("skymiles")) return "SkyMiles";
  if (lower.includes("aadvantage")) return "AAdvantage";
  if (lower.includes("rapid rewards")) return "Rapid Rewards";
  if (lower.includes("hyatt")) return "Hyatt";
  if (lower.includes("hilton") || lower.includes("honors")) return "Honors";
  if (lower.includes("bonvoy")) return "Bonvoy";
  if (lower.includes("ihg")) return "IHG";
  // Default: take the first 1-2 words.
  return name.split(/\s+/).slice(0, 2).join(" ");
}

function fmtCpp(cpp: number): string {
  // 1.25 → "1.25¢", 1.0 → "1¢", 1.6 → "1.6¢"
  const s = cpp.toFixed(2).replace(/\.?0+$/, "");
  return `${s}¢`;
}

interface SpendRow {
  category: SpendCategory;
  impact: CardScore["spendImpact"][keyof CardScore["spendImpact"]];
}

function SpendImpactList({ score }: { score: CardScore }) {
  const [showZero, setShowZero] = useState(false);
  const { active, idle } = useMemo(() => {
    const rows: SpendRow[] = SPEND_CATEGORIES.map((c) => ({
      category: c,
      impact: score.spendImpact[c.id],
    })).filter((r) => r.impact);
    // Active = user actually spends here. Sorted by candidate's marginal
    // impact (biggest wins first), then by spend size as a tiebreaker.
    const active = rows
      .filter((r) => r.impact.spend > 0)
      .sort((a, b) => {
        if (b.impact.delta !== a.impact.delta) return b.impact.delta - a.impact.delta;
        return b.impact.spend - a.impact.spend;
      });
    const idle = rows.filter((r) => r.impact.spend <= 0);
    return { active, idle };
  }, [score]);

  return (
    <div style={{ marginTop: 4 }}>
      {active.length === 0 && (
        <div style={{ fontSize: 12, color: "var(--ink-3)", padding: "8px 0", lineHeight: 1.5 }}>
          No spend categories on file. Set your spend in <a href="/onboarding/spend" style={{ color: "var(--ink-2)" }}>onboarding</a> to see this card&apos;s impact.
        </div>
      )}
      {active.map((row) => (
        <SpendImpactRow key={row.category.id} category={row.category} impact={row.impact} />
      ))}
      {idle.length > 0 && (
        <button
          type="button"
          onClick={() => setShowZero(!showZero)}
          style={{
            background: "transparent",
            border: 0,
            padding: "10px 0 0",
            cursor: "pointer",
            fontSize: 11.5,
            color: "var(--ink-3)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "inherit",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: showZero ? "rotate(90deg)" : "rotate(0)",
              transition: "transform 120ms",
            }}
          >
            ▸
          </span>
          {showZero ? "Hide" : "Show"} {idle.length} zero-spend{" "}
          {idle.length === 1 ? "category" : "categories"}
        </button>
      )}
      {showZero && (
        <div style={{ marginTop: 6 }}>
          {idle.map((row) => (
            <SpendImpactRow key={row.category.id} category={row.category} impact={row.impact} />
          ))}
        </div>
      )}
    </div>
  );
}

function SpendImpactRow({
  category,
  impact,
}: {
  category: SpendCategory;
  impact: CardScore["spendImpact"][keyof CardScore["spendImpact"]];
}) {
  const [open, setOpen] = useState(false);
  const cur = impact.current;
  const nw = impact.new;
  const winning = nw > cur;
  const expandable = winning && impact.spend > 0;
  const curBg = heatColor(cur);
  const newBg = heatColor(nw);
  const txt = heatTextColor(Math.max(cur, nw));

  return (
    <div
      style={{
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <button
        type="button"
        onClick={() => expandable && setOpen(!open)}
        disabled={!expandable}
        aria-expanded={expandable ? open : undefined}
        style={{
          width: "100%",
          background: "transparent",
          border: 0,
          padding: "8px 0",
          cursor: expandable ? "pointer" : "default",
          fontFamily: "inherit",
          color: "inherit",
          textAlign: "left",
          display: "grid",
          gridTemplateColumns: "1fr auto 14px",
          alignItems: "center",
          columnGap: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-2)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ color: "var(--ink-4)", fontSize: 11, width: 10, textAlign: "center" }}>
              {category.icon}
            </span>
            {category.label}
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 4 }}>
            <div
              className="hm-cell"
              style={{
                background: curBg,
                color: txt,
                height: 18,
                width: 44,
                opacity: winning ? 0.55 : 1,
                fontSize: 10.5,
              }}
            >
              {fmt.pct(cur)}
            </div>
            <span
              style={{
                color: "var(--ink-4)",
                fontSize: 10,
                fontFamily: "var(--font-mono), ui-monospace, monospace",
              }}
            >
              →
            </span>
            <div
              className="hm-cell"
              style={{
                background: newBg,
                color: txt,
                height: 18,
                width: 44,
                outline: winning ? "1.5px solid var(--pos)" : "none",
                outlineOffset: -1.5,
                fontWeight: winning ? 600 : 500,
                fontSize: 10.5,
              }}
            >
              {fmt.pct(nw)}
            </div>
          </div>
        </div>
        <div
          className="mono"
          style={{
            fontSize: 14,
            textAlign: "right",
            whiteSpace: "nowrap",
            color: impact.delta > 0 ? "var(--pos)" : "var(--ink-4)",
            fontWeight: impact.delta > 0 ? 600 : 400,
          }}
        >
          {impact.delta > 0 ? `+$${impact.delta.toLocaleString()}` : "—"}
        </div>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            fontSize: 10,
            color: expandable ? "var(--ink-3)" : "transparent",
            transform: open ? "rotate(90deg)" : "rotate(0)",
            transition: "transform 120ms",
            textAlign: "center",
          }}
        >
          ▸
        </span>
      </button>
      {open && expandable && <SpendMath category={category} impact={impact} />}
    </div>
  );
}

function SpendMath({
  category,
  impact,
}: {
  category: SpendCategory;
  impact: CardScore["spendImpact"][keyof CardScore["spendImpact"]];
}) {
  const { spend, current, new: nw, currentFrom, newFrom, newCap, newBase } = impact;
  // Cap-aware split. Engine sets newCap/newBase only when the candidate
  // is the winner AND its rule has a cap. If spend stays under the cap,
  // the over-cap term is zero and we render the simple two-line math.
  const cap = newCap ?? Infinity;
  const base = newBase ?? nw; // fallback: no cap → no base needed
  const inCapSpend = Math.min(spend, cap);
  const overCapSpend = Math.max(spend - cap, 0);
  const newEarnedInCap = inCapSpend * nw;
  const newEarnedOverCap = overCapSpend * base;
  const newEarned = newEarnedInCap + newEarnedOverCap;
  const curEarned = spend * current;
  const net = newEarned - curEarned;
  const hasOverCap = overCapSpend > 0;

  return (
    <div
      style={{
        background: "var(--paper-2)",
        borderRadius: 8,
        padding: "12px 14px",
        margin: "0 0 10px 16px",
        borderLeft: "2px solid var(--ink-4)",
        fontSize: 11.5,
        lineHeight: 1.65,
        color: "var(--ink-2)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2px 10px" }}>
        <span style={{ color: "var(--ink-3)" }}>Now</span>
        <span>
          <b style={{ color: "var(--ink)" }}>{fmt.pct(current)}</b>
          {currentFrom && currentFrom !== "—" && (
            <span style={{ color: "var(--ink-3)" }}> · {currentFrom}</span>
          )}
        </span>
        <span style={{ color: "var(--ink-3)" }}>With this card</span>
        <span>
          <b style={{ color: "var(--ink)" }}>{fmt.pct(nw)}</b>
          <span style={{ color: "var(--ink-3)" }}> · {newFrom}</span>
          {hasOverCap && (
            <span style={{ color: "var(--ink-3)" }}>
              {" "}
              · capped at {fmt.usd(cap)}
            </span>
          )}
        </span>
      </div>

      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: "1px solid var(--rule)",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: 11,
          color: "var(--ink-2)",
        }}
      >
        {hasOverCap ? (
          <>
            <CalcRow
              left={`${fmt.usd(inCapSpend)} × ${fmt.pct(nw)}`}
              right={fmt.usd(newEarnedInCap)}
              note="within cap"
            />
            <CalcRow
              left={`${fmt.usd(overCapSpend)} × ${fmt.pct(base)}`}
              right={fmt.usd(newEarnedOverCap)}
              note="over cap"
            />
            <CalcRow left={`${category.label} earned`} right={fmt.usd(newEarned)} subtotal />
            <CalcRow
              left={`${fmt.usd(spend)} × ${fmt.pct(current)}`}
              right={"−" + fmt.usd(curEarned)}
              note="was earning"
              negative
            />
          </>
        ) : (
          <>
            <CalcRow
              left={`${fmt.usd(spend)} × ${fmt.pct(nw)}`}
              right={fmt.usd(newEarned)}
              note="with this card"
            />
            <CalcRow
              left={`${fmt.usd(spend)} × ${fmt.pct(current)}`}
              right={"−" + fmt.usd(curEarned)}
              note="was earning"
              negative
            />
          </>
        )}
        <div
          style={{
            marginTop: 6,
            paddingTop: 6,
            borderTop: "1px solid var(--rule)",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "var(--ink)" }}>Net / year</span>
          <span style={{ color: net >= 0 ? "var(--pos)" : "var(--neg)" }}>
            {(net >= 0 ? "+" : "−") + fmt.usd(Math.abs(net))}
          </span>
        </div>
      </div>
    </div>
  );
}

function CalcRow({
  left,
  right,
  note,
  subtotal,
  negative,
}: {
  left: string;
  right: string;
  note?: string;
  subtotal?: boolean;
  negative?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "baseline",
        borderTop: subtotal ? "1px dotted var(--rule)" : "none",
        paddingTop: subtotal ? 4 : 0,
        marginTop: subtotal ? 4 : 0,
      }}
    >
      <span style={{ color: subtotal ? "var(--ink-2)" : "var(--ink-3)" }}>
        {left}
        {note && (
          <span style={{ color: "var(--ink-4)", marginLeft: 6 }}>· {note}</span>
        )}
      </span>
      <span style={{ color: negative ? "var(--neg)" : "var(--ink-2)" }}>{right}</span>
    </div>
  );
}
