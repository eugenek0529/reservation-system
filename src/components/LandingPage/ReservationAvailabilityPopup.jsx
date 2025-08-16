import React, { useState, useEffect } from 'react';
import { ReservationAvailabilityAPI } from '../../api/reservationAvailabilityAPI';

export default function ReservationAvailabilityPopup({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onBookReservation 
}) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available slots when popup opens
  useEffect(() => {
    if (isOpen && selectedDate) {
      fetchAvailableSlots();
    }
  }, [isOpen, selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching slots for date:', selectedDate);
      
      // Using existing function - COMMENT: Uses getAvailableSlots from ReservationAvailabilityAPI
      const slots = await ReservationAvailabilityAPI.getAvailableSlots(selectedDate);
      
      console.log('Raw API response:', slots);
      console.log('Number of slots returned:', slots?.length || 0);
      
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = (slot) => {
    onBookReservation(slot);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-gray-900">Reservation</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
  Available slots for {new Date(selectedDate.replace(/-/g, '/')).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  })}
</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading available slots...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading availability</p>
              <p className="text-gray-600 text-sm">{error}</p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No available slots for this date</p>
              <p className="text-sm text-gray-500">Please try another date or contact us directly</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableSlots.map((slot) => {
                // Fix: Check if current_capacity is less than max_capacity
                const isAvailable = slot.current_capacity < slot.max_capacity;
                
                return (
                  <div 
                    key={slot.id}
                    className={`border rounded-xl p-4 ${
                      isAvailable ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    {/* Reservation Type Header */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {slot.reservationTypeName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {slot.startTime} - {slot.reservationTypeName} led by the Main Chef
                      </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-sm text-gray-700">
                      <div>※ Market Price Range</div>
                      
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {isAvailable ? (
                          <span className="text-green-600">
                            Available
                          </span>
                        ) : (
                          <span className="text-red-600">Sold out</span>
                        )}
                      </div>
                      
                      {isAvailable ? (
                        <button
                          onClick={() => handleBookSlot(slot)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Book
                        </button>
                      ) : (
                        <div className="text-gray-500 text-sm font-medium">
                          Sold out
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
              Notify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
