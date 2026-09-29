import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the protected component if authenticated
  return children;
}
