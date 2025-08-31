import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import './SubscriptionPlans.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/api/subscriptions/plans');
        setPlans(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load subscription plans');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (priceId) => {
    setLoading(true);
    try {
      // Create checkout session
      const { data } = await axios.post('/api/subscriptions/create-checkout-session', {
        priceId,
      });

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        console.error('Error:', error);
        setError(error.message);
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError('Failed to create subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data } = await axios.get('/api/subscriptions/portal');
      window.location.href = data.url;
    } catch (err) {
      console.error('Error managing subscription:', err);
      setError('Failed to open customer portal');
    }
  };

  if (loading) {
    return <div className="loading">Loading subscription plans...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="subscription-plans">
      <h2>Choose a Plan</h2>
      <div className="plans-container">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <h3>{plan.name}</h3>
            <div className="price">
              ${plan.price} <span>/{plan.billing_cycle}</span>
            </div>
            <p className="description">{plan.description}</p>
            <ul className="features">
              {JSON.parse(plan.features).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button 
              className="subscribe-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSubscribe(plan.stripe_price_id);
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="manage-subscription">
        <h3>Manage Your Subscription</h3>
        <button 
          className="manage-btn"
          onClick={handleManageSubscription}
          disabled={loading}
        >
          Manage Subscription
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
