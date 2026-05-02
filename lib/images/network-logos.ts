// Inline SVG snippets for network logos. Stylized monograms — never reproduce
// trademarked artwork pixel-for-pixel. These are abstract identifiers
// (V / MC / AX / D) sized for the synthetic card's bottom-right corner.

export type NetworkLogoSlug = "visa" | "mastercard" | "amex" | "discover" | "diners" | "generic";

interface LogoMarkup {
  inner: string; // SVG fragment, anchored within a 220×80 box at (0,0)
  width: number;
  height: number;
}

const monogram = (letters: string, color: string, fontSize = 64): LogoMarkup => ({
  inner: `<text x="0" y="60" font-family="Inter, system-ui, sans-serif"
                font-weight="700" font-size="${fontSize}"
                fill="${color}" letter-spacing="-2">${letters}</text>`,
  width: 220,
  height: 80,
});

export const NETWORK_LOGOS: Record<NetworkLogoSlug, LogoMarkup> = {
  visa:       monogram("VISA", "#FFFFFF", 56),
  mastercard: monogram("MC", "#FFFFFF"),
  amex:       monogram("AX", "#FFFFFF"),
  discover:   monogram("DISC", "#FFFFFF", 48),
  diners:     monogram("DC", "#FFFFFF"),
  generic:    monogram("CC", "#FFFFFF"),
};

export function logoFor(slug: string | null | undefined): LogoMarkup {
  if (!slug) return NETWORK_LOGOS.generic;
  const norm = slug.toLowerCase();
  if (norm.includes("visa")) return NETWORK_LOGOS.visa;
  if (norm.includes("master")) return NETWORK_LOGOS.mastercard;
  if (norm.includes("amex") || norm.includes("american_express")) return NETWORK_LOGOS.amex;
  if (norm.includes("discover")) return NETWORK_LOGOS.discover;
  if (norm.includes("diner")) return NETWORK_LOGOS.diners;
  return NETWORK_LOGOS.generic;
}
