import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const ThankYouPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-close the success message after 5 seconds and redirect to home
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="rounded-full bg-green-100 p-4 inline-flex items-center justify-center">
          <FaCheckCircle className="h-12 w-12 text-green-600" />
        </div>
        
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Thank You for Your Generous Donation!
        </h2>
        
        <p className="mt-2 text-gray-600">
          Your support means the world to us. A receipt has been sent to your email address.
        </p>
        
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">What's Next?</h3>
          <p className="mt-2 text-blue-700">
            You'll receive an email confirmation with your donation details. 
            If you have any questions about your donation, please contact us at{' '}
            <a href="mailto:donations@arknetwork.org" className="text-blue-600 hover:text-blue-800">
              donations@arknetwork.org
            </a>.
          </p>
        </div>
        
        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </button>
        </div>
        
        <p className="mt-4 text-sm text-gray-500">
          You will be automatically redirected to the home page in 10 seconds.
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
