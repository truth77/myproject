const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripeService');
const db = require('../db');
const { authenticateJWT } = require('../middleware/auth');

/**
 * @route   GET /api/subscriptions/plans
 * @desc    Get available subscription plans
 * @access  Public
 */
router.get('/plans', async (req, res) => {
  try {
    // In a real app, you might want to cache this or store plans in your database
    const plans = await stripeService.getSubscriptionPlans();
    res.json(plans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ error: 'Failed to fetch subscription plans' });
  }
});

/**
 * @route   POST /api/subscriptions/create-checkout-session
 * @desc    Create a checkout session for subscription
 * @access  Private
 */
router.post('/create-checkout-session', authenticateJWT, async (req, res) => {
  try {
    const { priceId } = req.body;
    const userId = req.user.id;

    // Get the user from the database
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure the user has a Stripe customer ID
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const updatedUser = await stripeService.createCustomer(user);
      customerId = updatedUser.stripe_customer_id;
    }

    // Create a checkout session
    const session = await stripeService.createCheckoutSession(
      priceId,
      customerId,
      `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.FRONTEND_URL}/subscription/canceled`
    );

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/**
 * @route   POST /api/subscriptions/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public (Stripe will call this endpoint)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    await stripeService.handleWebhookEvent(event);
    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ error: 'Failed to process webhook event' });
  }
});

/**
 * @route   GET /api/subscriptions/portal
 * @desc    Create a customer portal session for managing subscription
 * @access  Private
 */
router.get('/portal', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db('users').where({ id: userId }).first();
    
    if (!user || !user.stripe_customer_id) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/account`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create customer portal session' });
  }
});

/**
 * @route   GET /api/subscriptions/user
 * @desc    Get the current user's subscription status
 * @access  Private
 */
router.get('/user', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db('users')
      .leftJoin('subscriptions', 'users.id', 'subscriptions.user_id')
      .leftJoin('subscription_plans', 'subscriptions.plan_id', 'subscription_plans.id')
      .where('users.id', userId)
      .select(
        'users.*',
        'subscriptions.status as subscription_status',
        'subscriptions.current_period_end',
        'subscription_plans.name as plan_name',
        'subscription_plans.price as plan_price',
        'subscription_plans.billing_cycle as plan_billing_cycle'
      )
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      subscription: {
        status: user.subscription_status || 'inactive',
        current_period_end: user.current_period_end,
        plan: user.plan_name ? {
          name: user.plan_name,
          price: user.plan_price,
          billing_cycle: user.plan_billing_cycle
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription details' });
  }
});

module.exports = router;
