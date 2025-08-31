import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';

const ProtectedRoute = ({ children, requireSubscription = false }) => {
  const location = useLocation();
  const { subscription, loading } = useSubscription();

  // If still loading, show a loading state or null
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If subscription is required but user doesn't have an active subscription
  if (requireSubscription && !subscription?.status === 'active') {
    // Redirect to the subscription page with a return URL
    return (
      <Navigate
        to="/subscribe"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;
