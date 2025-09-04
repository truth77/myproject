import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { premiumApi } from '../services/api.js';

const PremiumContentPage = () => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPremiumContent = async () => {
      try {
        setLoading(true);
        const data = await premiumApi.getPremiumContent();
        setContent(data);
      } catch (err) {
        console.error('Error fetching premium content:', err);
        setError(err.message || 'Failed to load premium content');
        
        // If the error is due to subscription required, redirect to subscription page
        if (err.status === 403) {
          navigate('/subscribe');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumContent();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/subscribe')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Premium Content
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Welcome to your exclusive content area
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {content?.title || 'Premium Content'}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your subscription gives you access to this premium content
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="prose max-w-none">
              <p>{content?.content || 'This is your exclusive premium content. Thank you for subscribing!'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumContentPage;
