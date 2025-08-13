import React, { useMemo, useState } from "react";

const DAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

export default function NewTypeForm({ initialData, onSubmit, onCancel }) {
  const init = useMemo(
    () => ({
      name: "",
      description: "",
      pricePerPerson: "",
      isActive: true,
      maxCapacity: "",
      timeSlot: {
        startTime: "",
        endTime: "",
        daysOfWeek: [],
      },
      ...initialData,
    }),
    [initialData]
  );

  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState({});

  // Helper for simple fields
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // Helper for nested timeSlot fields
  const setTimeSlot = (k, v) =>
    setForm((prev) => ({
      ...prev,
      timeSlot: { ...prev.timeSlot, [k]: v },
    }));

  // Handler for day checkboxes
  const handleDayChange = (dayValue, checked) => {
    const currentDays = form.timeSlot.daysOfWeek;
    if (checked) {
      setTimeSlot("daysOfWeek", [...currentDays, dayValue].sort());
    } else {
      setTimeSlot(
        "daysOfWeek",
        currentDays.filter((d) => d !== dayValue)
      );
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Name is required";
    if (form.pricePerPerson !== "" && Number(form.pricePerPerson) < 0)
      e.pricePerPerson = "Must be ≥ 0";
    if (!form.maxCapacity || Number(form.maxCapacity) <= 0)
      e.maxCapacity = "Capacity must be > 0";
    if (!form.timeSlot.startTime) e.startTime = "Start time is required";
    if (!form.timeSlot.endTime) e.endTime = "End time is required";
    if (form.timeSlot.daysOfWeek.length === 0)
      e.daysOfWeek = "Select at least one day";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.({
      ...form,
      name: form.name.trim(),
      description: form.description?.trim() || "",
      isActive: Boolean(form.isActive),
      pricePerPerson:
        form.pricePerPerson === "" ? null : Number(form.pricePerPerson),
      maxCapacity: Number(form.maxCapacity),
    });
  };

  return (
    <form
      onSubmit={submit}
      className="p-4 bg-white border border-gray-200 rounded-xl space-y-6" // Increased space-y
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Type name</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Price per person
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.pricePerPerson}
            onChange={(e) => set("pricePerPerson", e.target.value)}
            placeholder="e.g., 150.00"
          />
          {errors.pricePerPerson && (
            <p className="text-xs text-red-600 mt-1">{errors.pricePerPerson}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Max Capacity
          </label>
          <input
            type="number"
            min="1"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.maxCapacity}
            onChange={(e) => set("maxCapacity", e.target.value)}
            placeholder="e.g., 12"
          />
          {errors.maxCapacity && (
            <p className="text-xs text-red-600 mt-1">{errors.maxCapacity}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      {/* --- Schedule Section --- */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-base font-medium text-gray-800">Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.timeSlot.startTime}
              onChange={(e) => setTimeSlot("startTime", e.target.value)}
            />
            {errors.startTime && (
              <p className="text-xs text-red-600 mt-1">{errors.startTime}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.timeSlot.endTime}
              onChange={(e) => setTimeSlot("endTime", e.target.value)}
            />
            {errors.endTime && (
              <p className="text-xs text-red-600 mt-1">{errors.endTime}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Days of the Week
          </label>
          <div className="flex flex-wrap gap-4">
            {DAYS.map((day) => (
              <label key={day.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={form.timeSlot.daysOfWeek.includes(day.value)}
                  onChange={(e) => handleDayChange(day.value, e.target.checked)}
                />
                <span className="text-sm">{day.label}</span>
              </label>
            ))}
          </div>
          {errors.daysOfWeek && (
            <p className="text-xs text-red-600 mt-1">{errors.daysOfWeek}</p>
          )}
        </div>
      </div>

      {/* --- Actions --- */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            className="w-4 h-4"
            checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Active
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800"
          >
            Save Type & Schedule
          </button>
        </div>
      </div>
    </form>
  );
}
