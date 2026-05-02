"use client";

// Collapsible wallet/trying row used by the rec panel sidebars.
//
// Two modes share one component because the visual + math are the same,
// only the verbs differ:
//   - mode="owned"   "contributes +$X/yr" / "Drop this card → wallet drops to +$Y"
//   - mode="trial"   "would add +$X/yr"   / "Add this card → wallet would total +$Y"
//
// Marginal value is computed via scoreCard against the appropriate
// baseline. Engine is pure (CLAUDE.md), so per-card scoring on render is
// cheap; we don't precompute server-side.

import { useMemo, useState } from "react";
import { Money } from "@/components/perks/Money";
import { Section } from "@/components/perks/Section";
import { ValuePillars } from "@/components/perks/ValuePillars";
import { CardSwatch } from "@/components/perks/CardSwatch";
import { SPEND_CATEGORIES } from "@/lib/categories";
import type { Card, CardDatabase } from "@/lib/data/loader";
import { variantForCard } from "@/lib/cardArt";
import { scoreCard } from "@/lib/engine/scoring";
import type { ScoringOptions, UserProfile, WalletCardHeld } from "@/lib/engine/types";
import { fmt, heatColor, heatTextColor } from "@/lib/utils/format";

type Mode = "owned" | "trial";

interface Props {
  card: Card;
  mode: Mode;
  // Held wallet (excluding this card if mode="owned"; just held cards
  // if mode="trial"). The component scores `card` against this baseline
  // to derive the marginal contribution shown in the headline + pillars.
  baselineWallet: WalletCardHeld[];
  // Current wallet net (perks-inclusive, matching the wallet header).
  // For owned mode this is the *full* wallet net including this card —
  // we project the drop by subtracting score.deltaOngoing. For trial
  // mode this is the held-only wallet net; we project the add by
  // adding score.deltaOngoing.
  currentWalletNet: number;
  profile: UserProfile;
  db: CardDatabase;
  scoringOptions: ScoringOptions;
  // Action callbacks. The owning panel handles persistence + state.
  onRemove?: () => void;     // mode="owned" → remove from wallet
  onPromote?: () => void;    // mode="trial" → "I have this card"
  onUntry?: () => void;      // mode="trial" → drop trial
}

