const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: { 
    success: false,
    error: 'Too many login attempts, please try again after 15 minutes' 
  }
});

/**
 * @route   POST /api/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/',
  [
    check('email')
      .isEmail()
      .withMessage('Please include a valid email')
      .normalizeEmail(),
    check('password', 'Password is required').exists().trim()
  ],
  loginLimiter, // Apply rate limiting
  async (req, res) => {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await db('users')
        .where({ email })
        .where('is_active', true) // Only allow active users
        .first();

      if (!user) {
        console.warn(`Login attempt failed: User not found - ${email}`);
        return res.status(401).json({ 
          success: false,
          error: 'Invalid email or password' 
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        console.warn(`Login attempt failed: Invalid password for user - ${email}`);
        return res.status(401).json({ 
          success: false,
          error: 'Invalid email or password' 
        });
      }

      // Create JWT Payload
      const payload = {
        user: {
          id: user.id,
          email: user.email,
          role: user.role || 'user'
        }
      };

      // Sign token
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Log successful login
      console.log(`User logged in: ${user.email} (${user.role || 'user'})`);

      // Return user data and token
      res.json({
        success: true,
        token, // Still return token for clients that can't use cookies
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role || 'user',
          stripe_customer_id: user.stripe_customer_id,
          created_at: user.created_at
        }
      });

    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/login/me
 * @desc    Get current user data
 * @access  Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db('users')
      .where({ 
        id: req.user.id,
        is_active: true 
      })
      .select(
        'id', 
        'email', 
        'username', 
        'role', 
        'stripe_customer_id', 
        'created_at',
        'last_login_at',
        'subscription_status'
      )
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found or account is inactive'
      });
    }

    // Update last login time
    await db('users')
      .where({ id: user.id })
      .update({ last_login_at: new Date() });

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user data',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * @route   POST /api/logout
 * @desc    Logout user (clear token)
 * @access  Private
 */
router.post('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');
  
  res.json({
    success: true,
    message: 'Successfully logged out'
  });
});

module.exports = router;
