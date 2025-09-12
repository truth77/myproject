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
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { subscriptionsApi } from '../services/api';

const features = [
  { icon: <SchoolIcon />, text: 'Access to all courses' },
  { icon: <EmojiEventsIcon />, text: 'Exclusive content' },
  { icon: <GroupIcon />, text: 'Community access' },
  { icon: <HelpIcon />, text: 'Priority support' }
];

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState({ subscription: [], one_time: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlanType, setSelectedPlanType] = useState('subscription');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const plansData = await subscriptionsApi.getPlans();
        setPlans(plansData);
        setError(null);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      setProcessing(true);
      const session = await subscriptionsApi.createCheckoutSession(
        selectedPlan.id,
        selectedPlanType === 'subscription'
      );
      
      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Failed to initiate checkout. Please try again.');
      setProcessing(false);
    }
  };

  const renderPlanCard = (plan, index) => {
    const isSelected = selectedPlan?.id === plan.id;
    const isPopular = plan.nickname?.toLowerCase().includes('premium');
    const price = plan.amount / 100;
    const interval = plan.interval ? `/${plan.interval}` : '';

    return (
      <Grid item xs={12} sm={6} md={4} key={plan.id}>
        <Card 
          elevation={isSelected ? 8 : 2}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[8]
            }
          }}
        >
          {isPopular && (
            <Box 
              bgcolor="primary.main" 
              color="white" 
              textAlign="center"
              py={1}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                MOST POPULAR
              </Typography>
            </Box>
          )}
          <CardContent sx={{ flexGrow: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h3">
                {plan.nickname || plan.product?.name || 'Plan'}
              </Typography>
              {isPopular && <StarIcon color="primary" />}
            </Box>
            
            <Box mb={3}>
              <Typography variant="h4" component="div">
                ${price.toFixed(2)}<span style={{ fontSize: '1rem', color: theme.palette.text.secondary }}>{interval}</span>
              </Typography>
              {plan.amount === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Free forever
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <List dense>
              {features.map((feature, idx) => (
                <ListItem key={idx} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={feature.text} />
                </ListItem>
              ))}
              
              {plan.metadata?.features?.split(',').map((feature, idx) => (
                <ListItem key={`custom-${idx}`} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={feature.trim()} />
                </ListItem>
              ))}
            </List>
          </CardContent>
          
          <CardActions sx={{ p: 2 }}>
            <Button
              fullWidth
              variant={isSelected ? 'contained' : 'outlined'}
              color="primary"
              size="large"
              onClick={() => handlePlanSelect(plan)}
              disabled={processing}
            >
              {isSelected ? 'Selected' : 'Select Plan'}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="lg" mx="auto" px={3} py={6}>
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Choose Your Plan
        </Typography>
        <Typography variant="h6" color="textSecondary" maxWidth={700} mx="auto">
          Select the perfect plan for your spiritual journey. Cancel or change your plan anytime.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="center" mb={6}>
        <ToggleButtonGroup
          color="primary"
          value={selectedPlanType}
          exclusive
          onChange={(e, newType) => {
            if (newType !== null) {
              setSelectedPlanType(newType);
              setSelectedPlan(null);
            }
          }}
          aria-label="plan type"
          sx={{
            bgcolor: 'background.paper',
            p: 0.5,
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <ToggleButton 
            value="subscription" 
            sx={{
              px: 4,
              textTransform: 'none',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }
            }}
          >
            Subscription Plans
          </ToggleButton>
          <ToggleButton 
            value="one_time" 
            sx={{
              px: 4,
              textTransform: 'none',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }
            }}
          >
            One-Time Donations
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {plans[selectedPlanType]?.length > 0 ? (
          plans[selectedPlanType].map((planGroup) => (
            <React.Fragment key={planGroup.name}>
              {selectedPlanType === 'subscription' && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {planGroup.name} Plans
                  </Typography>
                </Grid>
              )}
              {planGroup.plans.map((plan) => renderPlanCard(plan))}
            </React.Fragment>
          ))
        ) : (
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                No {selectedPlanType === 'subscription' ? 'subscription' : 'donation'} plans available at the moment.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {selectedPlan && (
        <Box 
          position={isMobile ? 'fixed' : 'sticky'}
          bottom={0}
          left={0}
          right={0}
          bgcolor="background.paper"
          p={2}
          boxShadow={3}
          zIndex={1000}
          mt={4}
        >
          <Box 
            maxWidth={1200} 
            mx="auto" 
            display="flex" 
            flexDirection={isMobile ? 'column' : 'row'} 
            alignItems="center" 
            justifyContent="space-between"
            gap={2}
          >
            <Box>
              <Typography variant="h6">
                {selectedPlan.nickname || selectedPlan.product?.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                ${(selectedPlan.amount / 100).toFixed(2)}
                {selectedPlan.interval && ` per ${selectedPlan.interval}`}
              </Typography>
            </Box>
            <Box display="flex" gap={2} width={isMobile ? '100%' : 'auto'}>
              <Button 
                variant="outlined" 
                onClick={() => setSelectedPlan(null)}
                fullWidth={isMobile}
              >
                Change Plan
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleSubscribe}
                disabled={processing}
                fullWidth={isMobile}
                startIcon={processing ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {processing ? 'Processing...' : 'Continue to Checkout'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SubscriptionPlans;
