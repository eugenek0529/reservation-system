import React, { useState } from "react";

function MakeReservation() {
  const [partySize, setPartySize] = useState(2);
  const [selectedDate, setSelectedDate] = useState("");
  const [time, setTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Example: fixed session times
  const timeOptions = [
    { label: "Lunch (12:00 PM)", value: "12:00" },
    { label: "Dinner 1 (5:30 PM)", value: "17:30" },
    { label: "Dinner 2 (8:00 PM)", value: "20:00" },
  ];

  const handlePartySizeChange = (change) => {
    // guest size range 1 to max 12
    setPartySize((prevSize) => Math.max(1, Math.min(prevSize + change, 12)));
  };

  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    setShowCalendar(false);
    
    // Clear date error when date is selected
    setErrors(prev => ({ ...prev, date: undefined }));
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    }
    
    if (!time) {
      newErrors.time = 'Please select a time';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted", { partySize, selectedDate, time });
    }
  };

  const handleBlur = (field) => {
    console.log('Blur triggered for:', field); // Debug
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    const newErrors = validateForm();
    setErrors(newErrors);
  };

  return (
    <div className="p-4 rounded-lg border border-gray-200 max-w-sm mx-auto">
      <h2 className="text-lg mb-3">Make a Reservation</h2>
      <form onSubmit={handleSubmit}>
        {/* party size */}
        <div className="mb-4">
          <label htmlFor="party-size" className="block text-gray-700 text-sm mb-2">
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

        {/* Date Selection */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm mb-2">
            Date
          </label>
          <button
            data-testid="date-button"
            type="button"
            onClick={toggleCalendar}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white hover:bg-gray-50 transition-colors duration-200 ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {selectedDate ? (
              <span className="text-gray-800">
                {new Date(selectedDate).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            ) : (
              <span className="text-gray-500">Select a date</span>
            )}
          </button>
          
          {errors.date && (
            <div className="text-red-500 text-sm mt-1">{errors.date}</div>
          )}
          
          {/* Calendar Dropdown */}
          {showCalendar && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <CalendarGrid 
                selectedDate={selectedDate} 
                onDateSelect={handleDateSelect} 
              />
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div className="mb-4">
          <label htmlFor="time" className="block text-gray-700 text-sm mb-2">
            Time
          </label>
          <select
            id="time"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.time ? 'border-red-500' : 'border-gray-300'
            }`}
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              // Clear time error when time is selected
              setErrors(prev => ({ ...prev, time: undefined }));
            }}
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
          
          {errors.time && (
            <div className="text-red-500 text-sm mt-1">{errors.time}</div>
          )}
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

// Calendar Grid Component
function CalendarGrid({ selectedDate, onDateSelect }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  const calendarDays = [];
  
  // Add empty cells for days before the first of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    calendarDays.push(date);
  }

  const getMonthName = () => {
    return new Date(currentYear, currentMonth).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="p-4">
      {/* Month Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {getMonthName()}
        </h3>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {calendarDays.map((date, index) => (
          <div key={index} className="p-1">
            {date ? (
              <button
                type="button"
                onClick={() => onDateSelect(date.toISOString().split('T')[0])}
                className={`w-full h-8 rounded-md text-sm font-medium transition-colors duration-200 ${
                  date < today 
                    ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                    : date.toISOString().split('T')[0] === selectedDate
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'text-gray-700 hover:bg-blue-100 cursor-pointer'
                }`}
                disabled={date < today}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="w-full h-8"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MakeReservation;
