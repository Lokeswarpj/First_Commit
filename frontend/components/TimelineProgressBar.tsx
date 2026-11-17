import React from "react";

interface TimelineProgressBarProps {
  offsetPercent: number; // 0 to 100
  durationPercent: number; // 0 to 100
  isActive?: boolean;
}

export const TimelineProgressBar: React.FC<TimelineProgressBarProps> = ({
  offsetPercent,
  durationPercent,
  isActive = false,
}) => {
  return (
    <div className="w-full h-1.5 bg-[#e2e8f0] relative overflow-hidden rounded-full">
      <div
        className="absolute top-0 bottom-0 rounded-full transition-all"
        style={{
          left: `${Math.min(100, Math.max(0, offsetPercent))}%`,
          width: `${Math.min(100 - offsetPercent, Math.max(2, durationPercent))}%`,
          backgroundColor: isActive ? "#2563eb" : "#94a3b8",
        }}
      />
    </div>
  );
};

