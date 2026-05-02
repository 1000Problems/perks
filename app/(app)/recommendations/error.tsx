"use client";

// Caught by Next.js when the recommendations page throws during render
// — typically because data/cards.json is missing or malformed (forgot
// to run `npm run cards:build`). We don't surface Zod errors to the
// user; we log them server-side and show a friendly retry.

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RecommendationsError({ error, reset }: Props) {
  useEffect(() => {
    // Server-side log already captured this; surface in browser console
    // for engineers running locally.
    if (typeof window !== "undefined") {
      console.error("[recommendations:error]", error.message, error.digest);
    }
  }, [error]);

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "48px 32px",
        color: "var(--ink)",
      }}
    >
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div className="eyebrow">Something went wrong</div>
        <h1
          style={{
            margin: "10px 0 16px",
            fontSize: 28,
            letterSpacing: "-0.02em",
            fontWeight: 600,
          }}
        >
          We&apos;re having trouble loading our data.
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55 }}>
          Try again in a few minutes. If it keeps happening, the card database may
          need to be recompiled.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={reset}
          style={{ marginTop: 22 }}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
