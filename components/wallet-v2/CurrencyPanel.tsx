"use client";

// CurrencyPanel — editable cpp values for the program this card earns
// into. CLAUDE.md doctrine: User-driven cpp. Each currency program
// (Citi TY, Amex MR, Chase UR, Capital One Miles, Bilt, plus airline
// and hotel programs) ships with default cpps and is overridable per
// user. Edits flow into perks_point_value_overrides via
// setProgramCppOverride and propagate to every card in the wallet
// earning the same program.
//
// Two layouts based on program type:
//   - "transferable" — bank currencies that transfer 1:1 to airline
//     and hotel partners. Three editable rows: Cash / Travel portal /
//     Typical transfer.
//   - "loyalty" — airline miles and hotel points; redemption is the
//     only meaningful value. One editable row.
//
// The headline value (the cpp the engine actually uses for scoring) is
// whichever input has the highest filled value. The badge follows the
// engine — under the default `transfers` redemption_style the engine
// reads transfer first, so when transfer is filled it carries the
// badge; otherwise portal; otherwise cash.
//
// Saving: 600ms debounce after the input changes. Optimistic local
// update; on server error, the server reconciles on the next page
// load. The "Reset to defaults" link clears the user's overrides for
// this program (DELETE row).

import { useEffect, useRef, useState, useTransition } from "react";
import type { Card, Program } from "@/lib/data/loader";
import {
  setProgramCppOverride,
  resetProgramCppOverrides,
} from "@/lib/profile/actions";
import type { ProgramCppOverride } from "@/lib/engine/programOverrides";

interface Props {
  card: Card;
  program: Program | undefined;
  /** User's stored override for this program. Null when none. */
  override: ProgramCppOverride | null;
  /** Notifies parent of the new effective override after a server save. */
  onOverrideChange: (
    programId: string,
    next: ProgramCppOverride | null,
  ) => void;
}

const SAVE_DEBOUNCE_MS = 600;
const MIN_CPP = 0.5;
const MAX_CPP = 5;

type CppField = "cash_cpp" | "portal_cpp" | "transfer_cpp";

export function CurrencyPanel({
  card,
  program,
  override,
  onOverrideChange,
}: Props) {
  if (!card.currency_earned || !program) return null;

  const programType = derivePanelType(program);
  if (programType === "hidden") return null;

  // Defaults from the program's shipped fields. Cash defaults to 1¢ for
  // transferables (statement-credit floor); portal/transfer pull from
  // their respective program columns.
  const defaults = {
    cash: programType === "transferable" ? 1 : null,
    portal: program.portal_redemption_cpp ?? null,
    transfer:
      program.median_redemption_cpp ?? program.fixed_redemption_cpp ?? null,
  };

  // Effective values: override wins, else default.
  const effective = {
    cash: override?.cash_cpp ?? defaults.cash,
    portal: override?.portal_cpp ?? defaults.portal,
    transfer: override?.transfer_cpp ?? defaults.transfer,
  };

  const headline = pickHeadline(effective);
  const hasAnyOverride =
    override !== null &&
    (override.cash_cpp != null ||
      override.portal_cpp != null ||
      override.transfer_cpp != null);

  // Design pass 2026-05: transfer-partner list removed. Was a wall of
  // tags above the cpp inputs that hijacked attention; the program's
  // transfer story now lives in the per-perk why-sentences below.

  return (
    <section className="currency-panel" aria-label="Your points portal">
      <div className="currency-panel-head">
        <span className="eyebrow">Your points portal</span>
        <h2 className="currency-panel-name">{program.name}</h2>
        <p className="currency-panel-sub">
          This card earns into your {program.name} balance. Edits below
          propagate to every {shortName(program)} card in your wallet.
        </p>
      </div>

      <div className="currency-panel-values">
        {programType === "transferable" ? (
          <>
            <CppRow
              label="Cash"
              field="cash_cpp"
              programId={program.id}
              value={override?.cash_cpp ?? null}
              effective={effective.cash}
              defaultValue={defaults.cash}
              isHeadline={headline === "cash"}
              onSaved={onOverrideChange}
              currentOverride={override}
            />
            <CppRow
              label={`${program.issuer} travel portal`}
              field="portal_cpp"
              programId={program.id}
              value={override?.portal_cpp ?? null}
              effective={effective.portal}
              defaultValue={defaults.portal}
              isHeadline={headline === "portal"}
              onSaved={onOverrideChange}
              currentOverride={override}
            />
            <CppRow
              label="Typical transfer"
              field="transfer_cpp"
              programId={program.id}
              value={override?.transfer_cpp ?? null}
              effective={effective.transfer}
              defaultValue={defaults.transfer}
              isHeadline={headline === "transfer"}
              onSaved={onOverrideChange}
              currentOverride={override}
            />
          </>
        ) : (
          <CppRow
            label="Redemption"
            field="transfer_cpp"
            programId={program.id}
            value={override?.transfer_cpp ?? null}
            effective={effective.transfer}
            defaultValue={defaults.transfer}
            isHeadline
            onSaved={onOverrideChange}
            currentOverride={override}
          />
        )}
      </div>

      {hasAnyOverride && (
        <ResetButton
          programId={program.id}
          onReset={() => onOverrideChange(program.id, null)}
        />
      )}
    </section>
  );
}

