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
import { computeFoundMoneyV2 } from "@/lib/engine/foundMoney";
import { fmt } from "@/lib/utils/format";
import { CardArt } from "@/components/perks/CardArt";
import { variantForCard } from "@/lib/cardArt";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
  initialProfile: UserProfile;
  serializedDb: SerializedDb;
}

function formatOpened(iso: string): string {
  if (!iso) return "";
  const [y, m] = iso.split("-").map(Number);
  if (!y || !m) return "";
  return `opened ${MONTH[m - 1]} ${y}`;
}

export function EditWalletClient({ initialProfile, serializedDb }: Props) {
  const router = useRouter();
  const db = useMemo(() => fromSerialized(serializedDb), [serializedDb]);
  const held = initialProfile.cards_held ?? [];
  const heldIds = useMemo(() => new Set(held.map((h) => h.card_id)), [held]);

  const totalFound = useMemo(() => {
    let s = 0;
    for (const h of held) {
      if (h.found_money_cached_usd != null) {
        s += h.found_money_cached_usd;
        continue;
      }
      const c = db.cardById.get(h.card_id);
      if (!c) continue;
      s += computeFoundMoneyV2(c, h, initialProfile, db).point;
    }
    return s;
  }, [held, db, initialProfile]);

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
        <div>
          <h1>Edit your wallet</h1>
          <p className="sub">
            Click any card to open its page — every signal you fill in
            tightens the audit math and surfaces more of what the card
            can do for you.
          </p>
        </div>
        {!showEmpty && (
          <div className="wallet-stats">
            <div>
              <div className="stat">Found this year</div>
              <div className="val t-pos num">+{fmt.usd(totalFound)}</div>
            </div>
            <div>
              <div className="stat">Annual fees</div>
              <div className="val num">−{fmt.usd(totalFee)}</div>
            </div>
          </div>
        )}
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
            <span className="eyebrow">
              Wallet · {held.length} card{held.length === 1 ? "" : "s"}
            </span>
            <span className="list-head-hint">tap to open card page</span>
          </div>
          <div className="list-rows">
            {held.map((h) => {
              const c = db.cardById.get(h.card_id);
              if (!c) return null;
              return (
                <WalletLinkRow
                  key={h.card_id}
                  card={c}
                  held={h}
                  found={computeFoundMoneyV2(c, h, initialProfile, db).point}
                  signalsFilled={
                    computeFoundMoneyV2(c, h, initialProfile, db).signalsFilled
                  }
                  signalsTotal={
                    computeFoundMoneyV2(c, h, initialProfile, db).signalsTotal
                  }
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
  signalsFilled,
  signalsTotal,
}: {
  card: Card;
  held: WalletCardHeld;
  found: number;
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
        <div className="af-line">
          {signalsFilled}/{signalsTotal} signals
        </div>
      </div>
    </Link>
  );
}
