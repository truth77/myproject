import React from 'react';
import { Nav, Navbar, Container, Badge } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';

const AdminNavbar = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items with roles that can access them
  const navItems = [
    { id: 'overview', label: 'Overview', path: '/admin', roles: ['admin', 'superadmin'] },
    { id: 'users', label: 'Users', path: '/admin/users', roles: ['superadmin'] },
    { id: 'subscriptions', label: 'Subscriptions', path: '/admin/subscriptions', roles: ['admin', 'superadmin'] },
    { id: 'reports', label: 'Reports', path: '/admin/reports', roles: ['admin', 'superadmin'] },
    { id: 'settings', label: 'Settings', path: '/admin/settings', roles: ['superadmin'] },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Check if user has permission to view the nav item
  const hasPermission = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} to="/admin" className="d-flex align-items-center">
          <i className="bi bi-speedometer2 me-2"></i>
          <span>Admin Panel</span>
          {user?.role === 'superadmin' && (
            <Badge bg="warning" text="dark" className="ms-2">
              Super Admin
            </Badge>
          )}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
            {navItems.map((item) => (
              hasPermission(item.roles) && (
                <Nav.Link
                  key={item.id}
                  as={Link}
                  to={item.path}
                  active={location.pathname === item.path}
                  onClick={() => onTabChange(item.id)}
                  className="position-relative"
                >
                  {item.label}
                  {item.id === 'users' && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      3
                      <span className="visually-hidden">pending users</span>
                    </span>
                  )}
                </Nav.Link>
              )
            ))}
          </Nav>
          
          <Nav>
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <i className="bi bi-house-door me-1"></i>
              <span>Back to Site</span>
            </Nav.Link>
            
            <Nav.Link onClick={handleLogout} className="d-flex align-items-center">
              <i className="bi bi-box-arrow-right me-1"></i>
              <span>Logout</span>
            </Nav.Link>
            
            <div className="nav-link text-light d-none d-lg-flex align-items-center">
              <i className="bi bi-person-circle me-1"></i>
              <span>{user?.email || 'User'}</span>
              <Badge bg="secondary" className="ms-2">
                {user?.role || 'guest'}
              </Badge>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

AdminNavbar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default AdminNavbar;
