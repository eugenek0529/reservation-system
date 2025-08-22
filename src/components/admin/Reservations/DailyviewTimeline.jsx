import React, { useMemo } from "react";

const BOX =
  "w-12 h-14 md:w-14 md:h-16 rounded-lg shadow-sm ring-1 grid place-items-center text-xs font-medium";
const BADGE = "text-[10px] leading-none tracking-wide mt-0.5";

function DailyviewTimeline({ schedule = [] }) {
  // The component is now much simpler. It just renders the pre-structured data.
  const timelineSlots = useMemo(() => {
    return schedule.map((slot) => {
      // Since status is always "reserved" unless admin sets "pending"
      const reserved = slot.reservations.filter((r) => r.status === "reserved");
      const pending = slot.reservations.filter((r) => r.status === "pending");
      
      // Fix: Use currentCapacity instead of reservations.length for accurate count
      const openCount = Math.max(
        0,
        slot.maxCapacity - slot.currentCapacity
      );

      // make vertical stack items (order: reserved → pending → open)
      const stack = [
        // Show ALL reservations from the array
        ...slot.reservations.map((r) => ({
          id: r.id,
          type: r.status === "pending" ? "pending" : "reserved", // Default to reserved
          label: String(r.guestCount),
          title: `${r.guestName} • ${r.guestCount} guests • ${slot.startTime}`,
        })),
        // Add open slots after reservations
        ...Array.from({ length: openCount }).map((_, i) => ({
          id: `open-${slot.reservationSlotId}-${i}`,
          type: "open",
          label: "+",
          title: "Open spot",
        })),
      ];

      return {
        key: slot.reservationSlotId,
        label: slot.startTime,
        typeName: slot.reservationTypeName,
        reservedCount: reserved.length,
        pendingCount: pending.length,
        max: slot.maxCapacity,
        stack,
      };
    });
  }, [schedule]);

  return (
    <div className="p-4">
      {/* legend */}
      <div className="flex items-center gap-5 mb-3 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3.5 h-3.5 rounded bg-rose-500 ring-1 ring-rose-600/70" />
          Reserved
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3.5 h-3.5 rounded bg-amber-300 ring-amber-500/60" />
          Pending/Hold
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3.5 h-3.5 rounded bg-emerald-50 ring-1 ring-emerald-300" />
          Open
        </div>
      </div>

      {/* timeline columns */}
      <div
        className="grid gap-4 overflow-x-auto"
        style={{
          gridTemplateColumns: `repeat(${timelineSlots.length}, minmax(100px, 120px))`, // Max width of 120px instead of unlimited
        }}
      >
        {timelineSlots.map((slot) => (
          <div
            key={slot.key}
            className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
          >
            {/* header (time label + quick stats) */}
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-800 text-center">
                {slot.typeName}
              </div>
              <div className="text-xs text-gray-500 text-center">
                ({slot.label})
              </div>
              <div className="text-[11px] text-gray-500 text-center mt-0.5">
                {slot.currentCapacity}/{slot.maxCapacity}
              </div>
            </div>

            {/* vertical stack under the time header */}
            <div className="p-3">
              <div className="flex flex-col items-stretch gap-2">
                {slot.stack.map((cell) => {
                  if (cell.type === "reserved") {
                    return (
                      <div
                        key={cell.id}
                        className={`${BOX} bg-rose-500 text-white ring-rose-600/70`}
                        title={cell.title}
                      >
                        <div className="text-sm">{cell.label}</div>
                        <div className={`${BADGE}`}>RES</div>
                      </div>
                    );
                  }
                  if (cell.type === "pending") {
                    return (
                      <div
                        key={cell.id}
                        className={`${BOX} bg-amber-300 text-white ring-amber-500/70`}
                        title={cell.title}
                      >
                        <div className="text-sm">{cell.label}</div>
                        <div className={`${BADGE}`}>HOLD</div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={cell.id}
                      className={`${BOX} bg-emerald-50 text-emerald-700 ring-emerald-300`}
                      title={cell.title}
                    >
                      <div className="text-base leading-none">+</div>
                      <div className={`${BADGE}`}>OPEN</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyviewTimeline;
