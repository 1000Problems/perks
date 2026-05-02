// Three-pillar value split for the recommendation hero.
//
// CASH (statement-credit dollars from spend), POINTS (loyalty currency,
// headline is a point count, caption shows the dollar value at portal
// cpp), PERKS (annual credits + ongoing perks, claim-conditional).
// Splitting cash from points stops a 3x UR card from masquerading as a
// 6% cashback card — they earn very different things per dollar spent.
//
// Variants:
//   - "list"          compact, side-by-side, used in the ranked card list
//   - "list-stacked"  vertical, used on mobile where horizontal width is tight
//   - "hero"          larger, used in the drill-in detail panel
//
// Fee renders as a small negative subtotal beneath. Year-1 SUB (when
// view === "year1") renders as a small +$/+pts badge so the year-1
// view doesn't double-count or hide it.

import type { CardScoreComponents, PointsBucket } from "@/lib/engine/types";
import { fmt } from "@/lib/utils/format";

type Variant = "list" | "list-stacked" | "hero";
type View = "ongoing" | "year1";

interface Props {
  components: CardScoreComponents;
  view: View;
  variant: Variant;
}

const SIZES: Record<Variant, { num: number; ptsNum: number; label: number; sub: number; gap: number }> = {
  // Side-by-side, full row right rail (desktop list). Pts headline uses
  // a slightly smaller number than $ headlines so a five-digit pts
  // count doesn't blow the row.
  list: { num: 22, ptsNum: 18, label: 9.5, sub: 10, gap: 12 },
  // Vertically stacked, label inline with the number — used on mobile.
  "list-stacked": { num: 18, ptsNum: 16, label: 9.5, sub: 9.5, gap: 4 },
  // Big hero version for the detail panel.
  hero: { num: 36, ptsNum: 30, label: 10.5, sub: 11, gap: 22 },
};

