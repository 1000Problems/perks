"use client";

// Small reusable primitives for the wallet-edit-v2 panel:
// Cluster (collapsible field group with a numbered tag), Toggle, Stepper,
// YesNo chip pair, Field label.
//
// All visual rules live in app/wallet-edit-v2.css. This file only owns
// behavior + minimal markup.

import { useId, useState, type ReactNode } from "react";

// ── Cluster ────────────────────────────────────────────────────────────

interface ClusterProps {
  num: string;
  title: string;
  sub?: string;
  defaultOpen?: boolean;
  right?: ReactNode;
  children: ReactNode;
}

export function Cluster({
  num,
  title,
  sub,
  defaultOpen = true,
  right,
  children,
}: ClusterProps) {
  // Use a controlled <details> so we can render the caret consistently.
  return (
    <details className="field-cluster" open={defaultOpen}>
      <summary>
        <span className="num-tag">{num}</span>
        <div className="cluster-head">
          <div className="ttl">{title}</div>
          {sub && <div className="sub">{sub}</div>}
        </div>
        <div className="cluster-right">{right}</div>
        <span className="caret" aria-hidden>
          ›
        </span>
      </summary>
      <div className="body">{children}</div>
    </details>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────

interface ToggleProps {
  on: boolean;
  onChange: (next: boolean) => void;
  ariaLabel?: string;
}

export function Toggle({ on, onChange, ariaLabel = "toggle" }: ToggleProps) {
  return (
    <button
      className="tg"
      data-on={on ? "true" : "false"}
      aria-label={ariaLabel}
      aria-pressed={on}
      onClick={() => onChange(!on)}
      type="button"
    />
  );
}

// ── Stepper ────────────────────────────────────────────────────────────

interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

export function Stepper({ value, onChange, min = 0, max = 5 }: StepperProps) {
  return (
    <div className="stepper">
      <button
        type="button"
        aria-label="decrease"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        −
      </button>
      <span className="val">
        {value}
        {value === max ? "+" : ""}
      </span>
      <button
        type="button"
        aria-label="increase"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}

// ── YesNo chip pair ────────────────────────────────────────────────────

interface YesNoProps {
  value: boolean | null;
  onChange: (next: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
}

export function YesNo({
  value,
  onChange,
  yesLabel = "Yes",
  noLabel = "No",
}: YesNoProps) {
  return (
    <div className="yesno">
      <button
        type="button"
        className="chip"
        data-active={value === true ? "true" : "false"}
        onClick={() => onChange(true)}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        className="chip"
        data-active={value === false ? "true" : "false"}
        onClick={() => onChange(false)}
      >
        {noLabel}
      </button>
    </div>
  );
}

// ── Field (eyebrow label + content + optional hint) ────────────────────

interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  full?: boolean;
}

export function Field({ label, hint, children, full = false }: FieldProps) {
  const id = useId();
  return (
    <div className="row" data-full={full ? "true" : "false"}>
      <div className="eyebrow" id={id}>
        {label}
      </div>
      <div role="group" aria-labelledby={id}>
        {children}
      </div>
      {hint && <div className="row-hint">{hint}</div>}
    </div>
  );
}

// ── Pill group (chip-radio) ────────────────────────────────────────────

export interface PillOption<T extends string> {
  value: T;
  label: string;
  sub?: string;
  tone?: "default" | "warn" | "neg";
}

interface PillGroupProps<T extends string> {
  value: T;
  options: PillOption<T>[];
  onChange: (next: T) => void;
}

export function PillGroup<T extends string>({
  value,
  options,
  onChange,
}: PillGroupProps<T>) {
  return (
    <div className="pill-group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="status-pill"
          data-on={value === o.value ? "true" : "false"}
          data-tone={o.tone ?? "default"}
          onClick={() => onChange(o.value)}
        >
          <span className="ttl">{o.label}</span>
          {o.sub && <span className="sub">{o.sub}</span>}
        </button>
      ))}
    </div>
  );
}

// ── Lightweight controlled-collapsible hook ───────────────────────────

export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial);
  return {
    open,
    setOpen,
    toggle: () => setOpen((v) => !v),
  };
}
