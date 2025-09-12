const TABLE = {
  SUBSCRIPTION_PLANS: 'subscription_plans',
  SUBSCRIPTIONS: 'subscriptions',
  PAYMENTS: 'payments',
  USERS: 'users',
};

exports.up = function (knex) {
  return knex.schema
    .createTable(TABLE.SUBSCRIPTION_PLANS, (table) => {
      table.increments('id').primary();
      table.string('stripe_price_id').notNullable().unique();
      table.string('stripe_product_id').notNullable();
      table.string('name').notNullable();
      table.string('description').nullable();
      table.integer('amount').notNullable(); // in cents
      table.string('currency', 3).notNullable().defaultTo('usd');
      table.string('interval').notNullable(); // day, week, month, year
      table.integer('interval_count').notNullable().defaultTo(1);
      table.boolean('is_active').notNullable().defaultTo(true);
      table.jsonb('features').defaultTo('[]');
      table.timestamps(true, true);
    })
    .createTable(TABLE.SUBSCRIPTIONS, (table) => {
      table.increments('id').primary();
      table.string('stripe_subscription_id').unique();
      table.integer('user_id').unsigned().notNullable();
      table.integer('plan_id').unsigned().notNullable();
      table.string('status').notNullable();
      
      // Billing cycle details
      table.timestamp('current_period_start').notNullable();
      table.timestamp('current_period_end').notNullable();
      table.timestamp('cancel_at_period_end').nullable();
      
      // Trial period
      table.timestamp('trial_start').nullable();
      table.timestamp('trial_end').nullable();
      
      // Cancellation
      table.timestamp('canceled_at').nullable();
      table.timestamp('ended_at').nullable();
      
      table.timestamps(true, true);
      
      // Foreign keys
      table.foreign('user_id').references('id').inTable(TABLE.USERS).onDelete('CASCADE');
      table.foreign('plan_id').references('id').inTable(TABLE.SUBSCRIPTION_PLANS);
    })
    .createTable(TABLE.PAYMENTS, (table) => {
      table.increments('id').primary();
      table.string('stripe_payment_intent_id').notNullable().unique();
      table.integer('subscription_id').unsigned().nullable();
      table.integer('user_id').unsigned().notNullable();
      
      // Payment details
      table.integer('amount').notNullable();
      table.string('currency', 3).notNullable().defaultTo('usd');
      table.string('status').notNullable();
      
      // Billing details
      table.string('billing_email').nullable();
      table.jsonb('billing_details').nullable();
      
      // Metadata
      table.jsonb('metadata').nullable();
      
      table.timestamps(true, true);
      
      // Foreign keys
      table.foreign('subscription_id').references('id').inTable(TABLE.SUBSCRIPTIONS).onDelete('SET NULL');
      table.foreign('user_id').references('id').inTable(TABLE.USERS);
    })
    .then(() => {
      // Add initial subscription plans
      const plans = [
        // Weekly Plans
        { amount: 500, name: 'Weekly Partner $5', interval: 'week', stripe_price_id: 'price_1S4jwdEWSKGO1T0LMSYVqKjj' },
        { amount: 1000, name: 'Weekly Partner $10', interval: 'week', stripe_price_id: 'price_1S4jzbEWSKGO1T0LS4mjP92Z' },
        { amount: 2000, name: 'Weekly Partner $20', interval: 'week', stripe_price_id: 'price_1S4k0oEWSKGO1T0LLSF7oSOh' },
        // Add more weekly plans as needed
        
        // Monthly Plans
        { amount: 500, name: 'Monthly Partner $5', interval: 'month', stripe_price_id: 'price_1S4btNEWSKGO1T0L4nxuQXQO' },
        { amount: 1000, name: 'Monthly Partner $10', interval: 'month', stripe_price_id: 'price_1S4btNEWSKGO1T0LPBNf1ZKS' },
        { amount: 2000, name: 'Monthly Partner $20', interval: 'month', stripe_price_id: 'price_1S4btNEWSKGO1T0LeFnqu24a' },
        // Add more monthly plans as needed
        
        // Yearly Plans
        { amount: 6000, name: 'Yearly Partner $60', interval: 'year', stripe_price_id: 'price_1S4cMSEWSKGO1T0LPkSzUdBB' },
        { amount: 10000, name: 'Yearly Partner $100', interval: 'year', stripe_price_id: 'price_1S4cMSEWSKGO1T0LdKqEoIf2' },
        { amount: 20000, name: 'Yearly Partner $200', interval: 'year', stripe_price_id: 'price_1S4cMSEWSKGO1T0Lh8vbNRDu' },
        // Add more yearly plans as needed
        
        // Donation (one-time)
        { amount: 500, name: 'One-Time Donation $5', interval: 'one_time', stripe_price_id: 'price_1S4cVwEWSKGO1T0LHaVfPzFb' },
        { amount: 1000, name: 'One-Time Donation $10', interval: 'one_time', stripe_price_id: 'price_1S4caSEWSKGO1T0Lll7tXk9o' },
        // Add more donation amounts as needed
      ];
      
      return knex(TABLE.SUBSCRIPTION_PLANS).insert(plans);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists(TABLE.PAYMENTS)
    .dropTableIfExists(TABLE.SUBSCRIPTIONS)
    .dropTableIfExists(TABLE.SUBSCRIPTION_PLANS);
};
