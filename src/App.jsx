import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ScrollProvider } from "./context/ScrollContext";

import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import RecipeForm from "./components/RecipeForm/RecipeForm";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

export default function App() {
  return (
    <ScrollProvider>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />

            {/* Protected routes */}
            <Route
              path="/create/:id?"
              element={
                <ProtectedRoute>
                  <RecipeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ScrollProvider>
  );
}
