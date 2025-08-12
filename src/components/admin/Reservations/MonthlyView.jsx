import React, { useMemo } from "react";

// Minimal semicircle graph for a day cell
function MiniSemiDonut({
  total = 0,
  reserved = 0,
  pending = 0,
  available = 0,
  size = 44,
  stroke = 6,
}) {
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2 + r * 0.2; // push graph slightly down so it looks balanced
  const path = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  const circumference = Math.PI * r;
  const clamp = (n) => (Number.isFinite(n) ? Math.max(0, n) : 0);
  const t = Math.max(0, total || reserved + pending + available || 0);
  const resP = clamp(reserved) / (t || 1);
  const penP = clamp(pending) / (t || 1);
  const avlP = clamp(available) / (t || 1);

  const resDash = resP * circumference;
  const penDash = penP * circumference;
  const avlDash = avlP * circumference;

  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox={`0 0 ${size} ${size * 0.65}`}
    >
      <path
        d={path}
        fill="none"
        stroke="#eef2f7"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {t > 0 && (
        <>
          <path
            d={path}
            fill="none"
            stroke="#ef4444" // red
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${resDash} ${circumference}`}
            strokeDashoffset={0}
          />
          <path
            d={path}
            fill="none"
            stroke="#fbbf24" // yellow
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${penDash} ${circumference}`}
            strokeDashoffset={-resDash}
          />
          <path
            d={path}
            fill="none"
            stroke="#22c55e" // green
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${avlDash} ${circumference}`}
            strokeDashoffset={-(resDash + penDash)}
          />
        </>
      )}
    </svg>
  );
}

function startOfMonth(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfMonth(d) {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfGrid(d) {
  const first = startOfMonth(d);
  const day = first.getDay(); // Sun=0
  const g = new Date(first);
  g.setDate(first.getDate() - day);
  return g;
}
function endOfGrid(d) {
  const last = endOfMonth(d);
  const day = last.getDay();
  const g = new Date(last);
  g.setDate(last.getDate() + (6 - day));
  return g;
}
function iso(d) {
  return d.toISOString().slice(0, 10);
}

export default function MonthlyView({
  selectedDate = new Date(),
  metricsByDate = {},
  onSelectDate,
}) {
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();

  // Build 6-week grid (Sun-Sat)
  const days = useMemo(() => {
    const start = startOfGrid(selectedDate);
    const end = endOfGrid(selectedDate);
    const arr = [];
    const d = new Date(start);
    while (d <= end) {
      arr.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return arr;
  }, [selectedDate]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-3">
      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-[11px] text-gray-500">
        {weekDays.map((w) => (
          <div key={w} className="text-center">
            {w}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const key = iso(d);
          const data = metricsByDate[key] || null;
          const inMonth = d.getMonth() === month;
          const isToday =
            d.getFullYear() === new Date().getFullYear() &&
            d.getMonth() === new Date().getMonth() &&
            d.getDate() === new Date().getDate();

          return (
            <div
              key={key}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDate && onSelectDate(new Date(d))}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && onSelectDate)
                  onSelectDate(new Date(d));
              }}
              className={`rounded-lg border p-2 flex flex-col items-center justify-between bg-white cursor-pointer hover:bg-gray-50
                ${inMonth ? "border-gray-200" : "border-gray-100 bg-gray-50"}
                ${isToday ? "ring-2 ring-gray-900 ring-offset-1" : ""}`}
              style={{ minHeight: 84 }}
            >
              <div
                className={`text-xs ${
                  inMonth ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {d.getDate()}
              </div>

              <div className="mt-1">
                <MiniSemiDonut
                  total={data?.total ?? 0}
                  reserved={data?.reserved ?? 0}
                  pending={data?.pending ?? 0}
                  available={data?.available ?? 0}
                  size={44}
                  stroke={6}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
