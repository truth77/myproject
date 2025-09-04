import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { subscriptionsApi } from '../../services/api';
import { useSubscription } from '../../contexts/SubscriptionContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { subscription } = useSubscription();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionsApi.getPlans();
        setPlans(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load subscription plans. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (priceId) => {
    if (!priceId) {
      setError('Please select a plan to continue');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { sessionId } = await subscriptionsApi.createCheckoutSession(priceId);
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError(err.message || 'Failed to create subscription. Please try again.');
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

  if (loading && plans.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user already has an active subscription, show their current plan
  if (subscription?.status === 'active') {
    const currentPlan = plans.find(p => p.id === subscription.planId);
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Current Plan</h2>
          <p className="text-gray-600 mt-2">You're currently on the {currentPlan?.name || 'Premium'} plan</p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{currentPlan?.name || 'Premium'}</h3>
              <p className="text-gray-600">
                ${(currentPlan?.price / 100).toFixed(2)} / {currentPlan?.billing_cycle}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Next billing date: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/profile'}
              className="mt-4 md:mt-0 px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage Subscription
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Plans</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans
              .filter(plan => plan.id !== currentPlan?.id)
              .map(plan => (
                <div key={plan.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900">{plan.name}</h4>
                  <p className="text-2xl font-bold mt-2">
                    ${(plan.price / 100).toFixed(2)} 
                    <span className="text-base font-normal text-gray-500">/{plan.billing_cycle}</span>
                  </p>
                  <p className="text-gray-600 mt-2 text-sm">{plan.description}</p>
                  <button
                    onClick={() => handleSubscribe(plan.stripe_price_id)}
                    className="mt-4 w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Switch to {plan.name}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-2">
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm font-medium text-red-700 hover:text-red-600 transition-colors"
                >
                  Try again <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredPlans = plans.filter(plan => 
    billingCycle === 'all' || 
    (billingCycle === 'monthly' && plan.billing_cycle === 'monthly') ||
    (billingCycle === 'yearly' && plan.billing_cycle === 'yearly')
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
        <p className="text-gray-600">Select the plan that works best for you</p>
      </div>
      
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
              billingCycle === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            } transition-colors`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-3 text-sm font-medium rounded-r-md ${
              billingCycle === 'yearly'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-r border-gray-300'
            } transition-colors`}
          >
            <span>Yearly Billing</span>
            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-6 border rounded-xl transition-all duration-200 ${
              selectedPlan === plan.id
                ? 'ring-2 ring-blue-500 border-blue-500 bg-white shadow-lg transform -translate-y-1'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.is_popular && (
              <div className="absolute top-0 right-0 -mt-3 -mr-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  Most Popular
                </span>
              </div>
            )}
            
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-gray-900">
                ${(plan.price / 100).toFixed(2)}
              </span>
              <span className="text-base font-medium text-gray-500">
                /{plan.billing_cycle === 'monthly' ? 'month' : 'year'}
              </span>
              {plan.billing_cycle === 'yearly' && (
                <span className="ml-2 text-sm font-medium text-green-600">
                  (Save 20%)
                </span>
              )}
            </div>
            
            <p className="mt-3 text-gray-600">
              {plan.description}
            </p>
            
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe(plan.stripe_price_id);
                }}
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  loading || !plan.stripe_price_id
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                {loading ? 'Processing...' : plan.cta || 'Get Started'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Security and Trust Badges */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">TRUSTED BY THOUSANDS OF USERS WORLDWIDE</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="h-8 flex items-center">
              <svg className="h-6 w-auto" fill="currentColor" viewBox="0 0 120 24">
                <path d="M9.6 8.4H12V15.6H9.6zM0 8.4h2.4v7.2H4.8v-7.2h2.4V15.6c0 1.32-1.08 2.4-2.4 2.4H2.4A2.4 2.4 0 010 15.6V8.4zm16.8 0h2.4v7.2h1.2v-7.2h2.4V15.6c0 1.32-1.08 2.4-2.4 2.4h-1.2a2.4 2.4 0 01-2.4-2.4V8.4zm8.4 0h2.4v9.6h-2.4zM36 8.4h2.4v9.6H36zM48 8.4h2.4v9.6H48zM60 8.4h2.4v9.6H60zM72 8.4h2.4v9.6H72zM84 8.4h2.4v9.6H84zM96 8.4h2.4v9.6H96zM108 8.4h2.4v9.6H108zM120 8.4v9.6h-2.4V8.4z"/>
              </svg>
            </div>
            <div className="h-8 flex items-center">
              <svg className="h-6 w-auto" fill="currentColor" viewBox="0 0 120 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 21.6c-5.3 0-9.6-4.3-9.6-9.6S6.7 2.4 12 2.4s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6z"/>
                <path d="M12 4.8c-4 0-7.2 3.2-7.2 7.2s3.2 7.2 7.2 7.2 7.2-3.2 7.2-7.2-3.2-7.2-7.2-7.2zm0 12c-2.6 0-4.8-2.2-4.8-4.8S9.4 7.2 12 7.2s4.8 2.2 4.8 4.8-2.2 4.8-4.8 4.8z"/>
                <path d="M12 9.6c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>SSL Encryption</span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>No Hidden Fees</span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Cancel Anytime</span>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>7-day money-back guarantee • No long-term contracts • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
