import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>; // Or a spinner
  }

  if (!user || user.role !== "admin") {
    // Redirect to login (or a 403 page)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
