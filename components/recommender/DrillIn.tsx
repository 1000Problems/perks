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
import type { CardScore, RankedRecommendation, UserProfile } from "@/lib/engine/types";
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
  const [mathOpen, setMathOpen] = useState(false);

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
          {/* CASH/POINTS/PERKS pillars are shown in the selected list
              card — repeating them here was redundant. Keep the NET
              takeaway as the headline number and bump it up since it's
              now the only big number in the header. */}
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 4 }}>
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

      <Section num="5" title="Annual breakdown">
        <button
          type="button"
          onClick={() => setMathOpen(!mathOpen)}
          style={{
            background: "transparent",
            border: 0,
            padding: 0,
            cursor: "pointer",
            fontSize: 12,
            color: "var(--ink-2)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "inherit",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: mathOpen ? "rotate(90deg)" : "rotate(0)",
              transition: "transform 120ms",
            }}
          >
            ▸
          </span>
          {mathOpen ? "Hide" : "Show"} totals
        </button>
        {mathOpen && (
          <div
            style={{
              marginTop: 10,
              fontFamily: "var(--font-mono), ui-monospace, monospace",
              fontSize: 11.5,
              color: "var(--ink-2)",
              lineHeight: 1.7,
            }}
          >
            {(() => {
              // Per-category earning lines are shown inline above in
              // Section 01, so collapse them into a single summary line
              // here — keeps the totals reconcilable without doubling up.
              const earnings = score.breakdown.filter((l) => l.kind === "earning");
              const earningsTotal = earnings.reduce((a, l) => a + l.value, 0);
              const others = score.breakdown.filter((l) => l.kind !== "earning");
              return (
                <>
                  {earnings.length > 0 && (
                    <MathRow
                      label={`Spend earnings (${earnings.length} ${earnings.length === 1 ? "category" : "categories"})`}
                      v={(earningsTotal >= 0 ? "+$" : "−$") + Math.abs(earningsTotal).toLocaleString()}
                    />
                  )}
                  {others.map((line, i) => (
                    <MathRow
                      key={`${line.label}-${i}`}
                      label={line.label}
                      v={(line.value >= 0 ? "+$" : "−$") + Math.abs(line.value).toLocaleString()}
                      neg={line.value < 0}
                    />
                  ))}
                </>
              );
            })()}
            <hr className="hr" style={{ margin: "6px 0" }} />
            <MathRow
              label="Net"
              v={(delta >= 0 ? "+$" : "−$") + Math.abs(delta).toLocaleString()}
              bold
            />
          </div>
        )}
      </Section>

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

function MathRow({ label, v, neg, bold }: { label: string; v: string; neg?: boolean; bold?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: bold ? 600 : 400,
        color: bold ? "var(--ink)" : "inherit",
      }}
    >
      <span style={{ color: bold ? "var(--ink)" : "var(--ink-3)" }}>{label}</span>
      <span style={{ color: neg ? "var(--neg)" : bold ? "var(--pos)" : "inherit" }}>{v}</span>
    </div>
  );
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
