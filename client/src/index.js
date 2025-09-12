import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

// Initialize the root element
const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

// Create the root
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept();
}
