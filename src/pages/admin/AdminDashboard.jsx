import React from 'react'
import { useAuth } from '../../context/AuthProvider'
function AdminDashboard() {
  const { signOut } = useAuth();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

export default AdminDashboard