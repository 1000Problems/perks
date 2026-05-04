"use client";

// Phase 5 of signal-first architecture.
//
// Read-only catalog view of every signal the system can know about
// the user, grouped by namespace, with the current state and source
// attribution. Editing still happens on the per-card hero page —
// this surface focuses on transparency, not interaction.

import Link from "next/link";
import { useMemo } from "react";
import type { Route } from "next";

export interface DashboardSignal {
  id: string;
  label: string;
  prompt: string;
  type: "behavior" | "intent" | "holding";
  decay: "never" | "annual" | "trip_bound";
  userState: "confirmed" | "interested" | "dismissed" | null;
  autoConfirmed: boolean;
  sourceCardId: string | null;
  sourcePlayId: string | null;
  sourceCardName: string | null;
}

const NAMESPACE_LABELS: Record<string, string> = {
  claims: "Credits you claim",
  transfers: "Transfer partners you use",
  behaviors: "Habits we've observed",
  intents: "What you're planning",
  holdings: "Auto-confirmed from your wallet",
};

const NAMESPACE_ORDER = [
  "claims",
  "transfers",
  "behaviors",
  "intents",
  "holdings",
];

function namespaceOf(id: string): string {
  const dot = id.indexOf(".");
  return dot < 0 ? "other" : id.slice(0, dot);
}

interface Props {
  signals: DashboardSignal[];
}

export function SignalsDashboardClient({ signals }: Props) {
  const grouped = useMemo(() => {
    const m = new Map<string, DashboardSignal[]>();
    for (const ns of NAMESPACE_ORDER) m.set(ns, []);
    for (const s of signals) {
      const ns = namespaceOf(s.id);
      const arr = m.get(ns) ?? [];
      arr.push(s);
      m.set(ns, arr);
    }
    for (const arr of m.values()) {
      arr.sort((a, b) => a.label.localeCompare(b.label));
    }
    return m;
  }, [signals]);

  const counts = useMemo(() => {
    let confirmed = 0;
    let interested = 0;
    let dismissed = 0;
    let auto = 0;
    for (const s of signals) {
      if (s.autoConfirmed) auto++;
      else if (s.userState === "confirmed") confirmed++;
      else if (s.userState === "interested") interested++;
      else if (s.userState === "dismissed") dismissed++;
    }
    return { confirmed, interested, dismissed, auto, total: signals.length };
  }, [signals]);

  return (
    <div className="wallet-edit-page">
      <div className="page-head">
        <h1>What we know about you</h1>
        <p className="sub">
          Every signal the system has captured. {counts.confirmed} confirmed,{" "}
          {counts.interested} on your list, {counts.dismissed} ruled out,{" "}
          {counts.auto} auto-confirmed by your wallet, {" "}
          {counts.total -
            counts.confirmed -
            counts.interested -
            counts.dismissed -
            counts.auto}{" "}
          unanswered. Edit any of these by opening the card that surfaced them.
        </p>
        <Link href={"/wallet/edit" as Route} className="back-link">
          ← Back to wallet
        </Link>
      </div>

      <div className="signals-dashboard">
        {NAMESPACE_ORDER.map((ns) => {
          const items = grouped.get(ns) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={ns} className="signals-group">
              <h2 className="signals-group-title">
                {NAMESPACE_LABELS[ns] ?? ns}
              </h2>
              <div className="signals-group-rows">
                {items.map((s) => (
                  <SignalRow key={s.id} signal={s} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function SignalRow({ signal }: { signal: DashboardSignal }) {
  const stateLabel = signalStateLabel(signal);
  const stateTone = signalStateTone(signal);
  return (
    <div className="signal-row">
      <div className="signal-row-body">
        <div className="signal-label">{signal.label}</div>
        {signal.prompt && (
          <div className="signal-prompt">{signal.prompt}</div>
        )}
        <div className="signal-meta">
          <span className="signal-id num">{signal.id}</span>
          {signal.sourceCardName && signal.sourceCardId && (
            <>
              <span className="dot">·</span>
              <Link
                href={`/wallet/cards/${signal.sourceCardId}` as Route}
                className="signal-source-link"
              >
                set on {signal.sourceCardName} →
              </Link>
            </>
          )}
          {signal.autoConfirmed && (
            <>
              <span className="dot">·</span>
              <span className="signal-source-auto">
                auto-confirmed by your wallet
              </span>
            </>
          )}
        </div>
      </div>
      <div className={`signal-state-chip signal-state-${stateTone}`}>
        {stateLabel}
      </div>
    </div>
  );
}

function signalStateLabel(s: DashboardSignal): string {
  if (s.autoConfirmed && !s.userState) return "Auto-confirmed";
  switch (s.userState) {
    case "confirmed":
      return "Confirmed";
    case "interested":
      return "On your list";
    case "dismissed":
      return "Not for me";
    case null:
    default:
      return "No opinion captured";
  }
}

function signalStateTone(s: DashboardSignal): string {
  if (s.autoConfirmed && !s.userState) return "auto";
  switch (s.userState) {
    case "confirmed":
      return "confirmed";
    case "interested":
      return "interested";
    case "dismissed":
      return "dismissed";
    case null:
    default:
      return "neutral";
  }
}
