import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.access_token;
    setToken(token);
    // fetch profile after login
    const me = await api.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
    setUser(me.data);
    return { token, user: me.data };
  };

  const register = async (payload) => {
    // map name -> username to match backend DTO
    const res = await api.post('/auth/register', {
      username: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role || 'user',
    });
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
