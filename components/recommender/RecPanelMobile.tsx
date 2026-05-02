"use client";

import { useMemo, useState } from "react";
import { CardArt } from "@/components/perks/CardArt";
import { EligibilityChip } from "@/components/perks/EligibilityChip";
import { Eyebrow } from "@/components/perks/Eyebrow";
import { HeatRow } from "@/components/perks/HeatRow";
import { Money } from "@/components/perks/Money";
import { Segmented } from "@/components/perks/Segmented";
import { SPEND_CATEGORIES } from "@/lib/categories";
import type { Card, CardDatabase } from "@/lib/data/loader";
import type { SpendCategoryId } from "@/lib/data/types";
import { rankCards } from "@/lib/engine/ranking";
import { bestRateForCategory } from "@/lib/engine/scoring";
import type { RankFilter, RankOptions } from "@/lib/engine/types";
import { variantForCard } from "@/lib/cardArt";
import type { UserProfile } from "@/lib/profile/types";
import { fmt } from "@/lib/utils/format";
import { DrillIn } from "./DrillIn";
import { RecHeader, type CreditsMode, type ViewMode } from "./Header";

type Tab = "wallet" | "top" | "detail";

const FILTER_OPTIONS: { value: RankFilter; label: string }[] = [
  { value: "total", label: "Total" },
  { value: "payself", label: "Pay-self" },
  { value: "nofee", label: "No fee" },
  { value: "premium", label: "Premium" },
];

export interface RecPanelMobileProps {
  profile: UserProfile;
  db: CardDatabase;
}

