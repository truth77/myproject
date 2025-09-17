const jwt = require('jsonwebtoken');
const db = require('../db');

/**
 * Middleware to authenticate JWT token
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token and get decoded payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const user = await db('users')
      .where({ id: decoded.id })
      .select('id', 'username', 'email', 'role')
      .first();
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to check if user has admin role
 */
const requireAdmin = (req, res, next) => {
  const user = req.user;
  
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user has admin or superadmin role
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return res.status(403).json({ 
      error: 'Access denied. Admin privileges required.',
      requiredRole: 'admin',
      currentRole: user.role
    });
  }

  next();
};

// Alias for consistency
const authenticateToken = authenticateJWT;

module.exports = {
  authenticateToken,
  requireAdmin
};
