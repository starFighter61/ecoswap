import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user from token
  const loadUser = async () => {
    try {
      setLoading(true);
      
      if (token) {
        setAuthToken(token);
        
        // Check if token is expired
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          logout();
          setError('Session expired. Please login again.');
          setLoading(false);
          return;
        }
        
        // Get user data
        const res = await axios.get('/api/auth/me');
        setUser(res.data.data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthToken(null);
      setError(err.response?.data?.message || 'Error loading user');
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/auth/register', userData);
      
      const { token, user } = res.data.data;
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setAuthToken(token);
      
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/auth/login', { email, password });
      
      const { token, user } = res.data.data;
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setAuthToken(token);
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(`/api/users/${user._id}`, userData);
      
      setUser(res.data.data.user);
      
      return { success: true };
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Update profile failed');
      return { success: false, error: err.response?.data?.message || 'Update profile failed' };
    } finally {
      setLoading(false);
    }
  };

  // Load user on initial render if token exists
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Value to be provided by the context
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};