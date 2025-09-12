import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

function SubscriptionProvider({ children }) {
  const [state, setState] = useState({
    subscription: null,
    loading: false,
    error: null
  });

  const { isAuthenticated } = useAuth();

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      updateState({ subscription: null, loading: false });
      return { subscription: null };
    }

    updateState({ loading: true, error: null });

    try {
      const { data } = await axios.get('/api/subscriptions/user');
      updateState({ 
        subscription: data.subscription || null,
        loading: false 
      });
      return { subscription: data.subscription };
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        updateState({ 
          subscription: null, 
          loading: false 
        });
        return { subscription: null };
      }
      
      console.error('Error:', err);
      updateState({ 
        error: 'Failed to load subscription',
        loading: false 
      });
      return { subscription: null };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const value = useMemo(() => ({
    ...state,
    fetchSubscription,
    refreshSubscription: fetchSubscription
  }), [state, fetchSubscription]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

export { SubscriptionProvider, useSubscription };
export default SubscriptionContext;
