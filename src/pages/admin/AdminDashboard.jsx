import React from 'react'
import { useAuth } from '../../context/AuthProvider'
import AdminLayout from './AdminLayout';
import AdminDashboardComponent from '../../components/admin/AdminDashboardComponent';

function AdminDashboard() {
  const { signOut } = useAuth();

  return (
    <div>
      {/* <h1>Admin Dashboard</h1>
      <button onClick={() => signOut()}>Sign Out</button> */}

      <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome to the admin panel</p>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Quick Overview</h2>
        <AdminDashboardComponent />
      </div>
      </AdminLayout>
    </div>
  )
}

export default AdminDashboard