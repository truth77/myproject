const express = require('express');
const router = express.Router();
const { authenticateJWT, requireSubscription } = require('../middleware/auth');

/**
 * @route   GET /api/premium/content
 * @desc    Get premium content (requires active subscription)
 * @access  Private + Subscription required
 */
router.get('/content', authenticateJWT, requireSubscription, async (req, res) => {
  try {
    // This is a protected route that only users with an active subscription can access
    res.json({
      success: true,
      message: 'Welcome to premium content!',
      content: 'This is exclusive content for subscribers only.'
    });
  } catch (error) {
    console.error('Error accessing premium content:', error);
    res.status(500).json({ error: 'Failed to access premium content' });
  }
});

module.exports = router;
