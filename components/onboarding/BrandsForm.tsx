"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useProfile, profileErrorMessage } from "@/lib/profile/client";
import type { UserProfile } from "@/lib/profile/types";

interface Props {
  initialProfile: UserProfile;
  editMode?: boolean;
}

const STORES = [
  "Costco",
  "Amazon",
  "Target",
  "Walmart",
  "Sam's Club",
  "Apple",
  "Whole Foods",
  "Best Buy",
];

const TRAVEL = [
  "United",
  "Delta",
  "American",
  "Southwest",
  "Alaska",
  "JetBlue",
  "Hilton",
  "Marriott",
  "Hyatt",
  "IHG",
  "Wyndham",
];

const SERVICES = [
  "Uber",
  "Lyft",
  "DoorDash",
  "Disney+",
  "Netflix",
  "Spotify",
  "Equinox",
  "Peloton",
];

export function BrandsForm({ initialProfile, editMode }: Props) {
  const router = useRouter();
  const { profile, update, flushNow, error } = useProfile(initialProfile);

  async function go(
    target:
      | "/onboarding/cards"
      | "/onboarding/spend"
      | "/settings"
      | "/recommendations",
  ) {
    const ok = await flushNow();
    if (!ok) return; // stay on form so the user sees the error
    router.push(target as Route);
    // Invalidate the App Router Client Cache so the destination's
    // server components re-execute with the just-saved profile.
    router.refresh();
  }
  const [tripDraft, setTripDraft] = useState("");

  const selected = new Set(profile.brands_used);

  function toggleBrand(b: string) {
    update((prev) => {
      const set = new Set(prev.brands_used);
      if (set.has(b)) set.delete(b);
      else set.add(b);
      return { brands_used: Array.from(set) };
    });
  }

  function addTrip() {
    const dest = tripDraft.trim();
    if (!dest) return;
    update((prev) => ({
      trips_planned: [
        ...prev.trips_planned.filter(
          (t) => t.destination.toLowerCase() !== dest.toLowerCase(),
        ),
        { destination: dest },
      ],
    }));
    setTripDraft("");
  }

  function removeTrip(dest: string) {
    update((prev) => ({
      trips_planned: prev.trips_planned.filter(
        (t) => t.destination !== dest,
      ),
    }));
  }

  return (
    <div>
      <ChipGroup
        label="Stores I shop at"
        items={STORES}
        selected={selected}
        onToggle={toggleBrand}
      />
      <ChipGroup
        label="Airlines & hotels I'm loyal to"
        items={TRAVEL}
        selected={selected}
        onToggle={toggleBrand}
      />
      <ChipGroup
        label="Services I subscribe to"
        items={SERVICES}
        selected={selected}
        onToggle={toggleBrand}
      />

      <section style={{ marginTop: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Trips planned in the next 12 months
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="text"
            value={tripDraft}
            onChange={(e) => setTripDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTrip();
              }
            }}
            placeholder="Phoenix, Tokyo, Paris…"
            style={{
              flex: 1,
              maxWidth: 320,
              padding: "8px 12px",
              fontSize: 14,
              borderRadius: 8,
              border: "1px solid var(--rule)",
              background: "var(--paper)",
              color: "var(--ink)",
            }}
          />
          <button type="button" className="btn" onClick={addTrip}>
            Add
          </button>
        </div>
        {profile.trips_planned.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {profile.trips_planned.map((t) => (
              <span
                key={t.destination}
                className="chip"
                data-active="true"
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                {t.destination}
                <button
                  type="button"
                  onClick={() => removeTrip(t.destination)}
                  aria-label={`Remove ${t.destination}`}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "inherit",
                    cursor: "pointer",
                    fontSize: 12,
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      <div
        style={{
          marginTop: 36,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => go(editMode ? "/settings" : "/onboarding/spend")}
        >
          ← Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {error && (
            <span style={{ fontSize: 12, color: "var(--neg)" }}>
              {profileErrorMessage(error)}
            </span>
          )}
          {!editMode && (
            <button
              type="button"
              className="btn"
              onClick={() => go("/onboarding/cards")}
            >
              Skip
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => go(editMode ? "/recommendations" : "/onboarding/cards")}
          >
            {editMode ? "Save & view recs →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChipGroup({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: string[];
  selected: Set<string>;
  onToggle: (b: string) => void;
}) {
  return (
    <section style={{ marginTop: 28 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((b) => (
          <button
            key={b}
            type="button"
            className="chip"
            data-active={selected.has(b) ? "true" : "false"}
            onClick={() => onToggle(b)}
            style={{
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {b}
          </button>
        ))}
      </div>
    </section>
  );
}
