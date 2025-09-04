import React from 'react';

const Plans = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Subscription Plans Management</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and manage all available subscription plans.
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <p className="text-sm text-gray-500">Plans management coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Plans;
