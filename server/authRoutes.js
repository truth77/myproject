const express = require('express');
const passport = require('passport');
const router = express.Router();

// Import Facebook auth module
const { isFacebookConfigured } = require('./auth/facebook');
const { createUser, logUserIn, loginFacebook, handleStripeWebhook } = require('./controllers/auth');

// Middleware to parse raw body for Stripe webhook
const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

// Regular authentication routes
router.post('/register', createUser);
router.post('/login', logUserIn);

// Stripe webhook - must be before express.json() to get raw body
router.post('/webhook', 
  express.raw({ type: 'application/json', verify: rawBodySaver }),
  handleStripeWebhook
);

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
