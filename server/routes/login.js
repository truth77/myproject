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

// Helper function to log errors consistently
const logError = (message, error = null) => {
  console.error(`[${new Date().toISOString()}] ${message}`, error || '');
};

/**
 * @route   POST /api/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/',
  [
    check('email')
      .optional()
      .isEmail()
      .withMessage('Please include a valid email')
      .normalizeEmail(),
    check('username', 'Username or email is required')
      .optional()
      .trim(),
    check('password', 'Password is required').exists().trim()
  ],
  loginLimiter, // Apply rate limiting
  async (req, res) => {
    console.log('Login request received:', { 
      body: { ...req.body, password: req.body.password ? '***' : 'not provided' },
      headers: req.headers 
    });

    try {
      // Input validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logError('Validation errors', errors.array());
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const { email, username, password } = req.body;

      try {
        // Validate that either email or username is provided
        if (!email && !username) {
          const error = 'Please provide either email or username';
          logError(error);
          return res.status(400).json({
            success: false,
            error
          });
        }

        // Find user by email or username
        let query = db('users').select('*');
        
        if (email) {
          query = query.where('email', email);
        } else {
          query = query.where('username', username);
        }

        console.log('Executing query:', query.toString()); // Debug log
        const user = await query.first();
        
        if (!user) {
          logError(`User not found: ${email || username}`);
          return res.status(401).json({
            success: false,
            error: 'Invalid email or password'
          });
        }

        console.log('Found user:', { id: user.id, email: user.email, username: user.username }); // Debug log

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          logError(`Invalid password for user: ${email || username}`);
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

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
          (err, token) => {
            if (err) {
              logError('JWT sign error', err);
              throw err;
            }
            
            // Set HTTP-only cookie
            res.cookie('token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Don't send sensitive data in response
            const userResponse = {
              id: user.id,
              email: user.email,
              username: user.username,
              role: user.role || 'user',
              stripe_customer_id: user.stripe_customer_id,
              created_at: user.created_at
            };

            console.log('Login successful for user:', userResponse.email || userResponse.username);
            
            res.json({
              success: true,
              token, // Still return token for clients that can't use cookies
              user: userResponse
            });
          }
        );

      } catch (dbError) {
        logError('Database error during login', dbError);
        throw new Error('Database error during login');
      }

    } catch (error) {
      logError('Unexpected error in login route', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred during login. Please try again.'
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
        id: req.user.id
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
        error: 'User not found'
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
