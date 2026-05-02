"use client";

import Link from "next/link";
import { Segmented } from "@/components/perks/Segmented";

export type ViewMode = "ongoing" | "year1";
export type CreditsMode = "realistic" | "face";

interface Props {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  credits: CreditsMode;
  setCredits: (v: CreditsMode) => void;
}

export function RecHeader({ view, setView, credits, setCredits }: Props) {
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
          <Link href="/trips" style={{ padding: "6px 10px", textDecoration: "none", color: "inherit" }}>
            Trip planner
          </Link>
          <Link href="/onboarding/cards" style={{ padding: "6px 10px", textDecoration: "none", color: "inherit" }}>
            My wallet
          </Link>
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
        <button className="btn btn-ghost" style={{ fontSize: 12 }} type="button">
          Edit profile
        </button>
      </div>
    </header>
  );
}
