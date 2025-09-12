import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Footer from '../common/Footer';
import VersionDisplay from '../common/VersionDisplay';

const AuthLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          width: '100%',
          backgroundColor: '#f5f5f5'
        }}
      >
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
