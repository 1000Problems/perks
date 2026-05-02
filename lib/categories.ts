// Spend categories — app-domain values used by onboarding and the rec
// panel. Engine consumes these via SpendCategoryId; the icons/labels/
// defaults are presentation concerns the engine doesn't care about.

import type { SpendCategory } from "@/lib/data/types";

export const SPEND_CATEGORIES: SpendCategory[] = [
  { id: "groceries", label: "Groceries", default: 8400, icon: "🛒" },
  { id: "dining", label: "Dining", default: 4200, icon: "🍽" },
  { id: "gas", label: "Gas", default: 2400, icon: "⛽" },
  { id: "airfare", label: "Airfare", default: 1800, icon: "✈" },
  { id: "hotels", label: "Hotels", default: 1500, icon: "🏨" },
  { id: "streaming", label: "Streaming", default: 480, icon: "▶" },
  { id: "shopping", label: "Online shopping", default: 3600, icon: "📦" },
  { id: "drugstore", label: "Drugstore", default: 600, icon: "💊" },
  { id: "transit", label: "Transit / rideshare", default: 1200, icon: "🚖" },
  { id: "utilities", label: "Utilities", default: 2400, icon: "💡" },
  { id: "home", label: "Home improvement", default: 1500, icon: "🔨" },
  { id: "other", label: "Everything else", default: 6000, icon: "·" },
];
