import React from "react";

export type ChipStatus = "PASS" | "WARN" | "FAIL" | "ACTIVE" | "INFO";

interface StatusChipProps {
  status: ChipStatus;
  label?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, label }) => {
  const dotColor =
    status === "PASS"
      ? "#16a34a"
      : status === "WARN"
      ? "#d97706"
      : status === "ACTIVE"
      ? "#2563eb"
      : status === "FAIL"
      ? "#dc2626"
      : "#64748b";

  const displayLabel = label || status;

  return (
    <span className="v-chip">
      <span
        className="v-chip-dot"
        style={{ backgroundColor: dotColor }}
      />
      <span>{displayLabel}</span>
    </span>
  );
};

