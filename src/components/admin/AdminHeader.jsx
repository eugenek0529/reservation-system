import React from 'react'
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

function AdminHeader() {
    const { signOut } = useAuth();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      signOut();
      navigate('/');
    };
  
    return (
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">Sushi Yuen</h1>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Admin</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
}

export default AdminHeader