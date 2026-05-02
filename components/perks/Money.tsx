import { fmt } from "@/lib/utils/format";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<Size, number> = {
  sm: 18,
  md: 28,
  lg: 48,
  xl: 64,
};

interface Props {
  value: number;
  sign?: boolean;
  size?: Size;
  positive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Money({
  value,
  sign = false,
  size = "lg",
  positive,
  className = "",
  style = {},
}: Props) {
  const isPos = positive !== undefined ? positive : value >= 0;
  return (
    <span
      className={`num ${className}`}
      style={{
        fontSize: SIZE_PX[size],
        color: sign ? (isPos ? "var(--pos)" : "var(--neg)") : "var(--ink)",
        lineHeight: 1,
        fontWeight: 400,
        ...style,
      }}
    >
      {sign ? fmt.usdSign(value) : fmt.usd(value)}
    </span>
  );
}
