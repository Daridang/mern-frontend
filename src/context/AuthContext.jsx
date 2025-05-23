import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// const API_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios interceptor to add token to requests
  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      // Remove interceptor when component unmounts
      api.interceptors.request.eject(interceptor);
    };
  }, [token]);

  useEffect(() => {
    // Check if user is logged in on page load
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.get("/api/auth/me");
          setUser(response.data.user);
        } catch (error) {
          console.error("Error fetching user:", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post("/api/auth/register", userData);
      const { token: authToken, user: newUser } = response.data;
      
      // Log in the user after successful registration
      setUser(newUser);
      setToken(authToken);
      localStorage.setItem("token", authToken);
      
      return { success: true, data: response.data };
    } catch (error) {
      setError(
        error.response?.data?.error || 
        "Registration failed. Please try again."
      );
      return { 
        success: false, 
        error: error.response?.data?.error || "Registration failed" 
      };
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.post("/api/auth/login", credentials);
      const { token: authToken, user: userData } = response.data;
      
      setUser(userData);
      setToken(authToken);
      localStorage.setItem("token", authToken);
      
      return { success: true, data: response.data };
    } catch (error) {
      setError(
        error.response?.data?.error || 
        "Login failed. Please check your credentials."
      );
      return { 
        success: false, 
        error: error.response?.data?.error || "Login failed" 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const updateUser = async (updatedUserData) => {
    try {
      setError(null);
      const response = await api.put(
        "/api/auth/update-profile",
        updatedUserData
      );
      setUser((prevUser) => ({ ...prevUser, ...response.data.user }));
      return { success: true, data: response.data };
    } catch (error) {
      setError(
        error.response?.data?.error || 
        "Failed to update profile. Please try again."
      );
      return { 
        success: false, 
        error: error.response?.data?.error || "Update failed" 
      };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setError(null);
      const response = await api.put("/api/auth/change-password", passwordData);
      return { success: true, data: response.data };
    } catch (error) {
      setError(
        error.response?.data?.error || 
        "Failed to change password. Please try again."
      );
      return { 
        success: false, 
        error: error.response?.data?.error || "Password change failed" 
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        token, 
        loading, 
        error,
        register,
        login, 
        logout, 
        updateUser,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};