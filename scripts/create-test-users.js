const knex = require('knex');
const bcrypt = require('bcryptjs');
const config = require('../knexfile.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const db = knex(config.development);

async function createStripeCustomer(email, name) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      description: 'Test customer',
    });
    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    return null;
  }
}

async function createTestUsers() {
  try {
    // Test Super Admin
    const superAdminPassword = await bcrypt.hash('superadmin123', 10);
    const superAdminStripeId = await createStripeCustomer('superadmin@example.com', 'Super Admin');
    
    await db('users').insert({
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: superAdminPassword,
      role: 'superadmin',
      stripe_customer_id: superAdminStripeId,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }).onConflict('email').ignore();

    // Test Subscriber
    const subscriberPassword = await bcrypt.hash('subscriber123', 10);
    const subscriberStripeId = await createStripeCustomer('subscriber@example.com', 'Test Subscriber');
    
    await db('users').insert({
      username: 'subscriber',
      email: 'subscriber@example.com',
      password: subscriberPassword,
      role: 'user',
      stripe_customer_id: subscriberStripeId,
      subscription_status: 'active',
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }).onConflict('email').ignore();

    // Create a test subscription for the subscriber
    if (subscriberStripeId) {
      const priceId = 'price_monthly'; // This should match your test price ID in Stripe
      try {
        const subscription = await stripe.subscriptions.create({
          customer: subscriberStripeId,
          items: [{ price: priceId }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });
        
        // Update the user with subscription info
        await db('users')
          .where({ email: 'subscriber@example.com' })
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: 'active',
            subscription_plan: priceId,
            subscription_start: new Date(subscription.current_period_start * 1000),
            subscription_end: new Date(subscription.current_period_end * 1000)
          });
      } catch (error) {
        console.error('Error creating test subscription:', error);
      }
    }

    // Test Guest (regular user)
    const guestPassword = await bcrypt.hash('guest123', 10);
    const guestStripeId = await createStripeCustomer('guest@example.com', 'Test Guest');
    
    await db('users').insert({
      username: 'guest',
      email: 'guest@example.com',
      password: guestPassword,
      role: 'user',
      stripe_customer_id: guestStripeId,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }).onConflict('email').ignore();

    console.log('✅ Test users created successfully!');
    console.log('Super Admin: superadmin@example.com / superadmin123');
    console.log('Subscriber: subscriber@example.com / subscriber123');
    console.log('Guest: guest@example.com / guest123');
  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await db.destroy();
    process.exit(0);
  }
}

// Check if STRIPE_SECRET_KEY is set
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is not set');
  console.log('Please set your Stripe secret key and try again.');
  console.log('Example: export STRIPE_SECRET_KEY=sk_test_...');
  process.exit(1);
}

createTestUsers();
