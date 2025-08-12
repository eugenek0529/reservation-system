import React, { useMemo } from 'react'

const defaultSlots = [
  { key: 'lunch',   label: '12:00 PM', startMin: 11 * 60 + 45, endMin: 12 * 60 + 45, max: 8 },
  { key: 'dinner1', label: '5:30 PM',  startMin: 17 * 60 + 0,  endMin: 18 * 60 + 0,  max: 8 },
  { key: 'dinner2', label: '8:00 PM',  startMin: 19 * 60 + 30, endMin: 20 * 60 + 30, max: 8 },
];

const toMinutes = (timeString) => {
  if (!timeString) return 0; // Handle undefined/null time
  const [h, m] = timeString.split(':').map(Number);
  return (h % 24) * 60 + (m || 0);
};

const BOX = 'w-12 h-14 md:w-14 md:h-16 rounded-lg shadow-sm ring-1 grid place-items-center text-xs font-medium';
const BADGE = 'text-[10px] leading-none tracking-wide mt-0.5';

function DailyviewTimeline({ reservations = [], slots = defaultSlots }) {
  // bucket reservations by slot window
  const grouped = useMemo(() => {
    return slots.map(slot => {
      const inSlot = reservations.filter(r => {
        const mins = toMinutes(r.reservationTime); // Changed from r.time
        return mins >= slot.startMin && mins < slot.endMin;
      });
      const confirmed = inSlot.filter(r => r.status === 'confirmed');
      const pending = inSlot.filter(r => r.status === 'pending');
      const used = confirmed.length + pending.length;
      const openCount = Math.max(0, (slot.max ?? 0) - used);

      // make vertical stack items (order: confirmed → pending → open)
      const stack = [
        ...confirmed.map(r => ({ 
          id: r.id, 
          type: 'reserved', 
          label: String(r.guestCount), // Changed from r.guests
          title: `${r.guestName} • ${r.guestCount} guests • ${r.reservationTime}` // Changed from r.name and r.time
        })),
        ...pending.map((r, i) => ({ 
          id: `${r.id}-p${i}`, 
          type: 'pending', 
          label: String(r.guestCount), // Changed from r.guests
          title: `Pending • ${r.guestName} • ${r.guestCount} guests • ${r.reservationTime}` // Changed from r.name and r.time
        })),
        ...Array.from({ length: openCount }).map((_, i) => ({ 
          id: `open-${slot.key}-${i}`, 
          type: 'open', 
          label: '+', 
          title: 'Open spot' 
        })),
      ];

      return { ...slot, confirmed, pending, openCount, stack };
    });
  }, [reservations, slots]);

  return (
    <div className="p-4">
      {/* legend */}
      <div className="flex items-center gap-5 mb-3 text-[11px] text-gray-500">
        <div className="flex items-center gap-2"><span className="inline-block w-3.5 h-3.5 rounded bg-rose-500 ring-1 ring-rose-600/70" />Reserved</div>
        <div className="flex items-center gap-2"><span className="inline-block w-3.5 h-3.5 rounded bg-amber-300 ring-1 ring-amber-500/60" />Pending/Hold</div>
        <div className="flex items-center gap-2"><span className="inline-block w-3.5 h-3.5 rounded bg-emerald-50 ring-1 ring-emerald-300" />Open</div>
      </div>

      {/* timeline columns */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${grouped.length}, minmax(120px, 1fr))` }}
      >
        {grouped.map(slot => (
          <div key={slot.key} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            {/* header (time label + quick stats) */}
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="text-sm text-gray-800 text-center">{slot.label}</div>
              <div className="text-[11px] text-gray-500 text-center mt-0.5">
                {slot.confirmed.length + slot.pending.length}/{slot.max}
              </div>
            </div>

            {/* vertical stack under the time header */}
            <div className="p-3">
              <div className="flex flex-col items-stretch gap-2">
                {slot.stack.map(cell => {
                  if (cell.type === 'reserved') {
                    return (
                      <div key={cell.id} className={`${BOX} bg-rose-500 text-white ring-rose-600/70`} title={cell.title}>
                        <div className="text-sm">{cell.label}</div>
                        <div className={`${BADGE}`}>RES</div>
                      </div>
                    );
                  }
                  if (cell.type === 'pending') {
                    return (
                      <div key={cell.id} className={`${BOX} bg-amber-300 text-white ring-amber-500/70`} title={cell.title}>
                        <div className="text-sm">{cell.label}</div>
                        <div className={`${BADGE}`}>HOLD</div>
                      </div>
                    );
                  }
                  return (
                    <div key={cell.id} className={`${BOX} bg-emerald-50 text-emerald-700 ring-emerald-300`} title={cell.title}>
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
  )
}

export default DailyviewTimeline