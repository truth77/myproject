import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAppContext();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%'
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin or superadmin role
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  
  // Redirect to home if not an admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has admin role, render the children
  return children;
};

export default AdminProtectedRoute;
