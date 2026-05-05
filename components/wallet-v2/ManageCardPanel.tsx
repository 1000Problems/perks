"use client";

// ManageCardPanel — design-pass-2026-05 replacement for the dense numbered
// SignalsEditor cluster grid that used to live at the bottom of the
// per-card hero page. Compact 2-col admin form: key on the left, control
// on the right, muted hint inline. Same data + handlers as SignalsEditor;
// SignalsEditor stays in place because /wallet/edit's right pane still
// uses it.
//
// Surfaced fields (universal): nickname, opened-at display, welcome
// bonus, authorized users, next annual-fee post, pooling status,
// card status. Conditional fields (5x category, cobrand activity)
// render inline as additional admin rows when the card opts in.
//
// Per-credit claim list moves to the catalog area in a follow-up; this
// panel is settings-only.

import { useMemo, type ReactNode } from "react";
import type { Card } from "@/lib/data/loader";
import type { SpendCategoryId } from "@/lib/data/types";
import type { WalletCardHeld } from "@/lib/profile/types";
import { fmt } from "@/lib/utils/format";
import { MONTH_LABELS, parseYM } from "@/lib/utils/openedAt";
import { CategoryPicker } from "./CategoryPicker";
import type { CardPatch } from "./SignalsEditor";

interface Props {
  card: Card;
  held: WalletCardHeld;
  isNew: boolean;
  onPatch: (patch: CardPatch) => void;
  onCancel: () => void;
  onRemove: () => void;
  onSave: () => void;
}

