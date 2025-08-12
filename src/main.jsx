import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { AdminReservationProvider } from "./context/AdminReservationContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import AdminReservation from "./pages/admin/AdminReservation.jsx";
import AdminTypes from "./pages/admin/AdminTypes.jsx";
import AdminCustomers from "./pages/admin/AdminCustomers.jsx";
import AdminSetting from "./pages/admin/AdminSetting.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>404 Page not found</div>,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]} redirectedTo="/">
        <AdminReservationProvider>
          <AdminDashboard />
        </AdminReservationProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/reservations",
    element: (
      <ProtectedRoute allowedRoles={["admin"]} redirectedTo="/">
        <AdminReservationProvider>
          <AdminReservation />
        </AdminReservationProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/customers",
    element: (
      <ProtectedRoute allowedRoles={["admin"]} redirectedTo="/">
        <AdminReservationProvider>
          <AdminCustomers />
        </AdminReservationProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/types",
    element: (
      <ProtectedRoute allowedRoles={["admin"]} redirectedTo="/">
        <AdminReservationProvider>
          <AdminTypes />
        </AdminReservationProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute allowedRoles={["admin"]} redirectedTo="/">
        <AdminReservationProvider>
          <AdminSetting />
        </AdminReservationProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute allowedRoles={["user"]} redirectedTo="/">
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
