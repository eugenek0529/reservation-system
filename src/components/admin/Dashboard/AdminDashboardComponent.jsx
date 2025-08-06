import React from 'react'
import InfoCards from './InfoCards'
import Graph from './Graph'

function AdminDashboardComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Reservation Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome to the admin panel</p>

        {/* 4 card on top */}
        <InfoCards />

        {/* graph card */}
        <div className="mb-6">
          <Graph />
        </div>

        {/* list of today's reservations card */}
    </div>
  )
}

export default AdminDashboardComponent