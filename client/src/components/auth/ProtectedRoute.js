import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const ProtectedRoute = ({ children, requireSubscription = true }) => {
  const { isAuthenticated, loading: authLoading } = useAppContext();
  const { subscription, loading: subscriptionLoading, refreshSubscription } = useSubscription?.() || {};
  const location = useLocation();
  const navigate = useNavigate();

  // Refresh subscription data when component mounts or authentication state changes
  useEffect(() => {
    if (isAuthenticated && refreshSubscription) {
      refreshSubscription();
    }
  }, [isAuthenticated, refreshSubscription]);

  // Show loading state while checking authentication and subscription
  if (authLoading || (isAuthenticated && subscriptionLoading)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        gap: '1rem'
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          borderTopColor: '#2c3e50',
          animation: 'spin 1s ease-in-out infinite'
        }}></div>
        <div>Loading your content...</div>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin { 
              to { transform: rotate(360deg); } 
            }
          `
        }} />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check subscription status if required
  if (requireSubscription) {
    // If subscription data is not available yet, show loading
    if (subscriptionLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}>
          <div>Verifying subscription...</div>
        </div>
      );
    }

    // If subscription is required but not active, redirect to subscription page
    if (!subscription || subscription.status !== 'active') {
      return <Navigate to="/subscribe" state={{ from: location }} replace />;
    }
  }

  // If all checks pass, render the protected content
  return children;
};

export default ProtectedRoute;
