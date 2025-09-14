import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from '../Navbar';
import Footer from '../common/Footer';
import VersionDisplay from '../common/VersionDisplay';
import Breadcrumb from '../Breadcrumb';
import ScrollToTop from '../ScrollToTop';
import { useAppContext } from '../../contexts/AppContext';

const AuthLayout = () => {
  const [isMobileView, setIsMobileView] = useState(() => window.innerWidth < 768);
  const { loading } = useAppContext();
  const resizeTimeout = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      
      resizeTimeout.current = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        setIsMobileView(prev => prev !== mobile ? mobile : prev);
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      window.removeEventListener('resize', handleResize, { passive: true });
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f5f7fa'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Navbar includes the Breadcrumb component */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1100, 
        width: '100%',
        backgroundColor: '#2c3e50'
      }}>
        <Navbar />
      </div>
      <div style={{ height: '80px' }} /> {/* Spacer to prevent content from being hidden behind fixed header */}
      
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box',
        padding: isMobileView ? '0 1rem' : '0 2rem'
      }}>
        <main style={{
          flex: 1,
          paddingTop: '1rem',
          paddingBottom: '2rem',
          width: '100%',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          minHeight: 'calc(100vh - 280px)'
        }}>
          <ScrollToTop />
          <Container maxWidth="sm" sx={{ margin: '0 auto' }}>
            <Breadcrumb />
            <Box sx={{ marginTop: '1rem' }}>
              <Outlet />
            </Box>
          </Container>
        </main>
      </div>
      
      <Footer />
      
      {/* Version display in corner */}
      <div style={{ position: 'fixed', bottom: 10, left: 10, zIndex: 1000 }}>
        <VersionDisplay />
      </div>
    </div>
  );
};

export default AuthLayout;
