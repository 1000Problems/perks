// Number formatters used across the rec panel and onboarding.

export const fmt = {
  usd(n: number): string {
    return "$" + Math.round(n).toLocaleString("en-US");
  },
  usdSign(n: number): string {
    return (n >= 0 ? "+$" : "−$") + Math.abs(Math.round(n)).toLocaleString("en-US");
  },
  pct(r: number): string {
    return (r * 100).toFixed(r >= 0.1 ? 0 : 1) + "%";
  },
};

export function heatColor(rate: number): string {
  if (rate >= 0.05) return "var(--hm-5)";
  if (rate >= 0.04) return "var(--hm-4)";
  if (rate >= 0.03) return "var(--hm-3)";
  if (rate >= 0.02) return "var(--hm-2)";
  if (rate >= 0.015) return "var(--hm-1)";
  return "var(--hm-0)";
}

export function heatTextColor(rate: number): string {
  if (rate >= 0.04) return "oklch(0.25 0.06 155)";
  return "oklch(0.40 0.04 155)";
}
