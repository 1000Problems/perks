"use client";

// Card search with autocomplete. Filters the catalog (excluding cards
// already held) by name + issuer, surfaces up to 8 matches. Pick one →
// opens the edit panel for that card with empty fields, ready to save
// as a new wallet entry.

import { useMemo, useState, useRef, useEffect } from "react";
import { CardArt } from "@/components/perks/CardArt";
import { variantForCard } from "@/lib/cardArt";
import { fmt } from "@/lib/utils/format";
import type { Card } from "@/lib/data/loader";

interface Props {
  catalog: Card[];
  heldIds: Set<string>;
  onPick: (card: Card) => void;
  placeholder?: string;
}

export function SearchBar({
  catalog,
  heldIds,
  onPick,
  placeholder = "Search by card name — Chase Sapphire Preferred, Amex Gold…",
}: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return catalog
      .filter((c) => !heldIds.has(c.id))
      .filter((c) => `${c.name} ${c.issuer}`.toLowerCase().includes(t))
      .slice(0, 8);
  }, [q, catalog, heldIds]);

  return (
    <div className="search-wrap" ref={wrapRef}>
      <span className="search-icon" aria-hidden>
        ⌕
      </span>
      <input
        className="search-input"
        placeholder={placeholder}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && matches.length > 0 && (
        <div className="search-results">
          {matches.map((c) => {
            const fee = c.annual_fee_usd ?? 0;
            return (
              <button
                key={c.id}
                type="button"
                className="search-result"
                onClick={() => {
                  setQ("");
                  setOpen(false);
                  onPick(c);
                }}
              >
                <CardArt
                  variant={variantForCard(c)}
                  issuer={c.issuer}
                  network={c.network ?? undefined}
                  size="md"
                />
                <div className="search-result-body">
                  <div className="name">{c.name}</div>
                  <div className="meta">
                    {c.issuer} · {fee === 0 ? "No fee" : `${fmt.usd(fee)}/yr`}
                  </div>
                </div>
                <span className="chip search-add" aria-hidden>
                  Add
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
