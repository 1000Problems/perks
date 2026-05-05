"use client";

// EarningRateRow — a single row in the EarningSection on /wallet/cards/[id].
// Renders the official Citi/issuer phrasing for one earning category, an
// expandable body with verbatim T&C exclusion text, and a visible source
// link. No yes/no probe — this section is informational, sourced from
// the issuer's terms.

import { useState } from "react";

interface EarningEntry {
  category: string;
  rate_pts_per_dollar: number | null;
  cap_usd_per_year?: number | null;
  notes?: string | null;
  official_text?: string;
  exclusions?: string;
  source?: {
    url: string;
    type: string;
    label?: string;
    verified_at?: string;
  };
}

interface Props {
  entry: EarningEntry;
  programName: string;
}

function fallbackHeadline(entry: EarningEntry, programName: string): string {
  const rate = entry.rate_pts_per_dollar ?? 1;
  const cat = entry.category.replace(/_/g, " ");
  const points = rate === 1 ? "1 point" : `${rate} points`;
  return `${points} per $1 on ${cat} (${programName})`;
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function EarningRateRow({ entry, programName }: Props) {
  const [expanded, setExpanded] = useState(false);
  const headline = entry.official_text ?? fallbackHeadline(entry, programName);
  const rate = entry.rate_pts_per_dollar ?? 1;
  const exclusionsText =
    entry.exclusions && entry.exclusions.trim().length > 0
      ? entry.exclusions
      : "No additional exclusions in the card terms.";
  const sourceLabel =
    entry.source?.label ?? (entry.source ? hostnameOf(entry.source.url) : null);

  return (
    <div
      className="earning-rate-row"
      data-expanded={expanded ? "true" : "false"}
    >
      <button
        type="button"
        className="earning-rate-head"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <span className="earning-rate-headline">{headline}</span>
        <span className="earning-rate-chip">
          {rate}× pts/$1
        </span>
        <span className="earning-rate-caret" aria-hidden>
          {expanded ? "▴" : "▾"}
        </span>
      </button>
      {expanded && (
        <div className="earning-rate-body">
          <p className="earning-rate-exclusions">{exclusionsText}</p>
          {entry.source && (
            <p className="earning-rate-source">
              <a
                href={entry.source.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source: {sourceLabel}
              </a>
              {entry.source.verified_at && (
                <span className="earning-rate-source-verified">
                  {" · verified "}
                  {entry.source.verified_at}
                </span>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
