const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripeService = require('../services/stripeService');
const db = require('../db');
const { authenticateJWT } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

/**
 * @route   GET /api/subscriptions/plans
 * @desc    Get available subscription plans
 * @access  Public
 */
router.get('/plans', async (req, res) => {
  try {
    // Group plans by type (weekly, monthly, yearly, one_time)
    const plans = await stripeService.getSubscriptionPlans();
    
    const groupedPlans = plans.reduce((acc, plan) => {
      const type = plan.interval === 'one_time' ? 'one_time' : 'subscription';
      if (!acc[type]) acc[type] = [];
      acc[type].push(plan);
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        subscription: [
          {
            name: 'Weekly',
            plans: groupedPlans.subscription?.filter(p => p.interval === 'week') || []
          },
          {
            name: 'Monthly',
            plans: groupedPlans.subscription?.filter(p => p.interval === 'month') || []
          },
          {
            name: 'Yearly',
            plans: groupedPlans.subscription?.filter(p => p.interval === 'year') || []
          }
        ],
        one_time: groupedPlans.one_time || []
      }
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch subscription plans' 
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
  authenticateJWT,
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
      const customer = await stripeService.getOrCreateCustomer(user);
      
      // Get price details to determine if it's a subscription or one-time payment
      const price = await stripe.prices.retrieve(priceId);
      const isRecurring = price.type === 'recurring';

      // Create appropriate checkout session
      let session;
      if (isRecurring) {
        // For subscriptions
        session = await stripe.checkout.sessions.create({
          customer: customer.id,
          payment_method_types: ['card'],
          subscription_data: {
            metadata: {
              userId: user.id.toString(),
              priceId: priceId
            },
          },
          line_items: [{
            price: priceId,
            quantity: 1,
          }],
          mode: 'subscription',
          success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/subscription/canceled`,
        });
      } else {
        // For one-time payments
        session = await stripe.checkout.sessions.create({
          customer: customer.id,
          payment_method_types: ['card'],
          line_items: [{
            price: priceId,
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/subscription/canceled`,
          metadata: {
            userId: user.id.toString(),
            priceId: priceId,
            type: 'one_time'
          },
        });
      }

      res.json({ 
        success: true, 
        data: { 
          sessionId: session.id,
          url: session.url
        }
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to create checkout session' 
      });
    }
  }
);

/**
 * @route   POST /api/subscriptions/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public (Stripe will call this endpoint)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const payload = req.body;
  
  try {
    // Verify the webhook signature
    const event = await stripeService.handleWebhook(payload, sig);
    res.json(event);
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
});

/**
 * @route   GET /api/subscriptions/customer-portal
 * @desc    Create a customer portal session for managing subscription
 * @access  Private
 */
router.get('/customer-portal', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db('users').where({ id: userId }).first();
    
    if (!user || !user.stripe_customer_id) {
      return res.status(400).json({ 
        success: false,
        error: 'No subscription found' 
      });
    }

    const session = await stripeService.createPortalSession(
      user.stripe_customer_id,
      `${process.env.FRONTEND_URL}/account`
    );

    res.json({ 
      success: true,
      data: { url: session.url } 
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create customer portal session' 
    });
  }
});

/**
 * @route   GET /api/subscriptions/my-subscription
 * @desc    Get the current user's subscription status and details
 * @access  Private
 */
router.get('/my-subscription', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user with subscription details
    const subscription = await stripeService.getUserSubscription(userId);
    
    // Get user's payment history
    const payments = await db('payments')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(10);

    res.json({
      success: true,
      data: {
        subscription,
        paymentHistory: payments.map(payment => ({
          id: payment.id,
          amount: payment.amount / 100, // Convert to dollars
          currency: payment.currency,
          status: payment.status,
          createdAt: payment.created_at,
          billingDetails: payment.billing_details
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch subscription details' 
    });
  }
});

/**
 * @route   POST /api/subscriptions/cancel
 * @desc    Cancel the current user's subscription at period end
 * @access  Private
 */
router.post('/cancel', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's active subscription
    const subscription = await db('subscriptions')
      .where({ user_id: userId, status: 'active' })
      .first();
      
    if (!subscription) {
      return res.status(400).json({
        success: false,
        error: 'No active subscription found'
      });
    }
    
    // Cancel the subscription at period end
    await stripeService.cancelSubscription(subscription.stripe_subscription_id);
    
    res.json({
      success: true,
      message: 'Subscription will be canceled at the end of the current billing period',
      data: {
        cancelAtPeriodEnd: true,
        currentPeriodEnd: subscription.current_period_end
      }
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription'
    });
  }
});

/**
 * @route   POST /api/subscriptions/reactivate
 * @desc    Reactivate a canceled subscription
 * @access  Private
 */
router.post('/reactivate', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's subscription that's set to cancel at period end
    const subscription = await db('subscriptions')
      .where({ 
        user_id: userId, 
        status: 'active',
        cancel_at_period_end: true 
      })
      .first();
      
    if (!subscription) {
      return res.status(400).json({
        success: false,
        error: 'No cancellable subscription found'
      });
    }
    
    // Reactivate the subscription
    await stripeService.reactivateSubscription(subscription.stripe_subscription_id);
    
    res.json({
      success: true,
      message: 'Subscription has been reactivated',
      data: {
        cancelAtPeriodEnd: false
      }
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reactivate subscription'
    });
  }
});

module.exports = router;
