import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load user on initial render
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await authApi.getCurrentUser();
      if (userData) {
        setUser({
          ...userData,
          role: userData.role || 'user',
          isAdmin: ['admin', 'superadmin'].includes((userData.role || '').toLowerCase())
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      // Don't clear token here as it might be a network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authApi.login({ email, password });
      
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        
        // If we have user data in the response, use it
        if (response.user) {
          const userData = {
            ...response.user,
            role: response.user.role || 'user',
            isAdmin: ['admin', 'superadmin'].includes((response.user.role || '').toLowerCase())
          };
          setUser(userData);
          return { success: true, user: userData };
        }
        
        // Otherwise, fetch the user data
        const userData = await authApi.getCurrentUser();
        if (userData) {
          const userWithRole = {
            ...userData,
            role: userData.role || 'user',
            isAdmin: ['admin', 'superadmin'].includes((userData.role || '').toLowerCase())
          };
          setUser(userWithRole);
          return { success: true, user: userWithRole };
        }
      }
      
      throw new Error('Login failed - no user data received');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authApi.register(userData);
      
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        
        if (response.user) {
          const userWithRole = {
            ...response.user,
            role: response.user.role || 'user',
            isAdmin: ['admin', 'superadmin'].includes((response.user.role || '').toLowerCase())
          };
          
          setUser(userWithRole);
          return { success: true, user: userWithRole };
        }
      }
      
      throw new Error('Registration failed - no user data received');
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    logout,
    register,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
