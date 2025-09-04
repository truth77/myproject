const knex = require('knex');
const config = require('../knexfile.js');
const db = knex(config.development);

async function addTestSubscriptions() {
  try {
    // Get the test users
    const users = await db('users')
      .whereIn('email', ['subscriber@example.com', 'superadmin@example.com']);

    for (const user of users) {
      // Check if subscription already exists
      const existingSub = await db('subscriptions')
        .where('user_id', user.id)
        .first();

      if (!existingSub) {
        // Add a test subscription
        await db('subscriptions').insert({
          user_id: user.id,
          status: 'active',
          plan_id: 'price_monthly',
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          created_at: new Date(),
          updated_at: new Date()
        });
        console.log(`Added subscription for ${user.email}`);
      } else {
        console.log(`Subscription already exists for ${user.email}`);
      }
    }

    console.log('Test subscriptions added successfully!');
  } catch (error) {
    console.error('Error adding test subscriptions:', error);
  } finally {
    await db.destroy();
  }
}

addTestSubscriptions();