export function WalletRow({
  card,
  mode,
  baselineWallet,
  currentWalletNet,
  profile,
  db,
  scoringOptions,
  onRemove,
  onPromote,
  onUntry,
}: Props) {
  const [open, setOpen] = useState(false);

  // Marginal score: what does adding `card` to baselineWallet contribute?
  // For owned cards the baseline is the wallet WITHOUT this card, so the
  // delta is "what we'd lose if dropped"; for trials the baseline is the
  // held wallet, so the delta is "what we'd gain if added".
  const score = useMemo(
    () => scoreCard(card, profile, baselineWallet, db, scoringOptions),
    [card, profile, baselineWallet, db, scoringOptions],
  );

  const isOwned = mode === "owned";
  const fee = card.annual_fee_usd ?? 0;
  // Split the issuer string at the first parenthesis so disclaimers like
  // "Goldman Sachs (transitioning to alternate issuer in 2026 — verify)"
  // become "Goldman Sachs" + a separate ⚠ line. Stopgap until the schema
  // grows a proper display_warning field.
  const { issuerClean, issuerWarning } = useMemo(
    () => splitIssuerWarning(card.issuer),
    [card.issuer],
  );

  const projected = isOwned
    ? currentWalletNet - score.deltaOngoing
    : currentWalletNet + score.deltaOngoing;
  const headlineLabel = isOwned ? "contributes" : "would add";
  const headlineSuffix = isOwned ? "/yr" : "/yr if added";
  const swatchVariant = variantForCard(card);

  return (
    <div
      style={{
        border: isOwned ? "1px solid var(--rule)" : "1px dashed var(--rule-2)",
        borderRadius: 10,
        background: open ? "white" : "transparent",
        transition: "background 120ms",
        overflow: "hidden",
      }}
    >
      {/* COLLAPSED HEADER (always visible — clickable region) */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: "100%",
          background: "transparent",
          border: 0,
          padding: "10px 12px",
          cursor: "pointer",
          fontFamily: "inherit",
          color: "inherit",
          textAlign: "left",
          display: "grid",
          gridTemplateColumns: "auto 1fr 14px",
          alignItems: "start",
          gap: 12,
        }}
      >
        <CardSwatch
          variant={swatchVariant}
          width={22}
          // Nudge down so the swatch's vertical center sits on the card-name
          // text baseline rather than its top edge — reads as "next to" the
          // name even though the grid is top-aligned.
          style={{ marginTop: 2 }}
        />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {card.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              display: "flex",
              gap: 6,
              alignItems: "baseline",
              flexWrap: "wrap",
            }}
          >
            <span>{issuerClean}</span>
            <span>·</span>
            <span>{fee === 0 ? "No fee" : `$${fee}/yr`}</span>
            <span>·</span>
            <span
              style={{
                color: score.deltaOngoing >= 0 ? "var(--pos)" : "var(--neg)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {headlineLabel}{" "}
              {score.deltaOngoing >= 0 ? "+" : "−"}
              {fmt.usd(Math.abs(score.deltaOngoing))}
              {headlineSuffix}
            </span>
          </div>
          {issuerWarning && (
            <div
              style={{
                fontSize: 10.5,
                color: "var(--warn-ink, var(--ink-4))",
                marginTop: 2,
                lineHeight: 1.35,
              }}
            >
              ⚠ {issuerWarning}
            </div>
          )}
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

      {/* EXPANDED PANEL */}
      {open && (
        <div style={{ padding: "4px 14px 14px" }}>
          {/* Headline mono row matching DrillIn's NET / YEAR treatment */}
          <div
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              marginTop: 2,
              fontFamily: "var(--font-mono), ui-monospace, monospace",
              display: "flex",
              gap: 8,
              alignItems: "baseline",
            }}
          >
            <span>NET / YEAR</span>
            <Money value={score.deltaOngoing} sign size="sm" />
          </div>

          {/* SPEND / PERKS pillars — same component, same tones as DrillIn */}
          <div style={{ marginTop: 8 }}>
            <ValuePillars
              components={score.components}
              view="ongoing"
              variant="list-stacked"
            />
          </div>

          <Section num="1" title="Spend impact" compact>
            <SpendImpactMini score={score} mode={mode} />
          </Section>

          {score.newPerks.filter((p) => p.value !== 0).length > 0 && (
            <Section
              num="2"
              title={isOwned ? "Perks active" : "New perks gained"}
              compact
            >
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {score.newPerks
                  .filter((p) => p.value !== 0)
                  .map((p) => (
                    <li
                      key={p.name}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        alignItems: "baseline",
                        gap: 12,
                        padding: "6px 0",
                        borderBottom: "1px solid var(--rule)",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{p.name}</div>
                        {p.note && (
                          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                            {p.note}
                          </div>
                        )}
                      </div>
                      <div
                        className="mono"
                        style={{
                          fontSize: 12,
                          color: "var(--pos)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.value === "unlocks" ? "unlocks" : `+$${p.value}`}
                      </div>
                    </li>
                  ))}
              </ul>
            </Section>
          )}

          {/* FOOTER — consequence summary + action button(s) */}
          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: "1px solid var(--rule)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 11.5,
                color: "var(--ink-2)",
                lineHeight: 1.5,
                fontFamily: "var(--font-mono), ui-monospace, monospace",
              }}
            >
              {isOwned ? (
                <>
                  Drop this card → wallet drops to{" "}
                  <span
                    style={{
                      color: projected >= 0 ? "var(--pos)" : "var(--neg)",
                      fontWeight: 600,
                    }}
                  >
                    {projected >= 0 ? "+" : "−"}
                    {fmt.usd(Math.abs(projected))}/yr
                  </span>
                </>
              ) : (
                <>
                  Add this card → wallet would total{" "}
                  <span
                    style={{
                      color: projected >= 0 ? "var(--pos)" : "var(--neg)",
                      fontWeight: 600,
                    }}
                  >
                    {projected >= 0 ? "+" : "−"}
                    {fmt.usd(Math.abs(projected))}/yr
                  </span>
                </>
              )}
            </div>

            {isOwned ? (
              <button
                type="button"
                className="btn"
                style={{ justifyContent: "center", width: "100%" }}
                onClick={onRemove}
              >
                Remove from wallet
              </button>
            ) : (
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: "center", fontSize: 11.5 }}
                  onClick={onPromote}
                >
                  I have this card
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ justifyContent: "center", fontSize: 11.5 }}
                  onClick={onUntry}
                >
                  Drop trial
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Spend impact mini-table — same heat-cell layout as DrillIn but without
// the per-row caret-into-SpendMath drilldown (kept simpler for the wallet
// expansion). Owned cards show just the rate; trial cards show before→after.
function SpendImpactMini({
  score,
  mode,
}: {
  score: ReturnType<typeof scoreCard>;
  mode: Mode;
}) {
  const showDelta = mode === "trial";
  const rows = SPEND_CATEGORIES.map((c) => ({
    category: c,
    impact: score.spendImpact[c.id],
  })).filter((r) => r.impact && r.impact.spend > 0);
  // Sort by delta desc (biggest wins first), then spend size as tiebreak.
  rows.sort((a, b) => {
    if (b.impact.delta !== a.impact.delta) return b.impact.delta - a.impact.delta;
    return b.impact.spend - a.impact.spend;
  });

  if (rows.length === 0) {
    return (
      <div style={{ fontSize: 11.5, color: "var(--ink-3)", padding: "6px 0", lineHeight: 1.5 }}>
        No active spend categories on file.
      </div>
    );
  }

  return (
    <div>
      {rows.map((row) => {
        const cur = row.impact.current;
        const nw = row.impact.new;
        // For owned cards the "current" rate IS this card's contribution
        // (it's already in the wallet → cur reflects the best held rate
        // including this card). For trials, cur excludes the trial.
        const display = showDelta ? cur : Math.max(cur, nw);
        const target = showDelta ? nw : null;
        const winning = showDelta && nw > cur;
        const bg = heatColor(display);
        const txt = heatTextColor(Math.max(cur, nw));
        return (
          <div
            key={row.category.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              columnGap: 10,
              padding: "6px 0",
              borderBottom: "1px solid var(--rule)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11.5,
                  color: "var(--ink-2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ color: "var(--ink-4)", fontSize: 11, width: 10, textAlign: "center" }}>
                  {row.category.icon}
                </span>
                {row.category.label}
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 3 }}>
                <div
                  className="hm-cell"
                  style={{
                    background: bg,
                    color: txt,
                    height: 16,
                    width: 40,
                    opacity: showDelta ? 0.55 : 1,
                    fontSize: 10,
                  }}
                >
                  {fmt.pct(display)}
                </div>
                {showDelta && target !== null && (
                  <>
                    <span
                      style={{
                        color: "var(--ink-4)",
                        fontSize: 10,
                        fontFamily: "var(--font-mono), ui-monospace, monospace",
                      }}
                    >
                      →
                    </span>
                    <div
                      className="hm-cell"
                      style={{
                        background: heatColor(target),
                        color: txt,
                        height: 16,
                        width: 40,
                        outline: winning ? "1.5px solid var(--pos)" : "none",
                        outlineOffset: -1.5,
                        fontWeight: winning ? 600 : 500,
                        fontSize: 10,
                      }}
                    >
                      {fmt.pct(target)}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div
              className="mono"
              style={{
                fontSize: 13,
                textAlign: "right",
                whiteSpace: "nowrap",
                color: row.impact.delta > 0 ? "var(--pos)" : "var(--ink-4)",
                fontWeight: row.impact.delta > 0 ? 600 : 400,
              }}
            >
              {row.impact.delta > 0 ? `+$${row.impact.delta.toLocaleString()}` : "—"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Pull a parenthetical disclaimer out of an issuer string. The Apple Card
// has its issuer literally set to
//   "Goldman Sachs (transitioning to alternate issuer in 2026 — verify)"
// which we render as a separate ⚠ line. Cards with a normal issuer field
// pass through unchanged.
function splitIssuerWarning(issuer: string): { issuerClean: string; issuerWarning: string | null } {
  const m = issuer.match(/^([^(]+?)\s*\((.+)\)\s*$/);
  if (!m) return { issuerClean: issuer, issuerWarning: null };
  return { issuerClean: m[1].trim(), issuerWarning: m[2].trim() };
}
