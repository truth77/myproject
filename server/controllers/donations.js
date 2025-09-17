const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../db');

/**
 * Get or create a price ID for a donation amount
 */
async function getOrCreatePriceId(amount, interval = null) {
  // For one-time donations, use the predefined price IDs
  if (!interval) {
    const priceMap = {
      500: 'price_1S4cVwEWSKGO1T0LHaVfPzFb',  // $5
      1000: 'price_1S4caSEWSKGO1T0Lll7tXk9o', // $10
      2000: 'price_1S4cVwEWSKGO1T0LHaVfPzFc', // $20
      3000: 'price_1S4cVwEWSKGO1T0LHaVfPzFd', // $30
      4000: 'price_1S4cVwEWSKGO1T0LHaVfPzFe', // $40
      5000: 'price_1S4cVwEWSKGO1T0LHaVfPzFf', // $50
      6000: 'price_1S4cVwEWSKGO1T0LHaVfPzFg', // $60
      7000: 'price_1S4cVwEWSKGO1T0LHaVfPzFh', // $70
      8000: 'price_1S4cVwEWSKGO1T0LHaVfPzFi', // $80
      9000: 'price_1S4cVwEWSKGO1T0LHaVfPzFj', // $90
      10000: 'price_1S4cVwEWSKGO1T0LHaVfPzFk', // $100
      25000: 'price_1S4cVwEWSKGO1T0LHaVfPzFl', // $250
      50000: 'price_1S4cVwEWSKGO1T0LHaVfPzFm', // $500
      100000: 'price_1S4cVwEWSKGO1T0LHaVfPzFn' // $1000
    };
    
    return priceMap[amount] || null;
  }
  
  // For recurring donations, find or create a price
  try {
    // Try to find an existing price
    const existingPrice = await knex('subscription_plans')
      .where({
        amount,
        interval: interval === 'month' ? 'month' : 'year', // map to your interval format
        is_active: true
      })
      .first();
      
    if (existingPrice) {
      return existingPrice.stripe_price_id;
    }
    
    // If no existing price, create a new one in Stripe
    const product = await stripe.products.create({
      name: `Donation (${interval}ly)`,
      type: 'service',
    });
    
    const price = await stripe.prices.create({
      unit_amount: amount,
      currency: 'usd',
      recurring: { interval },
      product: product.id,
    });
    
    return price.id;
  } catch (error) {
    console.error('Error getting/creating price:', error);
    return null;
  }
}

/**
 * Create a one-time donation checkout session
 */
const createOneTimeDonation = async (req, res) => {
  try {
    const { amount, email, name, priceId, metadata = {} } = req.body;
    
    // Validate amount
    if (!amount || isNaN(amount) || amount < 100) { // Minimum $1
      return res.status(400).json({ error: 'Invalid donation amount' });
    }
    
    // Get or create price ID
    const price_id = priceId || await getOrCreatePriceId(amount);
    
    if (!price_id) {
      return res.status(400).json({ error: 'Invalid price configuration' });
    }
    
    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: price_id,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/donate`,
      customer_email: email,
      metadata: {
        ...metadata,
        type: 'one_time_donation',
        donor_name: name || 'Anonymous',
      },
    });

    // Save the donation record in our database
    await knex('donations').insert({
      stripe_checkout_session_id: session.id,
      email,
      name: name || null,
      amount,
      currency: 'usd',
      status: 'pending',
      metadata: JSON.stringify(metadata),
      created_at: new Date(),
      updated_at: new Date()
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating one-time donation:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a recurring donation subscription
 */
const createRecurringDonation = async (req, res) => {
  try {
    const { amount, interval, email, name, priceId, metadata = {} } = req.body;
    
    // Validate input
    if (!amount || isNaN(amount) || amount < 500) { // Minimum $5 for recurring
      return res.status(400).json({ error: 'Invalid donation amount' });
    }
    
    if (!['month', 'year'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid interval' });
    }
    
    // Get or create price ID
    const price_id = priceId || await getOrCreatePriceId(amount, interval);
    
    if (!price_id) {
      return res.status(400).json({ error: 'Invalid price configuration' });
    }

    // Create a checkout session for the subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: price_id,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/donate`,
      customer_email: email,
      subscription_data: {
        metadata: {
          ...metadata,
          type: 'recurring_donation',
          donation_interval: interval,
          donor_name: name || 'Anonymous',
        },
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating recurring donation:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Handle Stripe webhook events
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoiceFailed(event.data.object);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionUpdate(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ error: error.message });
  }
};

