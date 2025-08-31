import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(credentials);
      if (result.success) {
        // Check if user has an active subscription
        // This will be handled by the ProtectedRoute component
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
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
      }}>Sign In</h2>
      
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
      
      <form onSubmit={handleSubmit}>
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
            value={credentials.email}
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
        
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <label htmlFor="password" style={{
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              Password
            </label>
            <Link to="/forgot-password" style={{
              fontSize: '0.875rem',
              color: '#3498db',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}>
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
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
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div style={{
        textAlign: 'center',
        marginTop: '1.5rem',
        fontSize: '0.9rem',
        color: '#7f8c8d'
      }}>
        Don't have an account?{' '}
        <Link 
          to="/register" 
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
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
