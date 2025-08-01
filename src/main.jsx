import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";

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
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute allowedRoles={["user"]} redirectedTo="/">
        <UserDashboard />
      </ProtectedRoute>
    )
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
