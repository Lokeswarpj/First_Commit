import React from "react";

export type ChipStatus = "PASS" | "WARN" | "FAIL" | "ACTIVE" | "INFO";

interface StatusChipProps {
  status: ChipStatus;
  label?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, label }) => {
  const dotColor =
    status === "PASS"
      ? "#62c073"
      : status === "WARN"
      ? "#999999"
      : status === "ACTIVE"
      ? "#52a8ff"
      : "#ededed";

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

