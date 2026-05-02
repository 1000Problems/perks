// Tiny color identifier for wallet-row contexts. Strips the chip and any
// text — just the gradient surface from the card's variant. Card-shaped
// (1.586:1) so the eye reads it as "a card" without the visual weight
// of a real card image.

import type { CardArtVariant } from "@/lib/data/types";

interface Props {
  variant?: CardArtVariant;
  // Width in px. Height follows the credit-card aspect ratio.
  width?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function CardSwatch({
  variant = "art-navy",
  width = 22,
  className = "",
  style = {},
}: Props) {
  return (
    <div
      className={`card-swatch ${variant} ${className}`}
      style={{ width, ...style }}
      aria-hidden
    />
  );
}
