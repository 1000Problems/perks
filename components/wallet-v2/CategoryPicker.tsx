"use client";

// 5x category picker for cards that accept a pinned category (Citi
// Custom Cash, etc.). Renders a chip grid; user picks one. Top three
// spend categories from the user's profile are highlighted as
// recommended pins.

import type { SpendCategoryId } from "@/lib/data/types";

const LABELS: Partial<Record<SpendCategoryId, { label: string; icon: string }>> = {
  dining: { label: "Restaurants", icon: "🍴" },
  gas: { label: "Gas", icon: "⛽" },
  groceries: { label: "Groceries", icon: "🥬" },
  drugstore: { label: "Drugstores", icon: "℞" },
  home: { label: "Home Improvement", icon: "🔨" },
  streaming: { label: "Streaming", icon: "▶" },
  transit: { label: "Transit", icon: "🚆" },
  airfare: { label: "Air Travel", icon: "✈" },
  hotels: { label: "Hotels", icon: "🛎" },
  shopping: { label: "Online Shopping", icon: "🛍" },
  utilities: { label: "Utilities", icon: "💡" },
  other: { label: "Everything else", icon: "•" },
};

interface Props {
  options: SpendCategoryId[]; // categories the card accepts
  value: SpendCategoryId | null;
  onChange: (next: SpendCategoryId | null) => void;
  recommended?: SpendCategoryId[]; // user's top spend categories
}

export function CategoryPicker({
  options,
  value,
  onChange,
  recommended = [],
}: Props) {
  return (
    <div>
      <div className="cat-grid">
        {options.map((id) => {
          const meta = LABELS[id];
          if (!meta) return null;
          const on = value === id;
          const isRec = recommended.includes(id);
          return (
            <button
              key={id}
              type="button"
              className="cat-pill"
              data-on={on ? "true" : "false"}
              onClick={() => onChange(on ? null : id)}
            >
              <span className="cat-icon" aria-hidden>
                {meta.icon}
              </span>
              <span>{meta.label}</span>
              {isRec && <span className="pin">your top</span>}
            </button>
          );
        })}
      </div>
      <div className="cat-note">
        Recommended pins are based on your top three spend categories.
      </div>
    </div>
  );
}
