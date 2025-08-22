import React, { useMemo, useState } from "react";
import ReservationDetailPopup from "./ReservationDetailPopup";

function DailyviewList({ reservations = [] }) {
  const sorted = useMemo(
    () =>
      [...reservations].sort((a, b) =>
        (a.reservationTime || "").localeCompare(b.reservationTime || "")
      ),
    [reservations]
  );

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const handleCardClick = (reservation, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    
    setPopupPosition({
      x: rect.right + 10, // 10px to the right of the card
      y: rect.top
    });
    setSelectedReservation(reservation);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setSelectedReservation(null);
    setShowPopup(false);
  };

  return (
    <div className="p-4 relative">
      {/* header summary */}
      <div className="mb-4">
        <h2 className="text-base text-gray-800">
          Today's Reservations ({sorted.length})
        </h2>
      </div>

      {/* cards */}
      <div className="space-y-3">
        {sorted.map((r) => (
          <div
            key={r.id}
            className="border border-gray-200 rounded-xl bg-white h-28 p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-50 relative"
            onClick={(event) => handleCardClick(r, event)}
          >
            {/* name only (small, no bold) */}
            <div className="text-sm text-gray-900">
              {r.guestName || "Unknown"}
            </div>

            {/* meta row: guests + time (small) */}
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                {/* user icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 6.75 0Z"
                  />
                </svg>
                <span>{r.guestCount || 0} guests</span>
              </div>

              <div className="flex items-center gap-1">
                {/* clock */}
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                  />
                </svg>
                <span>{r.reservationTime || "No time"}</span>
              </div>
            </div>

            {r.note ? (
              <div className="text-xs text-gray-500 truncate">
                Note: {r.note}
              </div>
            ) : (
              <div className="text-[11px] text-transparent select-none">.</div>
            )}
            
            {/* Popup positioned next to this specific card */}
            {showPopup && selectedReservation && selectedReservation.id === r.id && (
              <div 
                className="absolute left-full ml-2 top-0 z-50"
              >
                <ReservationDetailPopup
                  reservation={selectedReservation}
                  onClose={handleClosePopup}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyviewList;