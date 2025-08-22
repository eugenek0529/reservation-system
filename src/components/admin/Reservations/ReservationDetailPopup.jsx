import React from "react";

function ReservationDetailPopup({ reservation, onClose }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64 max-w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Reservation Details</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-gray-700">Guest:</span> {reservation.guestName || "Unknown"}
        </div>
        <div>
          <span className="font-medium text-gray-700">Guests:</span> {reservation.guestCount || 0}
        </div>
        <div>
          <span className="font-medium text-gray-700">Time:</span> {reservation.reservationTime || "No time"}
        </div>
        {reservation.note && (
          <div>
            <span className="font-medium text-gray-700">Note:</span> {reservation.note}
          </div>
        )}
        <div>
          <span className="font-medium text-gray-700">Status:</span> {reservation.status || "Unknown"}
        </div>
      </div>
    </div>
  );
}

export default ReservationDetailPopup;