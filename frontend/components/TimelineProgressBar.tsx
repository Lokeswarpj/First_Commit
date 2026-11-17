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
    <div className="w-full h-1.5 bg-transparent relative overflow-hidden">
      <div
        className="absolute top-0 bottom-0 rounded-[2px] transition-all"
        style={{
          left: `${Math.min(100, Math.max(0, offsetPercent))}%`,
          width: `${Math.min(100 - offsetPercent, Math.max(2, durationPercent))}%`,
          backgroundColor: isActive ? "#52a8ff" : "rgba(255, 255, 255, 0.18)",
        }}
      />
    </div>
  );
};

