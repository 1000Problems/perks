"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CardArt } from "@/components/perks/CardArt";
import { EligibilityChip } from "@/components/perks/EligibilityChip";
import { Eyebrow } from "@/components/perks/Eyebrow";
import { CoverageRow } from "@/components/perks/CoverageRow";
import { Money } from "@/components/perks/Money";
import { Segmented } from "@/components/perks/Segmented";
import { ValuePillars } from "@/components/perks/ValuePillars";
import { WalletRow } from "@/components/perks/WalletRow";
import { SPEND_CATEGORIES } from "@/lib/categories";
import type { Card } from "@/lib/data/loader";
import { fromSerialized, type SerializedDb } from "@/lib/data/serialized";
import { makeQueryPredicate, nameMatch, segmentMatches } from "@/lib/data/searchIndex";
import type { SpendCategoryId } from "@/lib/data/types";
import { rankCards } from "@/lib/engine/ranking";
import { bestRateForCategory } from "@/lib/engine/scoring";
import type {
  EligibilityResult,
  RankFilter,
  RankOptions,
  ScoringOptions,
} from "@/lib/engine/types";
import { variantForCard } from "@/lib/cardArt";
import { useProfile, profileErrorMessage } from "@/lib/profile/client";
import type { UserProfile, WalletCardHeld } from "@/lib/profile/types";
import type { SignalState } from "@/lib/profile/server";
import type { ProgramCppOverride } from "@/lib/engine/programOverrides";
import { fmt } from "@/lib/utils/format";
import { DrillIn } from "./DrillIn";
import { RecHeader, type CreditsMode, type ViewMode } from "./Header";

const FILTER_OPTIONS: { value: RankFilter; label: string }[] = [
  { value: "total", label: "Best total value" },
  { value: "nofee", label: "No annual fee" },
  { value: "premium", label: "Premium tier" },
];

const FILTER_LABEL: Record<RankFilter, string> = {
  total: "All cards",
  nofee: "No annual fee",
  premium: "Premium tier",
};

function isRankFilter(s: string | null): s is RankFilter {
  return s === "total" || s === "nofee" || s === "premium";
}

// Sort axis for the rec panel dropdown. Three groups in display order:
//   "overall"                 → engine `total`
//   "cash" | "points" | "perks" → engine `specialization` lens
//   SpendCategoryId           → engine `category`
type SortValue =
  | "overall"
  | "cash"
  | "points"
  | "perks"
  | SpendCategoryId;

type SpecializationLens = "cash" | "points" | "perks";

function isSpecializationLens(s: SortValue): s is SpecializationLens {
  return s === "cash" || s === "points" || s === "perks";
}

function isCategorySort(s: SortValue): s is SpendCategoryId {
  return s !== "overall" && !isSpecializationLens(s);
}

const SPECIALIZATION_EYEBROW: Record<SpecializationLens, string> = {
  cash: "cash specialists",
  points: "points specialists",
  perks: "perks specialists",
};

const SPECIALIZATION_EMPTY: Record<SpecializationLens, string> = {
  cash: "No cash-back specialists match this filter.",
  points: "No transferable-points cards match this filter.",
  perks: "No perks specialists match this filter.",
};

export interface RecPanelDesktopProps {
  profile: UserProfile;
  serializedDb: SerializedDb;
  // Server-precomputed verdicts from the catalog-driven rules engine.
  // null when the rules path is disabled or unavailable — the engine
  // computes eligibility client-side as a fallback.
  eligibilityOverrides: Record<string, EligibilityResult> | null;
  // Phase 4: serialized signal map (Phase 3 storage merged with
  // auto-derived holdings server-side). Threaded into rankCards so
  // candidate cards with card_plays receive the +10% interest boost.
  userSignals?: Record<string, SignalState>;
  // CLAUDE.md User-driven cpp: per-program cpp overrides. Threaded
  // into rankCards so the rec list reshapes when the user edits cpp
  // values on a card detail page. Empty when migration 0007 hasn't
  // applied or the user has no overrides.
  programOverrides?: Record<string, ProgramCppOverride>;
}

