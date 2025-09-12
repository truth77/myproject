const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');

// Map of Stripe intervals to human-readable format
const INTERVAL_DISPLAY = {
  day: 'Daily',
  week: 'Weekly',
  month: 'Monthly',
  year: 'Yearly',
  one_time: 'One Time'
};

class StripeService {
  /**
   * Create a new customer in Stripe and save the customer ID to the database
   * @param {Object} user - The user object from the database
   * @param {string} paymentMethodId - (Optional) A payment method ID to attach to the customer
   * @returns {Promise<Object>} The updated user with Stripe customer ID
   */
  async createCustomer(user, paymentMethodId = null) {
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        metadata: {
          userId: user.id.toString(),
        },
        ...(paymentMethodId && { payment_method: paymentMethodId }),
      });

      // Save the Stripe customer ID to the user in the database
      await db('users')
        .where({ id: user.id })
        .update({ stripe_customer_id: customer.id });

      return { ...user, stripe_customer_id: customer.id };
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer in payment processor');
    }
  }

  /**
   * Get or create a Stripe customer
   * @param {Object} user - User object from database
   * @param {string} paymentMethodId - Optional payment method ID
   * @returns {Promise<Object>} Stripe customer
   */
  async getOrCreateCustomer(user, paymentMethodId = null) {
    try {
      if (user.stripe_customer_id) {
        return await stripe.customers.retrieve(user.stripe_customer_id);
      }
      return await this.createCustomer(user, paymentMethodId);
    } catch (error) {
      console.error('Error getting/creating customer:', error);
      throw new Error('Failed to get or create customer');
    }
  }

  /**
   * Create a checkout session for subscription
   * @param {string} customerId - Stripe customer ID
   * @param {string} priceId - Stripe price ID
   * @param {string} successUrl - Success redirect URL
   * @param {string} cancelUrl - Cancel redirect URL
   * @returns {Promise<Object>} Checkout session
   */
  async createCheckoutSession(customerId, priceId, successUrl, cancelUrl) {
    try {
      return await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
          trial_period_days: 7, // Optional: Add a trial period
        },
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Create a subscription for a customer
   * @param {string} customerId - The Stripe customer ID
   * @param {string} priceId - The Stripe price ID for the subscription
   * @param {string} paymentMethodId - (Optional) A payment method ID to use for the subscription
   * @returns {Promise<Object>} The subscription object from Stripe
   */
  async createSubscription(customerId, priceId, paymentMethodId = null) {
    try {
      // If a payment method is provided, attach it to the customer
      if (paymentMethodId) {
        await this.attachPaymentMethod(customerId, paymentMethodId);
      }

      // Get the price to determine the mode
      const price = await stripe.prices.retrieve(priceId);
      const isSubscription = price.type === 'recurring';

      if (isSubscription) {
        // Create a subscription for recurring payments
        return await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          expand: ['latest_invoice.payment_intent'],
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' }
        });
      } else {
        // Handle one-time payment
        return await stripe.paymentIntents.create({
          amount: price.unit_amount,
          currency: price.currency,
          customer: customerId,
          payment_method: paymentMethodId,
          off_session: false,
          confirm: true
        });
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Attach a payment method to a customer
   * @param {string} customerId - The Stripe customer ID
   * @param {string} paymentMethodId - The payment method ID to attach
   * @returns {Promise<Object>} The attached payment method
   */
  async attachPaymentMethod(customerId, paymentMethodId) {
    try {
      // Attach the payment method to the customer
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      return paymentMethod;
    } catch (error) {
      console.error('Error attaching payment method:', error);
      throw new Error('Failed to attach payment method');
    }
  }

  /**
   * Handle Stripe webhook events
   * @param {Object} event - The Stripe event object
   * @returns {Promise<Object>} The result of processing the event
   */
  async handleWebhookEvent(event) {
    const eventType = event.type;
    const data = event.data.object;

    try {
      switch (eventType) {
        case 'checkout.session.completed':
          return await this.handleCheckoutSessionCompleted(data);
        case 'customer.subscription.updated':
          return await this.handleSubscriptionUpdated(data);
        case 'customer.subscription.deleted':
          return await this.handleSubscriptionDeleted(data);
        case 'invoice.payment_succeeded':
          return await this.handleInvoicePaid(data);
        case 'invoice.payment_failed':
          return await this.handleInvoicePaymentFailed(data);
        default:
          console.log(`Unhandled event type: ${eventType}`);
          return { received: true };
      }
    } catch (error) {
      console.error(`Error handling webhook event ${eventType}:`, error);
      throw error;
    }
  }

  /**
   * Handle checkout.session.completed webhook event
   * @param {Object} session - The checkout session object from Stripe
   * @returns {Promise<Object>} Success status
   */
  async handleCheckoutSessionCompleted(session) {
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    
    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;
    
    // Get the price details
    const price = await stripe.prices.retrieve(priceId);
    const product = await stripe.products.retrieve(price.product);
    
    // Save subscription to database
    await this.saveSubscription({
      userId: session.client_reference_id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      amount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval || 'one_time',
      productName: product.name
    });
    
    return { success: true };
  }

  /**
   * Handle customer.subscription.updated webhook event
   * @param {Object} subscription - The subscription object from Stripe
   * @returns {Promise<Object>} Success status
   */
  async handleSubscriptionUpdated(subscription) {
    const customerId = subscription.customer;
    const status = subscription.status;

    // Update the subscription status in the database
    await db('users')
      .where({ stripe_customer_id: customerId })
      .update({
        subscription_status: status,
        subscription_ends_at: subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null,
      });

    return { success: true };
  }

  /**
   * Handle customer.subscription.deleted webhook event
   * @param {Object} subscription - The subscription object from Stripe
   * @returns {Promise<Object>} Success status
   */
  async handleSubscriptionDeleted(subscription) {
    const customerId = subscription.customer;

    // Update the user's subscription status to canceled
    await db('users')
      .where({ stripe_customer_id: customerId })
      .update({
        subscription_status: 'canceled',
        subscription_ends_at: new Date(subscription.canceled_at * 1000),
      });

    return { success: true };
  }

  /**
   * Handle invoice.payment_succeeded webhook event
   * @param {Object} invoice - The invoice object from Stripe
   * @returns {Promise<Object>} Success status
   */
  async handleInvoicePaid(invoice) {
    const subscriptionId = invoice.subscription;
    const customerId = invoice.customer;
    const amount = invoice.amount_paid;
    const currency = invoice.currency;

    try {
      // Record the payment in the database
      await db('payments').insert({
        user_id: invoice.metadata?.userId,
        stripe_invoice_id: invoice.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        amount: amount / 100, // Convert from cents to dollars
        currency,
        status: 'succeeded',
        created_at: new Date(),
        updated_at: new Date()
      });

      // Update subscription status if needed
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await this.handleSubscriptionUpdated(subscription);
      }

      return { success: true };
    } catch (error) {
      console.error('Error handling paid invoice:', error);
      throw new Error('Failed to process invoice payment');
    }
  }

  /**
   * Handle invoice.payment_failed webhook event
   * @param {Object} invoice - The invoice object from Stripe
   * @returns {Promise<Object>} Success status
   */
  async handleInvoicePaymentFailed(invoice) {
    const customerId = invoice.customer;

    // Update the user's subscription status to past_due
    await db('users')
      .where({ stripe_customer_id: customerId })
      .update({
        subscription_status: 'past_due',
      });

    return { success: true };
  }

  /**
   * Save subscription to database
   * @param {Object} subscriptionData - The subscription data to save
   * @returns {Promise<void>}
   */
  async saveSubscription(subscriptionData) {
    const {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      status,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd,
      amount,
      currency,
      interval,
      productName
    } = subscriptionData;

    // Start a transaction
    const trx = await db.transaction();

    try {
      // Check if subscription already exists
      const existingSubscription = await trx('subscriptions')
        .where({ stripe_subscription_id: stripeSubscriptionId })
        .first();

      const subscriptionData = {
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        stripe_price_id: stripePriceId,
        status,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: cancelAtPeriodEnd,
        amount,
        currency,
        interval,
        product_name: productName,
        updated_at: db.fn.now()
      };

      if (existingSubscription) {
        // Update existing subscription
        await trx('subscriptions')
          .where({ id: existingSubscription.id })
          .update(subscriptionData);
      } else {
        // Insert new subscription
        subscriptionData.created_at = db.fn.now();
        await trx('subscriptions').insert(subscriptionData);
      }

      // Update user's subscription status
      await trx('users')
        .where({ id: userId })
        .update({
          subscription_status: status,
          updated_at: db.fn.now()
        });

      // Commit the transaction
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      console.error('Error saving subscription:', error);
      throw new Error('Failed to save subscription');
    }
  }

  /**
   * Get subscription plans from Stripe
   * @returns {Promise<Array>} Array of subscription plans
   */
  async getSubscriptionPlans() {
    try {
      const prices = await stripe.prices.list({
        active: true,
        expand: ['data.product']
      });

      return prices.data.map(price => ({
        id: price.id,
        product_id: price.product.id,
        product_name: price.product.name,
        amount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval || 'one_time',
        interval_count: price.recurring?.interval_count || 1,
        trial_period_days: price.recurring?.trial_period_days || 0,
        metadata: price.metadata,
        product: {
          id: price.product.id,
          name: price.product.name,
          description: price.product.description,
          metadata: price.product.metadata
        }
      }));
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw new Error('Failed to fetch subscription plans');
    }
  }

  /**
   * Get user's subscription
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User's subscription
   */
  async getUserSubscription(userId) {
    try {
      const subscription = await db('subscriptions')
        .where({ user_id: userId })
        .orderBy('created_at', 'desc')
        .first();

      if (!subscription) {
        return null;
      }

      // Get the plan details
      const plan = await db('subscription_plans')
        .where({ id: subscription.plan_id })
        .first();

      return {
        ...subscription,
        plan
      };
    } catch (error) {
      console.error('Error getting user subscription:', error);
      throw new Error('Failed to get user subscription');
    }
  }
}

module.exports = new StripeService();
