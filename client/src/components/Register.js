import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting to register user:', { 
        username: formData.username, 
        email: formData.email 
      });
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration response:', response.data);
      
      // If we get here, registration was successful
      navigate('/login', { 
        state: { 
          from: from,
          registrationSuccess: 'Registration successful! Please log in.'
        } 
      });
    } catch (err) {
      console.error('Registration error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers
      });
      
      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else if (err.response.status === 400) {
          setError('Invalid registration data. Please check your input.');
        } else if (err.response.status === 409) {
          setError('A user with this email already exists.');
        } else {
          setError(`Registration failed: ${err.response.status} ${err.response.statusText}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('Unable to connect to the server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', err.message);
        setError('An error occurred while setting up the request.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '1.5rem'
      }}>Create an Account</h2>
      
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}
      
      {location.state?.registrationSuccess && (
        <div style={{
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          {location.state.registrationSuccess}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box',
              marginBottom: '0.5rem'
            }}
            disabled={isLoading}
          />
          <div style={{
            fontSize: '0.75rem',
            color: '#7f8c8d',
            marginTop: '0.25rem'
          }}>
            Password must be at least 6 characters long
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="confirmPassword" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...buttonStyle,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            backgroundColor: isLoading ? '#2c3e50' : '#2c3e50'
          }}
          onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#4ba1a4')}
          onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#2c3e50')}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div style={{
        textAlign: 'center',
        marginTop: '1.5rem',
        fontSize: '0.9rem',
        color: '#7f8c8d'
      }}>
        Already have an account?{' '}
        <Link 
          to="/login"
          state={{ from: location.state?.from }}
          style={{
            color: '#3498db',
            textDecoration: 'none',
            fontWeight: '500',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
