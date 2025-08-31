const db = require('../db');

const subscriptionPlans = [
  {
    stripe_price_id: 'price_1', // Replace with actual Stripe price ID
    name: 'Basic',
    description: 'Basic subscription plan',
    price: 9.99,
    billing_cycle: 'monthly',
    features: JSON.stringify([
      'Access to basic content',
      'Email support',
      'Limited access to premium features'
    ]),
    is_active: true
  },
  {
    stripe_price_id: 'price_2', // Replace with actual Stripe price ID
    name: 'Pro',
    description: 'Professional subscription plan',
    price: 29.99,
    billing_cycle: 'monthly',
    features: JSON.stringify([
      'Access to all content',
      'Priority support',
      'All premium features',
      'Early access to new features'
    ]),
    is_active: true
  },
  {
    stripe_price_id: 'price_3', // Replace with actual Stripe price ID
    name: 'Enterprise',
    description: 'Enterprise subscription plan',
    price: 299.99,
    billing_cycle: 'yearly',
    features: JSON.stringify([
      'Unlimited access to all content',
      '24/7 dedicated support',
      'All premium features',
      'Custom integrations',
      'Dedicated account manager'
    ]),
    is_active: true
  }
];

async function seed() {
  try {
    console.log('Seeding subscription plans...');
    
    // Delete existing plans
    await db('subscription_plans').del();
    
    // Insert new plans
    await db('subscription_plans').insert(subscriptionPlans);
    
    console.log('Subscription plans seeded successfully');
  } catch (error) {
    console.error('Error seeding subscription plans:', error);
    throw error;
  }
}

module.exports = { seed };
