"use client";

import { useState } from "react";
import { CardArt } from "@/components/perks/CardArt";
import { EligibilityChip } from "@/components/perks/EligibilityChip";
import { Eyebrow } from "@/components/perks/Eyebrow";
import { HeatRow } from "@/components/perks/HeatRow";
import { Money } from "@/components/perks/Money";
import { Segmented } from "@/components/perks/Segmented";
import {
  RECOMMEND_CARDS,
  SPEND_CATEGORIES,
  WALLET_BEST_RATES,
  WALLET_CARDS,
} from "@/lib/data/stub";
import { fmt } from "@/lib/utils/format";
import { DrillIn } from "./DrillIn";
import { RecHeader, type CreditsMode, type ViewMode } from "./Header";

type FilterMode = "total" | "payself" | "nofee" | "premium";

const FILTER_OPTIONS: { value: FilterMode; label: string }[] = [
  { value: "total", label: "Best total value" },
  { value: "payself", label: "Pays for itself" },
  { value: "nofee", label: "No annual fee" },
  { value: "premium", label: "Premium tier" },
];

const HELD_PERKS: [string, string][] = [
  ["No FX fees", "Voyager Travel"],
  ["Trip delay insurance", "Voyager Travel"],
  ["Primary CDW", "Voyager Travel"],
  ["Cell phone protection", "Everyday Rewards"],
];

