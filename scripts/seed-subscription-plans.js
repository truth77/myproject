const knex = require('knex');
const config = require('../knexfile.js');

const db = knex(config);

// Helper function to generate features based on plan type
const getFeatures = (type) => {
  const baseFeatures = ['Access to all content', 'Support the community'];
  
  switch(type) {
    case 'weekly':
      return [...baseFeatures, 'Weekly updates', 'Cancel anytime'];
    case 'monthly':
      return [...baseFeatures, 'Monthly updates', 'Cancel anytime', 'Better value than weekly'];
    case 'yearly':
      return [...baseFeatures, 'Yearly updates', 'Best value', 'Save 20%', 'Priority support'];
    case 'one_time':
      return [...baseFeatures, 'One-time contribution', 'No commitment'];
    default:
      return baseFeatures;
  }
};

// Weekly Subscription Plans
const weeklyPlans = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((amount, index) => ({
  stripe_price_id: `price_weekly_${amount}_${index}`.padEnd(30, 'X').slice(0, 30), // Mock ID
  stripe_product_id: 'prod_T0lTTCeQsvJXX1',
  name: 'Weekly Partner',
  description: `$${amount} Weekly Subscription`,
  amount: amount * 100, // Convert to cents
  currency: 'usd',
  interval: 'week',
  interval_count: 1,
  is_active: true,
  features: JSON.stringify(getFeatures('weekly')),
  created_at: new Date(),
  updated_at: new Date()
}));

// Monthly Subscription Plans
const monthlyPlans = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((amount, index) => ({
  stripe_price_id: `price_monthly_${amount}_${index}`.padEnd(30, 'X').slice(0, 30), // Mock ID
  stripe_product_id: 'prod_T0d9n560fLicqF',
  name: 'Monthly Partner',
  description: `$${amount} Monthly Subscription`,
  amount: amount * 100, // Convert to cents
  currency: 'usd',
  interval: 'month',
  interval_count: 1,
  is_active: true,
  features: JSON.stringify(getFeatures('monthly')),
  created_at: new Date(),
  updated_at: new Date()
}));

// Yearly Subscription Plans
const yearlyPlans = [60, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((amount, index) => ({
  stripe_price_id: `price_yearly_${amount}_${index}`.padEnd(30, 'X').slice(0, 30), // Mock ID
  stripe_product_id: 'prod_T0ddEvUiY0WCbP',
  name: 'Yearly Partner',
  description: `$${amount} Yearly Subscription`,
  amount: amount * 100, // Convert to cents
  currency: 'usd',
  interval: 'year',
  interval_count: 1,
  is_active: true,
  features: JSON.stringify(getFeatures('yearly')),
  created_at: new Date(),
  updated_at: new Date()
}));

// One-Time Donation Plans
const oneTimeDonations = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((amount, index) => ({
  stripe_price_id: `price_onetime_${amount}_${index}`.padEnd(30, 'X').slice(0, 30), // Mock ID
  stripe_product_id: 'prod_T0dn4afSR9oMDj',
  name: 'One-Time Donation',
  description: `$${amount} One-Time Donation`,
  amount: amount * 100, // Convert to cents
  currency: 'usd',
  interval: 'one_time',
  interval_count: 1,
  is_active: true,
  features: JSON.stringify(getFeatures('one_time')),
  created_at: new Date(),
  updated_at: new Date()
}));

// Combine all plans
const allPlans = [...weeklyPlans, ...monthlyPlans, ...yearlyPlans, ...oneTimeDonations];

async function seedSubscriptionPlans() {
  try {
    console.log('Starting to seed subscription plans...');
    
    // Clear existing data
    await db('subscription_plans').del();
    console.log('Cleared existing subscription plans');
    
    // Insert new data in batches to avoid hitting parameter limits
    const batchSize = 10;
    for (let i = 0; i < allPlans.length; i += batchSize) {
      const batch = allPlans.slice(i, i + batchSize);
      await db('subscription_plans').insert(batch);
      console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(allPlans.length / batchSize)}`);
    }
    
    console.log('Successfully seeded subscription plans');
    
    // Verify the count
    const count = await db('subscription_plans').count('* as count');
    console.log(`Total plans in database: ${count[0].count}`);
    
  } catch (error) {
    console.error('Error seeding subscription plans:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

seedSubscriptionPlans();
