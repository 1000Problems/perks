"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { SPEND_CATEGORIES } from "@/lib/categories";
import { useProfile } from "@/lib/profile/client";
import type { SpendCategoryId, UserProfile } from "@/lib/profile/types";
import { fmt } from "@/lib/utils/format";

interface Props {
  initialProfile: UserProfile;
}

const MAX_PER_CAT: Partial<Record<SpendCategoryId, number>> = {
  other: 50000,
};

function buildDefaults(): Partial<Record<SpendCategoryId, number>> {
  const out: Partial<Record<SpendCategoryId, number>> = {};
  for (const c of SPEND_CATEGORIES) out[c.id] = c.default;
  return out;
}

export function SpendForm({ initialProfile }: Props) {
  const router = useRouter();
  const { profile, update, flushNow, saving } = useProfile(initialProfile);

  // If the user lands here with an empty spend_profile, capture the
  // defaults immediately. Otherwise clicking Continue without touching
  // a slider leaves spend_profile = {} and the cold-start guard on
  // /recommendations bounces them back here.
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current) return;
    if (Object.keys(initialProfile.spend_profile ?? {}).length > 0) {
      seededRef.current = true;
      return;
    }
    seededRef.current = true;
    update({ spend_profile: buildDefaults() });
  }, [initialProfile.spend_profile, update]);

  const total = useMemo(() => {
    return SPEND_CATEGORIES.reduce(
      (acc, c) => acc + (profile.spend_profile[c.id] ?? c.default),
      0,
    );
  }, [profile.spend_profile]);

  function setCat(id: SpendCategoryId, value: number) {
    update((prev) => ({
      spend_profile: { ...prev.spend_profile, [id]: value },
    }));
  }

  async function continueNext() {
    await flushNow();
    router.push("/onboarding/brands" as Route);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 18,
          padding: "16px 20px",
          background: "var(--paper-2)",
          borderRadius: 12,
          border: "1px solid var(--rule)",
        }}
      >
        <div>
          <div className="eyebrow">Total annual spend</div>
          <div
            style={{
              fontSize: 28,
              letterSpacing: "-0.02em",
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            {fmt.usd(total)}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
          {saving ? "Saving…" : ""}
        </div>
      </div>

      <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, maxWidth: 600 }}>
        Drag any slider to adjust. Defaults are based on a typical US household —
        nudge whatever&apos;s off for yours.
      </p>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {SPEND_CATEGORIES.map((c) => {
          const value = profile.spend_profile[c.id] ?? c.default;
          const max = MAX_PER_CAT[c.id] ?? 30000;
          return (
            <div
              key={c.id}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr 100px",
                alignItems: "center",
                gap: 18,
                padding: "10px 14px",
                borderRadius: 10,
                background: "var(--paper)",
                border: "1px solid var(--rule)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <span style={{ width: 18, textAlign: "center" }}>{c.icon}</span>
                <span style={{ fontWeight: 500 }}>{c.label}</span>
              </div>
              <input
                type="range"
                min={0}
                max={max}
                step={100}
                value={value}
                onChange={(e) => setCat(c.id, Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--ink)" }}
                aria-label={c.label}
              />
              <div
                style={{
                  textAlign: "right",
                  fontSize: 13,
                  fontFamily: "var(--font-mono), ui-monospace, monospace",
                  color: "var(--ink)",
                }}
              >
                {fmt.usd(value)}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 18,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 999,
          border: "1px dashed var(--rule-2)",
          background: "var(--paper-2)",
          color: "var(--ink-3)",
          fontSize: 12,
          cursor: "not-allowed",
        }}
      >
        Statement upload — coming soon
      </div>

      <div
        style={{
          marginTop: 36,
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
        }}
      >
        <button
          type="button"
          className="btn btn-primary"
          onClick={continueNext}
          disabled={total === 0}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
