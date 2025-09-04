import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './AppLayout';
import './App.css';

// Main App component that wraps everything with providers
function App() {
  return (
    <Router>
      <AppProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <AppLayout />
          </SubscriptionProvider>
        </AuthProvider>
      </AppProvider>
    </Router>
  );
}

export default App;
