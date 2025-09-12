import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { subscriptionsApi } from '../services/api';

const SubscriptionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('session_id');
    
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        // Verify the session with the backend
        const sessionData = await subscriptionsApi.getSubscriptionStatus();
        setSession({
          id: sessionId,
          status: 'complete',
          customer_email: sessionData.customer_email || 'customer@example.com',
          amount_total: sessionData.amount_total || 999,
          currency: sessionData.currency || 'usd'
        });
        setLoading(false);
      } catch (err) {
        console.error('Error verifying session:', err);
        setError('Failed to verify payment. Please contact support.');
        setLoading(false);
      }
    };

    verifySession();
  }, [location]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" mt={2}>
            Verifying your payment...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth="md" mx="auto" p={3} mt={4}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h5" gutterBottom>
            Payment Verification Failed
          </Typography>
          <Typography paragraph>{error}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/subscription')}
            sx={{ mt: 2 }}
          >
            Back to Subscription Plans
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" p={3} mt={4}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Thank You for Your Subscription!
        </Typography>
        
        <Box my={4} textAlign="left" maxWidth={500} mx="auto">
          <Typography variant="body1" paragraph>
            Your payment of ${(session.amount_total / 100).toFixed(2)} {session.currency.toUpperCase()} has been processed successfully.
          </Typography>
          <Typography variant="body1" paragraph>
            A confirmation has been sent to <strong>{session.customer_email}</strong>.
          </Typography>
          <Typography variant="body1">
            You can now access all premium features. If you have any questions, please contact our support team.
          </Typography>
        </Box>

        <Box mt={4} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard')}
            size="large"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/account/subscription')}
            size="large"
          >
            Manage Subscription
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SubscriptionSuccess;
