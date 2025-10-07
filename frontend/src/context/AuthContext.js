import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService.js";
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await authService.verifyToken();
          setUser(userData.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ ADD THIS verifyEmail FUNCTION
  const verifyEmail = async (token) => {
    try {
      console.log("🔍 Verifying email with token:", token);
      const response = await authService.verifyEmail(token);
      console.log("✅ Email verification response:", response);
      return response;
    } catch (error) {
      console.error("❌ Email verification failed:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      console.log("🔄 AuthContext: Starting login...");
      const response = await authService.login(email, password);
      console.log("✅ AuthContext: Login response received:", response);

      // ✅ FIX: Handle backend response format { status: 'success' }
      if (response.status === "success" && response.token) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        console.log("✅ AuthContext: User set, token stored");
        return { success: true, ...response };
      }
      // ✅ Also handle { success: true } format for compatibility
      else if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        console.log("✅ AuthContext: User set (success format)");
        return response;
      } else {
        console.error("❌ AuthContext: Invalid response format", response);
        return { success: false, message: "Invalid response from server" };
      }
    } catch (error) {
      console.error("❌ AuthContext: Login failed", error);
      throw error;
    }
  };

  const register = async (username, email, password, designation) => {
    const response = await authService.register(
      username,
      email,
      password,
      designation
    );
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    verifyEmail, // ✅ MAKE SURE THIS IS INCLUDED
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
