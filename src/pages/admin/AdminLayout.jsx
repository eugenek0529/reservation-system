 /* 
    AdminLayout.jsx

    Goal: Goal of this file is to provide template for admin UI flow
          Layout will have sidebar and the header shouwn persistantly. 
          And leave main content section for its child provided
          Child components maybe...
          * dashboard
          * customers
          * reservations
          * types
          and so on
 */
import React from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'; 
import AdminHeader from '../../components/admin/AdminHeader';

function AdminLayout({ children }) {
    return (
        <div className="flex flex-col h-screen">
          {/* Header - Top */}
          <AdminHeader />
    
          {/* Bottom Section - Sidebar + Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - Left */}
            <AdminSidebar />
    
            {/* Main Content - Right */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      );
}

export default AdminLayout