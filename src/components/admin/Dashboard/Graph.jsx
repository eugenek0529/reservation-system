import React, { useState } from 'react';
import { useAdminReservations } from '../../../context/AdminReservationContext';

const Graph = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { dailySchedule } = useAdminReservations();

  // Calculate real data from context for the selected date
  const calculateDailyStats = (date) => {
    if (!dailySchedule || dailySchedule.length === 0) {
      return {
        totalSeats: 0,
        reservations: 0,
        pending: 0,
        available: 0
      };
    }

    let totalSeats = 0;
    let reservations = 0;
    let pending = 0;
    let available = 0;

    dailySchedule.forEach(slot => {
      totalSeats += slot.maxCapacity;
      
      slot.reservations.forEach(reservation => {
        if (reservation.status === 'pending') {
          pending += reservation.guestCount;
        } else {
          reservations += reservation.guestCount;
        }
      });
    });

    available = totalSeats - reservations - pending;

    return {
      totalSeats,
      reservations,
      pending,
      available
    };
  };

  const stats = calculateDailyStats(selectedDate);

  // Calculate percentages for the semicircle
  const reservationPercentage = stats.totalSeats > 0 ? (stats.reservations / stats.totalSeats) * 100 : 0;
  const pendingPercentage = stats.totalSeats > 0 ? (stats.pending / stats.totalSeats) * 100 : 0;
  const availablePercentage = stats.totalSeats > 0 ? (stats.available / stats.totalSeats) * 100 : 0;
  
  // Calculate stroke-dasharray values for the semicircle (circumference = π * radius)
  const radius = 80;
  const circumference = Math.PI * radius;
  
  const reservationDash = (reservationPercentage / 100) * circumference;
  const pendingDash = (pendingPercentage / 100) * circumference;
  const availableDash = (availablePercentage / 100) * circumference;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short'
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl text-gray-800 mb-1">Daily Capacity Overview</h2>
          <p className="text-sm text-gray-600">Seat availability breakdown for selected date</p>
        </div>
        
        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigateDate('prev')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800">{formatDate(selectedDate)}</div>
            <div className="text-sm text-gray-500">{formatDay(selectedDate)}</div>
          </div>
          <button 
            onClick={() => navigateDate('next')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Half Circle Chart */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
            {/* Background semicircle */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="20"
              strokeLinecap="round"
            />
            
            {/* Reservations (Red) */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#ef4444"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${reservationDash} ${circumference}`}
              strokeDashoffset="0"
              className="transition-all duration-1000 ease-out"
            />
            
            {/* Pending (Yellow) */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${pendingDash} ${circumference}`}
              strokeDashoffset={-reservationDash}
              className="transition-all duration-1000 ease-out delay-300"
            />
            
            {/* Available (Green) */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#22c55e"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${availableDash} ${circumference}`}
              strokeDashoffset={-(reservationDash + pendingDash)}
              className="transition-all duration-1000 ease-out delay-600"
            />
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-800 mt-4">{stats.totalSeats}</div>
            <div className="text-sm text-gray-500">Total Seats</div>
          </div>
        </div>
      </div>

      {/* Capacity Breakdown */}
      <div>
        <h3 className="text-lg text-gray-800 mb-4 text-center">Capacity Breakdown</h3>
        
        <div className="space-y-3">
          {/* Reservations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Total Reservations</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-800">{stats.reservations}</span>
              <span className="text-sm text-gray-500 ml-1">({reservationPercentage.toFixed(1)}%)</span>
            </div>
          </div>
          
          {/* Pending */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-700">Pending</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-800">{stats.pending}</span>
              <span className="text-sm text-gray-500 ml-1">({pendingPercentage.toFixed(1)}%)</span>
            </div>
          </div>
          
          {/* Available */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Available</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-800">{stats.available}</span>
              <span className="text-sm text-gray-500 ml-1">({availablePercentage.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;
