import React from "react";

export default function MiniSemiDonut({
  total,
  reserved,
  pending,
  available,
  size = 44,
  stroke = 6,
}) {
  if (total === 0) return <div className="text-xs text-gray-400">No slots</div>;

  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius;

  const reservedPercent = total > 0 ? reserved / total : 0;
  const pendingPercent = total > 0 ? pending / total : 0;
  const availablePercent = total > 0 ? available / total : 0;

  const reservedArc = reservedPercent * circumference;
  const pendingArc = pendingPercent * circumference;
  const availableArc = availablePercent * circumference;

  return (
    <div className="relative" style={{ width: size, height: size / 2 }}>
      <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        {/* Reserved (red) */}
        {reserved > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-reservation)"
            strokeWidth={stroke}
            strokeDasharray={`${reservedArc} ${circumference}`}
            strokeDashoffset={circumference / 2}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}

        {/* Pending (yellow) */}
        {pending > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-pending)"
            strokeWidth={stroke}
            strokeDasharray={`${pendingArc} ${circumference}`}
            strokeDashoffset={circumference / 2 + reservedArc}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}

        {/* Available (green) */}
        {available > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-available)"
            strokeWidth={stroke}
            strokeDasharray={`${availableArc} ${circumference}`}
            strokeDashoffset={circumference / 2 + reservedArc + pendingArc}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-[10px] text-gray-600 font-medium">
          {reserved + pending}/{total}
        </div>
      </div>
    </div>
  );
}
