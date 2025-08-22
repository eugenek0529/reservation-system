import React from "react";

/*
{
  
  "guestName": "customer", v
  "guestCount": 2, 
  "status": "reserved", v
  "note": "No uni for one person",
  "email": "customer@reservation.com", v
  "phone": "123123123", v
  "memberSince": "2025-08",
  "lastVisit": "2025-08-20 23:05",
  "reservationTime": "17:30" v
}

*/

function ReservationDetailPopup({ reservation, onClose }) {
  console.log(reservation);
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold text-gray-900">Reservation Details</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* user info */}
      <div className="flex mb-3 border border-gray-200 rounded-lg p-4 bg-gray-100 items-center gap-4">
        <div className="icon border border-gray-50 bg-gray-200 rounded-full p-5 text-xl text-gray-500">
          {reservation.guestName.charAt(0)}{reservation.guestName.charAt(1)}
        </div>
        <div className="userInfo flex flex-col gap-0.5 w-full">
          <div className="text-md font-medium text-gray-900">{reservation.guestName}</div>
          <div className="text-xs text-gray-500">Email: {reservation.email}</div>
          <div className="text-xs text-gray-500">Phone: {reservation.phone}</div>
        </div>
      </div>

      {/* modify or cancel button */}
      <div className="flex justify-center gap-2 mb-4">
        <button className="bg-gray-300 text-gray-900 hover:bg-gray-400 text-sm px-4 py-1 rounded-lg w-full cursor-pointer">Modify</button>
        <button className="bg-red-300 text-red-900 hover:bg-red-400 text-sm px-4 py-1 rounded-lg w-full cursor-pointer">Cancel</button>
      </div>

      {/* reservation info */}
      <div className="mt-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-base mb-5 text-gray-900">Reservation Information</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Date</span>
              <span className="text-sm  text-gray-900">
                {new Date(reservation.date || Date.now()).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Time</span>
              <span className="text-sm  text-gray-900">{reservation.reservationTime || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Party Size</span>
              <span className="text-sm  text-gray-900">{reservation.guestCount || 0} guests</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Status</span>
              <span className="text-sm  text-gray-900 capitalize">{reservation.status || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* reservation note */}
      <div className="mt-4">
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
          <h4 className="text-base mb-5 text-gray-900">Reservation Note*</h4>
          <p className="text-sm text-gray-900">{reservation.note || 'N/A'}</p>
        </div>
      </div>

      {/* user created and lastvisit */}
      <div className="mt-4">
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
          
          <p className="text-sm text-gray-900">Member Since: {reservation.memberSince || 'N/A'}</p>
          <p className="text-sm text-gray-900">Last Visit: {reservation.lastVisit || 'N/A'}</p>
        </div>
      </div>
      
    </div>
  );
}

export default ReservationDetailPopup;