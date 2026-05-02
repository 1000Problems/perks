"use client";

import { useMemo, useState } from "react";
import { CardArt } from "@/components/perks/CardArt";
import { EligibilityChip } from "@/components/perks/EligibilityChip";
import { Eyebrow } from "@/components/perks/Eyebrow";
import { HeatRow } from "@/components/perks/HeatRow";
import { Money } from "@/components/perks/Money";
import { Segmented } from "@/components/perks/Segmented";
import { SPEND_CATEGORIES } from "@/lib/categories";
import type { Card } from "@/lib/data/loader";
import { fromSerialized, type SerializedDb } from "@/lib/data/serialized";
import type { SpendCategoryId } from "@/lib/data/types";
import { rankCards } from "@/lib/engine/ranking";
import { bestRateForCategory } from "@/lib/engine/scoring";
import type {
  EligibilityResult,
  RankFilter,
  RankOptions,
} from "@/lib/engine/types";
import { variantForCard } from "@/lib/cardArt";
import type { UserProfile } from "@/lib/profile/types";
import { fmt } from "@/lib/utils/format";
import { DrillIn } from "./DrillIn";
import { RecHeader, type CreditsMode, type ViewMode } from "./Header";

const FILTER_OPTIONS: { value: RankFilter; label: string }[] = [
  { value: "total", label: "Best total value" },
  { value: "payself", label: "Pays for itself" },
  { value: "nofee", label: "No annual fee" },
  { value: "premium", label: "Premium tier" },
];

export interface RecPanelDesktopProps {
  profile: UserProfile;
  serializedDb: SerializedDb;
  // Server-precomputed verdicts from the catalog-driven rules engine.
  // null when the rules path is disabled or unavailable — the engine
  // computes eligibility client-side as a fallback.
  eligibilityOverrides: Record<string, EligibilityResult> | null;
}

