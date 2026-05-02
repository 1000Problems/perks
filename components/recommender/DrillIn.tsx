"use client";

import { useState } from "react";
import { CardArt } from "@/components/perks/CardArt";
import { EligibilityChip } from "@/components/perks/EligibilityChip";
import { Eyebrow } from "@/components/perks/Eyebrow";
import { HeatRow } from "@/components/perks/HeatRow";
import { Money } from "@/components/perks/Money";
import {
  SPEND_CATEGORIES,
  WALLET_BEST_RATES,
} from "@/lib/data/stub";
import type { RecommendCard } from "@/lib/data/types";
import type { ViewMode, CreditsMode } from "./Header";

interface Props {
  card: RecommendCard;
  view: ViewMode;
  credits: CreditsMode;
}

export function DrillIn({ card, view }: Props) {
  const cats = SPEND_CATEGORIES;
  const wallet = WALLET_BEST_RATES;
  const newRates = card.rates;
  const delta = view === "ongoing" ? card.delta : card.deltaY1;
  const [mathOpen, setMathOpen] = useState(false);

  return (
    <div>
      <Eyebrow>Card detail</Eyebrow>
      <div style={{ marginTop: 14, display: "flex", gap: 16, alignItems: "flex-start" }}>
        <CardArt variant={card.art} name={card.name} issuer={card.issuer} size="lg" />
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
            <EligibilityChip status={card.eligibility} label={card.eligibilityNote} />
          </div>
        </div>
      </div>

      <Section num="1" title="Spend impact">
        <div style={{ marginTop: 4 }}>
          {cats.map((c) => {
            const cur = wallet[c.id].rate;
            const fallback = newRates.other ?? 0;
            const newRate = newRates[c.id] ?? fallback;
            const nw = Math.max(cur, newRate);
            return (
              <HeatRow
                key={c.id}
                category={c}
                rate={cur}
                from={wallet[c.id].from}
                ratesNew={nw}
              />
            );
          })}
        </div>
      </Section>

      <Section num="2" title="New perks gained">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {card.newPerks
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

      {card.duplicatedPerks.length > 0 && (
        <Section num="3" title="Perks you'd duplicate">
          <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--ink-4)" }}>
            {card.duplicatedPerks.map((p) => (
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

      {card.transferPartners.length > 0 && (
        <Section num="4" title="Transfer partners unlocked">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {card.transferPartners.map((p) => (
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
            <b style={{ color: "var(--ink)" }}>For your Phoenix trip in March: </b>
            transfer 12,000 points to Hyatt and book Andaz Scottsdale at ~$400 retail. That&apos;s ≈3.3¢ per
            point versus 1.25¢ as travel statement credit.
          </div>
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
            <MathRow label="Dining $4,200 × 5%" v="+$210" />
            <MathRow label="Airfare $1,800 × 5%" v="+$90" />
            <MathRow label="Hotels $1,500 × 5%" v="+$75" />
            <MathRow label="Other $14,400 × 1%" v="+$144" />
            <MathRow label="Travel credit (realistic)" v="+$280" />
            <MathRow label="Lounge access" v="+$90" />
            <MathRow label="Trip protections" v="+$60" />
            <MathRow label="Annual fee" v="−$550" neg />
            <MathRow label="SUB amortized over 24mo" v={view === "ongoing" ? "+$0" : "+$875"} />
            <hr className="hr" style={{ margin: "6px 0" }} />
            <MathRow label="Net" v={"+$" + delta} bold />
          </div>
        )}
      </Section>

      <div style={{ marginTop: 22, display: "flex", gap: 8 }}>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} type="button">
          Add to comparison
        </button>
        <button className="btn" type="button">
          Save for later
        </button>
      </div>
    </div>
  );
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
