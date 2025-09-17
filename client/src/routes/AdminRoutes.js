import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../pages/admin/Dashboard';
import Subscribers from '../pages/admin/Subscribers';
import SubscriberDetail from '../pages/admin/SubscriberDetail';
import Plans from '../pages/admin/Plans';
import Transactions from '../pages/admin/Transactions';

const AdminRoutes = () => {
  const { currentUser, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  // Check if user is admin or superadmin
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin');

  // Redirect to home if not an admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="subscribers" element={<Subscribers />} />
      <Route path="subscribers/:id" element={<SubscriberDetail />} />
      <Route path="plans" element={<Plans />} />
      <Route path="transactions" element={<Transactions />} />
    </Routes>
  );
};

export default AdminRoutes;
