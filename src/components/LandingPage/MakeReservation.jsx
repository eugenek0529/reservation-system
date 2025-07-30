import React, { useState } from "react";

function MakeReservation() {
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Example: next 7 days
  const today = new Date();
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  // Example: fixed session times
  const timeOptions = [
    { label: "Lunch (12:00 PM)", value: "12:00" },
    { label: "Dinner 1 (5:30 PM)", value: "17:30" },
    { label: "Dinner 2 (8:00 PM)", value: "20:00" },
  ];

  const handlePartySizeChange = (change) => {
    setPartySize((prevSize) => Math.max(1, Math.min(prevSize + change, 20)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted", { partySize, date, time });
  };

  return (
    <div className="p-4 rounded-lg border border-gray-200  max-w-sm mx-auto">
      <h2 className="text-lg mb-3">Make a Reservation</h2>
      <form onSubmit={handleSubmit}>
        {/* party size */}
        <div className="mb-2">
          <label htmlFor="party-size" className="block text-gray-700 text-sm">
            Party size
          </label>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => handlePartySizeChange(-1)}
              className="text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="text-2xl p-2 font-light">-</span>
            </button>
            <span className="text-md font-medium text-gray-800">
              {partySize} guests
            </span>
            <button
              type="button"
              onClick={() => handlePartySizeChange(1)}
              className="text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="text-md p-2 font-light">+</span>
            </button>
          </div>
        </div>

        {/* date */}
        <div className="mb-2">
          <label htmlFor="date" className="block text-gray-700 text-sm mb-2">
            Date
          </label>
          <select
            id="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a date
            </option>
            {dateOptions.map((d) => (
              <option key={d} value={d}>
                {new Date(d).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>

        {/* time */}
        <div className="mb-4">
          <label htmlFor="time" className="block text-gray-700 text-sm mb-2">
            Time
          </label>
          <select
            id="time"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a time
            </option>
            {timeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default MakeReservation;