function fmtPts(n: number): string {
  if (n >= 10000) {
    const k = n / 1000;
    return (k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")) + "k";
  }
  return n.toLocaleString("en-US");
}

export function ValuePillars({ components, view, variant }: Props) {
  const { cashOngoing, pointsOngoing, perksOngoing, feeOngoing, subYear1, subYear1Detail } = components;
  const sz = SIZES[variant];
  const showSub = view === "year1" && subYear1 > 0;
  const showFee = feeOngoing < 0;
  const isList = variant === "list" || variant === "list-stacked";
  const align = isList ? "flex-end" : "flex-start";

  // Stacked variant: each pillar is one row, label inline with number.
  if (variant === "list-stacked") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
          fontFamily: "var(--font-mono), ui-monospace, monospace",
        }}
      >
        <PillarInlineCash
          label="CASH"
          value={cashOngoing}
          numSize={sz.num}
          labelSize={sz.label}
        />
        <PillarInlinePoints
          label="POINTS"
          points={pointsOngoing}
          numSize={sz.ptsNum}
          labelSize={sz.label}
          captionSize={sz.sub}
        />
        <PillarInlineCash
          label="PERKS"
          value={perksOngoing}
          numSize={sz.num}
          labelSize={sz.label}
          tone="conditional"
          captionRight={perksOngoing > 0 ? "if claimed" : undefined}
          captionSize={sz.sub}
        />
        {(showFee || showSub) && (
          <div
            style={{
              display: "flex",
              gap: 8,
              fontSize: sz.sub,
              color: "var(--ink-3)",
              marginTop: 2,
            }}
          >
            {showSub && (
              <span style={{ color: "var(--ink-2)" }}>
                {subYear1Caption(subYear1, subYear1Detail)}
              </span>
            )}
            {showFee && (
              <span style={{ color: "var(--neg)" }}>
                −${Math.abs(feeOngoing).toLocaleString()} fee
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        gap: isList ? 4 : 8,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: sz.gap,
          alignItems: "flex-end",
          // On the list variant, right-align so the pillars hug the row's
          // right edge; on the hero, left-align under the card name.
          justifyContent: isList ? "flex-end" : "flex-start",
        }}
      >
        <CashPillar
          label="CASH"
          value={cashOngoing}
          captionTop="from spending"
          numSize={sz.num}
          labelSize={sz.label}
          subSize={sz.sub}
          tone="confident"
        />
        <PointsPillar
          label="POINTS"
          points={pointsOngoing}
          numSize={sz.ptsNum}
          labelSize={sz.label}
          subSize={sz.sub}
        />
        <CashPillar
          label="PERKS"
          value={perksOngoing}
          captionTop="if claimed"
          numSize={sz.num}
          labelSize={sz.label}
          subSize={sz.sub}
          tone="conditional"
        />
      </div>

      {(showFee || showSub) && (
        <div
          style={{
            display: "flex",
            gap: 10,
            fontSize: sz.sub,
            color: "var(--ink-3)",
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            // Match the row of pillars above so the captions don't
            // drift left or right of them.
            justifyContent: isList ? "flex-end" : "flex-start",
            width: isList ? "100%" : undefined,
          }}
        >
          {showSub && (
            <span style={{ color: "var(--ink-2)" }}>
              {subYear1Caption(subYear1, subYear1Detail)}
            </span>
          )}
          {showFee && (
            <span style={{ color: "var(--neg)" }}>
              −${Math.abs(feeOngoing).toLocaleString()} fee
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// SUB caption — split format when loyalty (shows pts + $), simpler when cash.
function subYear1Caption(
  subYear1: number,
  subYear1Detail: CardScoreComponents["subYear1Detail"],
): string {
  if (subYear1Detail && subYear1Detail.mode === "loyalty" && subYear1Detail.pts > 0) {
    return `+${fmtPts(subYear1Detail.pts)} pts y1 (≈$${subYear1.toLocaleString()})`;
  }
  return `+$${subYear1.toLocaleString()} SUB y1`;
}

// ── inline (stacked) pillars ─────────────────────────────────────────

interface PillarInlineCashProps {
  label: string;
  value: number;
  numSize: number;
  labelSize: number;
  tone?: "confident" | "conditional";
  captionRight?: string;
  captionSize?: number;
}

function PillarInlineCash({
  label,
  value,
  numSize,
  labelSize,
  tone = "confident",
  captionRight,
  captionSize,
}: PillarInlineCashProps) {
  const numColor = numColorFor(value, tone);
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: labelSize, color: "var(--ink-4)", letterSpacing: "0.08em" }}>
        {label}
      </span>
      <span
        className="num"
        style={{
          fontSize: numSize,
          color: numColor,
          fontWeight: 400,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value > 0 ? "+" : ""}
        {fmt.usd(value)}
      </span>
      {captionRight && (
        <span style={{ fontSize: captionSize ?? 10, color: "var(--ink-3)" }}>
          {captionRight}
        </span>
      )}
    </div>
  );
}

interface PillarInlinePointsProps {
  label: string;
  points: PointsBucket | null;
  numSize: number;
  labelSize: number;
  captionSize?: number;
}

function PillarInlinePoints({
  label,
  points,
  numSize,
  labelSize,
  captionSize,
}: PillarInlinePointsProps) {
  const isZero = !points || points.pts <= 0;
  const numColor = isZero ? "var(--ink-4)" : "var(--ink)";
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: labelSize, color: "var(--ink-4)", letterSpacing: "0.08em" }}>
        {label}
      </span>
      <span
        className="num"
        style={{
          fontSize: numSize,
          color: numColor,
          fontWeight: 400,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {isZero ? "—" : `${fmtPts(points!.pts)} pts`}
      </span>
      {!isZero && (
        <span style={{ fontSize: captionSize ?? 10, color: "var(--ink-3)" }}>
          ≈ ${points!.valueUsd.toLocaleString()}
        </span>
      )}
    </div>
  );
}

// ── stacked (column) pillars ────────────────────────────────────────

function numColorFor(value: number, tone: "confident" | "conditional") {
  if (value === 0) return "var(--ink-4)";
  return tone === "confident" ? "var(--pos)" : "var(--ink-2)";
}

interface CashPillarProps {
  label: string;
  value: number;
  captionTop: string;
  numSize: number;
  labelSize: number;
  subSize: number;
  tone: "confident" | "conditional";
}

function CashPillar({
  label,
  value,
  captionTop,
  numSize,
  labelSize,
  subSize,
  tone,
}: CashPillarProps) {
  const numColor = numColorFor(value, tone);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0 }}>
      <span
        style={{
          fontSize: labelSize,
          color: "var(--ink-4)",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          letterSpacing: "0.08em",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </span>
      <span
        className="num"
        style={{
          fontSize: numSize,
          color: numColor,
          lineHeight: 1,
          fontWeight: 400,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value > 0 ? "+" : ""}
        {fmt.usd(value)}
      </span>
      <span
        style={{
          fontSize: subSize,
          color: "var(--ink-3)",
          marginTop: 4,
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          lineHeight: 1.2,
          opacity: value === 0 ? 0.55 : 1,
        }}
      >
        {value === 0 ? "—" : captionTop}
      </span>
    </div>
  );
}

interface PointsPillarProps {
  label: string;
  points: PointsBucket | null;
  numSize: number;
  labelSize: number;
  subSize: number;
}

function PointsPillar({
  label,
  points,
  numSize,
  labelSize,
  subSize,
}: PointsPillarProps) {
  const isZero = !points || points.pts <= 0;
  // Loyalty currency renders in a calm ink color (not green): it's not
  // statement-credit cash, so the eye shouldn't bank it as such.
  const numColor = isZero ? "var(--ink-4)" : "var(--ink)";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0 }}>
      <span
        style={{
          fontSize: labelSize,
          color: "var(--ink-4)",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          letterSpacing: "0.08em",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </span>
      <span
        className="num"
        style={{
          fontSize: numSize,
          color: numColor,
          lineHeight: 1,
          fontWeight: 400,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {isZero ? "—" : (
          <>
            {fmtPts(points!.pts)}
            <span style={{ fontSize: Math.max(numSize * 0.42, 10), color: "var(--ink-3)", marginLeft: 3 }}>
              pts
            </span>
          </>
        )}
      </span>
      <span
        style={{
          fontSize: subSize,
          color: "var(--ink-3)",
          marginTop: 4,
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          lineHeight: 1.2,
          opacity: isZero ? 0.55 : 1,
          whiteSpace: "nowrap",
        }}
      >
        {isZero ? "—" : `≈ $${points!.valueUsd.toLocaleString()} portal`}
      </span>
    </div>
  );
}
