import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from '../Navbar';
import Footer from '../common/Footer';
import VersionDisplay from '../common/VersionDisplay';
import Breadcrumb from '../Breadcrumb';
import ScrollToTop from '../ScrollToTop';

const AuthLayout = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0, width: '100%' }}>
      {/* Navbar includes the Breadcrumb component */}
      <Navbar />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobileView ? '1rem' : '2rem',
          paddingTop: isMobileView ? '100px' : '120px',
          paddingBottom: '2rem',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 200px)'
        }}
      >
        <ScrollToTop />
        <Container maxWidth="sm">
          <Outlet />
        </Container>
      </Box>
      
      <Footer />
      
      {/* Version display in corner */}
      <div style={{ position: 'fixed', bottom: 10, left: 10, zIndex: 1000 }}>
        <VersionDisplay />
      </div>
    </div>
  );
};

export default AuthLayout;
