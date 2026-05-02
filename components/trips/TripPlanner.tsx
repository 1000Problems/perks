"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useProfile } from "@/lib/profile/client";
import type { UserProfile } from "@/lib/profile/types";
import type { Card, CardDatabase, Program } from "@/lib/data/loader";

interface Props {
  initialProfile: UserProfile;
  cards: Card[];
  programs: Program[];
  destinationPerks: CardDatabase["destinationPerks"];
}

const TRIP_KEY_NORMALIZERS = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

function matchDestinationKey(
  dest: string,
  destinationPerks: CardDatabase["destinationPerks"],
): string | null {
  const norm = TRIP_KEY_NORMALIZERS(dest);
  const keys = Object.keys(destinationPerks);
  if (keys.includes(norm)) return norm;
  for (const k of keys) {
    const kn = TRIP_KEY_NORMALIZERS(k);
    if (kn.includes(norm) || norm.includes(kn)) return k;
  }
  return null;
}

function transferPartnersForCard(
  card: Card,
  programs: Program[],
): { partner: string; type: "airline" | "hotel" | "other" }[] {
  const programIds = [card.currency_earned, card.transfer_partners_inherited_from].filter(
    (x): x is string => Boolean(x),
  );
  const out: { partner: string; type: "airline" | "hotel" | "other" }[] = [];
  for (const pid of programIds) {
    const prog = programs.find((p) => p.id === pid);
    if (!prog) continue;
    for (const tp of prog.transfer_partners) {
      out.push({ partner: tp.partner, type: tp.type });
    }
  }
  return out;
}