export function RecPanelDesktop() {
  const [view, setView] = useState<ViewMode>("ongoing");
  const [credits, setCredits] = useState<CreditsMode>("realistic");
  const [filter, setFilter] = useState<FilterMode>("total");
  const [selectedId, setSelectedId] = useState<string>("sapphire-tier");

  const cards = RECOMMEND_CARDS;
  const selected = cards.find((c) => c.id === selectedId) ?? cards[0];
  const cats = SPEND_CATEGORIES;
  const wallet = WALLET_BEST_RATES;

  // Stub totals — engine replaces these once it's wired up.
  const walletNet = 412;
  const walletEarned = 1180;
  const walletFees = 95;
  const walletCredits = 0;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "64px 1fr",
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      <RecHeader view={view} setView={setView} credits={credits} setCredits={setCredits} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr 460px",
          minHeight: 0,
        }}
      >
        {/* LEFT — current wallet */}
        <aside
          style={{
            borderRight: "1px solid var(--rule)",
            padding: "28px 24px",
            overflowY: "auto",
            background: "var(--paper-2)",
          }}
        >
          <Eyebrow>Your wallet today</Eyebrow>
          <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 8 }}>
            <Money value={walletNet} sign size="lg" />
            <span style={{ fontSize: 12, color: "var(--ink-3)" }}>net / year</span>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 12,
              color: "var(--ink-2)",
              lineHeight: 1.6,
              fontFamily: "var(--font-mono), ui-monospace, monospace",
            }}
          >
            <Row label="Rewards earned" value={fmt.usd(walletEarned)} />
            <Row label="Annual fees" value={`−${fmt.usd(walletFees)}`} valueColor="var(--neg)" />
            <Row label="Credits used" value={fmt.usd(walletCredits)} />
          </div>

          <div style={{ marginTop: 28 }}>
            <Eyebrow style={{ marginBottom: 10 }}>Wallet · {WALLET_CARDS.length} cards</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {WALLET_CARDS.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CardArt variant={c.art} size="sm" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                      {c.issuer} · {c.fee === 0 ? "No fee" : "$" + c.fee + "/yr"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <Eyebrow style={{ marginBottom: 10 }}>Spend coverage</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {cats.map((c) => (
                <HeatRow
                  key={c.id}
                  category={c}
                  rate={wallet[c.id].rate}
                  from={wallet[c.id].from}
                />
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "var(--ink-3)", lineHeight: 1.5 }}>
              4 of 12 categories earning under 2%. Biggest gaps: airfare, hotels, online shopping.
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <Eyebrow style={{ marginBottom: 10 }}>Perks held · deduplicated</Eyebrow>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                fontSize: 12,
              }}
            >
              {HELD_PERKS.map(([p, src]) => (
                <div
                  key={p}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "var(--ink-2)",
                  }}
                >
                  <span>{p}</span>
                  <span style={{ color: "var(--ink-4)", fontSize: 11 }}>{src}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* MIDDLE — top 5 to add */}
        <main style={{ padding: "28px 32px", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <div>
              <Eyebrow>Top 5 cards to add next</Eyebrow>
              <h1
                style={{
                  margin: "6px 0 0",
                  fontSize: 28,
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  maxWidth: 540,
                }}
              >
                Based on your spend and what you already hold, these would do the most.
              </h1>
            </div>
          </div>
          <p
            style={{
              marginTop: 10,
              fontSize: 13,
              color: "var(--ink-2)",
              maxWidth: 600,
              lineHeight: 1.5,
            }}
          >
            Showing <b>net annual value added</b> after annual fee, after deduplicating perks against
            your wallet, with credits valued at what you&apos;d actually use.
          </p>

          <div style={{ marginTop: 22, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Segmented value={filter} onChange={setFilter} options={FILTER_OPTIONS} />
          </div>

          <ol
            style={{
              listStyle: "none",
              padding: 0,
              margin: "20px 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {cards.map((c, i) => {
              const isSel = c.id === selectedId;
              const delta = view === "ongoing" ? c.delta : c.deltaY1;
              return (
                <li
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "24px 88px 1fr auto",
                    gap: 18,
                    alignItems: "center",
                    padding: "16px 18px",
                    borderRadius: 14,
                    border: "1px solid " + (isSel ? "var(--ink)" : "var(--rule)"),
                    background: isSel ? "white" : "var(--paper-2)",
                    boxShadow: isSel ? "var(--shadow-2)" : "none",
                    cursor: "pointer",
                    transition: "all 140ms ease",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono), ui-monospace, monospace",
                      fontSize: 12,
                      color: "var(--ink-3)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <CardArt variant={c.art} name={c.name} issuer={c.issuer} size="md" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
                        {c.name}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{c.issuer}</span>
                      <EligibilityChip status={c.eligibility} label={c.eligibilityNote} />
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        color: "var(--ink-2)",
                        lineHeight: 1.45,
                        maxWidth: 480,
                      }}
                    >
                      {c.why}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 11,
                        color: "var(--ink-3)",
                        display: "flex",
                        gap: 14,
                        fontFamily: "var(--font-mono), ui-monospace, monospace",
                      }}
                    >
                      <span>{c.fee === 0 ? "NO ANNUAL FEE" : "$" + c.fee + " FEE"}</span>
                      {c.bonus.valueUSD > 0 && <span>SUB ≈ ${c.bonus.valueUSD}</span>}
                      {c.transferPartners.length > 0 && (
                        <span>{c.transferPartners.length} TRANSFER PARTNERS</span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Money value={delta} sign size="md" />
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-3)",
                        marginTop: 4,
                        fontFamily: "var(--font-mono), ui-monospace, monospace",
                      }}
                    >
                      {view === "ongoing" ? "NET / YEAR" : "NET, YEAR 1"}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <p
            style={{
              marginTop: 22,
              fontSize: 11,
              color: "var(--ink-3)",
              lineHeight: 1.6,
              maxWidth: 600,
            }}
          >
            Ranking is based on your spend profile, your held cards, and issuer rules. We do not take
            affiliate revenue and do not boost cards based on payouts.
          </p>
        </main>

        {/* RIGHT — drill-in detail */}
        <aside
          style={{
            borderLeft: "1px solid var(--rule)",
            background: "white",
            overflowY: "auto",
            padding: "28px 28px",
          }}
        >
          <DrillIn card={selected} view={view} credits={credits} />
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--ink-3)" }}>{label}</span>
      <span style={{ color: valueColor }}>{value}</span>
    </div>
  );
}
