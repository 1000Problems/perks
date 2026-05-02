"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Segmented } from "@/components/perks/Segmented";
import { logoutAction } from "@/lib/auth/actions";

export type ViewMode = "ongoing" | "year1";
export type CreditsMode = "realistic" | "face";

interface Props {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  credits: CreditsMode;
  setCredits: (v: CreditsMode) => void;
}

export function RecHeader({ view, setView, credits, setCredits }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <header
      style={{
        borderBottom: "1px solid var(--rule)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: "var(--paper)",
        height: 64,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "var(--ink)",
              display: "grid",
              placeItems: "center",
              color: "var(--paper)",
              fontFamily: "var(--font-display), serif",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            p
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>perks</span>
        </Link>
        <nav style={{ display: "flex", gap: 4, fontSize: 13, color: "var(--ink-2)" }}>
          <Link href="/recommendations" style={{ padding: "6px 10px", color: "var(--ink)", fontWeight: 500, textDecoration: "none" }}>
            Recommendation
          </Link>
          {/* Hidden for MVP — restore in v1.
          <Link href="/trips" style={{ padding: "6px 10px", textDecoration: "none", color: "inherit" }}>
            Trip planner
          </Link>
          */}
          <Link href="/onboarding/cards" style={{ padding: "6px 10px", textDecoration: "none", color: "inherit" }}>
            My wallet
          </Link>
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Desktop controls — hidden on small screens. */}
        <div className="rec-header-desktop" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* View + credits toggles hidden for MVP — restore in v1.
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: "ongoing", label: "Ongoing year" },
              { value: "year1", label: "Year 1 (with bonus)" },
            ]}
          />
          <Segmented
            value={credits}
            onChange={setCredits}
            options={[
              { value: "realistic", label: "Realistic credits" },
              { value: "face", label: "Face value" },
            ]}
          />
          */}
          <Link
            href={"/settings" as Route}
            className="btn btn-ghost"
            style={{ fontSize: 12, textDecoration: "none" }}
          >
            Settings
          </Link>
        </div>
        {/* Mobile filter trigger — hidden for MVP (would open an empty sheet
            with the toggles above commented out). Restore in v1.
        <button
          className="rec-header-mobile-only btn btn-ghost"
          style={{ fontSize: 12 }}
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Open filters"
        >
          ⚙ Filters
        </button>
        */}
        <form action={logoutAction}>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 12, color: "var(--ink-3)" }}
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>

      {sheetOpen && (
        <div
          onClick={() => setSheetOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.32)",
            zIndex: 100,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--paper)",
              width: "100%",
              borderRadius: "16px 16px 0 0",
              padding: "20px 20px 28px",
              boxShadow: "0 -8px 24px rgba(0,0,0,0.16)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div className="eyebrow">Display options</div>
            <Segmented
              value={view}
              onChange={(v) => {
                setView(v);
                setSheetOpen(false);
              }}
              options={[
                { value: "ongoing", label: "Ongoing year" },
                { value: "year1", label: "Year 1 (with bonus)" },
              ]}
            />
            <Segmented
              value={credits}
              onChange={(v) => {
                setCredits(v);
                setSheetOpen(false);
              }}
              options={[
                { value: "realistic", label: "Realistic credits" },
                { value: "face", label: "Face value" },
              ]}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setSheetOpen(false)}
              style={{ marginTop: 4, justifyContent: "center" }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
