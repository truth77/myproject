import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { BibleStudy, PrayerNetwork, OnlineCourses, LiveServices } from './components/services';
import { useAppContext } from './contexts/AppContext';
import { useSubscription } from './contexts/SubscriptionContext';
import './App.css';

// Lazy load the subscription page
const SubscriptionPage = React.lazy(() => import('./pages/SubscriptionPage'));

// Components
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAppContext();
  const { subscription } = useSubscription?.() || {};

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '1rem',
      marginBottom: '2rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <Link to="/" style={{ 
        color: 'white', 
        textDecoration: 'none', 
        fontSize: '1.5rem',
        whiteSpace: 'nowrap'
      }}>
        Blackford Bible App
      </Link>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'flex-end'
      }}>
        {isAuthenticated ? (
          <>
            {subscription && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginRight: '1rem',
                padding: '0.5rem',
                borderRadius: '4px',
                backgroundColor: subscription.status === 'active' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: subscription.status === 'active' ? '#2ecc71' : '#e74c3c'
                }}></span>
                <span style={{ fontSize: '0.9rem' }}>
                  {subscription.status === 'active' ? 'Subscribed' : 'Not Subscribed'}
                </span>
                <Link 
                  to="/subscribe" 
                  style={{
                    color: 'white',
                    fontSize: '0.85rem',
                    textDecoration: 'underline',
                    marginLeft: '0.5rem'
                  }}
                >
                  {subscription.status === 'active' ? 'Manage' : 'Upgrade'}
                </Link>
              </div>
            )}
            
            <span style={{ marginRight: '1rem' }}>Welcome, {user?.name}</span>
            <button 
              onClick={logout} 
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid white',
                whiteSpace: 'nowrap'
              }}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{
                color: '#2c3e50',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                backgroundColor: 'white',
                whiteSpace: 'nowrap'
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const Home = () => {
  const { posts, loading, error, fetchPosts } = useAppContext();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <h2>Recent Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to post!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {posts.map((post) => (
            <div key={post.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: '#fff'
            }}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {post.image && (
                <img 
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/${post.image}`} 
                  alt={post.title}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Login = () => {
  const [credentials, setCredentials] = React.useState({ email: '', password: '' });
  const { login } = useAppContext();
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(credentials);
    if (!result.success) {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <button type="submit" style={{
          background: '#2c3e50',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Login
        </button>
      </form>
    </div>
  );
};

const Register = () => {
  const [userData, setUserData] = React.useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const { register } = useAppContext();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const result = await register({
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    
    if (result.success) {
      setSuccess(true);
      setError('');
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>Registration Successful!</h2>
        <p>You can now <Link to="/login">login</Link> to your account.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>Name:</label>
          <input
            type="text"
            id="name"
            value={userData.name}
            onChange={(e) => setUserData({...userData, name: e.target.value})}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={userData.email}
            onChange={(e) => setUserData({...userData, email: e.target.value})}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={userData.password}
            onChange={(e) => setUserData({...userData, password: e.target.value})}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={userData.confirmPassword}
            onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <button type="submit" style={{
          background: '#2c3e50',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Register
        </button>
      </form>
    </div>
  );
};

const ServiceCard = ({ title, description, icon, color, to }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: isHovered 
      ? `0 20px 40px -10px ${color}40` 
      : '0 8px 20px -5px rgba(0,0,0,0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateY(-8px) rotateY(5deg) rotateX(5deg)' : 'none',
    border: `1px solid ${color}15`,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    transformStyle: 'preserve-3d',
    perspective: '1000px',
    height: '100%',
    minHeight: '260px',
    boxSizing: 'border-box',
    '@media (max-width: 768px)': {
      minHeight: '220px',
      padding: '1.25rem'
    },
    '&:hover': {
      transform: 'translateY(-8px) rotateY(5deg) rotateX(5deg)'
    }
  };

  const iconContainerStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    backgroundColor: `${color}10`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
    fontSize: '26px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'scale(1.08) rotate(5deg)' : 'none',
    '@media (max-width: 768px)': {
      width: '52px',
      height: '52px',
      fontSize: '24px',
      marginBottom: '1.1rem'
    }
  };

  const titleStyle = {
    textDecoration: 'none !important',
    color: '#1f2937',
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: '0 0 0.75rem',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateX(4px)' : 'none',
    lineHeight: '1.3',
    '@media (max-width: 768px)': {
      fontSize: '1.15rem',
      marginBottom: '0.65rem'
    }
  };

  const descriptionStyle = {
    textDecoration: 'none !important',
    color: '#6b7280',
    fontSize: '0.92rem',
    lineHeight: '1.65',
    margin: '0 0 1.5rem',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0.05s',
    transform: isHovered ? 'translateX(4px)' : 'none',
    '@media (max-width: 768px)': {
      fontSize: '0.9rem',
      lineHeight: '1.6',
      marginBottom: '1.25rem'
    }
  };

  const arrowStyle = {
    marginTop: 'auto',
    color: color,
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.95rem',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateX(4px)' : 'none',
    '@media (max-width: 768px)': {
      fontSize: '0.9rem'
    },
    '&:after': {
      content: '"→"',
      marginLeft: '0.4rem',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? 'translateX(3px)' : 'none',
      display: 'inline-block'
    }
  };

  return (
    <Link 
      to={to} 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div style={iconContainerStyle}>
        {icon}
      </div>
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
      <span style={arrowStyle}>Learn more</span>
    </Link>
  );
};

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (isMobileView) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: isMobileView ? '70px' : '80px' }}>
        <header style={{
          backgroundColor: '#2c3e50',
          padding: '1rem 2rem',
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000
        }}>
          <nav style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img 
                src={`${process.env.PUBLIC_URL}/images/ARK-Network-logo.png`} 
                alt="Ark Network Logo" 
                style={{ height: isMobileView ? '60px' : '80px', width: 'auto' }}
              />
              <div>
                <h1 style={{ 
                  margin: 0, 
                  fontSize: isMobileView ? '1.2rem' : '1.5rem', 
                  color: 'white',
                  whiteSpace: 'nowrap',
                  lineHeight: 1
                }}>
                  Ark Network
                </h1>
                <div style={{
                  fontSize: isMobileView ? '0.7rem' : '0.85rem',
                  color: '#e0e0e0',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  marginTop: '4px',
                  whiteSpace: 'nowrap',
                  fontWeight: 300,
                  letterSpacing: '0.5px'
                }}>
                  Building You Up In God
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            {isMobileView && (
              <button 
                onClick={toggleMobileMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s',
                  zIndex: 1001
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            )}

            {/* Navigation Links */}
            <div style={{
              position: isMobileView ? 'fixed' : 'static',
              top: isMobileView ? '0' : 'auto',
              right: isMobileView ? (isMobileMenuOpen ? '0' : '-100%') : 'auto',
              width: isMobileView ? '80%' : 'auto',
              height: isMobileView ? '100vh' : 'auto',
              backgroundColor: isMobileView ? '#2c3e50' : 'transparent',
              padding: isMobileView ? '6rem 2rem 2rem' : '0',
              transition: 'all 0.3s ease-in-out',
              zIndex: 1000,
              boxShadow: isMobileView ? '-5px 0 15px rgba(0,0,0,0.1)' : 'none',
              display: isMobileView ? 'block' : 'block'
            }}>
              <ul style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: isMobileMenuOpen || !isMobileView ? 'flex' : 'none',
                flexDirection: isMobileView ? 'column' : 'row',
                gap: isMobileView ? '1.5rem' : '1.5rem',
                alignItems: 'center',
                width: '100%'
              }}>
                <li style={{ width: isMobileView ? '100%' : 'auto' }}>
                  <Link 
                    to="/" 
                    onClick={closeMobileMenu}
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: '500',
                      padding: isMobileView ? '1rem' : '0.5rem 1rem',
                      borderRadius: '4px',
                      transition: 'all 0.2s ease',
                      display: 'block',
                      textAlign: isMobileView ? 'center' : 'left',
                      backgroundColor: isMobileView ? 'rgba(255,255,255,0.1)' : 'transparent',
                      marginBottom: isMobileView ? '0.5rem' : '0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2dd4bf';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = isMobileView ? 'rgba(255,255,255,0.1)' : 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    onTouchStart={(e) => {
                      e.target.style.backgroundColor = '#2dd4bf';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onTouchEnd={(e) => {
                      e.target.style.backgroundColor = isMobileView ? 'rgba(255,255,255,0.1)' : 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Home
                  </Link>
                </li>
                <li style={{ width: isMobileView ? '100%' : 'auto' }}>
                  <Link 
                    to="/subscribe" 
                    onClick={closeMobileMenu}
                    style={{
                      backgroundColor: '#3498db',
                      color: 'white',
                      textDecoration: 'none',
                      padding: isMobileView ? '1rem' : '0.5rem 1.5rem',
                      borderRadius: '4px',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      display: 'block',
                      textAlign: 'center',
                      width: isMobileView ? '100%' : 'auto',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#0d9488';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#3498db';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    onTouchStart={(e) => {
                      e.target.style.backgroundColor = '#0d9488';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    }}
                    onTouchEnd={(e) => {
                      e.target.style.backgroundColor = '#3498db';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Subscribe
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        
        <main style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto'
        }}>
          <Routes>
            <Route path="/bible-study" element={<BibleStudy />} />
            <Route path="/prayer" element={<PrayerNetwork />} />
            <Route path="/courses" element={<OnlineCourses />} />
            <Route path="/live" element={<LiveServices />} />
            
            <Route path="/" element={
              <>
                <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                  <h1 style={{ 
                    color: '#2c3e50', 
                    marginBottom: '1rem',
                    fontSize: '2rem',
                    fontWeight: '600',
                    background: 'linear-gradient(90deg, #2c3e50, #3498db)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}>
                    Welcome to our Academy
                  </h1>
                  <p style={{ 
                    color: '#555', 
                    fontSize: '1.2rem',
                    maxWidth: '800px',
                    margin: '0 auto 3rem',
                    lineHeight: '1.6'
                  }}>
                    Here are the helpful services we offer to support your spiritual journey and growth in faith.
                  </p>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '2rem',
                  padding: '1.5rem',
                  margin: '0 auto',
                  maxWidth: '1400px',
                  width: '100%',
                  boxSizing: 'border-box',
                  '@media (max-width: 768px)': {
                    gap: '1.25rem',
                    padding: '1rem'
                  }
                }}>
                  {/* Service Card 1 */}
                  <ServiceCard 
                    title="Bible Study"
                    description="Dive deep into scripture with our interactive Bible study tools and resources."
                    icon="📖"
                    color="#4f46e5"
                    to="/bible-study"
                  />
                  
                  {/* Service Card 2 */}
                  <ServiceCard 
                    title="Prayer Network"
                    description="Join our prayer community and submit prayer requests 24/7."
                    icon="🙏"
                    color="#10b981"
                    to="/prayer"
                  />
                  
                  {/* Service Card 3 */}
                  <ServiceCard 
                    title="Online Courses"
                    description="Enroll in our faith-based courses to grow in knowledge and spirit."
                    icon="🎓"
                    color="#f59e0b"
                    to="/courses"
                  />
                  
                  {/* Service Card 4 */}
                  <ServiceCard 
                    title="Live Services"
                    description="Watch or listen to our live and recorded worship services."
                    icon="⛪"
                    color="#ef4444"
                    to="/live"
                  />
                </div>
              </>
            } />
            <Route path="/subscribe" element={
              <div className="subscription-page" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ color: '#2c3e50', marginTop: 0 }}>Choose Your Plan</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                  Select the subscription plan that works best for you.
                </p>
                {/* Subscription plans will go here */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem',
                  marginTop: '2rem'
                }}>
                  {/* Placeholder for subscription plans */}
                  <div style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <h3>Basic</h3>
                    <p>Free</p>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      textAlign: 'left',
                      margin: '1.5rem 0'
                    }}>
                      <li>✓ Basic Bible access</li>
                      <li>✓ Daily verse</li>
                      <li>✓ Limited reading plans</li>
                    </ul>
                    <button style={{
                      backgroundColor: '#2ecc71',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      width: '100%',
                      transition: 'background-color 0.2s'
                    }}>
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>
        
        <footer style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          textAlign: 'center',
          padding: '1rem',
          marginTop: '2rem',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}>
          <p>© {new Date().getFullYear()} Ark Network Academy. All rights reserved.</p>
        </footer>
        <div style={{
          width: '100%',
          backgroundColor: '#f8f9fa',
          padding: '2rem 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'inline-block',
            margin: '0 auto'
          }}>
            <img 
              src="/images/YHWH-ARK-Network.png" 
              alt="YHWH ARK Network" 
              style={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: '150px',
                display: 'block',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