export function TripPlanner({
  initialProfile,
  cards,
  programs,
  destinationPerks,
}: Props) {
  const { profile, update } = useProfile(initialProfile);
  const [draft, setDraft] = useState("");
  const [activeDest, setActiveDest] = useState<string | null>(
    profile.trips_planned[0]?.destination ?? null,
  );

  const cardsById = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);
  const heldCardIds = profile.cards_held.map((h) => h.card_id);
  const heldCards = heldCardIds
    .map((id) => cardsById.get(id))
    .filter((c): c is Card => Boolean(c));

  // Programs the user can transfer to via a card they hold.
  const userPartners = useMemo(() => {
    const set = new Set<string>();
    for (const c of heldCards) {
      for (const p of transferPartnersForCard(c, programs)) {
        set.add(p.partner);
      }
    }
    return set;
  }, [heldCards, programs]);

  function addDestination() {
    const dest = draft.trim();
    if (!dest) return;
    update((prev) => ({
      trips_planned: [
        ...prev.trips_planned.filter(
          (t) => t.destination.toLowerCase() !== dest.toLowerCase(),
        ),
        { destination: dest },
      ],
    }));
    setActiveDest(dest);
    setDraft("");
  }

  const matchedKey = activeDest
    ? matchDestinationKey(activeDest, destinationPerks)
    : null;
  const matchedDp = matchedKey ? destinationPerks[matchedKey] : null;

  // Cards listed in the destination_perks entry.
  const relevantCards = useMemo(() => {
    if (!matchedDp) return [];
    return matchedDp.relevant_cards
      .map((entry) => {
        // Entries look like "amex_gold (MR transfer to Virgin Atlantic for ANA biz)".
        const id = entry.split(/[\s(]/)[0].trim();
        const card = cardsById.get(id);
        const note = entry.includes("(") ? entry.slice(entry.indexOf("(")) : "";
        return card ? { card, note } : null;
      })
      .filter((x): x is { card: Card; note: string } => Boolean(x));
  }, [matchedDp, cardsById]);

  // Split into bookable-today (user holds the card) vs unlocked-by-new-card.
  const bookable = relevantCards.filter((r) => heldCardIds.includes(r.card.id));
  const unlocked = relevantCards.filter((r) => !heldCardIds.includes(r.card.id));

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 32px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div className="eyebrow">Trip planner</div>
      <h1
        style={{
          margin: "8px 0 16px",
          fontSize: 32,
          letterSpacing: "-0.02em",
          fontWeight: 600,
        }}
      >
        Where are you going?
      </h1>
      <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, maxWidth: 600 }}>
        Pick a destination — we&apos;ll show what&apos;s bookable today with the points you can
        earn from cards you hold, plus which cards in the rec list would unlock more.
      </p>

      <section style={{ marginTop: 24 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {profile.trips_planned.map((t) => (
            <button
              key={t.destination}
              type="button"
              className="chip"
              data-active={activeDest === t.destination ? "true" : "false"}
              onClick={() => setActiveDest(t.destination)}
              style={{ cursor: "pointer", fontFamily: "inherit" }}
            >
              {t.destination}
            </button>
          ))}
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addDestination();
              }
            }}
            placeholder="+ add destination"
            style={{
              padding: "6px 12px",
              fontSize: 13,
              borderRadius: 999,
              border: "1px dashed var(--rule-2)",
              background: "transparent",
              color: "var(--ink)",
              minWidth: 160,
            }}
          />
        </div>
      </section>

      {!activeDest && (
        <p style={{ marginTop: 32, fontSize: 14, color: "var(--ink-3)" }}>
          Pick or add a destination above to see what your wallet (and the rec list) can do.
        </p>
      )}

      {activeDest && !matchedDp && (
        <p style={{ marginTop: 32, fontSize: 14, color: "var(--ink-3)" }}>
          We don&apos;t have curated sweet spots for {activeDest} yet. Try a major hub
          like Tokyo, Phoenix, or Paris.
        </p>
      )}

      {activeDest && matchedDp && (
        <div
          style={{
            marginTop: 32,
            display: "grid",
            gap: 28,
          }}
        >
          <Bucket
            heading={`Bookable today · ${activeDest}`}
            tone="positive"
            empty={
              userPartners.size === 0
                ? "You don't have any transferable-point cards yet. See the section below for cards that would unlock these redemptions."
                : "Your wallet doesn't reach these specific partners. See unlocks below."
            }
            rows={bookable}
            destNotes={matchedDp.notes}
          />
          <Bucket
            heading="A new card would unlock"
            tone="neutral"
            empty="Nothing extra to unlock — your wallet already covers this destination."
            rows={unlocked}
            destNotes={null}
            linkToRec
          />
        </div>
      )}

      <p
        style={{
          marginTop: 36,
          fontSize: 11,
          color: "var(--ink-4)",
          lineHeight: 1.6,
          maxWidth: 600,
          fontFamily: "var(--font-mono), ui-monospace, monospace",
        }}
      >
        Note: We don&apos;t track point balances yet. &quot;Bookable today&quot; means a card
        you hold can transfer to the partner — not that your specific balance covers
        the redemption.
      </p>
    </main>
  );
}

function Bucket({
  heading,
  tone,
  rows,
  empty,
  destNotes,
  linkToRec,
}: {
  heading: string;
  tone: "positive" | "neutral";
  rows: { card: Card; note: string }[];
  empty: string;
  destNotes: string | null | undefined;
  linkToRec?: boolean;
}) {
  const accent = tone === "positive" ? "var(--pos)" : "var(--ink-3)";
  return (
    <section>
      <div className="eyebrow" style={{ marginBottom: 10 }}>{heading}</div>
      {destNotes && (
        <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginBottom: 12, lineHeight: 1.5 }}>
          {destNotes}
        </p>
      )}
      {rows.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--ink-3)" }}>{empty}</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map(({ card, note }) => {
            const inner = (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid var(--rule)",
                  borderLeft: `2px solid ${accent}`,
                  background: "var(--paper)",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  {card.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                  {card.issuer}
                </div>
                {note && (
                  <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 8, lineHeight: 1.5 }}>
                    {note}
                  </div>
                )}
              </div>
            );
            return linkToRec ? (
              <Link
                key={card.id}
                href={`/recommendations?card=${card.id}` as Route}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {inner}
              </Link>
            ) : (
              <div key={card.id}>{inner}</div>
            );
          })}
        </div>
      )}
    </section>
  );
}
