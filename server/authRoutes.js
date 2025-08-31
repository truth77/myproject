const express = require('express');
const passport = require('passport');
const router = express.Router();

// Import Facebook auth module
const { isFacebookConfigured } = require('./auth/facebook');
const { createUser, logUserIn, loginFacebook } = require('./controllers/auth');

// Regular authentication routes
router.post('/register', createUser);
router.post('/login', logUserIn);

// Facebook authentication route - only enabled if properly configured
if (isFacebookConfigured) {
  router.post(
    '/facebook',
    passport.authenticate('facebook-token', { 
      session: false,
      failWithError: true
    }),
    loginFacebook,
    // Error handling middleware
    (err, req, res, next) => {
      console.error('Facebook authentication error:', err);
      res.status(401).json({
        success: false,
        message: 'Facebook authentication failed',
        error: err.message
      });
    }
  );
} else {
  // Return 501 Not Implemented if Facebook auth is not configured
  router.post('/facebook', (req, res) => {
    res.status(501).json({ 
      success: false, 
      message: 'Facebook authentication is not configured on this server.' 
    });
  });
}

module.exports = router;
