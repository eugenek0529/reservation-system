import React, { useMemo, useState } from 'react';
import DailyviewList from './Reservations/DailyviewList';
import DailyviewTimeline from './Reservations/DailyviewTimeline';
import MonthlyView from './Reservations/MonthlyView';
import ViewToggle from './Reservations/ViewToggle';
import DateNavigator from './Reservations/DateNavigator';
import mockReservations from './Reservations/mockReservations';

function AdminReservationComponent() {
  const [viewMode, setViewMode] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const reservations = useMemo(() => mockReservations, []);

  const navigateDate = (dir) => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      if (viewMode === 'daily') d.setDate(d.getDate() + (dir === 'prev' ? -1 : 1));
      else d.setMonth(d.getMonth() + (dir === 'prev' ? -1 : 1));
      return d;
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Reservations</h1>
          <p className="text-sm text-gray-500">Manage all reservations of the day and month</p>
        </div>
        <button className="bg-gray-900 text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-800">New Reservation</button>
      </div>

      <div className="p-4 border border-gray-300 rounded-lg flex min-h-screen">
        <div className="w-full">
          <div className="mb-3"><ViewToggle value={viewMode} onChange={setViewMode} /></div>
          <div className="mb-6">
            <DateNavigator
              viewMode={viewMode}
              date={selectedDate}
              onPrev={() => navigateDate('prev')}
              onNext={() => navigateDate('next')}
            />
          </div>

          {viewMode === 'daily' ? (
            <div className="p-4 flex gap-3">
              <div className="flex-1 border border-gray-200 rounded-lg">
                <DailyviewList reservations={reservations} selectedDate={selectedDate} />
              </div>
              <div className="flex-[2] border border-gray-200 rounded-lg">
                <DailyviewTimeline reservations={reservations} selectedDate={selectedDate} />
              </div>
            </div>
          ) : (
            <div className="p-4 flex-1 border border-gray-200 min-h-screen rounded-lg">
              <MonthlyView selectedDate={selectedDate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminReservationComponent;