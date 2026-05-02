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
  name?: string;
  issuer?: string;
  size?: Size;
  className?: string;
  style?: React.CSSProperties;
}

export function CardArt({
  variant = "art-navy",
  name,
  issuer,
  size = "md",
  className = "",
  style = {},
}: Props) {
  const showLabel = size !== "xs" && size !== "sm";
  return (
    <div
      className={`card-art ${variant} ${className}`}
      style={{ width: SIZE_WIDTH[size], ...style }}
    >
      <div className="chip" />
      {showLabel && (
        <div className="label">
          <span className="name">{name}</span>
          <span>{issuer?.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}
