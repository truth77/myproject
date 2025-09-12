import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  CreditCard as CreditCardIcon,
  History as HistoryIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { subscriptionsApi } from '../services/api';

const SubscriptionManagement = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const subscription = await subscriptionsApi.getSubscriptionStatus();
        setSubscription(subscription);
        setError(null);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) {
      return;
    }

    try {
      setCanceling(true);
      await subscriptionsApi.cancelSubscription();
      // Refresh subscription data
      const subscription = await subscriptionsApi.getSubscriptionStatus();
      setSubscription(subscription);
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setCanceling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setReactivating(true);
      await subscriptionsApi.reactivateSubscription();
      // Refresh subscription data
      const subscription = await subscriptionsApi.getSubscriptionStatus();
      setSubscription(subscription);
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      setError('Failed to reactivate subscription. Please try again.');
    } finally {
      setReactivating(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setPortalLoading(true);
      const portalSession = await subscriptionsApi.createCustomerPortalSession();
      window.location.href = portalSession.url;
    } catch (err) {
      console.error('Error accessing customer portal:', err);
      setError('Failed to open customer portal. Please try again.');
      setPortalLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Subscription Management
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Subscription Status Card */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="h2">
                  {subscription?.plan?.name || 'No Active Subscription'}
                </Typography>
                {subscription?.status === 'active' && (
                  <Chip 
                    label="Active" 
                    color="success" 
                    size="small" 
                    icon={<CheckCircleIcon />} 
                  />
                )}
                {subscription?.status === 'canceled' && (
                  <Chip 
                    label="Canceling" 
                    color="warning" 
                    size="small" 
                    icon={<WarningIcon />} 
                  />
                )}
              </Box>

              {subscription ? (
                <>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CreditCardIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`$${(subscription.plan.amount / 100).toFixed(2)} ` + 
                                `${subscription.plan.interval ? `per ${subscription.plan.interval}` : 'one-time'}`}
                        secondary="Billing amount"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <HistoryIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={formatDate(subscription.current_period_end)}
                       secondary={
                          subscription.cancel_at_period_end 
                            ? `Access ends on ${formatDate(subscription.current_period_end)}` 
                            : 'Next billing date'
                        }
                      />
                    </ListItem>
                  </List>

                  <Box mt={3} display="flex" flexWrap="wrap" gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleManageBilling}
                      disabled={portalLoading}
                      startIcon={portalLoading ? <CircularProgress size={20} /> : <CreditCardIcon />}
                    >
                      {portalLoading ? 'Loading...' : 'Manage Billing'}
                    </Button>
                    
                    {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancelSubscription}
                        disabled={canceling}
                        startIcon={canceling ? <CircularProgress size={20} /> : <CancelIcon />}
                      >
                        {canceling ? 'Processing...' : 'Cancel Subscription'}
                      </Button>
                    )}
                    
                    {subscription.status === 'active' && subscription.cancel_at_period_end && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleReactivateSubscription}
                        disabled={reactivating}
                        startIcon={reactivating ? <CircularProgress size={20} /> : <RefreshIcon />}
                      >
                        {reactivating ? 'Processing...' : 'Reactivate Subscription'}
                      </Button>
                    )}
                  </Box>
                </>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    You don't have an active subscription.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/subscription')}
                  >
                    View Subscription Plans
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Billing History */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Billing History
              </Typography>
              
              {subscription?.paymentHistory?.length > 0 ? (
                <List dense>
                  {subscription.paymentHistory.map((payment) => (
                    <React.Fragment key={payment.id}>
                      <ListItem>
                        <ListItemText
                          primary={`$${(payment.amount).toFixed(2)} ${payment.currency.toUpperCase()}`}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                                display="block"
                              >
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </Typography>
                              <Chip 
                                label={payment.status} 
                                size="small" 
                                color={payment.status === 'succeeded' ? 'success' : 'default'}
                                variant="outlined"
                              />
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No billing history available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubscriptionManagement;
