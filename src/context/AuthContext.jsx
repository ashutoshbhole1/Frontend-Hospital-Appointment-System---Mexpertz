import React, { createContext, useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      // Add a small artificial delay so the animation is visible
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const [res] = await Promise.all([
            axios.get('/auth/me'),
            delay(1000)
          ]);
          setUser(res.data.data || res.data);
        } catch (err) {
          console.error('Error fetching user', err);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        await delay(800); // Small delay even for guests
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.errors 
        ? err.response.data.errors[0].msg 
        : (err.response?.data?.message || 'Login failed');
      return { success: false, error: errorMsg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData);
      const { token, user: newUser } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(newUser);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err.response?.data || err);
      const errorMsg = err.response?.data?.errors 
        ? err.response.data.errors[0].msg 
        : (err.response?.data?.message || 'Registration failed');
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {loading ? <LoadingSpinner fullPage /> : children}
    </AuthContext.Provider>
  );
};
