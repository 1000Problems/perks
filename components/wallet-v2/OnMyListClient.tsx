"use client";

// Phase 5 of signal-first architecture.
//
// Cross-card aggregation of every play the user marked "On my list".
// One row per play; clicking a row navigates to the source card's
// hero page where the chip can be edited. Sortable by value (default)
// or grouped by source card. Empty state when there's nothing to show.

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Route } from "next";
import { fromSerialized, type SerializedDb } from "@/lib/data/serialized";
import { CardArt } from "@/components/perks/CardArt";
import { variantForCard } from "@/lib/cardArt";
import { GROUP_LABELS } from "@/lib/engine/moneyFind";
import type { PlayGroupId } from "@/lib/data/loader";
import { fmt } from "@/lib/utils/format";

export interface OnMyListEntry {
  cardId: string;
  playId: string;
  headline: string;
  group: PlayGroupId;
  valueUsd: number;
  cardName: string;
  cardIssuer: string;
  cardNetwork: string | null;
}

interface Props {
  entries: OnMyListEntry[];
  serializedDb: SerializedDb;
}

type SortMode = "value" | "card";

export function OnMyListClient({ entries, serializedDb }: Props) {
  const db = useMemo(() => fromSerialized(serializedDb), [serializedDb]);
  const [sort, setSort] = useState<SortMode>("value");

  const total = useMemo(
    () => entries.reduce((s, e) => s + e.valueUsd, 0),
    [entries],
  );

  const sorted = useMemo(() => {
    const copy = [...entries];
    if (sort === "value") {
      copy.sort((a, b) => b.valueUsd - a.valueUsd);
    } else {
      copy.sort((a, b) => {
        const cmp = a.cardName.localeCompare(b.cardName);
        if (cmp !== 0) return cmp;
        return b.valueUsd - a.valueUsd;
      });
    }
    return copy;
  }, [entries, sort]);

  if (entries.length === 0) {
    return (
      <div className="wallet-edit-page">
        <div className="page-head">
          <h1>On your list</h1>
          <p className="sub">
            Plays you mark &ldquo;On my list&rdquo; from any card&rsquo;s page
            show up here so you can come back to them. Nothing to show yet.
          </p>
        </div>
        <div className="empty-wallet">
          <div className="empty-headline">No items on your list</div>
          <p className="empty-body">
            Open a card from{" "}
            <Link href={"/wallet/edit" as Route} className="back-link">
              your wallet
            </Link>
            , then mark anything you intend to do as &ldquo;On my list&rdquo;
            and it will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-edit-page">
      <div className="page-head">
        <h1>On your list</h1>
        <p className="sub">
          {entries.length} item{entries.length === 1 ? "" : "s"} you intend
          to act on, worth ~{fmt.usd(total)}/yr if you do them all.
        </p>
      </div>

      <div className="wallet-list-pane">
        <div className="list-head">
          <div className="list-head-left">
            <span className="eyebrow">
              {entries.length} item{entries.length === 1 ? "" : "s"} ·
              {" "}
              {fmt.usd(total)} potential
            </span>
            <Link href={"/wallet/edit" as Route} className="list-head-link">
              ← Back to wallet
            </Link>
          </div>
          <div className="onlist-sort">
            <button
              type="button"
              className="chip"
              data-active={sort === "value" ? "true" : "false"}
              onClick={() => setSort("value")}
            >
              By value
            </button>
            <button
              type="button"
              className="chip"
              data-active={sort === "card" ? "true" : "false"}
              onClick={() => setSort("card")}
            >
              By card
            </button>
          </div>
        </div>

        <div className="list-rows">
          {sorted.map((e) => {
            const card = db.cardById.get(e.cardId);
            return (
              <Link
                key={`${e.cardId}:${e.playId}`}
                href={`/wallet/cards/${e.cardId}` as Route}
                className="onlist-row"
              >
                {card && (
                  <CardArt
                    variant={variantForCard(card)}
                    issuer={card.issuer}
                    network={card.network ?? undefined}
                    size="sm"
                  />
                )}
                <div className="onlist-row-body">
                  <div className="onlist-row-card">
                    <span className="card-name">{e.cardName}</span>
                    <span className="dot">·</span>
                    <span className="card-issuer">{e.cardIssuer}</span>
                  </div>
                  <div className="onlist-row-headline">{e.headline}</div>
                  <div className="onlist-row-group">
                    {GROUP_LABELS[e.group]}
                  </div>
                </div>
                <div className="onlist-row-right">
                  <div className="onlist-chip">
                    <span className="amt num">{fmt.usd(e.valueUsd)}</span>
                    <span>/ yr</span>
                  </div>
                  <div className="af-line">tap to open</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
