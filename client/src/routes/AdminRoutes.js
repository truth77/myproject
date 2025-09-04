import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../pages/admin/Dashboard';
import Subscribers from '../pages/admin/Subscribers';
import SubscriberDetail from '../pages/admin/SubscriberDetail';
import Plans from '../pages/admin/Plans';
import Transactions from '../pages/admin/Transactions';

const AdminRoutes = () => {
  const { currentUser } = useAuth();

  // Check if user is admin (you might want to implement proper role-based access control)
  const isAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin;

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
