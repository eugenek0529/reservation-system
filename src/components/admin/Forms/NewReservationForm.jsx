import React, { useMemo, useState, useEffect } from 'react';
import { ReservationAvailabilityAPI } from '../../../api/reservationAvailabilityAPI';

export default function NewReservationForm({
  initialData,
  onSubmit,
  onCancel,
  selectedDate = new Date(),
}) {
  const [form, setForm] = useState({
    customerName: '',
    contactEmail: '',
    contactPhone: '',
    date: selectedDate.toISOString().slice(0, 10),
    reservationSlotId: '',
    guests: 2,
    status: 'reserved',
    specialRequirements: '',
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [capacityInfo, setCapacityInfo] = useState(null);

  // Fetch available slots for the selected date
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!form.date) return;
      
      try {
        setLoading(true);
        const slots = await ReservationAvailabilityAPI.getAvailableSlots(form.date);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Failed to fetch available slots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [form.date]);

  // Update capacity info when slot is selected
  useEffect(() => {
    if (form.reservationSlotId) {
      const selectedSlot = availableSlots.find(slot => slot.reservation_slot_id === form.reservationSlotId);
      if (selectedSlot) {
        setCapacityInfo({
          maxCapacity: selectedSlot.max_capacity,
          currentReserved: selectedSlot.current_capacity,
          available: selectedSlot.max_capacity - selectedSlot.current_capacity
        });
      }
    }
  }, [form.reservationSlotId, availableSlots]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.customerName?.trim()) e.customerName = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.reservationSlotId) e.reservationSlotId = 'Required';
    if (!form.guests || form.guests < 1) e.guests = 'Must be at least 1';
    if (capacityInfo && form.guests > capacityInfo.available) {
      e.guests = `Only ${capacityInfo.available} seats available`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      
      const reservationData = {
        customerName: form.customerName.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        date: form.date,
        reservationSlotId: form.reservationSlotId,
        guests: Number(form.guests),
        status: form.status,
        specialRequirements: form.specialRequirements?.trim(),
      };

      await onSubmit?.(reservationData);
    } catch (error) {
      console.error('Reservation creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Create New Reservation</h2>
          <p className="text-sm text-gray-600 mt-1">Add a new reservation for your restaurant</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">
              Customer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input 
                  type="text"
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-colors focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.customerName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={form.customerName}
                  onChange={(e) => set('customerName', e.target.value)}
                  placeholder="Enter customer name"
                />
                {errors.customerName && (
                  <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests *
                </label>
                <input 
                  type="number" 
                  min={1}
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-colors focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.guests ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={form.guests}
                  onChange={(e) => set('guests', e.target.value)}
                />
                {errors.guests && (
                  <p className="text-xs text-red-600 mt-1">{errors.guests}</p>
                )}
                {capacityInfo && (
                  <p className="text-xs text-gray-500 mt-1">
                    {capacityInfo.available} of {capacityInfo.maxCapacity} seats available
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input 
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm transition-colors focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  value={form.contactEmail}
                  onChange={(e) => set('contactEmail', e.target.value)}
                  placeholder="customer@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input 
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm transition-colors focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  value={form.contactPhone}
                  onChange={(e) => set('contactPhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">
              Reservation Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input 
                  type="date"
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-colors focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                />
                {errors.date && (
                  <p className="text-xs text-red-600 mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reservation Slot *
                </label>
                <select 
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-colors focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.reservationSlotId ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={form.reservationSlotId}
                  onChange={(e) => set('reservationSlotId', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select a slot</option>
                  {availableSlots.map(slot => (
                    <option key={slot.reservation_slot_id} value={slot.reservation_slot_id}>
                      {slot.startTime} - {slot.reservationTypeName} 
                      ({slot.max_capacity - slot.current_capacity} seats available)
                    </option>
                  ))}
                </select>
                {errors.reservationSlotId && (
                  <p className="text-xs text-red-600 mt-1">{errors.reservationSlotId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm transition-colors focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                >
                  <option value="reserved">Reserved</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements
              </label>
              <textarea 
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm transition-colors focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                value={form.specialRequirements}
                onChange={(e) => set('specialRequirements', e.target.value)}
                placeholder="Any special requests or dietary requirements..."
              />
            </div>
          </div>

          {/* Capacity Indicator */}
          {capacityInfo && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Capacity Overview</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {capacityInfo.maxCapacity} total seats • {capacityInfo.currentReserved} reserved • {capacityInfo.available} available
                  </p>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
