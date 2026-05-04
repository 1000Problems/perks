"use client";

// Wallet edit — list/index view. Search + add at the top, list of held
// cards below. Each row links to /wallet/cards/[id] (the per-card hero
// page) where editing happens. The inline edit panel from the v1
// shipping was dropped in favor of the hero — clicking a card is now
// always a navigation, not a side-panel toggle.

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { fromSerialized, type SerializedDb } from "@/lib/data/serialized";
import type { Card } from "@/lib/data/loader";
import type { UserProfile, WalletCardHeld } from "@/lib/profile/types";
import type { SignalState } from "@/lib/profile/server";
import { computeCardValue } from "@/lib/engine/cardValue";
import { fmt } from "@/lib/utils/format";
import { CardArt } from "@/components/perks/CardArt";
import { variantForCard } from "@/lib/cardArt";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
  initialProfile: UserProfile;
  serializedDb: SerializedDb;
  // Phase 4: serialized signal map (already merged with auto-derived
  // holdings server-side). Reconstructed as a Map in useMemo. Empty
  // object until Phase 3 migration is applied; engine handles that
  // case as identical-to-pre-Phase-4 behavior.
  userSignals?: Record<string, SignalState>;
}

function formatOpened(iso: string): string {
  if (!iso) return "";
  const [y, m] = iso.split("-").map(Number);
  if (!y || !m) return "";
  return `opened ${MONTH[m - 1]} ${y}`;
}

export function EditWalletClient({
  initialProfile,
  serializedDb,
  userSignals: userSignalsProp,
}: Props) {
  const router = useRouter();
  const db = useMemo(() => fromSerialized(serializedDb), [serializedDb]);
  const held = initialProfile.cards_held ?? [];
  const heldIds = useMemo(() => new Set(held.map((h) => h.card_id)), [held]);

  // Phase 4: signal map reconstructed once per render. The server has
  // already merged user-clicked signals with auto-derived holdings, so
  // this Map is the engine's single source of truth.
  const signals = useMemo(
    () => new Map(Object.entries(userSignalsProp ?? {})),
    [userSignalsProp],
  );

  // Phase 5: dual-gauge totals. computeCardValue is called once per
  // row and the result drives both the page-head stats and the per-row
  // "On your list" sub-number.
  const cardValues = useMemo(() => {
    const m = new Map<string, ReturnType<typeof computeCardValue>>();
    for (const h of held) {
      const c = db.cardById.get(h.card_id);
      if (!c) continue;
      m.set(h.card_id, computeCardValue(c, h, initialProfile, signals, db));
    }
    return m;
  }, [held, db, initialProfile, signals]);

  const totalFound = useMemo(() => {
    let s = 0;
    for (const h of held) {
      if (h.found_money_cached_usd != null) {
        s += h.found_money_cached_usd;
        continue;
      }
      const cv = cardValues.get(h.card_id);
      if (cv) s += cv.confirmed_usd;
    }
    return s;
  }, [held, cardValues]);

  const totalOnList = useMemo(() => {
    let s = 0;
    for (const h of held) {
      const cv = cardValues.get(h.card_id);
      if (cv) s += cv.projected_usd;
    }
    return s;
  }, [held, cardValues]);

  const totalFee = useMemo(() => {
    let s = 0;
    for (const h of held) {
      const c = db.cardById.get(h.card_id);
      if (!c) continue;
      s += c.annual_fee_usd ?? 0;
    }
    return s;
  }, [held, db]);

  function handlePick(card: Card) {
    if (heldIds.has(card.id)) {
      router.push(`/wallet/cards/${card.id}` as Route);
    } else {
      router.push(`/wallet/cards/${card.id}?new=1` as Route);
    }
  }

  const showEmpty = held.length === 0;

  return (
    <div className="wallet-edit-page">
<div className="page-head">
        <h1>Edit your wallet</h1>
        <p className="sub">
          Click any card to open its page — every signal you fill in
          tightens the audit math and surfaces more of what the card
          can do for you.
        </p>
        <Link href={"/signals" as Route} className="back-link">
          What we know about you →
        </Link>
      </div>

      {showEmpty ? (
        <EmptyState catalog={db.cards} onPick={handlePick} />
      ) : (
        <div className="wallet-list-pane">
          <SearchBar
            catalog={db.cards}
            heldIds={heldIds}
            onPick={handlePick}
          />
          <div className="list-head">
            <div className="list-head-left">
              <span className="eyebrow">
                Wallet · {held.length} card{held.length === 1 ? "" : "s"}
              </span>
              <span className="list-head-hint">tap to open card page</span>
              {totalOnList > 0 && (
                <Link href={"/wallet/list" as Route} className="list-head-link">
                  Open list →
                </Link>
              )}
            </div>
            <div className="wallet-stats">
              <div>
                <div className="stat">Found this year</div>
                <div className="val t-pos num">+{fmt.usd(totalFound)}</div>
              </div>
              {totalOnList > 0 && (
                <div>
                  <div className="stat">On your list</div>
                  <div className="val t-warn num">+{fmt.usd(totalOnList)}</div>
                </div>
              )}
              <div>
                <div className="stat">Annual fees</div>
                <div className="val num">−{fmt.usd(totalFee)}</div>
              </div>
            </div>
          </div>
          <div className="list-rows">
            {held.map((h) => {
              const c = db.cardById.get(h.card_id);
              if (!c) return null;
              const cv = cardValues.get(h.card_id);
              return (
                <WalletLinkRow
                  key={h.card_id}
                  card={c}
                  held={h}
                  found={cv?.confirmed_usd ?? 0}
                  onList={cv?.projected_usd ?? 0}
                  signalsFilled={cv?.signalsFilled ?? 0}
                  signalsTotal={cv?.signalsTotal ?? 0}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function WalletLinkRow({
  card,
  held,
  found,
  onList,
  signalsFilled,
  signalsTotal,
}: {
  card: Card;
  held: WalletCardHeld;
  found: number;
  onList: number;
  signalsFilled: number;
  signalsTotal: number;
}) {
  const fee = card.annual_fee_usd ?? 0;
  return (
    <Link href={`/wallet/cards/${card.id}` as Route} className="wallet-row">
      <CardArt
        variant={variantForCard(card)}
        issuer={card.issuer}
        network={card.network ?? undefined}
        size="md"
      />
      <div className="wallet-row-body">
        <div className="name">{held.nickname || card.name}</div>
        <div className="meta">
          <span>{card.issuer}</span>
          <span className="dot">·</span>
          <span>{fee === 0 ? "No fee" : `${fmt.usd(fee)}/yr`}</span>
          {held.opened_at && (
            <>
              <span className="dot">·</span>
              <span>{formatOpened(held.opened_at)}</span>
            </>
          )}
        </div>
      </div>
      <div className="wallet-row-right">
        <div className="found-chip">
          <span className="amt num">{fmt.usd(found)}</span>
          <span>found</span>
        </div>
        {onList > 0 && (
          <div className="onlist-chip">
            <span className="amt num">{fmt.usd(onList)}</span>
            <span>on list</span>
          </div>
        )}
        <div className="af-line">
          {signalsFilled}/{signalsTotal} signals
        </div>
      </div>
    </Link>
  );
}
