import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.verifyToken();
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ ADD THIS verifyEmail FUNCTION
  const verifyEmail = async (token) => {
    try {
      console.log('🔍 Verifying email with token:', token);
      const response = await authService.verifyEmail(token);
      console.log('✅ Email verification response:', response);
      return response;
    } catch (error) {
      console.error('❌ Email verification failed:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.success) {
      localStorage.setItem('token', response.token);
      setUser(response.user);
    }
    return response;
  };

  const register = async (username, email, password, designation) => {
    const response = await authService.register(username, email, password, designation);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};