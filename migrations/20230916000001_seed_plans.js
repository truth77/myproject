const plans = [
  // Weekly Plans
  {
    stripe_price_id: 'price_weekly_5',
    stripe_product_id: 'prod_T0lTTCeQsvJXX1',
    name: 'Weekly Partner $5',
    description: 'Weekly subscription',
    amount: 500,
    interval: 'week',
    features: JSON.stringify(['Access to all content', 'Support the community', 'Weekly updates', 'Cancel anytime'])
  },
  {
    stripe_price_id: 'price_weekly_10',
    stripe_product_id: 'prod_T0lTTCeQsvJXX1',
    name: 'Weekly Partner $10',
    description: 'Weekly subscription',
    amount: 1000,
    interval: 'week',
    features: JSON.stringify(['Access to all content', 'Support the community', 'Weekly updates', 'Cancel anytime'])
  },
  {
    stripe_price_id: 'price_weekly_20',
    stripe_product_id: 'prod_T0lTTCeQsvJXX1',
    name: 'Weekly Partner $20',
    description: 'Weekly subscription',
    amount: 2000,
    interval: 'week',
    features: JSON.stringify(['Access to all content', 'Support the community', 'Weekly updates', 'Cancel anytime'])
  },
  
  // Monthly Plans
  {
    stripe_price_id: 'price_monthly_5',
    stripe_product_id: 'prod_T0d9n560fLicqF',
    name: 'Monthly Partner $5',
    description: 'Monthly subscription',
    amount: 500,
    interval: 'month',
    features: JSON.stringify(['Access to all content', 'Support the community', 'Monthly updates', 'Better value than weekly'])
  },
  {
    stripe_price_id: 'price_monthly_10',
    stripe_product_id: 'prod_T0d9n560fLicqF',
    name: 'Monthly Partner $10',
    description: 'Monthly subscription',
    amount: 1000,
    interval: 'month',
    features: JSON.stringify(['Access to all content', 'Support the community', 'Monthly updates', 'Better value than weekly'])
  },
  {
    stripe_price_id: 'price_monthly_20',
    stripe_product_id: 'prod_T0d9n560fLicqF',
    name: 'Monthly Partner $20',
    description: 'Monthly subscription',
    amount: 2000,
    interval: 'month',
    features: JSON.stringify(['Access to all content', 'Support the community', 'Monthly updates', 'Better value than weekly'])
  },
  
  // Yearly Plans
  {
    stripe_price_id: 'price_yearly_60',
    stripe_product_id: 'prod_T0ddEvUiY0WCbP',
    name: 'Yearly Partner $60',
    description: 'Yearly subscription',
    amount: 6000,
    interval: 'year',
    features: JSON.stringify(['Access to all content', 'Support the community', 'Yearly updates', 'Best value', 'Save 20%', 'Priority support'])
  },
  {
    stripe_price_id: 'price_yearly_100',
    stripe_product_id: 'prod_T0ddEvUiY0WCbP',
    name: 'Yearly Partner $100',
    description: 'Yearly subscription',
    amount: 10000,
    interval: 'year',
    features: JSON.stringify(['Access to all content', 'Support the community', 'Yearly updates', 'Best value', 'Save 20%', 'Priority support'])
  },
  
  // One-Time Donations
  {
    stripe_price_id: 'price_donation_5',
    stripe_product_id: 'prod_T0dn4afSR9oMDj',
    name: 'One-Time Donation $5',
    description: 'One-time donation',
    amount: 500,
    interval: 'one_time',
    features: JSON.stringify(['Access to all content', 'Support the community', 'One-time contribution', 'No commitment'])
  },
  {
    stripe_price_id: 'price_donation_10',
    stripe_product_id: 'prod_T0dn4afSR9oMDj',
    name: 'One-Time Donation $10',
    description: 'One-time donation',
    amount: 1000,
    interval: 'one_time',
    features: JSON.stringify(['Access to all content', 'Support the community', 'One-time contribution', 'No commitment'])
  }
];

exports.up = async function(knex) {
  // First, clear any existing plans
  await knex('subscription_plans').del();
  
  // Insert all plans
  return knex('subscription_plans').insert(plans.map(plan => ({
    ...plan,
    currency: 'usd',
    interval_count: plan.interval === 'one_time' ? 1 : 1,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  })));
};

exports.down = function(knex) {
  return knex('subscription_plans').del();
};
