import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import SubscriptionPlans from '../components/Subscription/SubscriptionPlans';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subscription, hasActiveSubscription } = useSubscription();
  const from = location.state?.from?.pathname || '/';

  // If user already has an active subscription, redirect them back
  useEffect(() => {
    if (hasActiveSubscription) {
      navigate(from, { replace: true });
    }
  }, [hasActiveSubscription, navigate, from]);

  // Show loading state while checking subscription
  if (subscription === null) {
    return (
      <div className="subscription-loading">
        <div className="spinner"></div>
        <p>Loading subscription information...</p>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        <h1>Choose Your Plan</h1>
        <p className="subtitle">Select the plan that works best for you</p>
        
        {subscription?.status === 'canceled' && (
          <div className="subscription-alert warning">
            <h3>Your subscription has been canceled</h3>
            <p>Your access will continue until the end of your current billing period.</p>
          </div>
        )}

        {subscription?.status === 'past_due' && (
          <div className="subscription-alert error">
            <h3>Payment Required</h3>
            <p>There was an issue with your last payment. Please update your payment method to continue your subscription.</p>
          </div>
        )}

        <SubscriptionPlans />
        
        <div className="subscription-footer">
          <p>Need help choosing a plan? <a href="/contact">Contact our support team</a></p>
          <p className="small">Cancel anytime. No hidden fees. 7-day money-back guarantee.</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
