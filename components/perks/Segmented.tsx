"use client";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  size?: "sm" | "md";
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = "md",
}: Props<T>) {
  return (
    <div
      className="seg"
      style={size === "sm" ? { transform: "scale(0.92)", transformOrigin: "left" } : {}}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          data-active={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
