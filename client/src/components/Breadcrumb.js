import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumb on home page or auth pages
  if (location.pathname === '/' || 
      location.pathname === '/login' || 
      location.pathname === '/register') return null;

  return (
    <Box 
      component="nav" 
      aria-label="breadcrumb" 
      sx={{
        padding: '0',
        backgroundColor: '#2c3e50',
        position: 'sticky',
        top: '1px', // Just enough to be below the navbar
        zIndex: 1099,
        width: '100%',
        boxSizing: 'border-box',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Box
        sx={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          color: 'white',
          fontSize: '0.8rem',
          lineHeight: '1.2',
          '& a': {
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s ease',
            padding: '0.15rem 0.5rem',
            borderRadius: '3px',
            '&:hover': {
              color: '#fff',
              backgroundColor: 'rgba(255, 255, 255, 0.15)'
            }
          },
          '& .separator': {
            color: 'rgba(255, 255, 255, 0.4)',
            margin: '0 0.35rem',
            fontSize: '0.7rem'
          }
        }}
      >
        <Link to="/">
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
            <Box key={name} sx={{ 
              color: '#fff',
              fontWeight: 600,
              padding: '0.25rem 0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span className="separator">/</span>
              <span>{displayName}</span>
            </Box>
          ) : (
            <React.Fragment key={name}>
              <span className="separator">/</span>
              <Link to={routeTo}>
                {displayName}
              </Link>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export default Breadcrumb;
