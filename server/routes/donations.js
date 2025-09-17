const express = require('express');
const router = express.Router();
const donationsController = require('../controllers/donations');
const { body } = require('express-validator');

// Webhook endpoint - Stripe will call this
router.post('/webhook', express.raw({ type: 'application/json' }), donationsController.handleWebhook);

// Create a one-time donation checkout session
router.post(
  '/create-one-time',
  [
    body('amount').isInt({ min: 50 }), // Minimum $0.50
    body('email').isEmail(),
    body('name').optional().trim().escape(),
  ],
  donationsController.createOneTimeDonation
);

// Create a recurring donation subscription
router.post(
  '/create-recurring',
  [
    body('amount').isInt({ min: 50 }), // Minimum $0.50
    body('interval').isIn(['week', 'month', 'year']),
    body('email').isEmail(),
    body('name').optional().trim().escape(),
  ],
  donationsController.createRecurringDonation
);

module.exports = router;