// Helper functions for webhook handlers
async function handleCheckoutSessionCompleted(session) {
  const { id, metadata, customer, subscription, payment_intent, customer_email, customer_details } = session;
  
  try {
    // Find or create the user
    let user = await knex('users')
      .where('email', customer_email)
      .orWhere('stripe_customer_id', customer)
      .first();
    
    const userData = {
      email: customer_email,
      stripe_customer_id: customer,
      name: metadata.donor_name || customer_details?.name || 'Anonymous',
      role: 'donor',
      is_donor: true,
      updated_at: new Date()
    };
    
    if (!user) {
      // New user - create record
      const [userId] = await knex('users').insert({
        ...userData,
        created_at: new Date(),
        last_login: new Date()
      });
      user = { id: userId, ...userData };
      
      console.log(`Created new donor user: ${user.email} (ID: ${user.id})`);
    } else {
      // Existing user - update record
      await knex('users')
        .where('id', user.id)
        .update({
          ...userData,
          last_login: new Date()
        });
      
      console.log(`Updated existing user: ${user.email} (ID: ${user.id})`);
    }
    
    // Handle one-time donations
    if (metadata.type === 'one_time_donation') {
      await knex('donations')
        .where({ stripe_checkout_session_id: id })
        .update({
          user_id: user.id,
          status: 'succeeded',
          stripe_payment_intent_id: payment_intent,
          stripe_customer_id: customer,
          updated_at: new Date()
        });
        
      console.log(`Recorded one-time donation from ${user.email}`);
    } 
    // Handle recurring donations
    else if (metadata.type === 'recurring_donation' && subscription) {
      const subscriptionData = await stripe.subscriptions.retrieve(subscription);
      const priceId = subscriptionData.items.data[0].price.id;
      
      await knex('subscriptions')
        .insert({
          user_id: user.id,
          stripe_subscription_id: subscription,
          stripe_customer_id: customer,
          stripe_price_id: priceId,
          email: customer_email,
          name: metadata.donor_name || 'Anonymous',
          amount: subscriptionData.items.data[0].price.unit_amount,
          currency: subscriptionData.items.data[0].price.currency,
          interval: subscriptionData.items.data[0].price.recurring.interval,
          status: subscriptionData.status,
          is_donor: true,
          metadata: JSON.stringify(metadata),
          current_period_start: new Date(subscriptionData.current_period_start * 1000),
          current_period_end: new Date(subscriptionData.current_period_end * 1000),
          cancel_at_period_end: subscriptionData.cancel_at_period_end,
          created_at: new Date(),
          updated_at: new Date()
        });
        
      console.log(`Created subscription for ${user.email} (Subscription: ${subscription})`);
      
      // Update user's subscription status
      await knex('users')
        .where('id', user.id)
        .update({
          subscription_status: 'active',
          updated_at: new Date()
        });
    }
    
  } catch (error) {
    console.error('Error in handleCheckoutSessionCompleted:', error);
    // Even if user creation fails, we should still process the payment
    if (metadata.type === 'one_time_donation') {
      await knex('donations')
        .where({ stripe_checkout_session_id: id })
        .update({
          status: 'succeeded',
          stripe_payment_intent_id: payment_intent,
          stripe_customer_id: customer,
          updated_at: new Date()
        });
    }
  }
}

