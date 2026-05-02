"use client";

import { useEffect, useRef, useState } from "react";
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
  query?: string;
  setQuery?: (q: string) => void;
}

export function RecHeader({ view, setView, credits, setCredits, query, setQuery }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Cmd/Ctrl+K focuses the search input from anywhere on the page. We
  // bind once at the document level and act only when the chord
  // matches — never compete with native form typing.
  useEffect(() => {
    if (!setQuery) return;
    function onKey(e: KeyboardEvent) {
      const isK = e.key === "k" || e.key === "K";
      if (!isK) return;
      if (!(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();
      // Mobile: open the bar and focus once it mounts.
      if (window.matchMedia("(max-width: 767px)").matches) {
        setMobileSearchOpen(true);
        requestAnimationFrame(() => mobileInputRef.current?.focus());
        return;
      }
      desktopInputRef.current?.focus();
      desktopInputRef.current?.select();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setQuery]);

  function handleSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setQuery?.("");
      e.currentTarget.blur();
      setMobileSearchOpen(false);
    }
  }

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
        position: "relative",
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
          {setQuery && (
            <div className="rec-header-search-wrap">
              <SearchIcon className="rec-header-search-icon" />
              <input
                ref={desktopInputRef}
                type="search"
                value={query ?? ""}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKey}
                placeholder="Search cards"
                aria-label="Search cards"
                className="rec-header-search"
                spellCheck={false}
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="rec-header-search-clear"
                  onClick={() => {
                    setQuery("");
                    desktopInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          )}
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
        {/* Mobile-only search trigger. */}
        {setQuery && (
          <button
            type="button"
            className="rec-header-mobile-only btn btn-ghost"
            style={{ padding: "6px 8px" }}
            aria-label="Search cards"
            onClick={() => {
              setMobileSearchOpen(true);
              requestAnimationFrame(() => mobileInputRef.current?.focus());
            }}
          >
            <SearchIcon />
          </button>
        )}
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

      {/* Mobile search overlay — full-width bar over the header. */}
      {mobileSearchOpen && setQuery && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--paper)",
            borderBottom: "1px solid var(--rule)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 12px",
            zIndex: 50,
          }}
        >
          <SearchIcon className="rec-header-search-icon" style={{ position: "static" }} />
          <input
            ref={mobileInputRef}
            type="search"
            value={query ?? ""}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKey}
            placeholder="Search cards"
            aria-label="Search cards"
            className="rec-header-search"
            spellCheck={false}
            autoComplete="off"
            style={{ flex: 1, paddingLeft: 8 }}
          />
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: 12 }}
            onClick={() => {
              setQuery("");
              setMobileSearchOpen(false);
            }}
          >
            Done
          </button>
        </div>
      )}

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

function SearchIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="5" />
      <path d="M14 14L11 11" />
    </svg>
  );
}
