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
  /** @deprecated Card name is no longer rendered on the card face — surrounding UI labels the card. Prop kept for API compat. */
  name?: string;
  issuer?: string;
  size?: Size;
  className?: string;
  style?: React.CSSProperties;
}

export function CardArt({
  variant = "art-navy",
  issuer,
  size = "md",
  className = "",
  style = {},
}: Props) {
  // Hide the wordmark at xs (44px) — there's no room. Everywhere else
  // the issuer abbreviation reads as a real card's brand mark.
  const showLabel = size !== "xs" && !!issuer;
  return (
    <div
      className={`card-art ${variant} ${className}`}
      style={{ width: SIZE_WIDTH[size], ...style }}
    >
      <div className="chip" />
      {showLabel && (
        <div className="label">
          <span>{issuer?.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}