interface CppRowProps {
  label: string;
  field: CppField;
  programId: string;
  /** Current override value for this field (null when unset). */
  value: number | null;
  /** Effective value (override ?? default) — what the input renders. */
  effective: number | null;
  /** Program-shipped default; used for the "default 1.9¢" hint. */
  defaultValue: number | null;
  isHeadline: boolean;
  /** Receives the latest override map after a server save. */
  onSaved: (programId: string, next: ProgramCppOverride | null) => void;
  /** Snapshot of the current override; used to emit the next state. */
  currentOverride: ProgramCppOverride | null;
}

function CppRow({
  label,
  field,
  programId,
  value,
  effective,
  defaultValue,
  isHeadline,
  onSaved,
  currentOverride,
}: CppRowProps) {
  const [draft, setDraft] = useState<string>(() => formatInputValue(effective));
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, startTransition] = useTransition();

  // Sync the draft when the effective value changes from outside (e.g.
  // reset-to-defaults clears the override).
  useEffect(() => {
    if (timer.current) return; // user is mid-edit; don't clobber
    setDraft(formatInputValue(effective));
  }, [effective]);

  function commit(rawValue: string) {
    const trimmed = rawValue.trim();
    let nextValue: number | null;
    if (trimmed === "") {
      nextValue = null;
    } else {
      const n = Number(trimmed);
      if (!Number.isFinite(n)) {
        setError("Enter a number between 0.5 and 5");
        return;
      }
      if (n < MIN_CPP || n > MAX_CPP) {
        setError(`Must be between ${MIN_CPP} and ${MAX_CPP}`);
        return;
      }
      nextValue = n;
    }
    setError(null);

    // Optimistic: tell the parent the new override shape immediately.
    const nextOverride: ProgramCppOverride = {
      cash_cpp: currentOverride?.cash_cpp ?? null,
      portal_cpp: currentOverride?.portal_cpp ?? null,
      transfer_cpp: currentOverride?.transfer_cpp ?? null,
      [field]: nextValue,
    } as ProgramCppOverride;
    const allNull =
      nextOverride.cash_cpp == null &&
      nextOverride.portal_cpp == null &&
      nextOverride.transfer_cpp == null;
    onSaved(programId, allNull ? null : nextOverride);

    startTransition(async () => {
      const result = await setProgramCppOverride(
        programId,
        field,
        nextValue,
      );
      if (!result.ok) {
        setError(result.detail ?? "Save failed");
      }
    });
  }

  function scheduleCommit(rawValue: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      commit(rawValue);
    }, SAVE_DEBOUNCE_MS);
  }

  function flushCommit(rawValue: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    commit(rawValue);
  }

  const showDefaultHint =
    value != null && defaultValue != null && Math.abs(value - defaultValue) > 1e-6;

  // Design pass 2026-05: explicit ▲/▼ steppers so the value reads as
  // editable, not as static metadata. 0.05¢ steps match the precision
  // users actually nudge cpp values by.
  const STEP = 0.05;
  const bump = (delta: number) => {
    const base =
      Number.isFinite(parseFloat(draft)) && draft.trim() !== ""
        ? parseFloat(draft)
        : (effective ?? defaultValue ?? MIN_CPP);
    const next = clamp(round2(base + delta), MIN_CPP, MAX_CPP);
    const str = next.toString();
    setDraft(str);
    flushCommit(str);
  };

  return (
    <div className="currency-cpp-row">
      <span className="currency-cpp-label">{label}</span>
      <span className="currency-cpp-input-wrap">
        <input
          type="number"
          inputMode="decimal"
          step={STEP}
          min={MIN_CPP}
          max={MAX_CPP}
          className="currency-cpp-input"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            scheduleCommit(e.target.value);
          }}
          onBlur={(e) => flushCommit(e.target.value)}
          aria-label={`${label} cents per point`}
        />
        <span className="currency-cpp-suffix">¢ / pt</span>
        <span className="currency-cpp-stepper" aria-hidden>
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Increase ${label}`}
            onClick={() => bump(STEP)}
          >
            ▲
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Decrease ${label}`}
            onClick={() => bump(-STEP)}
          >
            ▼
          </button>
        </span>
      </span>
      <span className="currency-cpp-tail">
        {isHeadline && (
          <span className="currency-cpp-badge">used for scoring</span>
        )}
        {showDefaultHint && (
          <span className="currency-cpp-default-hint">
            default {formatCpp(defaultValue)}
          </span>
        )}
      </span>
      {error && <span className="currency-cpp-error">{error}</span>}
    </div>
  );
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function ResetButton({
  programId,
  onReset,
}: {
  programId: string;
  onReset: () => void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className="currency-cpp-reset"
      disabled={pending}
      onClick={() => {
        // Optimistic local clear first.
        onReset();
        startTransition(async () => {
          await resetProgramCppOverrides(programId);
        });
      }}
    >
      Reset to defaults
    </button>
  );
}