export function RecPanelMobile({ profile, db }: RecPanelMobileProps) {
  const [view, setView] = useState<ViewMode>("ongoing");
  const [credits, setCredits] = useState<CreditsMode>("realistic");
  const [filter, setFilter] = useState<RankFilter>("total");
  const [tab, setTab] = useState<Tab>("top");

  const rankOptions: RankOptions = useMemo(
    () => ({
      filter,
      scoring: { creditsMode: credits, subAmortizeMonths: 24 },
      limit: 5,
    }),
    [filter, credits],
  );

  const ranked = useMemo(
    () => rankCards(profile, profile.cards_held, db, rankOptions),
    [profile, db, rankOptions],
  );

  const [selectedId, setSelectedId] = useState<string | null>(
    ranked.visible[0]?.card.id ?? null,
  );
  const selected =
    ranked.visible.find((r) => r.card.id === selectedId) ?? ranked.visible[0];

  const walletCards: Card[] = profile.cards_held
    .map((h) => db.cardById.get(h.card_id))
    .filter((c): c is Card => Boolean(c));

  const walletBestRates = useMemo(() => {
    const out: Record<SpendCategoryId, { rate: number; from: string }> = {} as Record<
      SpendCategoryId,
      { rate: number; from: string }
    >;
    for (const c of SPEND_CATEGORIES) {
      out[c.id] = bestRateForCategory(c.id, walletCards);
    }
    return out;
  }, [walletCards]);

  const walletEarned = useMemo(() => {
    let total = 0;
    for (const c of SPEND_CATEGORIES) {
      const spend = profile.spend_profile[c.id] ?? 0;
      total += spend * walletBestRates[c.id].rate;
    }
    return total;
  }, [profile.spend_profile, walletBestRates]);

  const walletFees = walletCards.reduce((acc, c) => acc + (c.annual_fee_usd ?? 0), 0);
  const walletNet = Math.round(walletEarned - walletFees);

  function pickCard(id: string) {
    setSelectedId(id);
    setTab("detail");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RecHeader view={view} setView={setView} credits={credits} setCredits={setCredits} />

      <div style={{ padding: "16px 16px 8px" }}>
        <div className="eyebrow">Recommendations</div>
      </div>

      {/* Tab bar */}
      <div
        style={{
          padding: "0 16px",
          borderBottom: "1px solid var(--rule)",
          display: "flex",
          gap: 6,
          background: "var(--paper-2)",
        }}
      >
        {(["wallet", "top", "detail"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            data-active={tab === t ? "true" : "false"}
            style={{
              border: 0,
              background: "transparent",
              padding: "12px 14px",
              fontSize: 13,
              fontFamily: "inherit",
              cursor: "pointer",
              color: tab === t ? "var(--ink)" : "var(--ink-3)",
              fontWeight: tab === t ? 600 : 400,
              borderBottom: `2px solid ${tab === t ? "var(--ink)" : "transparent"}`,
            }}
          >
            {t === "wallet" ? "Wallet" : t === "top" ? "Top 5" : "Detail"}
          </button>
        ))}
      </div>

      <main style={{ flex: 1, padding: "20px 16px 96px", overflowY: "auto" }}>
        {tab === "wallet" && (
          <div>
            <Eyebrow>Your wallet today</Eyebrow>
            {walletCards.length === 0 ? (
              <p style={{ marginTop: 12, fontSize: 14, color: "var(--ink-2)" }}>
                No cards yet.{" "}
                <a href="/onboarding/cards" style={{ color: "var(--ink)" }}>
                  Add some →
                </a>
              </p>
            ) : (
              <>
                <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <Money value={walletNet} sign size="lg" />
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>net / year</span>
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 12,
                    color: "var(--ink-2)",
                    fontFamily: "var(--font-mono), ui-monospace, monospace",
                    lineHeight: 1.6,
                  }}
                >
                  <Row label="Rewards earned" value={fmt.usd(Math.round(walletEarned))} />
                  <Row label="Annual fees" value={`−${fmt.usd(walletFees)}`} valueColor="var(--neg)" />
                </div>
                <div style={{ marginTop: 24 }}>
                  <Eyebrow style={{ marginBottom: 10 }}>Wallet · {walletCards.length}</Eyebrow>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {walletCards.map((c) => (
                      <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <CardArt variant={variantForCard(c)} size="sm" />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                            {c.issuer} · {(c.annual_fee_usd ?? 0) === 0 ? "No fee" : "$" + c.annual_fee_usd + "/yr"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 24 }}>
                  <Eyebrow style={{ marginBottom: 10 }}>Spend coverage</Eyebrow>
                  {SPEND_CATEGORIES.map((c) => (
                    <HeatRow
                      key={c.id}
                      category={c}
                      rate={walletBestRates[c.id].rate}
                      from={walletBestRates[c.id].from}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === "top" && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              <Segmented value={filter} onChange={setFilter} options={FILTER_OPTIONS} />
            </div>
            {ranked.visible.length === 0 ? (
              <p style={{ fontSize: 14, color: "var(--ink-2)" }}>No cards match this filter.</p>
            ) : (
              <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {ranked.visible.map((r) => {
                  const delta = view === "ongoing" ? r.score.deltaOngoing : r.score.deltaYear1;
                  return (
                    <li
                      key={r.card.id}
                      onClick={() => pickCard(r.card.id)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "64px 1fr auto",
                        gap: 12,
                        alignItems: "center",
                        padding: "14px",
                        borderRadius: 12,
                        border: "1px solid var(--rule)",
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      <CardArt variant={variantForCard(r.card)} size="sm" name={r.card.name} issuer={r.card.issuer} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>
                          {r.card.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--ink-3)",
                            marginTop: 2,
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          {r.card.issuer}
                          <EligibilityChip status={r.eligibility.status} label={r.eligibility.note} />
                        </div>
                        <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.4 }}>
                          {r.why}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Money value={delta} sign size="sm" />
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--ink-3)",
                            marginTop: 2,
                            fontFamily: "var(--font-mono), ui-monospace, monospace",
                          }}
                        >
                          {view === "ongoing" ? "/YR" : "Y1"}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        )}

        {tab === "detail" && selected && (
          <DrillIn recommendation={selected} view={view} userProfile={profile} db={db} />
        )}
        {tab === "detail" && !selected && (
          <p style={{ fontSize: 14, color: "var(--ink-3)" }}>Tap a card on the Top 5 tab.</p>
        )}
      </main>
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
