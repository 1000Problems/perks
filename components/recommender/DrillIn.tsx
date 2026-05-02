"use client";

import { useState } from "react";
import { CardArt } from "@/components/perks/CardArt";
import { EligibilityChip } from "@/components/perks/EligibilityChip";
import { Eyebrow } from "@/components/perks/Eyebrow";
import { HeatRow } from "@/components/perks/HeatRow";
import { Money } from "@/components/perks/Money";
import { SPEND_CATEGORIES } from "@/lib/categories";
import type { CardDatabase } from "@/lib/data/loader";
import { variantForCard } from "@/lib/cardArt";
import type { RankedRecommendation, UserProfile } from "@/lib/engine/types";
import type { ViewMode } from "./Header";

interface Props {
  recommendation: RankedRecommendation;
  view: ViewMode;
  userProfile: UserProfile;
  db: CardDatabase;
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

export function DrillIn({ recommendation: r, view, userProfile, db }: Props) {
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
        <CardArt variant={variantForCard(card)} name={card.name} issuer={card.issuer} size="lg" />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{card.name}</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{card.issuer}</div>
          <div style={{ marginTop: 10 }}>
            <Money value={delta} sign size="md" />
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-3)",
                marginTop: 2,
                fontFamily: "var(--font-mono), ui-monospace, monospace",
              }}
            >
              {view === "ongoing" ? "NET / YEAR ONGOING" : "NET, FIRST YEAR"}
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <EligibilityChip status={eligibility.status} label={eligibility.note} />
          </div>
        </div>
      </div>

      <Section num="1" title="Spend impact">
        <div style={{ marginTop: 4 }}>
          {SPEND_CATEGORIES.map((c) => {
            const impact = score.spendImpact[c.id];
            const cur = impact?.current ?? 0;
            const nw = impact?.new ?? cur;
            return (
              <HeatRow
                key={c.id}
                category={c}
                rate={cur}
                from=""
                ratesNew={nw}
              />
            );
          })}
        </div>
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

      <Section num="5" title="The math">
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
          {mathOpen ? "Hide" : "Show"} calculation
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
            {score.breakdown.map((line, i) => (
              <MathRow
                key={`${line.label}-${i}`}
                label={line.label}
                v={(line.value >= 0 ? "+$" : "−$") + Math.abs(line.value).toLocaleString()}
                neg={line.value < 0}
              />
            ))}
            <hr className="hr" style={{ margin: "6px 0" }} />
            <MathRow
              label="Net"
              v={(delta >= 0 ? "+$" : "−$") + Math.abs(delta).toLocaleString()}
              bold
            />
          </div>
        )}
      </Section>

      <div style={{ marginTop: 22, display: "flex", gap: 8 }}>
        <button
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: "center", opacity: 0.55, cursor: "not-allowed" }}
          type="button"
          disabled
          title="Coming soon"
          aria-disabled="true"
        >
          Add to comparison
        </button>
        <button
          className="btn"
          type="button"
          disabled
          style={{ opacity: 0.55, cursor: "not-allowed" }}
          title="Coming soon"
          aria-disabled="true"
        >
          Save for later
        </button>
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

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
        <span
          style={{
            fontSize: 11,
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            color: "var(--ink-4)",
          }}
        >
          0{num}
        </span>
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em" }}>{title}</h3>
      </div>
      {children}
    </section>
  );
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
