// Three-pillar value split for the recommendation hero.
//
// CASH (statement-credit dollars from spend), POINTS (loyalty currency,
// headline is a point count, caption shows the dollar value at portal
// cpp), PERKS (annual credits + ongoing perks, claim-conditional).
// Splitting cash from points stops a 3x UR card from masquerading as a
// 6% cashback card — they earn very different things per dollar spent.
//
// Variants:
//   - "list"          compact, side-by-side, used in legacy ranked card list
//   - "list-stacked"  vertical, used where horizontal width is tight
//   - "hero"          larger, used in the drill-in detail panel
//   - "band"          full-width 3-column grid, sits beneath the card
//                     identity row in the new two-row recommendation card
//
// Fee renders as a small negative subtotal beneath. Year-1 SUB (when
// view === "year1") renders as a small +$/+pts badge so the year-1
// view doesn't double-count or hide it.

import type { CardScoreComponents, PointsBucket } from "@/lib/engine/types";
import { fmt } from "@/lib/utils/format";

type Variant = "list" | "list-stacked" | "hero" | "band";
type View = "ongoing" | "year1";

interface Props {
  components: CardScoreComponents;
  view: View;
  variant: Variant;
}

const SIZES: Record<Variant, { num: number; ptsNum: number; label: number; sub: number; gap: number }> = {
  // Side-by-side, full row right rail (legacy desktop list). Pts headline
  // uses a slightly smaller number than $ headlines so a five-digit pts
  // count doesn't blow the row.
  list: { num: 22, ptsNum: 18, label: 9.5, sub: 10, gap: 12 },
  // Vertically stacked, label inline with the number — used on mobile.
  "list-stacked": { num: 18, ptsNum: 16, label: 9.5, sub: 9.5, gap: 4 },
  // Big hero version for the detail panel.
  hero: { num: 36, ptsNum: 30, label: 10.5, sub: 11, gap: 22 },
  // Full-width band beneath the identity row. Numbers sit between list
  // and hero in size — generous because the band finally has the room.
  band: { num: 24, ptsNum: 20, label: 10, sub: 10.5, gap: 16 },
};

function fmtPts(n: number): string {
  if (n >= 10000) {
    const k = n / 1000;
    return (k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")) + "k";
  }
  return n.toLocaleString("en-US");
}

export function ValuePillars({ components, view, variant }: Props) {
  const { cashOngoing, pointsOngoing, brandFitOngoing, perksOngoing, feeOngoing, subYear1, subYear1Detail } = components;
  const sz = SIZES[variant];
  const showSub = view === "year1" && subYear1 > 0;
  const showFee = feeOngoing < 0;
  const showBrandFit = brandFitOngoing != null && brandFitOngoing.valueUsd > 0;
  const isList = variant === "list" || variant === "list-stacked";
  const align = isList ? "flex-end" : "flex-start";

  // Band variant: full-width 3-column grid. Each cell is a left-aligned
  // pillar (label, big number, caption). Brand-fit (cobrand soft value)
  // hangs as a muted line beneath the pillars, left-aligned so it
  // anchors visually under CASH — that's the bucket users would
  // otherwise expect it in. Fee/SUB caption strip is right-aligned and
  // sits on the same row so it tucks under PERKS.
  if (variant === "band") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: sz.gap,
            alignItems: "flex-start",
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
        {(showFee || showSub || showBrandFit) && (
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: sz.sub,
              color: "var(--ink-3)",
              fontFamily: "var(--font-mono), ui-monospace, monospace",
              alignItems: "baseline",
            }}
          >
            {showBrandFit && (
              <BrandFitCaption bucket={brandFitOngoing!} />
            )}
            <div style={{ flex: 1 }} />
            {showSub && (
              <span style={{ color: "var(--ink-2)" }}>
                {subYear1Caption(subYear1, subYear1Detail)}
              </span>
            )}
            {showFee && (
              <span style={{ color: "var(--neg)" }}>
                −{fmt.usd(Math.abs(feeOngoing))} fee
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

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
        {(showFee || showSub || showBrandFit) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 2,
              fontSize: sz.sub,
              color: "var(--ink-3)",
              marginTop: 2,
              fontFamily: "var(--font-mono), ui-monospace, monospace",
            }}
          >
            {showBrandFit && (
              <BrandFitCaption bucket={brandFitOngoing!} />
            )}
            <div style={{ display: "flex", gap: 8 }}>
              {showSub && (
                <span style={{ color: "var(--ink-2)" }}>
                  {subYear1Caption(subYear1, subYear1Detail)}
                </span>
              )}
              {showFee && (
                <span style={{ color: "var(--neg)" }}>
                  −{fmt.usd(Math.abs(feeOngoing))} fee
                </span>
              )}
            </div>
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

      {(showFee || showSub || showBrandFit) && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: sz.sub,
            color: "var(--ink-3)",
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            // Match the row of pillars above so the captions don't
            // drift left or right of them.
            alignItems: isList ? "flex-end" : "flex-start",
            width: isList ? "100%" : undefined,
          }}
        >
          {showBrandFit && (
            <BrandFitCaption bucket={brandFitOngoing!} />
          )}
          <div style={{ display: "flex", gap: 10 }}>
            {showSub && (
              <span style={{ color: "var(--ink-2)" }}>
                {subYear1Caption(subYear1, subYear1Detail)}
              </span>
            )}
            {showFee && (
              <span style={{ color: "var(--neg)" }}>
                −{fmt.usd(Math.abs(feeOngoing))} fee
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Muted secondary line for cobrand soft value. Sits beneath the pillar
// row, left-aligned (band) or right-aligned (list-stacked). Format:
//   "+$80 cobrand fit · the only Visa Costco accepts, 2% on warehouse runs"
// Lighter than the green CASH pillar — same gray as fee/SUB captions —
// so the user reads it as an estimate, not a calculated dollar value.
function BrandFitCaption({ bucket }: { bucket: { valueUsd: number; brand: string; whyPhrase: string } }) {
  return (
    <span style={{ color: "var(--ink-3)" }}>
      ~{fmt.usd(bucket.valueUsd)} {bucket.brand} fit
      <span style={{ color: "var(--ink-4)" }}> · {bucket.whyPhrase}</span>
    </span>
  );
}

// SUB caption — split format when loyalty (shows pts + $), simpler when cash.
function subYear1Caption(
  subYear1: number,
  subYear1Detail: CardScoreComponents["subYear1Detail"],
): string {
  if (subYear1Detail && subYear1Detail.mode === "loyalty" && subYear1Detail.pts > 0) {
    return `+${fmtPts(subYear1Detail.pts)} pts y1 (≈${fmt.usd(subYear1)})`;
  }
  return `+${fmt.usd(subYear1)} SUB y1`;
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
          ≈ {fmt.usd(points!.valueUsd)}
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
        {isZero ? "—" : `≈ ${fmt.usd(points!.valueUsd)} portal`}
      </span>
    </div>
  );
}
