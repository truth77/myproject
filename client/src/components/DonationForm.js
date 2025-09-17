import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DonationForm = () => {
  const [donationType, setDonationType] = useState('one-time');
  const [selectedAmount, setSelectedAmount] = useState({
    amount: 10,
    priceId: 'price_1S4caSEWSKGO1T0Lll7tXk9o',
    label: '$10'
  });
  const [interval, setInterval] = useState('month');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Available donation amounts in dollars
  const presetAmounts = [
    { amount: 5, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFb', label: '$5' },
    { amount: 10, priceId: 'price_1S4caSEWSKGO1T0Lll7tXk9o', label: '$10' },
    { amount: 20, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFc', label: '$20' },
    { amount: 30, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFd', label: '$30' },
    { amount: 40, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFe', label: '$40' },
    { amount: 50, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFf', label: '$50' },
    { amount: 60, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFg', label: '$60' },
    { amount: 70, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFh', label: '$70' },
    { amount: 80, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFi', label: '$80' },
    { amount: 90, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFj', label: '$90' },
    { amount: 100, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFk', label: '$100' },
    { amount: 250, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFl', label: '$250' },
    { amount: 500, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFm', label: '$500' },
    { amount: 1000, priceId: 'price_1S4cVwEWSKGO1T0LHaVfPzFn', label: '$1,000' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const donationData = {
        amount: selectedAmount.amount * 100, // Convert to cents
        priceId: selectedAmount.priceId,
        email,
        name: name || 'Anonymous',
        interval: donationType === 'recurring' ? interval : undefined,
        metadata: {
          source: 'donation_form',
          donation_type: donationType,
          ...(donationType === 'recurring' && { billing_interval: interval })
        }
      };

      const endpoint = donationType === 'one-time' 
        ? '/api/donations/create-one-time'
        : '/api/donations/create-recurring';

      const response = await axios.post(endpoint, donationData);
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
      
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Support Our Mission</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Donation Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-6 py-2 text-sm font-medium rounded-l-lg ${
                donationType === 'one-time'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setDonationType('one-time')}
            >
              One-Time Donation
            </button>
            <button
              type="button"
              className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
                donationType === 'recurring'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setDonationType('recurring')}
            >
              Monthly Support
            </button>
          </div>
        </div>

        {/* Recurring Interval Selector */}
        {donationType === 'recurring' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Frequency
            </label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
        )}

        {/* Preset Amounts */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select an amount (USD)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-3">
            {presetAmounts.map((item) => (
              <button
                key={item.amount}
                type="button"
                onClick={() => setSelectedAmount(item)}
                className={`p-3 border rounded-md text-center transition-colors ${
                  selectedAmount.amount === item.amount
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {/* Custom Amount */}
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Or enter a custom amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={selectedAmount.amount}
                onChange={(e) => {
                  const amount = parseFloat(e.target.value) || 1;
                  setSelectedAmount({
                    amount,
                    priceId: `custom_${Date.now()}`,
                    label: `$${amount.toLocaleString()}`
                  });
                }}
                placeholder="0.00"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                  USD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Donor Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              We'll send a receipt to this email address
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading || !selectedAmount.amount || !email}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading || !selectedAmount.amount || !email
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              `Donate $${selectedAmount.amount.toLocaleString()} ${donationType === 'recurring' ? `per ${interval}` : ''}`.trim()
            )}
          </button>
          
          <p className="mt-3 text-center text-xs text-gray-500">
            Your donation is secure and encrypted. We use Stripe to process all payments.
          </p>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
