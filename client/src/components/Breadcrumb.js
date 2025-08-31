import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumb on home page
  if (location.pathname === '/') return null;

  return (
    <nav aria-label="breadcrumb" style={{
      backgroundColor: '#f8f9fa',
      padding: '0.75rem 1rem',
      borderBottom: '1px solid #e9ecef',
      fontSize: '0.9rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <Link 
          to="/" 
          style={{
            color: '#6c757d',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s ease',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#4ba1a4';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#6c757d';
          }}
        >
          <span style={{ marginRight: '0.5rem' }}>🏠</span>
          Home
        </Link>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          // Format the name for display
          const displayName = name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return isLast ? (
            <span key={name} style={{
              color: '#2c3e50',
              marginLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ margin: '0 0.5rem' }}>/</span>
              <span>{displayName}</span>
            </span>
          ) : (
            <Link
              key={name}
              to={routeTo}
              style={{
                color: '#6c757d',
                textDecoration: 'none',
                marginLeft: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s ease',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#4ba1a4';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#6c757d';
              }}
            >
              <span style={{ margin: '0 0.5rem' }}>/</span>
              <span>{displayName}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumb;
