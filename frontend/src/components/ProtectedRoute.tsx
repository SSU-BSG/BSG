import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
