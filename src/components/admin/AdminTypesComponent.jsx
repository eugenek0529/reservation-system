import React, { useState } from 'react';

function AdminTypesComponent() {
  // Mock data for reservation types - in real app this would come from your database
  const [reservationTypes, setReservationTypes] = useState([
    {
      id: 1,
      name: "Breakfast Special",
      status: "Active",
      description: "Early morning dining experience with our signature breakfast menu",
      price: 25.00,
      created_at: "2025-01-15"
    },
    {
      id: 2,
      name: "Lunch Time Special",
      status: "Active",
      description: "Midday dining with express service and lighter fare options",
      price: 35.00,
      created_at: "2025-01-15"
    },
    {
      id: 3,
      name: "Dinner Main Chef Special",
      status: "Active",
      description: "Premium evening dining experience featuring our head chef's signature dishes",
      price: 75.00,
      created_at: "2025-01-15"
    },
    {
      id: 4,
      name: "Brunch Special",
      status: "Active",
      description: "Weekend brunch with unlimited beverages and extended menu",
      price: 45.00,
      created_at: "2025-01-15"
    },
    {
      id: 5,
      name: "Private Event",
      status: "Inactive",
      description: "Exclusive dining experience for special occasions and private gatherings",
      price: 120.00,
      created_at: "2025-01-15"
    }
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleToggleStatus = (id) => {
    setReservationTypes(prev => 
      prev.map(type => 
        type.id === id 
          ? { ...type, status: type.status === "Active" ? "Inactive" : "Active" }
          : type
      )
    );
  };

  const handleEdit = (id) => {
    // TODO: Implement edit functionality
    console.log('Edit reservation type:', id);
  };

  const handleDelete = (id) => {
    // TODO: Implement delete functionality
    console.log('Delete reservation type:', id);
  };

  const handleAddType = () => {
    // TODO: Implement add new type functionality
    console.log('Add new reservation type');
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Reservation Types</h1>
          <p className="text-sm text-gray-500">Manage dining experiences and pricing</p>
        </div>
        <button
          onClick={handleAddType}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add Type
        </button>
      </div>

      {/* Main Content */}
      <div className='p-4 border border-gray-300 rounded-lg'>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">All Reservation Types</h2>
        <p className="text-gray-600 mb-6">Manage your restaurant's dining experiences.</p>
        
        {/* Reservation Types List */}
        <div className="space-y-4">
          {reservationTypes.map((type) => (
            <div
              key={type.id}
              className="border border-gray-200 rounded-lg p-6 flex justify-between items-center hover:shadow-md transition-shadow"
            >
              {/* Left Side - Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    type.status === "Active" 
                      ? "bg-gray-200 text-gray-800" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {type.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{type.description}</p>
                <p className="text-gray-500 text-xs">Created {formatDate(type.created_at)}</p>
              </div>

              {/* Right Side - Price and Actions */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${type.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">per person</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(type.id)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                  >
                    {type.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleEdit(type.id)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminTypesComponent;