"use client";

// PerkSourceLink — the inline ⓘ next to each perk row's title, plus
// the popover that opens on click. Three states managed locally:
//
//   1. Closed:  just the ⓘ trigger.
//   2. Default: link to source URL + verified date + "Report" button.
//               When the user already has an open flag, "Report"
//               swaps to "You flagged this — undo".
//   3. Form:    reason radios + optional note + Submit/Cancel.
//
// Outside-click and Escape close the popover. The trigger toggles.
// When a flag is submitted, we collapse back to the default state
// with the user's flag visible. router.refresh() reloads server
// state so myFlag survives the next render.

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { hostnameOf, type PerkSource } from "./perkSource";
import {
  flagPerkSource,
  unflagPerkSource,
} from "@/lib/profile/actions";
import type { PerkFlag, PerkFlagReason } from "@/lib/profile/server";

interface Props {
  source: PerkSource;
  cardId: string;
  perkKind: "annual_credit" | "ongoing_perk";
  perkName: string;
  myFlag: PerkFlag | null;
}

type Pane = "default" | "form";

const REASON_OPTIONS: { value: PerkFlagReason; label: string }[] = [
  { value: "link_broken", label: "Link doesn't work" },
  { value: "info_outdated", label: "Page says something different" },
  { value: "perk_removed", label: "Perk no longer offered" },
  { value: "other", label: "Something else" },
];

export function PerkSourceLink({
  source,
  cardId,
  perkKind,
  perkName,
  myFlag,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pane, setPane] = useState<Pane>("default");
  const containerRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setPane("default");
  }, []);

  // Outside-click closes.
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const target = e.target as Node | null;
      if (target && containerRef.current && !containerRef.current.contains(target)) {
        close();
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, close]);

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const verifiedSuffix = source.verified_at
    ? ` — verified ${formatVerifiedDate(source.verified_at)}`
    : "";

  return (
    <span ref={containerRef} className="perk-source-wrap">
      <button
        type="button"
        className="perk-source-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        title={`Source: ${source.label ?? hostnameOf(source.url)}${verifiedSuffix}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
          setPane("default");
        }}
      >
        ⓘ
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={`Source for ${perkName}`}
          className="perk-source-popover"
          onClick={(e) => e.stopPropagation()}
        >
          {pane === "default" ? (
            <DefaultPane
              source={source}
              cardId={cardId}
              perkName={perkName}
              myFlag={myFlag}
              onReport={() => setPane("form")}
              onUndo={async () => {
                await unflagPerkSource(cardId, perkName);
                router.refresh();
                close();
              }}
            />
          ) : (
            <FormPane
              cardId={cardId}
              perkKind={perkKind}
              perkName={perkName}
              initial={myFlag}
              onSubmitted={() => {
                router.refresh();
                setPane("default");
              }}
              onCancel={() => setPane("default")}
            />
          )}
        </div>
      )}
    </span>
  );
}

function DefaultPane({
  source,
  cardId: _cardId,
  perkName: _perkName,
  myFlag,
  onReport,
  onUndo,
}: {
  source: PerkSource;
  cardId: string;
  perkName: string;
  myFlag: PerkFlag | null;
  onReport: () => void;
  onUndo: () => void | Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="perk-source-pane">
      <div className="perk-source-eyebrow">Source</div>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="perk-source-link-row"
      >
        {source.label ?? hostnameOf(source.url)} →
      </a>
      {source.verified_at && (
        <div className="perk-source-verified">
          Verified {formatVerifiedDate(source.verified_at)}
        </div>
      )}
      <div className="perk-source-divider" />
      {myFlag ? (
        <button
          type="button"
          className="perk-source-action perk-source-action-undo"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await onUndo();
            })
          }
        >
          ⚑ You flagged this — undo
        </button>
      ) : (
        <button
          type="button"
          className="perk-source-action"
          onClick={onReport}
        >
          ⚑ Report a problem
        </button>
      )}
    </div>
  );
}

function FormPane({
  cardId,
  perkKind,
  perkName,
  initial,
  onSubmitted,
  onCancel,
}: {
  cardId: string;
  perkKind: "annual_credit" | "ongoing_perk";
  perkName: string;
  initial: PerkFlag | null;
  onSubmitted: () => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState<PerkFlagReason>(
    initial?.reason ?? "info_outdated",
  );
  const [note, setNote] = useState<string>(initial?.note ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const reasonGroupId = useId();
  const noteId = useId();

  const noteRequired = reason === "other";
  const trimmedNote = note.trim();
  const canSubmit = !noteRequired || trimmedNote.length >= 3;

  function handleSubmit() {
    if (!canSubmit) return;
    setError(null);
    startTransition(async () => {
      const res = await flagPerkSource({
        cardId,
        perkKind,
        perkName,
        reason,
        note: trimmedNote || undefined,
      });
      if (!res.ok) {
        setError(res.detail ?? "Couldn't submit. Try again.");
        return;
      }
      onSubmitted();
    });
  }

  return (
    <div className="perk-source-pane">
      <div className="perk-source-eyebrow" id={reasonGroupId}>
        What's wrong?
      </div>
      <div
        role="radiogroup"
        aria-labelledby={reasonGroupId}
        className="perk-source-reasons"
      >
        {REASON_OPTIONS.map((opt) => (
          <label key={opt.value} className="perk-source-reason">
            <input
              type="radio"
              name={`reason-${cardId}-${perkName}`}
              value={opt.value}
              checked={reason === opt.value}
              onChange={() => setReason(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      <label htmlFor={noteId} className="perk-source-note-label">
        {noteRequired ? "Tell us what's wrong" : "Optional details"}
      </label>
      <textarea
        id={noteId}
        className="perk-source-note"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={
          noteRequired ? "Required — at least 3 characters" : "Optional"
        }
      />
      {error && <div className="perk-source-error">{error}</div>}
      <div className="perk-source-form-actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canSubmit || pending}
          onClick={handleSubmit}
        >
          {pending ? "Saving…" : "Submit"}
        </button>
        <button
          type="button"
          className="btn"
          disabled={pending}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function formatVerifiedDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-\d{2}$/);
  if (!m) return iso;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthIdx = parseInt(m[2], 10) - 1;
  return `${months[monthIdx] ?? ""} ${m[1]}`;
}
