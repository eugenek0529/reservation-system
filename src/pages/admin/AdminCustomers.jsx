import React from "react";
import AdminLayout from "./AdminLayout";
import AdminCustomersComponent from "../../components/admin/AdminCustomersComponent";

function AdminCustomers() {
  return (
    <div>
      <AdminLayout>
        <AdminCustomersComponent />
      </AdminLayout>
    </div>
  );
}

export default AdminCustomers;
