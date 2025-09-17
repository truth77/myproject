import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { NewSubscriptionProvider } from './contexts/NewSubscriptionContext';
import store from './store';
import AppLayout from './AppLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import './App.css';

// Lazy load components for better performance
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DonatePage = lazy(() => import('./pages/DonatePage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));

// Fallback component for lazy loading
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <LoadingSpinner size="large" />
  </div>
);

// Main App component with routing
function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/donate/thank-you" element={<ThankYouPage />} />
        
        {/* Protected Admin routes */}
        <Route 
          path="/admin/*" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />
        
        {/* Main app route */}
        <Route path="/*" element={<AppLayout />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

// Wrapper component to provide all necessary contexts
function AppWithProviders() {
  return (
    <Provider store={store}>
      <AppProvider>
        <AuthProvider>
          <NewSubscriptionProvider>
            <AppRoutes />
          </NewSubscriptionProvider>
        </AuthProvider>
      </AppProvider>
    </Provider>
  );
}

export default AppWithProviders;
