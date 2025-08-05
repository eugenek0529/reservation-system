import React from "react";
import AdminLayout from "./AdminLayout";
import AdminReservationComponent from "../../components/admin/AdminReservationComponent";

function AdminReservation() {
  return (
    <div>
      <AdminLayout>
        <AdminReservationComponent />
      </AdminLayout>
    </div>
  );
}

export default AdminReservation;
