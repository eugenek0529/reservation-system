import React, { useMemo } from 'react';

function DailyviewList({ reservations = [] }) {
  const sorted = useMemo(
    () => [...reservations].sort((a, b) => a.time.localeCompare(b.time)),
    [reservations]
  );
  const counts = useMemo(() => ({
    confirmed: sorted.filter(r => r.status === 'confirmed').length,
    pending: sorted.filter(r => r.status === 'pending').length,
  }), [sorted]);

  return (
    <div className="p-4">
      {/* header summary */}
      <div className="mb-4">
        <h2 className="text-base text-gray-800">Today's Reservations ({sorted.length})</h2>
        <div className="mt-1 flex gap-6 text-xs">
          <span className="text-green-600">{counts.confirmed} Confirmed</span>
          <span className="text-amber-600">{counts.pending} Pending</span>
        </div>
      </div>

      {/* cards */}
      <div className="space-y-3">
        {sorted.map(r => (
          <div
            key={r.id}
            className="border border-gray-200 rounded-xl bg-white h-28 p-4 flex flex-col justify-between"
          >
            {/* name only (small, no bold) */}
            <div className="text-sm text-gray-900">{r.name}</div>

            {/* meta row: guests + time (small) */}
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                {/* user icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                <span>{r.guests} guests</span>
              </div>

              <div className="flex items-center gap-1">
                {/* clock */}
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
                <span>{r.time}</span>
              </div>
            </div>

          
            {r.note ? (
              <div className="text-xs text-gray-500 truncate">Note: {r.note}</div>
            ) : (
              <div className="text-[11px] text-transparent select-none">.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyviewList;