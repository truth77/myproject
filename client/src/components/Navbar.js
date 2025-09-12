import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useNewSubscription } from '../contexts/NewSubscriptionContext';
import Breadcrumb from './Breadcrumb';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAppContext();
  const { subscription } = useNewSubscription?.() || {};
  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: "/bible-study", text: "Bible" },
    { to: "/prayer", text: "Prayer" },
    { to: "/courses", text: "Courses" },
    { to: "/live", text: "Live" },
    { to: "/plant-churches", text: "Churches" },
    ...(isAuthenticated ? [
      { to: "/premium-content", text: "Premium Content" },
      { to: "/profile", text: "My Profile" },
      ...(isAdmin ? [{ to: "/admin", text: "Admin Dashboard" }] : [])
    ] : [])
  ];

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#2c3e50',
      padding: '0 1rem',
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          width: '100%',
          padding: 0,
          margin: 0,
          boxSizing: 'border-box',
          overflow: 'visible'
        }}>
        <nav style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 'auto',
          minHeight: 0,
          overflow: 'visible',
          margin: 0,
          padding: 0
        }}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img 
            src={`${process.env.PUBLIC_URL}/images/ARK-Network-logo.png`} 
            alt="ARK Network Logo" 
            style={{ 
              height: isMobileView ? '65px' : '75px',
              width: 'auto',
              flexShrink: 0
            }} 
          />
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            marginLeft: isMobileView ? '6px' : '3px',
            overflow: 'hidden',
            justifyContent: 'center'
          }}>
            <span style={{ 
              fontSize: isMobileView ? '1.6rem' : '1.8rem',
              fontWeight: 'bold', 
              color: 'white',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              ARK Network
            </span>
            <span style={{ 
              color: '#cccccc',
              fontSize: isMobileView ? '0.9rem' : '0.85rem',
              fontWeight: 'normal',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Building You Up In God
            </span>
          </div>
        </Link>
      </div>

      <div 
        style={{
          display: isMobileView ? 'block' : 'none',
          cursor: 'pointer',
          zIndex: 1001,
          paddingRight: '1.5rem',
          paddingTop: '0.5rem'
        }}
        onClick={toggleMobileMenu}
      >
        <div style={{
          width: '25px',
          height: '3px',
          backgroundColor: 'white',
          margin: '5px 0',
          transition: 'all 0.3s ease',
          transform: isMobileMenuOpen ? 'rotate(-45deg) translate(-5px, 6px)' : 'none'
        }} />
        <div style={{
          width: '25px',
          height: '3px',
          backgroundColor: 'white',
          margin: '5px 0',
          transition: 'all 0.3s ease',
          opacity: isMobileMenuOpen ? 0 : 1
        }} />
        <div style={{
          width: '25px',
          height: '3px',
          backgroundColor: 'white',
          margin: '5px 0',
          transition: 'all 0.3s ease',
          transform: isMobileMenuOpen ? 'rotate(45deg) translate(-5px, -6px)' : 'none'
        }} />
      </div>

      {(!isMobileView || isMobileMenuOpen) && (
        <div style={{
          position: isMobileView ? 'fixed' : 'static',
          top: isMobileView ? '80px' : 'auto',
          left: 0,
          right: 0,
          backgroundColor: isMobileView ? '#2c3e50' : 'transparent',
          zIndex: 1000,
          padding: isMobileView ? '1rem' : 0,
          display: 'flex',
          flexDirection: isMobileView ? 'column' : 'row',
          gap: '1rem',
          alignItems: 'center',
          boxShadow: isMobileView ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
        }}>
          {isAuthenticated ? (
            <>
              {subscription && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  backgroundColor: subscription.status === 'active' 
                    ? 'rgba(46, 204, 113, 0.2)' 
                    : 'rgba(231, 76, 60, 0.2)',
                  marginRight: isMobileView ? 0 : '1rem',
                  marginBottom: isMobileView ? '1rem' : 0,
                  width: isMobileView ? '100%' : 'auto',
                  justifyContent: 'center'
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
                    to={subscription.status === 'active' ? "/account/subscription" : "/subscription"}
                    style={{
                      color: 'white',
                      fontSize: '0.85rem',
                      textDecoration: 'underline',
                      marginLeft: '0.5rem'
                    }}
                    onClick={closeMobileMenu}
                  >
                    {subscription.status === 'active' ? 'Manage' : 'Upgrade'}
                  </Link>
                </div>
              )}
              
              <span style={{ 
                margin: isMobileView ? '0 0 1rem 0' : '0 1rem 0 0',
                color: 'white',
                whiteSpace: 'nowrap'
              }}>
                Welcome, {user?.name}
              </span>
              
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                  closeMobileMenu();
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid white',
                  color: 'white',
                  padding: '0.8rem 1.4rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  width: isMobileView ? '100%' : 'auto',
                  textAlign: 'center',
                  display: 'inline-block',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#4ba1a4';
                  e.currentTarget.style.borderColor = '#4ba1a4';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'white';
                }}
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                state={{ from: location.pathname }}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.8rem 1.4rem',
                  border: '1px solid white',
                  borderRadius: '4px',
                  width: isMobileView ? '100%' : 'auto',
                  textAlign: 'center',
                  marginBottom: isMobileView ? '0.5rem' : 0,
                  transition: 'all 0.2s ease',
                  display: 'inline-block'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#4ba1a4';
                  e.currentTarget.style.borderColor = '#4ba1a4';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'white';
                }}
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  backgroundColor: 'white',
                  color: '#2c3e50',
                  textDecoration: 'none',
                  padding: '0.8rem 1.4rem',
                  marginRight: '1.5rem',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  border: '1px solid white',
                  ':hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white'
                  }
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#4ba1a4';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#2c3e50';
                }}
                onClick={closeMobileMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
        </nav>
      </div>
      <Breadcrumb />
    </div>
  </div>
  );
};

export default Navbar;
