import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../services/api';

// Define input style outside the component
const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
  boxSizing: 'border-box',
  marginBottom: '0.5rem'
};

// VERSION: 1.1 - Added version tracking and improved error handling
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const validatePassword = (password) => {
    return {
      hasMinLength: password.length >= 8,
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Password validation
    const errors = [];
    
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    if (formData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[0-9]/.test(formData.password)) {
      errors.push('Password must contain at least one number (0-9)');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting to register user:', { 
        username: formData.username, 
        email: formData.email 
      });
      
      const response = await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration response:', response);
      
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
        response: err.response,
        status: err.status,
        data: err.data,
        fullError: err
      });
      
      // Handle different types of errors
      if (err.response) {
        // If we have error data from the API
        if (err.data && err.data.error) {
          setError(`Registration failed: ${err.data.error}`);
          return;
        }
        
        // Try to parse the response as JSON
        try {
          const errorData = await err.response.text();
          console.log('Error response text:', errorData);
          
          // Try to parse as JSON if possible
          try {
            const jsonData = JSON.parse(errorData);
            if (jsonData.error) {
              setError(`Registration failed: ${jsonData.error}`);
              return;
            }
          } catch (e) {
            // If not JSON, use the text as is
            if (errorData) {
              setError(`Registration failed: ${errorData}`);
              return;
            }
          }
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
        }
        
        // Handle specific status codes with generic messages
        if (err.response.status === 400) {
          setError('Invalid registration data. Please check your input and try again.');
        } else if (err.response.status === 409) {
          setError('A user with this email or username already exists.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Registration failed with status ${err.response.status}: ${err.response.statusText || 'Unknown error'}`);
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
      maxWidth: '500px',
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
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          borderLeft: '4px solid #c62828'
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
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          borderLeft: '4px solid #2e7d32'
        }}>
          {location.state.registrationSuccess}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="username" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#2c3e50',
            fontSize: '0.95rem'
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
              ...inputStyle,
              borderColor: formData.username ? '#2c3e50' : '#ddd'
            }}
            disabled={isLoading}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#2c3e50',
            fontSize: '0.95rem'
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
              ...inputStyle,
              borderColor: formData.email ? '#2c3e50' : '#ddd'
            }}
            disabled={isLoading}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#2c3e50',
            fontSize: '0.95rem'
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
              ...inputStyle,
              borderColor: formData.password ? '#2c3e50' : '#ddd',
              marginBottom: '0.5rem'
            }}
            disabled={isLoading}
          />
          
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '0.75rem',
            borderRadius: '4px',
            marginTop: '0.5rem',
            border: '1px solid #e9ecef'
          }}>
            <p style={{ 
              margin: '0 0 0.5rem 0', 
              fontWeight: '600',
              fontSize: '0.85rem',
              color: '#495057'
            }}>
              Password Requirements:
            </p>
            <ul style={{ 
              margin: '0', 
              paddingLeft: '1.25rem',
              fontSize: '0.85rem'
            }}>
              <li style={{ 
                color: passwordStrength.hasMinLength ? '#2ecc71' : '#6c757d',
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: passwordStrength.hasMinLength ? '#2ecc71' : '#e9ecef',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {passwordStrength.hasMinLength ? '✓' : '•'}
                </span>
                At least 8 characters
              </li>
              <li style={{ 
                color: passwordStrength.hasNumber ? '#2ecc71' : '#6c757d',
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: passwordStrength.hasNumber ? '#2ecc71' : '#e9ecef',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {passwordStrength.hasNumber ? '✓' : '•'}
                </span>
                At least one number
              </li>
              <li style={{ 
                color: passwordStrength.hasSpecialChar ? '#2ecc71' : '#6c757d',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: passwordStrength.hasSpecialChar ? '#2ecc71' : '#e9ecef',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {passwordStrength.hasSpecialChar ? '✓' : '•'}
                </span>
                At least one special character (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="confirmPassword" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#2c3e50',
            fontSize: '0.95rem'
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
              ...inputStyle,
              borderColor: formData.confirmPassword 
                ? (formData.password === formData.confirmPassword ? '#2ecc71' : '#e74c3c')
                : '#ddd'
            }}
            disabled={isLoading}
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p style={{ 
              color: '#e74c3c', 
              margin: '0.5rem 0 0', 
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚠️</span>
              <span>Passwords do not match</span>
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...buttonStyle,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            backgroundColor: '#2c3e50',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            border: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#1a252f')}
          onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#2c3e50')}
        >
          {isLoading ? (
            <>
              <span style={{ visibility: 'hidden' }}>Create Account</span>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    to: { transform: 'rotate(360deg)' }
                  }
                }} />
                <span>Creating Account...</span>
              </div>
            </>
          ) : 'Create Account'}
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
