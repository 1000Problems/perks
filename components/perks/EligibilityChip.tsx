import type { EligibilityStatus } from "@/lib/data/types";

interface Props {
  status: EligibilityStatus;
  label: string;
}

export function EligibilityChip({ status, label }: Props) {
  const cls =
    status === "green"
      ? "elig-green"
      : status === "yellow"
        ? "elig-yellow"
        : "elig-red";
  return (
    <span className={`elig ${cls}`}>
      <span className="elig-dot" />
      {label}
    </span>
  );
}
