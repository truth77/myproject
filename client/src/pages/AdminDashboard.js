import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Button, Box, CircularProgress, Card, CardContent, CardHeader, Divider, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import LiveServices from '../components/services/LiveServices';

const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const AdminDashboard = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    version: '',
    lastChecked: null,
    loading: true,
    error: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const checkDatabaseStatus = async () => {
    try {
      setDbStatus(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetch('/api/admin/db-status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to check database status');
      }
      
      const data = await response.json();
      
      setDbStatus({
        connected: true,
        version: data.version,
        lastChecked: new Date().toLocaleTimeString(),
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Database check failed:', error);
      setDbStatus({
        connected: false,
        version: '',
        lastChecked: new Date().toLocaleTimeString(),
        loading: false,
        error: error.message
      });
      
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleBackup = async () => {
    try {
      const response = await fetch('/api/admin/backup', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create backup');
      }
      
      // Trigger file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setSnackbar({
        open: true,
        message: 'Backup created successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Backup failed:', error);
      setSnackbar({
        open: true,
        message: `Backup failed: ${error.message}`,
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
    const interval = setInterval(checkDatabaseStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome, {user?.username || 'Admin'}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Database Status Card */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader 
              title="Database Status" 
              action={
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={checkDatabaseStatus}
                  disabled={dbStatus.loading}
                  startIcon={dbStatus.loading ? <CircularProgress size={20} /> : null}
                >
                  {dbStatus.loading ? 'Checking...' : 'Refresh'}
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="textSecondary">Connection Status:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: dbStatus.connected ? 'success.main' : 'error.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body1">
                    {dbStatus.connected ? 'Connected' : 'Disconnected'}
                  </Typography>
                </Box>
              </Box>

              {dbStatus.connected && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="textSecondary">Database Version:</Typography>
                  <Typography variant="body1">{dbStatus.version}</Typography>
                </Box>
              )}

              {dbStatus.error && (
                <Box sx={{ mb: 2, color: 'error.main' }}>
                  <Typography variant="subtitle2">Error:</Typography>
                  <Typography variant="body2">{dbStatus.error}</Typography>
                </Box>
              )}

              <Typography variant="caption" color="textSecondary">
                Last checked: {dbStatus.lastChecked || 'Never'}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader title="Quick Actions" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                    onClick={handleBackup}
                    disabled={dbStatus.loading}
                  >
                    Backup Database
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    color="primary"
                    onClick={checkDatabaseStatus}
                    disabled={dbStatus.loading}
                  >
                    Test Connection
                  </Button>
                </Grid>
                {user?.role === 'superadmin' && (
                  <Grid item xs={12}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      color="secondary"
                      onClick={() => navigate('/admin/users')}
                    >
                      Manage Users
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Live Services Management */}
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader title="Live Services Management" />
            <Divider />
            <CardContent>
              <LiveServices isAdmin={true} />
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
