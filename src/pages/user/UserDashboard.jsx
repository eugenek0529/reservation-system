import React from 'react'
import { useAuth } from '../../context/AuthProvider'

function UserDashboard() {
  const { signOut } = useAuth();

  return (
    <div>
      <h1>User Dashboard</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

export default UserDashboard