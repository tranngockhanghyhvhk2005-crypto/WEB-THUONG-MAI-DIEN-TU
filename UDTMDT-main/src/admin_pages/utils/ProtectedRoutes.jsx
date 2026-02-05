import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();

  // If authenticated, allow nested routes to render (AdminLayout will be used as a wrapper in routes)
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoutes;