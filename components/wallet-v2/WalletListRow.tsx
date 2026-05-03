"use client";

// One row in the wallet list. Card art on the left, card name + meta in
// the middle, found-money chip + signals fraction on the right. Click
// → opens the edit panel for this card.

import { CardArt } from "@/components/perks/CardArt";
import { variantForCard } from "@/lib/cardArt";
import type { Card } from "@/lib/data/loader";
import type { WalletCardHeld } from "@/lib/profile/types";
import type { FoundMoneyV2 } from "@/lib/engine/foundMoney";
import { fmt } from "@/lib/utils/format";

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
  card: Card;
  held: WalletCardHeld;
  found: FoundMoneyV2;
  active: boolean;
  onClick: () => void;
}

function formatOpened(iso: string): string {
  if (!iso) return "";
  const [y, m] = iso.split("-").map(Number);
  if (!y || !m) return "";
  return `opened ${MONTH[m - 1]} ${y}`;
}

export function WalletListRow({ card, held, found, active, onClick }: Props) {
  const fee = card.annual_fee_usd ?? 0;
  return (
    <button
      type="button"
      className="wallet-row"
      data-active={active ? "true" : "false"}
      onClick={onClick}
    >
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
          <span className="amt num">{fmt.usd(found.point)}</span>
          <span>found</span>
        </div>
        <div className="af-line">
          {found.signalsFilled}/{found.signalsTotal} signals
        </div>
      </div>
    </button>
  );
}