// ── helpers ────────────────────────────────────────────────────────────

function derivePanelType(
  program: Program,
): "transferable" | "loyalty" | "hidden" {
  if (program.kind === "cash") return "hidden";
  // Transferable bank currencies have transfer partners. Cobrand
  // airline/hotel programs (United, Hilton, Marriott) carry kind="loyalty"
  // but no transfer partners — they only redeem within their own award
  // chart, so we collapse to a single Redemption row.
  if (program.transfer_partners.length > 0) return "transferable";
  return "loyalty";
}

function pickHeadline(values: {
  cash: number | null;
  portal: number | null;
  transfer: number | null;
}): "cash" | "portal" | "transfer" {
  // Engine's default redemption_style is "transfers", which prefers
  // transfer cpp first, then portal, then 1¢. Mirror that order so
  // the badge reflects what the engine actually uses.
  if (values.transfer != null && values.transfer > 0) return "transfer";
  if (values.portal != null && values.portal > 0) return "portal";
  return "cash";
}

function formatInputValue(v: number | null): string {
  if (v == null) return "";
  return Number(v.toFixed(3)).toString();
}

function formatCpp(cpp: number | null): string {
  if (cpp == null) return "—";
  if (Number.isInteger(cpp)) return `${cpp}¢`;
  return `${(Math.round(cpp * 10) / 10).toFixed(1)}¢`;
}

function shortName(program: Program): string {
  // Heuristic: pull the issuer-prefixed short form for the propagation
  // copy. Citi TY, Amex MR, Chase UR. Falls back to the full name.
  const map: Record<string, string> = {
    citi_thankyou: "Citi TY",
    amex_mr: "Amex MR",
    chase_ur: "Chase UR",
    capital_one_miles: "Cap One",
    bilt_rewards: "Bilt",
  };
  return map[program.id] ?? program.name;
}
