import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const TestPremiumPage = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box textAlign="center" py={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Premium Test Page
        </Typography>
        <Typography variant="body1" paragraph>
          This is a test page for premium content. Only users with an active subscription can view this content.
        </Typography>
        
        {user ? (
          <Box mt={4}>
            <Typography variant="h6" color="primary">
              Welcome, {user.email}!
            </Typography>
            <Typography variant="body1" mt={2}>
              Your user role: {user.role || 'guest'}
            </Typography>
            {user.subscriptionStatus === 'active' ? (
              <Typography variant="body1" color="success.main" mt={2}>
                Your subscription is active! Enjoy the premium content.
              </Typography>
            ) : (
              <Box mt={2}>
                <Typography variant="body1" color="error" mb={2}>
                  You need an active subscription to access premium content.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  href="/subscriptions"
                >
                  Subscribe Now
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box mt={4}>
            <Typography variant="body1" color="error" mb={2}>
              Please log in to access this content.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              href="/login"
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              href="/register"
            >
              Register
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default TestPremiumPage;
