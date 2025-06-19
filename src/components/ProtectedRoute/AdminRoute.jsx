import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Загрузка...</p>; // Или спиннер
  }

  if (!user || user.role !== "admin") {
    // Перенаправление на страницу входа или 403
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
