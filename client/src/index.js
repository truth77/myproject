import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './contexts/AppContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      <SubscriptionProvider>
        <App />
      </SubscriptionProvider>
    </AppProvider>
  </React.StrictMode>
);