export function RecPanelDesktop({
  profile: serverProfile,
  serializedDb,
  eligibilityOverrides,
  userSignals: userSignalsProp,
  programOverrides: programOverridesProp,
}: RecPanelDesktopProps) {
  // Reconstruct lookup Maps once per render of the client tree. The
  // serializedDb arrays are stable (server reloads are full
  // remounts), so this useMemo keys on identity and runs once.
  const db = useMemo(() => fromSerialized(serializedDb), [serializedDb]);
  const signals = useMemo(
    () => new Map(Object.entries(userSignalsProp ?? {})) as Map<string, SignalState>,
    [userSignalsProp],
  );
  const programOverrides = useMemo(
    () =>
      new Map(Object.entries(programOverridesProp ?? {})) as Map<
        string,
        ProgramCppOverride
      >,
    [programOverridesProp],
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [view, setView] = useState<ViewMode>("ongoing");
  const [credits, setCredits] = useState<CreditsMode>("realistic");
  // Initialize segment + query from URL on mount. seg is only respected
  // when q is present — otherwise filter starts at "total" (today's
  // default).
  const initialQuery = searchParams.get("q") ?? "";
  const initialSegRaw = searchParams.get("seg");
  const initialFilter: RankFilter =
    initialQuery && isRankFilter(initialSegRaw) ? initialSegRaw : "total";
  const [filter, setFilterRaw] = useState<RankFilter>(initialFilter);
  const [query, setQuery] = useState<string>(initialQuery);
  // When the user clicks the escape hatch, we remember the segment they
  // came from so the restore strip can flip back. null = no override.
  const [originalFilter, setOriginalFilter] = useState<RankFilter | null>(
    null,
  );

  // Manual segment changes always clear the override marker — picking a
  // segment is a stronger intent than the implicit "I escaped".
  function setFilter(next: RankFilter) {
    setFilterRaw(next);
    setOriginalFilter(null);
  }

  function escapeToAllCards() {
    setOriginalFilter(filter);
    setFilterRaw("total");
  }

  function restoreSegment() {
    if (originalFilter) {
      setFilterRaw(originalFilter);
      setOriginalFilter(null);
    }
  }

  // Clearing the query auto-restores the override so the user doesn't
  // get stranded in "all cards" without realizing it.
  useEffect(() => {
    if (query.trim() === "" && originalFilter) {
      setFilterRaw(originalFilter);
      setOriginalFilter(null);
    }
  }, [query, originalFilter]);

  // Debounced URL sync. Only writes seg when search is active —
  // otherwise the URL stays clean and the segment is pure session
  // state, matching pre-search behavior.
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const isSearching = query.trim().length > 0;
      if (isSearching) {
        params.set("q", query);
        params.set("seg", filter);
      } else {
        params.delete("q");
        params.delete("seg");
      }
      const qs = params.toString();
      router.replace((qs ? `${pathname}?${qs}` : pathname) as never, {
        scroll: false,
      });
    }, 150);
    return () => clearTimeout(t);
  }, [query, filter, pathname, router]);
  // Sort axis — session-only. "overall" maps to the engine's
  // default { kind: "total" }. cash/points/perks map to the
  // specialization lens. SpendCategoryId maps to category sort.
  const [sortCategory, setSortCategory] = useState<SortValue>("overall");

  // Wallet writes go through useProfile so the rec page can mutate the
  // user's held set inline (× on a wallet card, "I have this card" on a
  // Considering card). Reads still come from profile.cards_held — same
  // shape as before, just sourced from local state instead of a server
  // prop.
  const {
    profile,
    update: updateProfile,
    flushNow,
    error: saveError,
  } = useProfile(serverProfile);

  // Considering — session-only simulation set. Cards in here are
  // treated as held by the engine for ranking + spend coverage, but
  // never persist. Refresh = empty.
  const [consideringIds, setConsideringIds] = useState<string[]>([]);
  const todayIso = useMemo(
    () => new Date().toISOString().slice(0, 10),
    [],
  );
  // Engine wallet = held + considering. Considering entries default to
  // today's date and bonus_received=false, matching "if I got this
  // card right now" — so velocity rules count them and once-per-life
  // rules don't false-block.
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

  const isSearching = query.trim().length > 0;

  const rankOptions: RankOptions = useMemo(
    () => ({
      // When searching, override to "total" + raise limit so we get
      // every eligible card. The visual segment is then applied as a
      // UI predicate. This lets us count matches in BOTH the segment
      // and "all cards" from a single engine pass — the escape-hatch
      // arithmetic needs both numbers.
      filter: isSearching ? "total" : filter,
      scoring: { creditsMode: credits, subAmortizeMonths: 24 },
      limit: isSearching ? db.cards.length : 5,
      // Server-precomputed verdicts go stale the moment the user
      // mutates their wallet — drop them and let the engine recompute
      // eligibility per-card. Page refresh brings fresh overrides.
      eligibilityOverrides:
        consideringIds.length === 0 && profile.cards_held === serverProfile.cards_held
          ? eligibilityOverrides ?? undefined
          : undefined,
      sortBy:
        sortCategory === "overall"
          ? { kind: "total" }
          : isSpecializationLens(sortCategory)
            ? { kind: "specialization", lens: sortCategory }
            : { kind: "category", category: sortCategory },
    }),
    [
      filter,
      credits,
      eligibilityOverrides,
      consideringIds.length,
      profile.cards_held,
      serverProfile.cards_held,
      sortCategory,
      isSearching,
      db.cards.length,
    ],
  );

  // Sort categories by descending user spend so the dropdown leads
  // with what the user actually buys. Zero-spend categories preserve
  // their default order at the tail.
  const categoryOptions = useMemo(() => {
    const spend = profile.spend_profile ?? {};
    return [...SPEND_CATEGORIES].sort((a, b) => {
      const sa = spend[a.id] ?? 0;
      const sb = spend[b.id] ?? 0;
      if (sa === 0 && sb === 0) return 0;
      return sb - sa;
    });
  }, [profile.spend_profile]);

  const ranked = useMemo(
    () =>
      rankCards(
        profile,
        effectiveWallet,
        db,
        rankOptions,
        signals,
        programOverrides,
      ),
    [profile, effectiveWallet, db, rankOptions, signals, programOverrides],
  );

  // Search-time display pipeline. When NOT searching, ranked.visible is
  // already top 5 in the segment — pass through. When searching, the
  // engine returned the full eligible list (filter overridden to
  // "total"); apply segment + query, pin name match, slice to 5.
  const queryPredicate = useMemo(() => makeQueryPredicate(query), [query]);

  const matchesSegment = useMemo(
    () =>
      isSearching
        ? ranked.visible.filter((r) =>
            segmentMatches(filter, r.card.annual_fee_usd),
          )
        : ranked.visible,
    [isSearching, ranked.visible, filter],
  );

  const matchesAll = useMemo(
    () =>
      isSearching ? ranked.visible.filter((r) => queryPredicate(r.card)) : [],
    [isSearching, ranked.visible, queryPredicate],
  );

  const display = useMemo(() => {
    if (!isSearching) return ranked.visible;
    const inBoth = matchesSegment.filter((r) => queryPredicate(r.card));
    const hit = nameMatch(inBoth, query);
    const ordered = hit
      ? [hit, ...inBoth.filter((r) => r.card.id !== hit.card.id)]
      : inBoth;
    return ordered.slice(0, 5);
  }, [isSearching, ranked.visible, matchesSegment, queryPredicate, query]);

  const showEscapeHatch =
    isSearching && display.length === 0 && matchesAll.length > 0;
  const noMatchesAtAll =
    isSearching && display.length === 0 && matchesAll.length === 0;

  const [selectedId, setSelectedId] = useState<string | null>(
    display[0]?.card.id ?? null,
  );
  // Keep selection valid when the display list changes shape.
  const selected =
    display.find((r) => r.card.id === selectedId) ?? display[0];

  // Considering as Card[] for left-panel rendering. Filter out IDs the
  // catalog doesn't know — defensive against stale state.
  const consideringCards: Card[] = useMemo(
    () =>
      consideringIds
        .map((id) => db.cardById.get(id))
        .filter((c): c is Card => Boolean(c)),
    [consideringIds, db],
  );

  // Wallet today (held only — considering shown separately).
  const walletCards: Card[] = useMemo(
    () =>
      profile.cards_held
        .map((h) => db.cardById.get(h.card_id))
        .filter((c): c is Card => Boolean(c)),
    [profile.cards_held, db],
  );

  // Spend coverage uses the effective wallet — that's the whole point
  // of trying a card.
  const coverageCards = useMemo(
    () => [...walletCards, ...consideringCards],
    [walletCards, consideringCards],
  );

  // ── Wallet actions ────────────────────────────────────────────────

  function tryCard(cardId: string) {
    setConsideringIds((prev) =>
      prev.includes(cardId) ? prev : [...prev, cardId],
    );
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
    // Optimistic — pull out of considering, drop into held. Force a
    // sync save so we know if it landed; revert on failure.
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

  // Wallet math uses the effective wallet (held + considering) so the
  // user sees how the simulation would change their picture. The
  // section header makes it clear when Considering is contributing.
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

  // Deduped perk value across the wallet — perks are first-card-wins so a
  // duplicate (Priority Pass on two cards) only counts once. Matches the
  // engine's `alreadyCoveredPerks` logic so per-card marginal scores
  // reconcile with the wallet net displayed in the header.
  const walletPerksValue = useMemo(() => {
    const seen = new Set<string>();
    let total = 0;
    for (const c of coverageCards) {
      for (const p of c.ongoing_perks) {
        const key = p.name.toLowerCase().trim();
        if (seen.has(key)) continue;
        seen.add(key);
        total += p.value_estimate_usd ?? 0;
      }
    }
    return total;
  }, [coverageCards]);

  const walletFees = coverageCards.reduce((acc, c) => acc + (c.annual_fee_usd ?? 0), 0);
  const walletNet = Math.round(walletEarned + walletPerksValue - walletFees);

  // Held-only baseline — used as the trial "would total" reference. Trials
  // are evaluated independently against held, so this number is the same
  // for every trial row.
  const heldOnlyNet = useMemo(() => {
    let earnings = 0;
    for (const c of SPEND_CATEGORIES) {
      const spend = profile.spend_profile[c.id] ?? 0;
      earnings += spend * bestRateForCategory(c.id, walletCards, db).rate;
    }
    let perks = 0;
    const seen = new Set<string>();
    for (const c of walletCards) {
      for (const p of c.ongoing_perks) {
        const key = p.name.toLowerCase().trim();
        if (seen.has(key)) continue;
        seen.add(key);
        perks += p.value_estimate_usd ?? 0;
      }
    }
    const fees = walletCards.reduce((acc, c) => acc + (c.annual_fee_usd ?? 0), 0);
    return Math.round(earnings + perks - fees);
  }, [walletCards, profile.spend_profile, db]);

  // Scoring options threaded into WalletRow so per-card marginal numbers
  // respect the user's "realistic vs face" credit toggle in the header.
  const scoringOptions = useMemo<ScoringOptions>(
    () => ({ creditsMode: credits, subAmortizeMonths: 24 }),
    [credits],
  );

  // Per-card "wallet without this card" baselines. Memoized as a Map so
  // each WalletRow gets a stable array reference between renders — the
  // row's scoreCard useMemo dep keys on it. Without this, every parent
  // setState rebuilt every baseline and re-scored every row. (Code
  // review #13.)
  const ownedBaselines = useMemo(() => {
    const m = new Map<string, WalletCardHeld[]>();
    for (const h of profile.cards_held) {
      m.set(h.card_id, profile.cards_held.filter((x) => x.card_id !== h.card_id));
    }
    return m;
  }, [profile.cards_held]);

  // Held perks, deduplicated by name (first card wins for the source label).
  const heldPerks: { perk: string; from: string }[] = useMemo(() => {
    const seen = new Map<string, string>();
    for (const c of coverageCards) {
      for (const p of c.ongoing_perks) {
        if (!seen.has(p.name)) seen.set(p.name, c.name);
      }
    }
    return Array.from(seen.entries())
      .slice(0, 8)
      .map(([perk, from]) => ({ perk, from }));
  }, [coverageCards]);

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
      <RecHeader
        view={view}
        setView={setView}
        credits={credits}
        setCredits={setCredits}
        query={query}
        setQuery={setQuery}
      />

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
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {walletCards.map((c) => (
                    <WalletRow
                      key={c.id}
                      card={c}
                      mode="owned"
                      // Stable per-card baseline (wallet without this card)
                      // from the memoized map above — preserves WalletRow's
                      // scoreCard memoization on parent re-renders.
                      baselineWallet={ownedBaselines.get(c.id) ?? []}
                      currentWalletNet={walletNet}
                      profile={profile}
                      db={db}
                      scoringOptions={scoringOptions}
                      onRemove={() => removeFromWallet(c.id)}
                    />
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
                <div style={{ marginTop: 28 }}>
                  <Eyebrow style={{ marginBottom: 6 }}>
                    Considering · {consideringCards.length}{" "}
                    {consideringCards.length === 1 ? "card" : "cards"}
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
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {consideringCards.map((c) => (
                      <WalletRow
                        key={c.id}
                        card={c}
                        mode="trial"
                        // Each trial is evaluated independently vs the
                        // held wallet so the marginal numbers stay
                        // legible (otherwise overlap between trials
                        // would distort each other's deltas).
                        baselineWallet={profile.cards_held}
                        currentWalletNet={heldOnlyNet}
                        profile={profile}
                        db={db}
                        scoringOptions={scoringOptions}
                        onPromote={() => promoteToWallet(c.id)}
                        onUntry={() => untryCard(c.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 28 }}>
                <Eyebrow style={{ marginBottom: 10 }}>
                  Spend coverage
                  {consideringCards.length > 0 && (
                    <span
                      style={{
                        marginLeft: 8,
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
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {SPEND_CATEGORIES.map((c) => (
                    <CoverageRow
                      key={c.id}
                      category={c}
                      bestRate={walletBestRates[c.id].rate}
                      walletCards={walletCards}
                      trialCards={consideringCards}
                      db={db}
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
            <Eyebrow>
              {isSearching
                ? `${display.length} ${display.length === 1 ? "match" : "matches"} for "${query.trim()}"`
                : isSpecializationLens(sortCategory)
                  ? `Top ${display.length} ${SPECIALIZATION_EYEBROW[sortCategory]}`
                  : `Top ${display.length} cards to add next`}
            </Eyebrow>
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

          <div style={{ marginTop: 22, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <Segmented value={filter} onChange={setFilter} options={FILTER_OPTIONS} />
            <select
              value={sortCategory}
              onChange={(e) => setSortCategory(e.target.value as SortValue)}
              aria-label="Sort by"
              title="Sort by"
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid var(--rule)",
                background: "white",
                color: "var(--ink)",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <option value="overall">Overall</option>
              <optgroup label="Optimize for">
                <option value="cash">Cash</option>
                <option value="points">Points</option>
                <option value="perks">Perks</option>
              </optgroup>
              <optgroup label="Best card for">
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {display.length === 0 ? (
            <p
              style={{
                marginTop: 30,
                fontSize: 14,
                color: "var(--ink-2)",
                lineHeight: 1.5,
              }}
            >
              {noMatchesAtAll ? (
                <>No cards match &ldquo;{query.trim()}&rdquo;.</>
              ) : showEscapeHatch ? (
                <>
                  No matches in {FILTER_LABEL[filter]}.{" "}
                  <button
                    type="button"
                    onClick={escapeToAllCards}
                    style={{
                      border: 0,
                      background: "transparent",
                      padding: 0,
                      color: "var(--ink)",
                      fontWeight: 600,
                      textDecoration: "underline",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    {matchesAll.length} in all cards →
                  </button>
                </>
              ) : sortCategory === "overall" ? (
                "No cards match this filter. Try another."
              ) : isSpecializationLens(sortCategory) ? (
                SPECIALIZATION_EMPTY[sortCategory]
              ) : (
                (() => {
                  const cat = SPEND_CATEGORIES.find((c) => c.id === sortCategory);
                  const label = cat?.label.toLowerCase() ?? sortCategory;
                  const baseline = bestRateForCategory(sortCategory, walletCards, db);
                  if (baseline.rate > 0 && baseline.from !== "—") {
                    const pct = (baseline.rate * 100).toFixed(1).replace(/\.0$/, "");
                    return `No card in this view beats your ${baseline.from} for ${label} at ${pct}%.`;
                  }
                  return `No card in this view adds value for ${label}.`;
                })()
              )}
            </p>
          ) : (
            <>
              {isSearching && originalFilter && (
                <div
                  style={{
                    marginTop: 14,
                    padding: "8px 12px",
                    border: "1px dashed var(--rule)",
                    borderRadius: 8,
                    background: "var(--paper-2)",
                    fontSize: 12,
                    color: "var(--ink-2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>Showing all cards.</span>
                  <button
                    type="button"
                    onClick={restoreSegment}
                    style={{
                      border: 0,
                      background: "transparent",
                      padding: 0,
                      color: "var(--ink)",
                      fontWeight: 600,
                      textDecoration: "underline",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    Restore {FILTER_LABEL[originalFilter]}
                  </button>
                </div>
              )}
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
                {display.map((r) => {
                const isSel = r.card.id === selected?.card.id;
                const fee = r.card.annual_fee_usd ?? 0;
                const subVal = r.card.signup_bonus?.estimated_value_usd ?? 0;
                return (
                  <li
                    key={r.card.id}
                    onClick={() => setSelectedId(r.card.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 14,
                      border: "1px solid " + (isSel ? "var(--ink)" : "var(--rule)"),
                      background: isSel ? "white" : "var(--paper-2)",
                      boxShadow: isSel ? "var(--shadow-2)" : "none",
                      cursor: "pointer",
                      transition: "all 140ms ease",
                      overflow: "hidden",
                    }}
                  >
                    {/* Identity row — title finally has the full width.
                        Art is top-aligned with the title (not vertically
                        centered) so the row stays short. */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "88px 1fr",
                        gap: 18,
                        alignItems: "flex-start",
                        padding: "14px 18px 12px",
                      }}
                    >
                      <CardArt variant={variantForCard(r.card)} issuer={r.card.issuer} network={r.card.network} size="md" />
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
                          }}
                        >
                          {r.why}
                        </div>
                        {isCategorySort(sortCategory) && (() => {
                          const impact = r.score.spendImpact[sortCategory];
                          const delta = Math.round(impact?.delta ?? 0);
                          const cat = SPEND_CATEGORIES.find((c) => c.id === sortCategory);
                          const label = cat?.label.toLowerCase() ?? sortCategory;
                          return (
                            <div
                              style={{
                                marginTop: 6,
                                fontSize: 12,
                                fontWeight: 600,
                                color: delta > 0 ? "var(--ink)" : "var(--ink-3)",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {delta > 0 ? "+" : ""}
                              ${delta}/yr on {label}
                            </div>
                          );
                        })()}
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
                    </div>
                    {/* Value band — full-width pillars + Try button.
                        Try lives here (not in the identity row) so each
                        row is shorter and more cards fit per screen. */}
                    <div
                      style={{
                        borderTop: "1px solid var(--rule)",
                        background: isSel ? "var(--paper-2)" : "transparent",
                        padding: "12px 18px",
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-end",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <ValuePillars
                          components={r.score.components}
                          view={view}
                          variant="band"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn"
                        style={{ fontSize: 11.5, padding: "4px 14px", flexShrink: 0 }}
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
            </>
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
              isConsidering={consideringIds.includes(selected.card.id)}
              onTry={tryCard}
              onUntry={untryCard}
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
