// Server component. Resolves card_id → real <img> or inline synthetic <svg>.
// Mounts cleanly inside server-rendered routes; client routes need to
// fetch via a server action or accept a pre-resolved prop.

import { resolveCardImage, type ImageRole, type ImageSize } from "@/lib/images/resolve";

type DisplaySize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_TO_LABEL: Record<DisplaySize, ImageSize> = {
  xs: "thumb",
  sm: "thumb",
  md: "card",
  lg: "card",
  xl: "hero",
};

const SIZE_WIDTH: Record<DisplaySize, number> = {
  xs: 44, sm: 64, md: 96, lg: 160, xl: 240,
};

interface Props {
  cardId: string;
  alt: string;
  size?: DisplaySize;
  role?: ImageRole;
  className?: string;
}

export async function CardImage({
  cardId, alt, size = "md", role = "front", className = "",
}: Props) {
  const resolved = await resolveCardImage(cardId, SIZE_TO_LABEL[size], role);
  const widthCss = { width: SIZE_WIDTH[size] };

  if (resolved.type === "real") {
    return (
      <img
        src={resolved.url}
        alt={alt}
        width={resolved.width_px}
        height={resolved.height_px}
        className={`card-img ${className}`}
        style={widthCss}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`card-img card-img--synthetic ${className}`}
      style={widthCss}
      role="img"
      aria-label={alt}
      // SVG is generated server-side from a deterministic spec; safe.
      dangerouslySetInnerHTML={{ __html: resolved.svg }}
    />
  );
}
