// Synthetic card-art renderer. Pure function. Deterministic output —
// snapshot tests pin the SVG bytes. Do not introduce randomness, dates,
// or external font loads.

import { logoFor } from "./network-logos";

export interface SyntheticSpec {
  background_color: string;
  accent_color: string;
  text_color?: string;
  network_logo_slug?: string | null;
  issuer_name_short: string;
  card_name_short: string;
  currency_short?: string | null;
}

const VIEWBOX = "0 0 1080 680";
const CORNER = 36;

export function renderSynthetic(spec: SyntheticSpec): string {
  const text = spec.text_color ?? "#FFFFFF";
  const logo = logoFor(spec.network_logo_slug);

  // Diagonal accent stripe + soft radial highlight at top-left.
  const accent = `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${spec.background_color}"/>
        <stop offset="100%" stop-color="${darken(spec.background_color, 0.6)}"/>
      </linearGradient>
      <radialGradient id="hl" cx="0.2" cy="0.2" r="0.6">
        <stop offset="0%" stop-color="${spec.accent_color}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${spec.accent_color}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="680" rx="${CORNER}" ry="${CORNER}" fill="url(#bg)"/>
    <rect width="1080" height="680" rx="${CORNER}" ry="${CORNER}" fill="url(#hl)"/>
    <rect x="0" y="540" width="1080" height="6" fill="${spec.accent_color}" opacity="0.35"/>
  `;

  const issuerY = 90;
  const cardY = 350;
  const currencyY = 600;

  const cardName = escapeXml(spec.card_name_short);
  const issuerName = escapeXml(spec.issuer_name_short);
  const currency = spec.currency_short ? escapeXml(spec.currency_short) : null;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" preserveAspectRatio="xMidYMid meet">
${accent}
  <text x="60" y="${issuerY}" font-family="Inter, system-ui, sans-serif"
        font-weight="600" font-size="36" fill="${text}" letter-spacing="-0.5">${issuerName}</text>
  <text x="60" y="${cardY}" font-family="Inter, system-ui, sans-serif"
        font-weight="700" font-size="64" fill="${text}" letter-spacing="-1.5">${cardName}</text>
  ${currency ? `<text x="60" y="${currencyY}" font-family="Inter, system-ui, sans-serif"
        font-weight="500" font-size="28" fill="${text}" opacity="0.7">${currency}</text>` : ""}
  <g transform="translate(820, 560)">
    ${logo.inner}
  </g>
</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;" }[c] ?? c));
}

// Naive HSL-darken via mix-with-black. Good enough for gradient stops.
function darken(hex: string, factor: number): string {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return hex;
  const r = Math.round(parseInt(m[1], 16) * factor);
  const g = Math.round(parseInt(m[2], 16) * factor);
  const b = Math.round(parseInt(m[3], 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
