import React, { useState } from 'react'
import DailyviewList from './Reservations/DailyviewList';
import DailyviewTimeline from './Reservations/DailyviewTimeline';
import MonthlyView from './Reservations/MonthlyView';

function AdminReservationComponent() {
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'monthly'

  return (
    <div className='p-6 bg-white min-h-screen'>
      {/* 
      
      main content section

        Daily view: 
        * upcoming res list
        * res timeline 
        
        Monthly view: 
        * calendar view with each day has circle view for easy checkout
      
      
      */}


      {/* header */}
      <div className='flex justify-between items-start mb-6'>
        <div>
        <h1 className='text-xl font-bold text-gray-900 mb-2'>Reservations</h1>
        <p className='text-sm text-gray-500'>Manage all reservations of the day and month</p>
        </div>
        <button
        className='bg-gray-900 text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'>
          New Reservation
        </button>
      </div>


      {/* main content section - dynamic */}
      <div className='p-4 border border-gray-300 rounded-lg flex min-h-screen'>
        <div className='w-full'>
          {/* toggle for daily and monthly view */}
          <div className='flex justify-center mb-6'>
            <div className='relative bg-gray-200 rounded-full p-1 flex items-center'>
              <button
                onClick={() => setViewMode('daily')}
                className={`px-6 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  viewMode === 'daily'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Daily View
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-6 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  viewMode === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Monthly View
              </button>
            </div>
          </div>
          
          {/* content based on view mode */}
          <div className='flex'>
            <div className='flex-1'>
              {viewMode === 'daily' ? (
                <div className='p-4 flex gap-1'>
                  <div className=' flex-1 border border-gray-300 rounded-md min-h-screen'>
                    <DailyviewList />
                  </div>
                  <div className=' flex-3 border border-gray-300 rounded-md min-h-screen'>
                    <DailyviewTimeline />
                  </div>
                </div>
              ) : (
                <div className='p-4 flex-1 border border-gray-300 min-h-screen rounded-lg'>
                  <MonthlyView /> 
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
      


    </div>
  )
}

export default AdminReservationComponent