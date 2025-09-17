import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DonationForm from '../components/DonationForm';
import { toast } from 'react-toastify';

const DonatePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get('status');

  // Handle successful donation redirect
  useEffect(() => {
    if (status === 'success') {
      toast.success('Thank you for your generous donation! Your support makes a difference.');
    } else if (status === 'canceled') {
      toast.info('Your donation was not completed. You may try again if you wish.');
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Support Our Mission
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Your generous donation helps us continue our work and make a difference.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <DonationForm />
          
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-3">Why Donate?</h3>
            <p className="text-blue-700 mb-4">
              Your support enables us to continue providing valuable resources and services to our community.
              Every contribution, no matter the size, makes a meaningful impact.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-blue-700">
              <li>100% of your donation goes directly to our programs</li>
              <li>Tax-deductible donations (consult your tax advisor)</li>
              <li>Secure and encrypted payment processing</li>
              <li>Recurring options available to provide ongoing support</li>
            </ul>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Questions about donations? Email us at{' '}
              <a href="mailto:donations@arknetwork.org" className="text-blue-600 hover:text-blue-800">
                donations@arknetwork.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
