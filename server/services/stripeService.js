const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');

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

      // Create the subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        expand: ['latest_invoice.payment_intent'],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
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

  // Webhook event handlers
  async handleCheckoutSessionCompleted(session) {
    // Handle successful checkout completion
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    // Update user's subscription status in the database
    await db('users')
      .where({ stripe_customer_id: customerId })
      .update({
        subscription_status: 'active',
      });

    return { success: true };
  }

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

  async handleInvoicePaid(invoice) {
    // Handle successful invoice payment
    const customerId = invoice.customer;
    const amountPaid = invoice.amount_paid;
    const currency = invoice.currency;

    // Record the payment in the database
    await db('payments').insert({
      user_id: invoice.metadata?.userId,
      stripe_invoice_id: invoice.id,
      amount: amountPaid / 100, // Convert from cents to dollars
      currency,
      status: 'succeeded',
    });

    return { success: true };
  }

  async handleInvoicePaymentFailed(invoice) {
    // Handle failed invoice payment
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
   * Create a checkout session for subscription
   * @param {string} priceId - The Stripe price ID
   * @param {string} customerId - The Stripe customer ID
   * @param {string} successUrl - The URL to redirect to after successful payment
   * @param {string} cancelUrl - The URL to redirect to if payment is canceled
   * @returns {Promise<Object>} The checkout session
   */
  async createCheckoutSession(priceId, customerId, successUrl, cancelUrl) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer: customerId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
          trial_period_days: 7, // Optional: Add a trial period
        },
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }
}

module.exports = new StripeService();
