import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAdminStats } from '../../store/adminActions';
import AdminNavbar from '../../components/admin/AdminNavbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, loading, error } = useSelector((state) => state.admin);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [authLoading, isAdmin, navigate]);

  // Load admin stats when component mounts and user is admin
  useEffect(() => {
    if (isAdmin) {
      dispatch(getAdminStats());
    }
  }, [dispatch, isAdmin]);

  // Show loading state while checking auth or loading data
  if (authLoading || (loading && !stats)) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  // Show error message if there was an error loading stats
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error loading dashboard</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <button 
              className="btn btn-primary" 
              onClick={() => dispatch(getAdminStats())}
            >
              Retry
            </button>
          </div>
        </Alert>
      </Container>
    );
  }

  // If not admin (after auth check), show access denied
  if (!isAdmin) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You don't have permission to access this page.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <Container fluid className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Admin Dashboard</h2>
          <div className="text-muted">
            Logged in as: <strong>{user?.email}</strong> ({user?.role})
          </div>
        </div>
        
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <Row className="g-4 mb-4">
              <Col md={4}>
                <Card className="h-100 border-primary">
                  <Card.Body>
                    <Card.Title className="text-primary">Total Users</Card.Title>
                    <Card.Text className="display-4">
                      {stats?.totalUsers || 0}
                    </Card.Text>
                    <Card.Link href="#/admin/users">View All Users</Card.Link>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 border-success">
                  <Card.Body>
                    <Card.Title className="text-success">Active Subscriptions</Card.Title>
                    <Card.Text className="display-4">
                      {stats?.activeSubscriptions || 0}
                    </Card.Text>
                    <Card.Link href="#/admin/subscriptions">View Subscriptions</Card.Link>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 border-info">
                  <Card.Body>
                    <Card.Title className="text-info">Monthly Revenue</Card.Title>
                    <Card.Text className="display-4">
                      ${stats?.monthlyRevenue?.toLocaleString() || '0'}
                    </Card.Text>
                    <Card.Link href="#/admin/revenue">View Reports</Card.Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Add more dashboard widgets as needed */}
            <Row className="mt-4">
              <Col md={6}>
                <Card>
                  <Card.Header>Recent Activity</Card.Header>
                  <Card.Body>
                    {stats?.recentActivity?.length > 0 ? (
                      <ul className="list-unstyled">
                        {stats.recentActivity.map((activity, index) => (
                          <li key={index} className="mb-2">
                            <small className="text-muted">{activity.timestamp}</small>
                            <div>{activity.message}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-muted">No recent activity</div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>System Status</Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>Version:</strong> {process.env.REACT_APP_VERSION || '1.0.0'}
                    </div>
                    <div className="mb-3">
                      <strong>Last Updated:</strong> {new Date().toLocaleString()}
                    </div>
                    <div>
                      <strong>Admin Permissions:</strong> {user?.role === 'superadmin' ? 'Full Access' : 'Limited Access'}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}
        
        {/* Add other tabs content here */}
        {activeTab !== 'overview' && (
          <Alert variant="info">
            {`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view coming soon.`}
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default AdminDashboard;
