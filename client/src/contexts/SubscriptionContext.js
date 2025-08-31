import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/subscriptions/user');
      setSubscription(data.subscription);
      setError(null);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Failed to load subscription details');
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const value = {
    subscription,
    loading,
    error,
    refreshSubscription: fetchSubscription,
    hasActiveSubscription: subscription?.status === 'active',
  };

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
