"use client";

// Spend coverage row used in the wallet sidebar. Collapsed shows the
// best-in-wallet rate as a heat bar; expanded shows every wallet + trial
// card's contribution to that category, sorted by rate, with the winner
// annotated. Trials get a dashed border (same convention as the
// Considering section) and a "would win" annotation when they're top.
//
// Per-card rates are computed via bestRateForCategory(cat, [card], db) —
// pure function, no engine plumbing needed.

import { useState } from "react";
import { CardSwatch } from "@/components/perks/CardSwatch";
import type { Card, CardDatabase } from "@/lib/data/loader";
import type { SpendCategory } from "@/lib/data/types";
import { bestRateForCategory } from "@/lib/engine/scoring";
import { variantForCard } from "@/lib/cardArt";
import { fmt, heatColor, heatTextColor } from "@/lib/utils/format";

interface Props {
  category: SpendCategory;
  // Wallet best rate (across walletCards + trialCards) — already computed
  // by the parent for the heat bar. Passed in so we don't recompute and
  // so the displayed rate can't drift from the parent's source.
  bestRate: number;
  walletCards: Card[];
  trialCards: Card[];
  db: CardDatabase;
}

interface Contributor {
  card: Card;
  rate: number;
  isTrial: boolean;
}

const MAX_VISIBLE = 6;

export function CoverageRow({ category, bestRate, walletCards, trialCards, db }: Props) {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Build the contributor list lazily — only meaningful work when open.
  const contributors: Contributor[] = open
    ? buildContributors(category.id, walletCards, trialCards, db)
    : [];

  const bg = heatColor(bestRate);
  const txt = heatTextColor(bestRate);

  const visible = showAll ? contributors : contributors.slice(0, MAX_VISIBLE);
  const hidden = contributors.length - visible.length;

  return (
    <div style={{ borderBottom: "1px solid var(--rule)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: "100%",
          background: "transparent",
          border: 0,
          padding: "6px 0",
          cursor: "pointer",
          fontFamily: "inherit",
          color: "inherit",
          textAlign: "left",
          display: "grid",
          gridTemplateColumns: "110px 1fr 14px",
          alignItems: "center",
          gap: 10,
        }}
      >
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
        <div
          className="hm-cell"
          style={{
            background: bg,
            color: txt,
            height: 22,
            width: "100%",
          }}
        >
          {fmt.pct(bestRate)}
        </div>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            fontSize: 10,
            color: "var(--ink-3)",
            transform: open ? "rotate(90deg)" : "rotate(0)",
            transition: "transform 120ms",
            textAlign: "center",
          }}
        >
          ▸
        </span>
      </button>

      {open && (
        <div style={{ padding: "4px 0 10px 14px" }}>
          {contributors.length === 0 ? (
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", padding: "6px 0", lineHeight: 1.5 }}>
              No wallet cards earn on this category.
            </div>
          ) : (
            <>
              {visible.map((c) => (
                <ContributorRow
                  key={c.card.id}
                  card={c.card}
                  rate={c.rate}
                  isTrial={c.isTrial}
                  isWinner={c.rate >= bestRate && bestRate > 0}
                />
              ))}
              {hidden > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  style={{
                    background: "transparent",
                    border: 0,
                    padding: "6px 0 0",
                    cursor: "pointer",
                    fontSize: 11,
                    color: "var(--ink-3)",
                    fontFamily: "inherit",
                  }}
                >
                  Show {hidden} more
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ContributorRow({
  card,
  rate,
  isTrial,
  isWinner,
}: {
  card: Card;
  rate: number;
  isTrial: boolean;
  isWinner: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "start",
        gap: 8,
        padding: "5px 8px",
        marginTop: 4,
        border: isTrial ? "1px dashed var(--rule-2)" : "1px solid transparent",
        borderRadius: 6,
        background: isWinner ? "var(--paper-2)" : "transparent",
      }}
    >
      <CardSwatch
        variant={variantForCard(card)}
        width={18}
        // Match WalletRow: nudge so the swatch's center sits on the card-name
        // baseline. Keeps it aligned with the name when "← active" wraps.
        style={{ marginTop: 2 }}
      />
      <div
        style={{
          minWidth: 0,
          fontSize: 11.5,
          color: "var(--ink-2)",
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: isWinner ? 600 : 400,
            color: isWinner ? "var(--ink)" : "var(--ink-2)",
          }}
        >
          {card.name}
        </span>
        {isTrial && (
          <span
            style={{
              fontSize: 9.5,
              color: "var(--ink-4)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            trial
          </span>
        )}
        {isWinner && (
          <span
            style={{
              fontSize: 10,
              color: "var(--pos)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ← {isTrial ? "would win" : "active"}
          </span>
        )}
      </div>
      <span
        className="mono"
        style={{
          fontSize: 11.5,
          color: isWinner ? "var(--pos)" : "var(--ink-3)",
          fontWeight: isWinner ? 600 : 400,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {fmt.pct(rate)}
      </span>
    </div>
  );
}

function buildContributors(
  categoryId: SpendCategory["id"],
  walletCards: Card[],
  trialCards: Card[],
  db: CardDatabase,
): Contributor[] {
  const list: Contributor[] = [];
  for (const c of walletCards) {
    list.push({
      card: c,
      rate: bestRateForCategory(categoryId, [c], db).rate,
      isTrial: false,
    });
  }
  for (const c of trialCards) {
    list.push({
      card: c,
      rate: bestRateForCategory(categoryId, [c], db).rate,
      isTrial: true,
    });
  }
  // Sort by rate desc, then trials below held cards at the same rate so
  // an "active" card (held, winning) sits above a "would win" tie.
  list.sort((a, b) => {
    if (b.rate !== a.rate) return b.rate - a.rate;
    return Number(a.isTrial) - Number(b.isTrial);
  });
  return list;
}