export function RecPanelDesktop({
  profile,
  serializedDb,
  eligibilityOverrides,
}: RecPanelDesktopProps) {
  // Reconstruct lookup Maps once per render of the client tree. The
  // serializedDb arrays are stable (server reloads are full
  // remounts), so this useMemo keys on identity and runs once.
  const db = useMemo(() => fromSerialized(serializedDb), [serializedDb]);
  const [view, setView] = useState<ViewMode>("ongoing");
  const [credits, setCredits] = useState<CreditsMode>("realistic");
  const [filter, setFilter] = useState<RankFilter>("total");

  const rankOptions: RankOptions = useMemo(
    () => ({
      filter,
      scoring: { creditsMode: credits, subAmortizeMonths: 24 },
      limit: 5,
      eligibilityOverrides: eligibilityOverrides ?? undefined,
    }),
    [filter, credits, eligibilityOverrides],
  );

  const ranked = useMemo(
    () => rankCards(profile, profile.cards_held, db, rankOptions),
    [profile, db, rankOptions],
  );

  const [selectedId, setSelectedId] = useState<string | null>(
    ranked.visible[0]?.card.id ?? null,
  );
  // Keep selection valid when the rank list changes shape.
  const selected =
    ranked.visible.find((r) => r.card.id === selectedId) ?? ranked.visible[0];

  const walletCards: Card[] = useMemo(
    () =>
      profile.cards_held
        .map((h) => db.cardById.get(h.card_id))
        .filter((c): c is Card => Boolean(c)),
    [profile.cards_held, db],
  );

  // Wallet "now" — best-rate per category and net annual value summary.
  const walletBestRates = useMemo(() => {
    const out: Record<SpendCategoryId, { rate: number; from: string }> = {} as Record<
      SpendCategoryId,
      { rate: number; from: string }
    >;
    for (const c of SPEND_CATEGORIES) {
      out[c.id] = bestRateForCategory(c.id, walletCards, db);
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

  // Held perks, deduplicated by name (first card wins for the source label).
  const heldPerks: { perk: string; from: string }[] = useMemo(() => {
    const seen = new Map<string, string>();
    for (const c of walletCards) {
      for (const p of c.ongoing_perks) {
        if (!seen.has(p.name)) seen.set(p.name, c.name);
      }
    }
    return Array.from(seen.entries())
      .slice(0, 8)
      .map(([perk, from]) => ({ perk, from }));
  }, [walletCards]);

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
          {walletCards.length === 0 ? (
            <div style={{ marginTop: 14 }}>
              <Money value={0} sign size="lg" />
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
                No cards yet. Add some →{" "}
                <a href="/onboarding/cards" style={{ color: "var(--ink)" }}>
                  /onboarding/cards
                </a>
              </div>
            </div>
          ) : (
            <>
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
                <Row label="Rewards earned" value={fmt.usd(Math.round(walletEarned))} />
                <Row label="Annual fees" value={`−${fmt.usd(walletFees)}`} valueColor="var(--neg)" />
              </div>

              <div style={{ marginTop: 28 }}>
                <Eyebrow style={{ marginBottom: 10 }}>
                  Wallet · {walletCards.length} {walletCards.length === 1 ? "card" : "cards"}
                </Eyebrow>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {walletCards.map((c) => (
                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <CardArt variant={variantForCard(c)} size="sm" />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                          {c.issuer} · {(c.annual_fee_usd ?? 0) === 0 ? "No fee" : "$" + c.annual_fee_usd + "/yr"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 28 }}>
                <Eyebrow style={{ marginBottom: 10 }}>Spend coverage</Eyebrow>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {SPEND_CATEGORIES.map((c) => (
                    <HeatRow
                      key={c.id}
                      category={c}
                      rate={walletBestRates[c.id].rate}
                      from={walletBestRates[c.id].from}
                    />
                  ))}
                </div>
              </div>

              {heldPerks.length > 0 && (
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
                    {heldPerks.map(({ perk, from }) => (
                      <div
                        key={perk}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "var(--ink-2)",
                        }}
                      >
                        <span>{perk}</span>
                        <span style={{ color: "var(--ink-4)", fontSize: 11 }}>{from}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </aside>

        {/* MIDDLE — top 5 to add */}
        <main style={{ padding: "28px 32px", overflowY: "auto" }}>
          <div>
            <Eyebrow>Top {ranked.visible.length} cards to add next</Eyebrow>
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

          {ranked.visible.length === 0 ? (
            <p
              style={{
                marginTop: 30,
                fontSize: 14,
                color: "var(--ink-2)",
                lineHeight: 1.5,
              }}
            >
              No cards match this filter. Try another.
            </p>
          ) : (
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
              {ranked.visible.map((r) => {
                const isSel = r.card.id === selected?.card.id;
                const delta = view === "ongoing" ? r.score.deltaOngoing : r.score.deltaYear1;
                const fee = r.card.annual_fee_usd ?? 0;
                const subVal = r.card.signup_bonus?.estimated_value_usd ?? 0;
                return (
                  <li
                    key={r.card.id}
                    onClick={() => setSelectedId(r.card.id)}
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
                      {String(r.rank).padStart(2, "0")}
                    </div>
                    <CardArt variant={variantForCard(r.card)} name={r.card.name} issuer={r.card.issuer} size="md" />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
                          {r.card.name}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{r.card.issuer}</span>
                        <EligibilityChip status={r.eligibility.status} label={r.eligibility.note} />
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
                        {r.why}
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
                        <span>{fee === 0 ? "NO ANNUAL FEE" : "$" + fee + " FEE"}</span>
                        {subVal > 0 && <span>SUB ≈ ${Math.round(subVal)}</span>}
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
          )}

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
          <FreshnessStamp compiledAt={db.manifest.compiled_at} />
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
          {selected ? (
            <DrillIn
              recommendation={selected}
              view={view}
              userProfile={profile}
              db={db}
            />
          ) : (
            <p style={{ fontSize: 13, color: "var(--ink-3)" }}>Select a card to see the breakdown.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

function FreshnessStamp({ compiledAt }: { compiledAt: string }) {
  const compiled = new Date(compiledAt);
  const ageDays = (Date.now() - compiled.getTime()) / (24 * 60 * 60 * 1000);
  const stale = ageDays > 90 || isNaN(ageDays);
  const color = stale ? "var(--warn-ink)" : "var(--ink-4)";
  const dateStr = isNaN(compiled.getTime()) ? "unknown" : compiledAt.slice(0, 10);
  return (
    <p
      style={{
        marginTop: 6,
        fontSize: 11,
        color,
        fontFamily: "var(--font-mono), ui-monospace, monospace",
      }}
    >
      {stale ? "⚠️ Card data may be stale — " : ""}
      Card data verified {dateStr}
    </p>
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
