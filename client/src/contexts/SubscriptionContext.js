import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchSubscription = useCallback(async () => {
    // Don't try to fetch if user is not authenticated
    if (!isAuthenticated) {
      setSubscription(null);
      return { subscription: null };
    }

    try {
      setLoading(true);
      const { data } = await axios.get('/api/subscriptions/user');
      const subscriptionData = data.subscription || null;
      setSubscription(subscriptionData);
      setError(null);
      return { subscription: subscriptionData };
    } catch (err) {
      // Don't show error for 401/404 as they're expected when user has no subscription
      if (err.response && (err.response.status === 401 || err.response.status === 404)) {
        setSubscription(null);
        return { subscription: null };
      } else {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription details');
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      // Only fetch subscription if user is authenticated
      if (isAuthenticated) {
        try {
          await fetchSubscription();
        } catch (error) {
          if (isMounted) {
            console.error('Failed to fetch subscription:', error);
          }
        }
      } else if (isMounted) {
        setSubscription(null);
        setError(null);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, fetchSubscription]);

  const value = useMemo(() => ({
    subscription,
    loading,
    error,
    refreshSubscription: fetchSubscription,
    hasActiveSubscription: subscription?.status === 'active',
  }), [subscription, loading, error, fetchSubscription]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;
