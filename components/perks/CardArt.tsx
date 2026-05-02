import type { CardArtVariant } from "@/lib/data/types";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_WIDTH: Record<Size, number> = {
  xs: 44,
  sm: 64,
  md: 96,
  lg: 160,
  xl: 240,
};

interface Props {
  variant?: CardArtVariant;
  /** Full product name. Rendered on the card face only at lg/xl, where there's
   * room for it to read cleanly. Ignored at sm/md (the wordmark layout). */
  name?: string;
  issuer?: string;
  /** Payment network (e.g. "visa", "mastercard", "amex"). Renders as a short
   * mark in the bottom-right at compact (sm/md) sizes. Skipped when it would
   * duplicate the issuer wordmark (e.g. Amex cards already say AMEX). */
  network?: string;
  size?: Size;
  className?: string;
  style?: React.CSSProperties;
}

// Short text mark mirroring lib/images/network-logos.ts. Kept here so the
// HTML renderer doesn't have to inline SVG logos.
function networkMark(network: string | undefined): string | null {
  if (!network) return null;
  const n = network.toLowerCase();
  if (n.includes("visa")) return "VISA";
  if (n.includes("master")) return "MC";
  if (n.includes("amex") || n.includes("american_express") || n.includes("american express")) return "AMEX";
  if (n.includes("discover")) return "DISC";
  if (n.includes("diner")) return "DINERS";
  return null;
}

export function CardArt({
  variant = "art-navy",
  name,
  issuer,
  network,
  size = "md",
  className = "",
  style = {},
}: Props) {
  const wordmark = issuer?.toUpperCase();
  const net = networkMark(network);
  // Don't print AMEX twice on Amex's own cards.
  const showNet = !!net && net !== wordmark;
  // Two layouts. Compact (sm/md) shows just the issuer wordmark + network mark
  // — small thumbnails can't fit a wrapped product name. Detail (lg/xl)
  // restores the original product-name + issuer layout, which reads cleanly at
  // 160px+ and gives the card art enough text to feel substantive in the
  // detail panel. xs (44px) is too small for any text.
  const isDetail = size === "lg" || size === "xl";
  const showCompactLabel = !isDetail && size !== "xs" && (!!wordmark || showNet);
  const showDetailLabel = isDetail && (!!name || !!wordmark);
  return (
    <div
      className={`card-art ${variant} ${className}`}
      style={{ width: SIZE_WIDTH[size], ...style }}
    >
      <div className="chip" />
      {showCompactLabel && (
        <div className="label">
          {wordmark ? <span>{wordmark}</span> : <span />}
          {showNet && <span className="net">{net}</span>}
        </div>
      )}
      {showDetailLabel && (
        <div className="label-detail">
          {name && <span className="name">{name}</span>}
          {wordmark && <span>{wordmark}</span>}
        </div>
      )}
    </div>
  );
}