export function ManageCardPanel({
  card,
  held,
  isNew,
  onPatch,
  onCancel,
  onRemove,
  onSave,
}: Props) {
  const fee = card.annual_fee_usd ?? 0;
  const isPoolEligible = Boolean(card.is_pool_spoke);
  const isCobrand = Boolean(card.is_cobrand);
  const acceptsCategory =
    Array.isArray(card.accepts_pinned_category) &&
    card.accepts_pinned_category.length > 0;

  const [openYear, openMonth] = parseYM(held.opened_at);
  const today = useMemo(() => new Date(), []);

  const openedLabel = useMemo(() => {
    if (!openYear || !openMonth) return null;
    return `${MONTH_LABELS[openMonth - 1]} ${openYear}`;
  }, [openYear, openMonth]);

  const openedDuration = useMemo(() => {
    if (!openYear || !openMonth) return null;
    const months =
      (today.getFullYear() - openYear) * 12 +
      (today.getMonth() + 1 - openMonth);
    if (months < 1) return "this month";
    const y = Math.floor(months / 12);
    const m = months % 12;
    return [y > 0 ? `${y}y` : null, m > 0 ? `${m}mo` : null]
      .filter(Boolean)
      .join(" ");
  }, [openYear, openMonth, today]);

  const afNext = useMemo(() => {
    if (!fee || !openYear || !openMonth) return null;
    const candidate = new Date(today.getFullYear(), openMonth - 1, 1);
    if (candidate <= today) candidate.setFullYear(today.getFullYear() + 1);
    return candidate;
  }, [fee, openYear, openMonth, today]);

  const status = held.card_status_v2 ?? "active";
  const statusLabel: Record<string, string> = {
    active: "Active",
    considering_close: "Considering closing",
    downgraded: "Downgraded",
    closed: "Closed",
  };
  const statusTone: Record<string, "default" | "warn" | "neg"> = {
    active: "default",
    considering_close: "warn",
    downgraded: "default",
    closed: "neg",
  };

  return (
    <section className="manage-panel" aria-label="Manage this card">
      <header className="manage-panel-head">
        <div className="manage-panel-head-l">
          <span className="eyebrow">Manage</span>
          <h2 className="manage-panel-title">Manage this card</h2>
          <p className="manage-panel-sub">
            Settings only — won&apos;t change your rewards math.{" "}
            <span
              className="manage-panel-status-pill"
              data-tone={statusTone[status]}
            >
              {statusLabel[status] ?? status}
            </span>
          </p>
        </div>
        <div className="manage-panel-actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onSave}>
            {isNew ? "Add card" : "Save changes"}
          </button>
        </div>
      </header>

      <div className="manage-grid">
        <Row k="Nickname">
          <input
            className="input"
            type="text"
            placeholder="e.g. Travel main"
            value={held.nickname ?? ""}
            onChange={(e) =>
              onPatch({ nickname: e.target.value || undefined })
            }
          />
        </Row>

        {openedLabel && (
          <Row k="Account opened">
            <span className="mono">{openedLabel}</span>
            {openedDuration && (
              <span className="muted small">{openedDuration}</span>
            )}
          </Row>
        )}

        <Row k="Welcome bonus">
          <Seg
            value={held.bonus_received === true ? "received" : "pending"}
            onChange={(v) => onPatch({ bonus_received: v === "received" })}
            options={[
              { id: "received", label: "Received" },
              { id: "pending", label: "Working on it" },
            ]}
          />
          <span className="muted small">
            {held.bonus_received === true
              ? "Counted in your past returns"
              : "Remaining welcome value still in your audit"}
          </span>
        </Row>

        <Row k="Authorized users">
          <NumberStepper
            value={held.authorized_users ?? 0}
            onChange={(v) => onPatch({ authorized_users: v })}
            min={0}
            max={5}
          />
          <span className="muted small">No fee on this card</span>
        </Row>

        {fee > 0 && afNext && (
          <Row k="Next fee posts">
            <span className="mono">
              {MONTH_LABELS[afNext.getMonth()]} {afNext.getFullYear()}
            </span>
            <span className="muted small">
              {fmt.usd(fee)} — set a 30-day reminder
            </span>
          </Row>
        )}

        {isPoolEligible && (
          <Row k="Pooled to premium card">
            <Seg
              value={(held.pool_status ?? "unknown") as string}
              onChange={(v) =>
                onPatch({
                  pool_status: v as WalletCardHeld["pool_status"],
                })
              }
              options={[
                { id: "yes", label: "Yes" },
                { id: "not_yet", label: "Not yet" },
                { id: "unknown", label: "Don't know" },
              ]}
            />
            <span className="muted small">
              Pooling preserves the 1:1 transfer ratio on no-AF feeders.
            </span>
          </Row>
        )}

        {acceptsCategory && (
          <Row k="5× category" wide>
            <CategoryPicker
              options={
                (card.accepts_pinned_category ?? []) as SpendCategoryId[]
              }
              value={
                (held.pinned_category ?? null) as SpendCategoryId | null
              }
              onChange={(v) => onPatch({ pinned_category: v ?? undefined })}
            />
          </Row>
        )}

        {isCobrand && (
          <Row k="Elite & cobrand activity" wide>
            <div className="manage-stack">
              <label className="check">
                <input
                  type="checkbox"
                  checked={Boolean(held.elite_reached)}
                  onChange={(e) =>
                    onPatch({ elite_reached: e.target.checked })
                  }
                />
                Elite status reached this year
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={Boolean(held.activity_threshold_met)}
                  onChange={(e) =>
                    onPatch({ activity_threshold_met: e.target.checked })
                  }
                />
                Required activity threshold met
              </label>
            </div>
          </Row>
        )}

        <Row k="Status" wide>
          <Seg
            value={status}
            onChange={(v) =>
              onPatch({
                card_status_v2:
                  v as WalletCardHeld["card_status_v2"],
              })
            }
            options={[
              { id: "active", label: "Active" },
              { id: "considering_close", label: "On the bubble" },
              { id: "downgraded", label: "Downgraded" },
              { id: "closed", label: "Closed" },
            ]}
          />
        </Row>
      </div>

      <footer className="manage-panel-foot">
        <button
          type="button"
          className="manage-remove-link"
          onClick={onRemove}
        >
          Remove this card from wallet
        </button>
      </footer>
    </section>
  );
}

// ── compact admin row ───────────────────────────────────────────────────

function Row({
  k,
  wide = false,
  children,
}: {
  k: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="manage-row" data-wide={wide ? "true" : "false"}>
      <div className="manage-row-k">{k}</div>
      <div className="manage-row-v">{children}</div>
    </div>
  );
}

// ── segmented control — purpose-built for admin (text-only, no chrome) ─

interface SegOption {
  id: string;
  label: string;
}
function Seg({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (next: string) => void;
  options: SegOption[];
}) {
  return (
    <div className="manage-seg" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className="manage-seg-btn"
          data-active={value === o.id ? "true" : "false"}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Local stepper — more compact than primitives.Stepper for admin grid.
function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 9,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="manage-stepper">
      <button
        type="button"
        aria-label="decrease"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        −
      </button>
      <span className="manage-stepper-val mono">{value}</span>
      <button
        type="button"
        aria-label="increase"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </button>
    </div>
  );
}
