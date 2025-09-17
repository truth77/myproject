import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const spinnerSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : undefined;
  
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <Spinner 
        animation="border" 
        role="status" 
        size={spinnerSize}
        className="mb-2"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {message && <div className="text-muted">{message}</div>}
    </div>
  );
};

export default LoadingSpinner;
