// Settings hub. Shows the user's current onboarding answers as four
// section cards, each linking to the matching onboarding step in
// edit-mode (?from=settings). A "Run setup again" link kicks off a
// fresh wizard pass for users who want the linear experience.

import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile/server";
import { fmt } from "@/lib/utils/format";
import type { CreditScoreBand, UserProfile } from "@/lib/profile/types";

export const dynamic = "force-dynamic";

const BAND_LABEL: Record<CreditScoreBand, string> = {
  excellent: "Excellent (800+)",
  very_good: "Very good (740–799)",
  good: "Good (670–739)",
  fair: "Fair (580–669)",
  building: "Building credit",
  unknown: "Skipped — show all options",
};

function creditSummary(p: UserProfile): { text: string; muted: boolean } {
  if (p.credit_score_band == null) return { text: "Not set", muted: true };
  return { text: BAND_LABEL[p.credit_score_band], muted: false };
}

function spendSummary(p: UserProfile): { text: string; muted: boolean } {
  const entries = Object.entries(p.spend_profile ?? {});
  const nonZero = entries.filter(([, v]) => (v ?? 0) > 0);
  if (nonZero.length === 0) return { text: "Not set", muted: true };
  const total = nonZero.reduce((acc, [, v]) => acc + (v ?? 0), 0);
  const noun = nonZero.length === 1 ? "category" : "categories";
  return {
    text: `${fmt.usd(total)}/yr across ${nonZero.length} ${noun}`,
    muted: false,
  };
}

function brandsSummary(p: UserProfile): { text: string; muted: boolean } {
  const brands = p.brands_used ?? [];
  const trips = p.trips_planned ?? [];
  if (brands.length === 0 && trips.length === 0) {
    return { text: "Not set", muted: true };
  }
  let head = "";
  if (brands.length === 0) {
    head = "No brands picked";
  } else if (brands.length <= 3) {
    head = brands.join(", ");
  } else {
    head = `${brands.slice(0, 2).join(", ")} +${brands.length - 2} more`;
  }
  const tripBit =
    trips.length === 0
      ? ""
      : ` · ${trips.length} ${trips.length === 1 ? "trip" : "trips"}`;
  return { text: `${head}${tripBit}`, muted: false };
}

function walletSummary(p: UserProfile): { text: string; muted: boolean } {
  const held = p.cards_held ?? [];
  if (held.length === 0) return { text: "Empty", muted: true };
  // Earliest opened_at — "YYYY-MM-DD" sorts lexically.
  const earliest = held
    .map((h) => h.opened_at)
    .filter((s): s is string => Boolean(s))
    .sort()[0];
  const noun = held.length === 1 ? "card" : "cards";
  if (!earliest) return { text: `${held.length} ${noun} held`, muted: false };
  const [y, m] = earliest.split("-").map(Number);
  const monthName = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ][(m || 1) - 1];
  return {
    text: `${held.length} ${noun} held · oldest from ${monthName} ${y}`,
    muted: false,
  };
}

export default async function SettingsPage() {
  let profile: UserProfile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }

  const sections: SectionData[] = [
    {
      num: "01",
      title: "Credit",
      blurb: "What we use to filter and rank cards by approval likelihood.",
      summary: creditSummary(profile),
      editHref: "/onboarding/credit",
    },
    {
      num: "02",
      title: "Spend",
      blurb: "Annual spend per category — drives the rewards math.",
      summary: spendSummary(profile),
      editHref: "/onboarding/spend",
    },
    {
      num: "03",
      title: "Brands & trips",
      blurb: "Cobrands and travel destinations we look for in the rec list.",
      summary: brandsSummary(profile),
      editHref: "/onboarding/brands",
    },
    {
      num: "04",
      title: "Wallet",
      blurb: "Cards you already hold — used for eligibility and dedup.",
      summary: walletSummary(profile),
      editHref: "/onboarding/cards",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 32px 96px",
        maxWidth: 880,
        margin: "0 auto",
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <Link
          href="/recommendations"
          style={{
            fontSize: 13,
            color: "var(--ink-3)",
            textDecoration: "none",
          }}
        >
          ← Recommendations
        </Link>
        <Link
          href={"/onboarding/credit" as Route}
          style={{
            fontSize: 12,
            color: "var(--ink-3)",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Run setup again
        </Link>
      </nav>

      <h1
        style={{
          margin: 0,
          fontSize: 32,
          letterSpacing: "-0.02em",
          fontWeight: 600,
        }}
      >
        Your settings
      </h1>
      <p
        style={{
          marginTop: 10,
          fontSize: 14,
          color: "var(--ink-2)",
          lineHeight: 1.55,
          maxWidth: 600,
        }}
      >
        Edit any section to update your profile. Recommendations refresh
        the moment you save.
      </p>

      <div
        style={{
          marginTop: 28,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {sections.map((s) => (
          <SectionCard key={s.num} {...s} />
        ))}
      </div>
    </main>
  );
}

interface SectionData {
  num: string;
  title: string;
  blurb: string;
  summary: { text: string; muted: boolean };
  editHref: "/onboarding/credit" | "/onboarding/spend" | "/onboarding/brands" | "/onboarding/cards";
}

function SectionCard({ num, title, blurb, summary, editHref }: SectionData) {
  return (
    <Link
      href={`${editHref}?from=settings` as Route}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <article
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 18,
          alignItems: "center",
          padding: "18px 20px",
          border: "1px solid var(--rule)",
          borderRadius: 14,
          background: "var(--paper)",
          transition: "border-color 80ms, background 80ms",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: 11,
            color: "var(--ink-4)",
            letterSpacing: "0.04em",
          }}
        >
          {num}
        </span>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 13,
              color: summary.muted ? "var(--ink-3)" : "var(--ink-2)",
              fontStyle: summary.muted ? "italic" : "normal",
            }}
          >
            {summary.text}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 11.5,
              color: "var(--ink-4)",
              lineHeight: 1.5,
            }}
          >
            {blurb}
          </div>
        </div>
        <span
          className="btn"
          style={{ fontSize: 12, pointerEvents: "none" }}
          aria-hidden
        >
          Edit →
        </span>
      </article>
    </Link>
  );
}
