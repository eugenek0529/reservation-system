import React from "react";
import AdminLayout from "./AdminLayout";
import AdminSettingComponent from "../../components/admin/AdminSettingComponent";

function AdminSetting() {
  return (
    <div>
      <AdminLayout>
        <AdminSettingComponent />
      </AdminLayout>
    </div>
  );
}

export default AdminSetting;
