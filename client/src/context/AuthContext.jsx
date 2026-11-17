import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get('/auth/me');
        if (res.data?.success) {
          setUser(res.data.user);
          setBusiness(res.data.business);
        }
      } catch (err) {
        setUser(null);
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      setUser(res.data.user);
      setBusiness(res.data.business);
      return res.data;
    }
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data?.success) {
      setUser(res.data.user);
      setBusiness(res.data.business);
      return res.data;
    }
  };

  const loginWithGoogle = async (googleData) => {
    const res = await api.post('/auth/google', googleData);
    if (res.data?.success) {
      setUser(res.data.user);
      setBusiness(res.data.business);
      return res.data;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      setBusiness(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.success) {
        setUser(res.data.user);
        setBusiness(res.data.business);
      }
    } catch (e) {
      console.error('Failed to refresh profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
