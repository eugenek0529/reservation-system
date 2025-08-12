import React, { useMemo, useState } from 'react';

export default function NewReservationForm({
  initialData,
  onSubmit,
  onCancel,
  timeSlots = ['12:00', '17:30', '20:00'],
}) {
  const init = useMemo(() => ({
    customerName: '',
    contactEmail: '',
    contactPhone: '',
    date: '',
    timeSlot: timeSlots[0] || '',
    guests: 2,
    status: 'confirmed', // confirmed | pending | hold | cancelled
    note: '',
    ...initialData,
  }), [initialData, timeSlots]);

  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.customerName?.trim()) e.customerName = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.timeSlot) e.timeSlot = 'Required';
    if (!form.guests || form.guests < 1) e.guests = 'Must be at least 1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.({
      customerName: form.customerName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      date: form.date,
      timeSlot: form.timeSlot,
      guests: Number(form.guests),
      status: form.status,
      note: form.note?.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Customer name</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm"
                 value={form.customerName}
                 onChange={(e) => set('customerName', e.target.value)} />
          {errors.customerName && <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Guests</label>
          <input type="number" min={1} className="w-full border rounded-lg px-3 py-2 text-sm"
                 value={form.guests}
                 onChange={(e) => set('guests', e.target.value)} />
          {errors.guests && <p className="text-xs text-red-600 mt-1">{errors.guests}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Contact email</label>
          <input type="email" className="w-full border rounded-lg px-3 py-2 text-sm"
                 value={form.contactEmail}
                 onChange={(e) => set('contactEmail', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Contact phone</label>
          <input type="tel" className="w-full border rounded-lg px-3 py-2 text-sm"
                 value={form.contactPhone}
                 onChange={(e) => set('contactPhone', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Date</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"
                 value={form.date}
                 onChange={(e) => set('date', e.target.value)} />
          {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Time slot</label>
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={form.timeSlot}
                  onChange={(e) => set('timeSlot', e.target.value)}>
            {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
          </select>
          {errors.timeSlot && <p className="text-xs text-red-600 mt-1">{errors.timeSlot}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Status</label>
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="hold">Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Special requirements / Note</label>
          <textarea rows={3} className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={form.note}
                    onChange={(e) => set('note', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => onCancel?.()} className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800">
          Save Reservation
        </button>
      </div>
    </form>
  );
}
