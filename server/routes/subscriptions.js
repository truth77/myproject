const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Verify Stripe is properly initialized
if (!stripe) {
  console.error('Stripe is not properly initialized');
  throw new Error('Stripe is not properly initialized');
}

// Basic route to verify the API is working
router.get('/', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Subscriptions API is working',
    endpoints: {
      getPlans: 'GET /plans',
      createCheckout: 'POST /checkout-session',
      getSubscriptions: 'GET /user',
      cancelSubscription: 'POST /cancel'
    }
  });
});

/**
 * @route   GET /api/subscriptions/plans
 * @desc    Get available subscription plans
 * @access  Public
 */
router.get('/plans', async (req, res) => {
  try {
    // Get all products with their prices
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    });

    // Format the response
    const plans = products.data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.default_price
    }));

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch subscription plans',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/subscriptions/checkout-session
 * @desc    Create a checkout session for subscription or one-time payment
 * @access  Private
 */
router.post(
  '/checkout-session',
  authenticateToken,
  [
    check('priceId').not().isEmpty().withMessage('Price ID is required'),
    check('isSubscription').optional().isBoolean().withMessage('isSubscription must be a boolean')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { priceId, isSubscription = true } = req.body;
      const userId = req.user.id;

      // Get the user from the database
      const user = await db('users').where({ id: userId }).first();
      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }

      // Get or create Stripe customer
      let customer;
      if (user.stripe_customer_id) {
        customer = await stripe.customers.retrieve(user.stripe_customer_id);
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
          metadata: { userId: user.id }
        });
        
        // Save the customer ID to the user
        await db('users')
          .where({ id: user.id })
          .update({ stripe_customer_id: customer.id });
      }

      // Get price details
      const price = await stripe.prices.retrieve(priceId);
      const isRecurring = price.type === 'recurring';

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: isRecurring ? 'subscription' : 'payment',
        success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: {
          userId: user.id,
          priceId: priceId,
          isSubscription: isRecurring
        }
      });

      res.json({ 
        success: true, 
        sessionId: session.id 
      });

    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/subscriptions/user
 * @desc    Get current user's subscriptions
 * @access  Private
 */
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await db('users').where({ id: req.user.id }).first();
    
    if (!user.stripe_customer_id) {
      return res.json({ 
        success: true, 
        data: { subscriptions: [], customer: null } 
      });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_customer_id,
      status: 'all',
      expand: ['data.default_payment_method']
    });

    res.json({ 
      success: true, 
      data: { 
        subscriptions: subscriptions.data,
        customer: {
          id: user.stripe_customer_id,
          email: user.email
        }
      } 
    });
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch subscriptions',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/subscriptions/cancel
 * @desc    Cancel a subscription
 * @access  Private
 */
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'Subscription ID is required'
      });
    }

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    res.json({ 
      success: true, 
      data: { 
        message: 'Subscription will be cancelled at the end of the current period',
        subscription: subscription
      } 
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to cancel subscription',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutSession(session);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleSubscriptionUpdate(subscription);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Helper functions for webhook handlers
async function handleCheckoutSession(session) {
  const { customer, subscription, metadata } = session;
  const userId = metadata?.userId;
  
  if (!userId) return;

  // Update user's subscription status in your database
  await db('users')
    .where({ id: userId })
    .update({
      stripe_customer_id: customer,
      subscription_status: subscription ? 'active' : 'inactive',
      subscription_id: subscription || null,
      updated_at: new Date()
    });
}

async function handleSubscriptionUpdate(subscription) {
  const { customer, status } = subscription;
  
  // Update user's subscription status in your database
  await db('users')
    .where({ stripe_customer_id: customer })
    .update({
      subscription_status: status,
      updated_at: new Date()
    });
}

module.exports = router;
