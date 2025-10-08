import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ roles }) {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && (!user?.role || !roles.some(r => r.toLowerCase() === user.role?.toLowerCase()))) {
    return <Navigate to="/polls" replace />;
  }

  return <Outlet />;
}