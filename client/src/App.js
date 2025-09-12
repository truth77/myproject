import React from 'react';
import { Routes, Route, useRoutes } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { NewSubscriptionProvider } from './contexts/NewSubscriptionContext';
import AppLayout from './AppLayout';
import AuthLayout from './components/layouts/AuthLayout';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

// Main App component with routing
function App() {
  const routes = useRoutes([
    // Auth routes (login, register, etc.)
    {
      element: <AuthLayout />,
      children: [
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
      ],
    },
    // Main app routes
    {
      path: '/*',
      element: <AppLayout />
    },
  ]);

  return routes;
}

// Wrapper component to provide all necessary contexts
function AppWithProviders() {
  return (
    <AppProvider>
      <AuthProvider>
        <NewSubscriptionProvider>
          <App />
        </NewSubscriptionProvider>
      </AuthProvider>
    </AppProvider>
  );
}

export default AppWithProviders;
