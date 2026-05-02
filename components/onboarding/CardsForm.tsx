"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { CardArt } from "@/components/perks/CardArt";
import { useProfile, profileErrorMessage } from "@/lib/profile/client";
import { evaluateEligibility } from "@/lib/engine/eligibility";
import { variantForCard } from "@/lib/cardArt";
import type { UserProfile, WalletCardHeld } from "@/lib/profile/types";
import type { Card, CardDatabase } from "@/lib/data/loader";
import { fromSerialized, type SerializedDb } from "@/lib/data/serialized";

interface Props {
  initialProfile: UserProfile;
  serializedDb: SerializedDb;
  editMode?: boolean;
}

const ANCHOR_CARDS_FOR_PRE_CHECK = [
  "chase_sapphire_preferred",
  "amex_gold",
  "citi_strata_premier",
  "capital_one_venture",
];

export function CardsForm({ initialProfile, serializedDb, editMode }: Props) {
  const router = useRouter();
  const { profile, update, flushNow, error, errorDetail } = useProfile(initialProfile);

  async function go(
    target:
      | "/recommendations"
      | "/onboarding/brands"
      | "/settings",
  ) {
    await flushNow();
    router.push(target as Route);
  }
  // Initialize TODAY inside the component so it doesn't drift if the tab
  // stays open across midnight or month rollovers.
  const [today] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [openMonth, setOpenMonth] = useState<number>(today.getMonth() + 1);
  const [openYear, setOpenYear] = useState<number>(today.getFullYear());
  const [openBonus, setOpenBonus] = useState<boolean>(true);

  const cards = serializedDb.cards;
  const heldIds = new Set(profile.cards_held.map((h) => h.card_id));

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return cards
      .filter((c) => !heldIds.has(c.id))
      .filter((c) => {
        const hay = `${c.name} ${c.issuer}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 8);
  }, [query, cards, heldIds]);

  const db = useMemo(() => fromSerialized(serializedDb), [serializedDb]);

  // True when the currently-open panel is editing an existing held
  // card rather than adding a new one. Drives the panel's title +
  // confirm-button label.
  const isEditing = openCardId != null && heldIds.has(openCardId);

  function addCard(card: Card) {
    // Defensive: search already filters held cards out of matches, but
    // if a held card somehow reaches this path, route to edit instead.
    const existing = profile.cards_held.find((h) => h.card_id === card.id);
    if (existing) {
      editHeld(existing);
      return;
    }
    setOpenCardId(card.id);
    setOpenMonth(today.getMonth() + 1);
    setOpenYear(today.getFullYear());
    setOpenBonus(true);
  }

  function editHeld(held: WalletCardHeld) {
    setOpenCardId(held.card_id);
    // opened_at is "YYYY-MM-DD" — pull month + year, default to today
    // if parsing fails so the form is always interactable.
    const [y, m] = (held.opened_at ?? "").split("-").map(Number);
    setOpenYear(Number.isFinite(y) && y > 0 ? y : today.getFullYear());
    setOpenMonth(Number.isFinite(m) && m >= 1 && m <= 12 ? m : today.getMonth() + 1);
    setOpenBonus(Boolean(held.bonus_received));
    setQuery("");
  }

  function confirmAdd() {
    if (!openCardId) return;
    const opened = `${openYear}-${String(openMonth).padStart(2, "0")}-01`;
    const next: WalletCardHeld = {
      card_id: openCardId,
      opened_at: opened,
      bonus_received: openBonus,
    };
    // Filter then append — works for both add and edit because the
    // filter removes any prior entry for this card_id either way.
    update((prev) => ({
      cards_held: [
        ...prev.cards_held.filter((h) => h.card_id !== openCardId),
        next,
      ],
    }));
    setOpenCardId(null);
    setQuery("");
  }

  function removeHeld(cardId: string) {
    update((prev) => ({
      cards_held: prev.cards_held.filter((h) => h.card_id !== cardId),
    }));
    if (openCardId === cardId) setOpenCardId(null);
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by card name — Chase Sapphire Preferred, Amex Gold…"
        style={{
          width: "100%",
          padding: "10px 14px",
          fontSize: 14,
          borderRadius: 10,
          border: "1px solid var(--rule)",
          background: "var(--paper)",
          color: "var(--ink)",
        }}
      />

      {matches.length > 0 && !openCardId && (
        <div
          style={{
            marginTop: 8,
            border: "1px solid var(--rule)",
            borderRadius: 10,
            overflow: "hidden",
            background: "var(--paper-2)",
          }}
        >
          {matches.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => addCard(c)}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 12,
                width: "100%",
                padding: "10px 14px",
                background: "transparent",
                border: 0,
                borderBottom: "1px solid var(--rule)",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                color: "inherit",
              }}
            >
              <CardArt variant={variantForCard(c)} size="sm" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
                  {c.issuer} · {(c.annual_fee_usd ?? 0) === 0
                    ? "No fee"
                    : `$${c.annual_fee_usd}/yr`}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {openCardId && (() => {
        const card = cards.find((c) => c.id === openCardId);
        if (!card) return null;
        return (
          <div
            style={{
              marginTop: 12,
              padding: "16px 18px",
              border: "1px solid var(--ink)",
              borderRadius: 12,
              background: "white",
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <CardArt variant={variantForCard(card)} size="md" name={card.name} issuer={card.issuer} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{card.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{card.issuer}</div>
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => setOpenCardId(null)}
              >
                Cancel
              </button>
            </div>

            <div
              style={{
                marginTop: 14,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Field label="Opened">
                <div style={{ display: "flex", gap: 6 }}>
                  <select
                    value={openMonth}
                    onChange={(e) => setOpenMonth(Number(e.target.value))}
                    style={selectStyle}
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {monthShort(i + 1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={openYear}
                    onChange={(e) => setOpenYear(Number(e.target.value))}
                    style={selectStyle}
                  >
                    {Array.from({ length: 8 }).map((_, i) => {
                      const y = today.getFullYear() - i;
                      return <option key={y} value={y}>{y}</option>;
                    })}
                  </select>
                </div>
              </Field>
              <Field label="Got the sign-up bonus?">
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="chip"
                    data-active={openBonus ? "true" : "false"}
                    onClick={() => setOpenBonus(true)}
                    style={{ cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="chip"
                    data-active={!openBonus ? "true" : "false"}
                    onClick={() => setOpenBonus(false)}
                    style={{ cursor: "pointer", fontFamily: "inherit" }}
                  >
                    No
                  </button>
                </div>
              </Field>
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: isEditing ? "space-between" : "flex-end",
                alignItems: "center",
                gap: 8,
              }}
            >
              {isEditing && (
                <button
                  type="button"
                  onClick={() => removeHeld(card.id)}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "var(--neg)",
                    fontSize: 12,
                    cursor: "pointer",
                    padding: "4px 8px",
                    fontFamily: "inherit",
                  }}
                >
                  Remove from wallet
                </button>
              )}
              <button type="button" className="btn btn-primary" onClick={confirmAdd}>
                {isEditing ? "Save changes" : "Add to wallet"}
              </button>
            </div>
          </div>
        );
      })()}

      {profile.cards_held.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Your wallet · {profile.cards_held.length} {profile.cards_held.length === 1 ? "card" : "cards"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {profile.cards_held.map((h) => {
              const c = cards.find((x) => x.id === h.card_id);
              if (!c) return null;
              const isOpen = openCardId === h.card_id;
              return (
                <div
                  key={h.card_id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    padding: "10px 14px",
                    border: `1px solid ${isOpen ? "var(--ink)" : "var(--rule)"}`,
                    borderRadius: 10,
                    background: "var(--paper)",
                  }}
                >
                  <CardArt variant={variantForCard(c)} size="sm" />
                  <button
                    type="button"
                    onClick={() => editHeld(h)}
                    aria-label={`Edit ${c.name}`}
                    style={{
                      minWidth: 0,
                      textAlign: "left",
                      background: "transparent",
                      border: 0,
                      padding: 0,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      color: "inherit",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
                      {c.issuer} · opened {humanDate(h.opened_at)}
                      {" · "}
                      {h.bonus_received ? "bonus received" : "no bonus yet"}
                    </div>
                  </button>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => editHeld(h)}
                      style={{
                        background: "transparent",
                        border: 0,
                        color: "var(--ink-2)",
                        fontSize: 12,
                        cursor: "pointer",
                        padding: "4px 8px",
                        fontFamily: "inherit",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeHeld(h.card_id)}
                      style={{
                        background: "transparent",
                        border: 0,
                        color: "var(--ink-3)",
                        fontSize: 12,
                        cursor: "pointer",
                        padding: "4px 8px",
                        fontFamily: "inherit",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <PreCheck wallet={profile.cards_held} db={db} today={today} />

      {profile.cards_held.length === 0 && (
        <p style={{ marginTop: 24, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
          No cards yet — that&apos;s fine. We&apos;ll recommend starter cards based on your
          spend.
        </p>
      )}

      <div
        style={{
          marginTop: 36,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => go(editMode ? "/settings" : "/onboarding/brands")}
        >
          ← Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {error && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontSize: 12, color: "var(--neg)" }}>
                {profileErrorMessage(error)}
              </span>
              {errorDetail && (
                <span
                  style={{
                    fontSize: 10.5,
                    color: "var(--ink-3)",
                    fontFamily: "var(--font-mono), ui-monospace, monospace",
                    marginTop: 2,
                    maxWidth: 420,
                    textAlign: "right",
                    overflowWrap: "anywhere",
                  }}
                  title={errorDetail}
                >
                  {errorDetail}
                </span>
              )}
            </div>
          )}
          {!editMode && (
            <button
              type="button"
              className="btn"
              onClick={() => go("/recommendations")}
            >
              Skip
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => go(editMode ? "/settings" : "/recommendations")}
          >
            {editMode ? "Save & close" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PreCheck({
  wallet,
  db,
  today,
}: {
  wallet: WalletCardHeld[];
  db: CardDatabase;
  today: Date;
}) {
  if (wallet.length === 0) return null;
  const lines: string[] = [];
  for (const anchorId of ANCHOR_CARDS_FOR_PRE_CHECK) {
    const c = db.cardById.get(anchorId);
    if (!c) continue;
    const r = evaluateEligibility(c, wallet, db, today);
    lines.push(`${c.issuer}: ${r.note}`);
  }
  if (lines.length === 0) return null;
  return (
    <section style={{ marginTop: 28 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        Eligibility pre-check
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: "var(--ink-2)",
          lineHeight: 1.7,
          padding: "10px 14px",
          borderLeft: "2px solid var(--rule-2)",
          background: "var(--paper-2)",
          borderRadius: "0 8px 8px 0",
        }}
      >
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  padding: "6px 10px",
  fontSize: 13,
  borderRadius: 8,
  border: "1px solid var(--rule)",
  background: "var(--paper)",
  color: "var(--ink)",
  fontFamily: "inherit",
};

function monthShort(m: number): string {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];
}

function humanDate(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return `${monthShort(m)} ${y}`;
}
