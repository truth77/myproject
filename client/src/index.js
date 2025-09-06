import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('r    
    <Router>
      <AppProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <App />
          </SubscriptionProvider>
        </AuthProvider>
      </AppProvider>
    </Router>
  </React.StrictMode>
);
