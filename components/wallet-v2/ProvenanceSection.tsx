"use client";

// Section 1 ("From Citi") and Section 2 ("Built into Mastercard World
// Elite") on the per-card hero page. Both render via this component;
// the only difference between Citi and Mastercard is the eyebrow /
// title / subline copy and which provider's plays the parent passes in.
//
// Body iterates ALL_GROUPS and renders one CatalogGroup per non-empty
// group, exactly as the legacy single-catalog layout did. Returns null
// when finds is empty so the network section vanishes when a card has
// no network plays.
//
// Earn-rate filter (multiplier_on_category) lives at the row level —
// kept here on parity with the pre-split behavior. Restoring earning
// rates is a separate TASK.

import type { Card } from "@/lib/data/loader";
import type {
  ScoredFind,
  FindStatus,
} from "@/lib/engine/moneyFind";
import {
  ALL_GROUPS,
  findsByGroup,
  isGroupSkipped,
} from "@/lib/engine/moneyFind";
import type { PlayGroupId } from "@/lib/data/loader";
import type { CardPlayState } from "@/lib/profile/types";
import { CatalogGroup } from "./CatalogGroup";
import type { ResolvedSource } from "./perkSource";
import type { PerkFlag } from "@/lib/profile/server";

interface DisabledBenefit {
  id: string;
  name: string;
  reason: string;
  evidence_url: string;
}

interface Props {
  eyebrow: string;
  title: string;
  subline: string;
  card: Card;
  /** Already filtered to a single provider by the parent. */
  finds: ScoredFind[];
  playState: CardPlayState[];
  onMarkFind: (playId: string, status: FindStatus) => void;
  onProbeClick: (promptId: string) => void;
  onToggleGroupSkip: (group: PlayGroupId) => void;
  cardId: string;
  playSourceMap?: Map<string, ResolvedSource>;
  perkFlags?: Map<string, PerkFlag>;
  /**
   * Network advertises but issuer doesn't enable. Renders as a muted
   * footer block below the catalog groups. Section 2 only — pass
   * `card.disabled_network_benefits`. Section 1 leaves this undefined.
   */
  disabled?: DisabledBenefit[];
}

export function ProvenanceSection({
  eyebrow,
  title,
  subline,
  finds,
  playState,
  onMarkFind,
  onProbeClick,
  onToggleGroupSkip,
  cardId,
  playSourceMap,
  perkFlags,
  disabled,
}: Props) {
  const hasDisabled = (disabled?.length ?? 0) > 0;
  if (finds.length === 0 && !hasDisabled) return null;

  const groupedFinds = findsByGroup(finds);

  // Pre-decide which groups have anything to render so we can skip the
  // section entirely when filtered down to zero visible rows (e.g. all
  // network plays exist but the engine marked them invisible).
  const renderableGroups: { group: PlayGroupId; finds: ScoredFind[] }[] = [];
  for (const group of ALL_GROUPS) {
    const groupFinds = (groupedFinds.get(group) ?? []).filter(
      // v3 parity: earn-rate plays are filtered out at the row level.
      (f) => f.play.value_model.kind !== "multiplier_on_category",
    );
    if (groupFinds.length === 0) continue;
    renderableGroups.push({ group, finds: groupFinds });
  }
  if (renderableGroups.length === 0 && !hasDisabled) return null;

  return (
    <section className="provenance-section" aria-label={title}>
      <header className="provenance-section-head">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="provenance-section-title">{title}</h2>
        <p className="provenance-section-subline">{subline}</p>
      </header>

      <div className="provenance-section-body">
        {renderableGroups.map(({ group, finds: groupFinds }) => {
          // Editorial layout — surface a single source link in the
          // group head, taken from the first row in the group that has
          // a resolved source.
          const firstSource = groupFinds
            .map((f) => playSourceMap?.get(f.play.id))
            .find((s) => s?.source?.url);
          return (
            <CatalogGroup
              key={group}
              group={group}
              finds={groupFinds}
              skipped={isGroupSkipped(playState, group)}
              onToggleGroupSkip={() => onToggleGroupSkip(group)}
              onMarkFind={onMarkFind}
              onProbeClick={onProbeClick}
              cardId={cardId}
              playSourceMap={playSourceMap}
              perkFlags={perkFlags}
              groupSourceUrl={firstSource?.source?.url}
              groupSourceLabel={firstSource?.source?.label ?? "source"}
            />
          );
        })}

        {hasDisabled && (
          <div className="provenance-disabled-block">
            <header className="provenance-disabled-head">
              <span className="eyebrow">Network advertises, issuer doesn&apos;t enable</span>
              <p className="provenance-disabled-subline">
                Mastercard publishes these for World Elite cards, but Citi
                doesn&apos;t activate them on this product.
              </p>
            </header>
            <ul className="provenance-disabled-list">
              {disabled!.map((d) => (
                <li key={d.id} className="provenance-disabled-row">
                  <div className="provenance-disabled-name">{d.name}</div>
                  <div className="provenance-disabled-reason">{d.reason}</div>
                  <a
                    href={d.evidence_url}
                    target="_blank"
                    rel="noreferrer"
                    className="provenance-disabled-link"
                  >
                    source ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
