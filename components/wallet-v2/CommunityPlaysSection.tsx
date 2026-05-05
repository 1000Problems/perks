"use client";

// Section 3 — "From the community". Sweet-spot redemptions and wallet
// hacks that aren't promised by the issuer or the card network. Sourced
// from blogs, YouTube, Reddit. Card data lives on card.community_plays
// (not card.card_plays); the engine concatenates both arrays so per-row
// dollar figures and the projected-rewards header stay consistent.
//
// Rendered as two sub-stacks so the page reads as two distinct asks:
//   - Good redemptions  (value_model.kind === "transfer_redemption")
//                       → "where can I go?"
//   - Wallet plays      (everything else: system_mechanic, niche_play, …)
//                       → "what should I do this month?"
//
// Reuses MoneyFindRow so chip interactions (Using / On list / Skip)
// behave exactly like the catalog.

import type { Card } from "@/lib/data/loader";
import type { ScoredFind, FindStatus } from "@/lib/engine/moneyFind";
import { fmt } from "@/lib/utils/format";
import { MoneyFindRow } from "./MoneyFindRow";
import type { ResolvedSource } from "./perkSource";
import type { PerkFlag } from "@/lib/profile/server";

interface Props {
  card: Card;
  /** All scored finds for this card. We filter to community plays inside. */
  finds: ScoredFind[];
  onMarkFind: (playId: string, status: FindStatus) => void;
  onProbeClick: (promptId: string) => void;
  cardId: string;
  playSourceMap?: Map<string, ResolvedSource>;
  perkFlags?: Map<string, PerkFlag>;
}

interface SubStackProps {
  eyebrow: string;
  title: string;
  subline: string;
  finds: ScoredFind[];
  onMarkFind: (playId: string, status: FindStatus) => void;
  onProbeClick: (promptId: string) => void;
  cardId: string;
  playSourceMap?: Map<string, ResolvedSource>;
  perkFlags?: Map<string, PerkFlag>;
}

function SubStack({
  eyebrow,
  title,
  subline,
  finds,
  onMarkFind,
  onProbeClick,
  cardId,
  playSourceMap,
  perkFlags,
}: SubStackProps) {
  const visible = finds.filter((f) => f.visible);
  if (visible.length === 0) return null;

  // Conservative summary: numeric valueUsd when present; for transfer
  // redemptions (range only) take the low end. Same convention
  // CatalogGroup uses.
  const valueSum = visible.reduce((s, f) => {
    if (f.valueUsd != null) return s + f.valueUsd;
    if (f.valueRange != null) return s + f.valueRange[0];
    return s;
  }, 0);

  return (
    <section className="community-plays-substack">
      <header className="community-plays-substack-head">
        <span className="eyebrow">{eyebrow}</span>
        <h3 className="community-plays-substack-title">{title}</h3>
        <p className="community-plays-substack-subline">{subline}</p>
        {valueSum > 0 && (
          <div className="community-plays-substack-summary">
            ~{fmt.usd(valueSum)} in opportunities
          </div>
        )}
      </header>
      <div className="community-plays-substack-body">
        {visible.map((f) => {
          const rs = playSourceMap?.get(f.play.id);
          return (
            <MoneyFindRow
              key={f.play.id}
              find={f}
              onMark={(s) => onMarkFind(f.play.id, s)}
              onProbeClick={onProbeClick}
              cardId={cardId}
              resolvedSource={rs}
              myFlag={rs ? (perkFlags?.get(rs.perkName) ?? null) : null}
            />
          );
        })}
      </div>
    </section>
  );
}

export function CommunityPlaysSection({
  card,
  finds,
  onMarkFind,
  onProbeClick,
  cardId,
  playSourceMap,
  perkFlags,
}: Props) {
  const communityIds = new Set(
    (card.community_plays ?? []).map((p) => p.id),
  );
  const communityFinds = finds.filter((f) => communityIds.has(f.play.id));
  if (communityFinds.length === 0) return null;

  const transferFinds = communityFinds.filter(
    (f) => f.play.value_model.kind === "transfer_redemption",
  );
  const walletFinds = communityFinds.filter(
    (f) => f.play.value_model.kind !== "transfer_redemption",
  );

  return (
    <section className="community-plays-section" aria-label="From the community">
      <header className="community-plays-section-head">
        <span className="eyebrow">From the community</span>
        <h2 className="community-plays-section-title">
          How holders actually use this card
        </h2>
        <p className="community-plays-section-subline">
          Sourced from blogs, YouTube, and Reddit — not from Citi or
          Mastercard. Updated independently as new plays surface.
        </p>
      </header>

      <SubStack
        eyebrow="Transfer sweet spots"
        title="Good redemptions"
        subline="Where Citi ThankYou points punch above 1¢."
        finds={transferFinds}
        onMarkFind={onMarkFind}
        onProbeClick={onProbeClick}
        cardId={cardId}
        playSourceMap={playSourceMap}
        perkFlags={perkFlags}
      />

      <SubStack
        eyebrow="Process tactics"
        title="Wallet plays"
        subline="Setup tricks holders use to squeeze more out of the card."
        finds={walletFinds}
        onMarkFind={onMarkFind}
        onProbeClick={onProbeClick}
        cardId={cardId}
        playSourceMap={playSourceMap}
        perkFlags={perkFlags}
      />
    </section>
  );
}
