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

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await db('users').where({ id: decoded.id }).first();
    
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
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

/**
 * Middleware to check if user has an active subscription
 */
const requireSubscription = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await db('users')
      .leftJoin('subscriptions', 'users.id', 'subscriptions.user_id')
      .where('users.id', req.user.id)
      .select('users.*', 'subscriptions.status as subscription_status')
      .first();

    if (!user || user.subscription_status !== 'active') {
      return res.status(403).json({ 
        error: 'Active subscription required',
        requiresSubscription: true
      });
    }

    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ error: 'Failed to verify subscription' });
  }
};

// Alias authenticateJWT as authenticateToken for consistency with common naming
const authenticateToken = authenticateJWT;

module.exports = {
  authenticateJWT,
  authenticateToken,
  requireAdmin,
  requireSubscription
};
