import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const SubscriptionCanceled = () => {
  const navigate = useNavigate();

  return (
    <Box maxWidth="md" mx="auto" p={3} mt={4}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CancelIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Payment Canceled
        </Typography>
        
        <Box my={4} textAlign="left" maxWidth={500} mx="auto">
          <Typography variant="body1" paragraph>
            Your subscription was not completed. The payment process was canceled.
          </Typography>
          <Typography variant="body1">
            If this was a mistake, you can try again or contact our support team for assistance.
          </Typography>
        </Box>

        <Box mt={4} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/subscription')}
            size="large"
          >
            Back to Plans
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/contact')}
            size="large"
          >
            Contact Support
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SubscriptionCanceled;
