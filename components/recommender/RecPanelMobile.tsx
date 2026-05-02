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
import { useProfile, profileErrorMessage } from "@/lib/profile/client";
import type { UserProfile, WalletCardHeld } from "@/lib/profile/types";
import { fmt } from "@/lib/utils/format";
import { DrillIn } from "./DrillIn";
import { RecHeader, type CreditsMode, type ViewMode } from "./Header";

type Tab = "wallet" | "top" | "detail";

const FILTER_OPTIONS: { value: RankFilter; label: string }[] = [
  { value: "total", label: "Total" },
  { value: "nofee", label: "No fee" },
  { value: "premium", label: "Premium" },
];

export interface RecPanelMobileProps {
  profile: UserProfile;
  serializedDb: SerializedDb;
  eligibilityOverrides: Record<string, EligibilityResult> | null;
}

export function RecPanelMobile({
  profile: serverProfile,
  serializedDb,
  eligibilityOverrides,
}: RecPanelMobileProps) {
  const db = useMemo(() => fromSerialized(serializedDb), [serializedDb]);
  const [view, setView] = useState<ViewMode>("ongoing");
  const [credits, setCredits] = useState<CreditsMode>("realistic");
  const [filter, setFilter] = useState<RankFilter>("total");
  const [tab, setTab] = useState<Tab>("top");

  const {
    profile,
    update: updateProfile,
    flushNow,
    error: saveError,
  } = useProfile(serverProfile);

  const [consideringIds, setConsideringIds] = useState<string[]>([]);
  const todayIso = useMemo(
    () => new Date().toISOString().slice(0, 10),
    [],
  );
  const effectiveWallet: WalletCardHeld[] = useMemo(
    () => [
      ...profile.cards_held,
      ...consideringIds.map((id) => ({
        card_id: id,
        opened_at: todayIso,
        bonus_received: false,
      })),
    ],
    [profile.cards_held, consideringIds, todayIso],
  );

  const rankOptions: RankOptions = useMemo(
    () => ({
      filter,
      scoring: { creditsMode: credits, subAmortizeMonths: 24 },
      limit: 5,
      eligibilityOverrides:
        consideringIds.length === 0 && profile.cards_held === serverProfile.cards_held
          ? eligibilityOverrides ?? undefined
          : undefined,
    }),
    [
      filter,
      credits,
      eligibilityOverrides,
      consideringIds.length,
      profile.cards_held,
      serverProfile.cards_held,
    ],
  );

  const ranked = useMemo(
    () => rankCards(profile, effectiveWallet, db, rankOptions),
    [profile, effectiveWallet, db, rankOptions],
  );

  const [selectedId, setSelectedId] = useState<string | null>(
    ranked.visible[0]?.card.id ?? null,
  );
  const selected =
    ranked.visible.find((r) => r.card.id === selectedId) ?? ranked.visible[0];

  const consideringCards: Card[] = useMemo(
    () =>
      consideringIds
        .map((id) => db.cardById.get(id))
        .filter((c): c is Card => Boolean(c)),
    [consideringIds, db],
  );

  const walletCards: Card[] = useMemo(
    () =>
      profile.cards_held
        .map((h) => db.cardById.get(h.card_id))
        .filter((c): c is Card => Boolean(c)),
    [profile.cards_held, db],
  );

  const coverageCards = useMemo(
    () => [...walletCards, ...consideringCards],
    [walletCards, consideringCards],
  );

  const walletBestRates = useMemo(() => {
    const out: Record<SpendCategoryId, { rate: number; from: string }> = {} as Record<
      SpendCategoryId,
      { rate: number; from: string }
    >;
    for (const c of SPEND_CATEGORIES) {
      out[c.id] = bestRateForCategory(c.id, coverageCards, db);
    }
    return out;
  }, [coverageCards, db]);

  const walletEarned = useMemo(() => {
    let total = 0;
    for (const c of SPEND_CATEGORIES) {
      const spend = profile.spend_profile[c.id] ?? 0;
      total += spend * walletBestRates[c.id].rate;
    }
    return total;
  }, [profile.spend_profile, walletBestRates]);

  const walletFees = coverageCards.reduce((acc, c) => acc + (c.annual_fee_usd ?? 0), 0);
  const walletNet = Math.round(walletEarned - walletFees);

  function pickCard(id: string) {
    setSelectedId(id);
    setTab("detail");
  }

  function tryCard(cardId: string) {
    setConsideringIds((prev) =>
      prev.includes(cardId) ? prev : [...prev, cardId],
    );
    // Take the user back to the wallet tab so they see the simulation
    // immediately. (On desktop it's all visible at once.)
    setTab("wallet");
  }

  function untryCard(cardId: string) {
    setConsideringIds((prev) => prev.filter((id) => id !== cardId));
  }

  async function promoteToWallet(cardId: string) {
    const newCard: WalletCardHeld = {
      card_id: cardId,
      opened_at: todayIso,
      bonus_received: false,
    };
    setConsideringIds((prev) => prev.filter((id) => id !== cardId));
    updateProfile((prev) => ({
      cards_held: [
        ...prev.cards_held.filter((h) => h.card_id !== cardId),
        newCard,
      ],
    }));
    const ok = await flushNow();
    if (!ok) {
      updateProfile((prev) => ({
        cards_held: prev.cards_held.filter((h) => h.card_id !== cardId),
      }));
      setConsideringIds((prev) => [...prev, cardId]);
    }
  }

  function removeFromWallet(cardId: string) {
    updateProfile((prev) => ({
      cards_held: prev.cards_held.filter((h) => h.card_id !== cardId),
    }));
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
                      <div
                        key={c.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "auto 1fr auto",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <CardArt variant={variantForCard(c)} size="sm" issuer={c.issuer} network={c.network} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                            {c.issuer} · {(c.annual_fee_usd ?? 0) === 0 ? "No fee" : "$" + c.annual_fee_usd + "/yr"}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromWallet(c.id)}
                          aria-label={`Remove ${c.name}`}
                          style={{
                            background: "transparent",
                            border: 0,
                            color: "var(--ink-3)",
                            fontSize: 16,
                            cursor: "pointer",
                            padding: "4px 8px",
                            lineHeight: 1,
                            fontFamily: "inherit",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {saveError && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 11,
                        color: "var(--neg)",
                        lineHeight: 1.4,
                      }}
                    >
                      {profileErrorMessage(saveError)}
                    </div>
                  )}
                </div>

                {consideringCards.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <Eyebrow style={{ marginBottom: 6 }}>
                      Considering · {consideringCards.length}
                    </Eyebrow>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-3)",
                        marginBottom: 10,
                        lineHeight: 1.45,
                      }}
                    >
                      Treated as if held — recs and coverage update live.
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {consideringCards.map((c) => (
                        <div
                          key={c.id}
                          style={{
                            padding: "10px 12px",
                            border: "1px dashed var(--rule-2)",
                            borderRadius: 10,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "auto 1fr",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <CardArt
                              variant={variantForCard(c)}
                              size="sm"
                              issuer={c.issuer}
                              network={c.network}
                            />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                                {c.issuer} ·{" "}
                                {(c.annual_fee_usd ?? 0) === 0
                                  ? "No fee"
                                  : "$" + c.annual_fee_usd + "/yr"}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              type="button"
                              className="btn"
                              style={{ flex: 1, justifyContent: "center", fontSize: 12 }}
                              onClick={() => promoteToWallet(c.id)}
                            >
                              I have this card
                            </button>
                            <button
                              type="button"
                              onClick={() => untryCard(c.id)}
                              aria-label={`Stop considering ${c.name}`}
                              style={{
                                background: "transparent",
                                border: "1px solid var(--rule)",
                                borderRadius: 8,
                                color: "var(--ink-3)",
                                fontSize: 14,
                                cursor: "pointer",
                                padding: "0 12px",
                                fontFamily: "inherit",
                              }}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 24 }}>
                  <Eyebrow style={{ marginBottom: 10 }}>
                    Spend coverage
                    {consideringCards.length > 0 && (
                      <span
                        style={{
                          marginLeft: 6,
                          color: "var(--ink-4)",
                          fontWeight: 400,
                          textTransform: "none",
                          letterSpacing: 0,
                        }}
                      >
                        · with Considering
                      </span>
                    )}
                  </Eyebrow>
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
                      <CardArt variant={variantForCard(r.card)} size="sm" issuer={r.card.issuer} network={r.card.network} />
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
                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 6,
                        }}
                      >
                        <div>
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
                        <button
                          type="button"
                          className="btn"
                          style={{ fontSize: 11, padding: "3px 10px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            tryCard(r.card.id);
                          }}
                        >
                          Try
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        )}

        {tab === "detail" && selected && (
          <DrillIn
            recommendation={selected}
            view={view}
            userProfile={profile}
            db={db}
            isConsidering={consideringIds.includes(selected.card.id)}
            onTry={tryCard}
            onUntry={untryCard}
          />
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