async function handleInvoicePaid(invoice) {
  const { subscription: subscriptionId, customer_email, amount_paid, status, payment_intent } = invoice;
  
  if (status !== 'paid') return;
  
  // Get subscription details
  const subscription = await knex('subscriptions')
    .where({ stripe_subscription_id: subscriptionId })
    .first();
    
  if (!subscription) {
    console.error('Subscription not found for invoice:', subscriptionId);
    return;
  }
  
  // Record the payment
  await knex('payments').insert({
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: payment_intent,
    stripe_subscription_id: subscriptionId,
    user_id: subscription.user_id,
    plan_id: subscription.plan_id,
    amount: amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    metadata: JSON.stringify({
      billing_reason: invoice.billing_reason,
      hosted_invoice_url: invoice.hosted_invoice_url,
      invoice_pdf: invoice.invoice_pdf
    }),
    created_at: new Date(),
    updated_at: new Date()
  });
  
  // Update subscription with new period
  await knex('subscriptions')
    .where({ id: subscription.id })
    .update({
      current_period_start: new Date(invoice.period_start * 1000),
      current_period_end: new Date(invoice.period_end * 1000),
      updated_at: new Date()
    });
}

async function handleInvoiceFailed(invoice) {
  const { subscription: subscriptionId, payment_intent } = invoice;
  
  // Update subscription status
  await knex('subscriptions')
    .where({ stripe_subscription_id: subscriptionId })
    .update({
      status: 'past_due',
      updated_at: new Date()
    });
    
  // Record the failed payment
  await knex('payments').insert({
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: payment_intent,
    stripe_subscription_id: subscriptionId,
    amount: invoice.amount_due,
    currency: invoice.currency,
    status: 'failed',
    failure_reason: invoice.billing_reason || 'payment_failed',
    created_at: new Date(),
    updated_at: new Date()
  });
}

async function handleSubscriptionUpdate(subscription) {
  const { id: subscriptionId, status, cancel_at_period_end, current_period_end } = subscription;
  
  const updates = {
    status,
    cancel_at_period_end,
    current_period_end: new Date(current_period_end * 1000),
    updated_at: new Date()
  };
  
  // If subscription is canceled or incomplete_expired, mark as canceled
  if (['canceled', 'incomplete_expired'].includes(status)) {
    updates.status = 'canceled';
    updates.canceled_at = new Date();
  }
  
  await knex('subscriptions')
    .where({ stripe_subscription_id: subscriptionId })
    .update(updates);
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  const { id: paymentIntentId, amount, currency, metadata } = paymentIntent;
  
  // For one-time donations, ensure the donation record is marked as succeeded
  if (metadata.donation_type === 'one_time') {
    await knex('donations')
      .where({ stripe_payment_intent_id: paymentIntentId })
      .update({
        status: 'succeeded',
        updated_at: new Date()
      });
  }
  
  // Record the successful payment
  await knex('payments').insert({
    stripe_payment_intent_id: paymentIntentId,
    amount,
    currency,
    status: 'succeeded',
    metadata: JSON.stringify(metadata),
    created_at: new Date(),
    updated_at: new Date()
  });
}

async function handlePaymentIntentFailed(paymentIntent) {
  const { id: paymentIntentId, amount, currency, last_payment_error, metadata } = paymentIntent;
  
  // For one-time donations, mark as failed
  if (metadata.donation_type === 'one_time') {
    await knex('donations')
      .where({ stripe_payment_intent_id: paymentIntentId })
      .update({
        status: 'failed',
        failure_reason: last_payment_error?.message || 'payment_failed',
        updated_at: new Date()
      });
  }
  
  // Record the failed payment
  await knex('payments').insert({
    stripe_payment_intent_id: paymentIntentId,
    amount,
    currency,
    status: 'failed',
    failure_reason: last_payment_error?.message || 'payment_failed',
    metadata: JSON.stringify(metadata),
    created_at: new Date(),
    updated_at: new Date()
  });
}

module.exports = {
  createOneTimeDonation,
  createRecurringDonation,
  handleWebhook
};
