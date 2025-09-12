import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useNewSubscription } from '../../contexts/NewSubscriptionContext';

const SubscriptionRequired = ({ children }) => {
  const { subscription, loading } = useNewSubscription();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user doesn't have an active subscription, redirect to subscription page
  if (!subscription || subscription.status !== 'active') {
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  return children;
};

export default SubscriptionRequired;
