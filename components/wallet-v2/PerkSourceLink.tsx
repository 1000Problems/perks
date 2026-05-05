"use client";

// PerkSourceLink — always-visible source row beneath each perk's
// personal sentence. Renders the canonical citation link, the
// human-stamped verified date, and a small ⚑ button that opens a
// popover for the report-a-problem form.
//
// Layout, left to right:
//   1. "Source: {label} →"   — direct link to the citation URL.
//   2. "verified May 2026"    — muted static text.
//   3. ⚑ trigger              — opens the popover.
//
// Popover state machine:
//   - User has no flag yet:                         show form
//   - User has an open flag, hasn't asked to edit:  show "You flagged
//                                                    this" + Undo /
//                                                    Edit reason
//   - User has a flag, clicked "Edit reason":       show form
//                                                    (pre-populated)
//
// Source link + verified date stay outside the popover because
// they're the trust signal users care about most. The popover is
// reserved for the lower-volume report action.

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
  /** When false, the flag button is hidden — the source came from a */
  /** play.source_urls fallback and there's no perk row to flag */
  /** against. Defaults to true. */
  flaggable?: boolean;
}

const REASON_OPTIONS: { value: PerkFlagReason; label: string }[] = [
  { value: "link_broken", label: "Link doesn't work" },
  { value: "info_outdated", label: "Page says something different" },
  { value: "perk_removed", label: "Perk no longer offered" },
  { value: "other", label: "Something else" },
];

// Trust-hierarchy note shown at the top of the popover. Auto-generated
// from source.type so individual perks don't have to author it. Not
// shown for "issuer" — when Citi enumerates the perk on its own page,
// the source IS the trust signal and no extra context is needed.
const SOURCE_TYPE_NOTE: Record<PerkSource["type"], string | null> = {
  issuer: null,
  network: "Mastercard owns this benefit. Your Strata Premier inherits it as a World Elite card. Citi doesn't enumerate Mastercard-bundled perks on its own pages — Citi keeps flexibility to drop them quietly if Mastercard ever changes the bundle.",
  partner: "This is a Mastercard-administered partner offer, redeemed on the partner's site. Activate by linking your card. Mastercard refreshes the lifestyle bundle periodically (DashPass → Peacock just happened); Lyft and Instacart are locked through early 2027.",
  underwriter: "Insurance underwritten by Mastercard's network partner. The page above lists the headline coverage; full terms live in the issuer's Guide to Benefits PDF.",
  community: "External community source. Used when no official issuer or network page documents this play. Verify against the partner's award chart before transferring points.",
};

export function PerkSourceLink({
  source,
  cardId,
  perkKind,
  perkName,
  myFlag,
  flaggable = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setEditing(false);
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

  const label = source.label ?? hostnameOf(source.url);
  const verifiedText = source.verified_at
    ? formatVerifiedDate(source.verified_at)
    : null;

  const showForm = !myFlag || editing;

  return (
    <div className="perk-source-row" onClick={(e) => e.stopPropagation()}>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="perk-source-link-inline"
      >
        Source: {label} →
      </a>
      {verifiedText && (
        <span className="perk-source-verified-inline">
          verified {verifiedText}
        </span>
      )}
      {flaggable && (
        <span ref={containerRef} className="perk-source-flag-wrap">
          <button
            type="button"
            className="perk-source-flag-trigger"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={
              myFlag
                ? "You flagged this perk — click to manage"
                : "Report a problem with this source"
            }
            data-flagged={myFlag ? "true" : "false"}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
              setEditing(false);
            }}
          >
            ⚑{myFlag ? " flagged" : ""}
          </button>
        {open && (
          <div
            role="dialog"
            aria-label={`Report a problem with ${perkName}`}
            className="perk-source-popover"
            onClick={(e) => e.stopPropagation()}
          >
            {SOURCE_TYPE_NOTE[source.type] && (
              <div className="perk-source-typenote">
                <div className="perk-source-eyebrow">About this source</div>
                <p>{SOURCE_TYPE_NOTE[source.type]}</p>
              </div>
            )}
            {!showForm && myFlag ? (
              <FlaggedPane
                onUndo={async () => {
                  await unflagPerkSource(cardId, perkName);
                  router.refresh();
                  close();
                }}
                onEdit={() => setEditing(true)}
              />
            ) : (
              <FormPane
                cardId={cardId}
                perkKind={perkKind}
                perkName={perkName}
                initial={myFlag}
                onSubmitted={() => {
                  router.refresh();
                  close();
                }}
                onCancel={() => {
                  if (myFlag) {
                    setEditing(false);
                  } else {
                    close();
                  }
                }}
              />
            )}
          </div>
        )}
        </span>
      )}
    </div>
  );
}

function FlaggedPane({
  onUndo,
  onEdit,
}: {
  onUndo: () => void | Promise<void>;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="perk-source-pane">
      <div className="perk-source-eyebrow">You flagged this</div>
      <div className="perk-source-flagged-actions">
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
          Undo flag
        </button>
        <button
          type="button"
          className="perk-source-action"
          onClick={onEdit}
        >
          Edit reason
        </button>
      </div>
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
        What&apos;s wrong?
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
