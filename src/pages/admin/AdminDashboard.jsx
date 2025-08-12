import React from "react";
import { useAuth } from "../../context/AuthProvider";
import AdminLayout from "./AdminLayout";
import AdminDashboardComponent from "../../components/admin/Dashboard/AdminDashboardComponent";

function AdminDashboard() {
  const { signOut } = useAuth();

  return (
    <div>
      <AdminLayout>
        <AdminDashboardComponent />
      </AdminLayout>
    </div>
  );
}

export default AdminDashboard;
