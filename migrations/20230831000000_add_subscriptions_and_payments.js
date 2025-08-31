exports.up = function(knex) {
  return Promise.all([
    // Add subscription status to users table
    knex.schema.table('users', function(table) {
      table.string('stripe_customer_id').nullable();
      table.string('subscription_status').defaultTo('inactive');
      table.timestamp('subscription_ends_at').nullable();
    }),

    // Create subscription plans table
    knex.schema.createTable('subscription_plans', function(table) {
      table.increments('id').primary();
      table.string('stripe_price_id').notNullable();
      table.string('name').notNullable();
      table.string('description').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.string('billing_cycle').notNullable(); // 'monthly' or 'yearly'
      table.jsonb('features').defaultTo('[]');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    }),

    // Create subscriptions table
    knex.schema.createTable('subscriptions', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('plan_id').unsigned().references('id').inTable('subscription_plans');
      table.string('stripe_subscription_id').notNullable();
      table.string('status').notNullable();
      
      // Subscription dates
      table.timestamp('current_period_start').notNullable();
      table.timestamp('current_period_end').notNullable();
      table.timestamp('cancel_at_period_end').nullable();
      
      // Trial information
      table.boolean('is_trial').defaultTo(false);
      table.timestamp('trial_starts_at').nullable();
      table.timestamp('trial_ends_at').nullable();
      
      table.timestamps(true, true);
    }),

    // Create payments table
    knex.schema.createTable('payments', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.integer('subscription_id').unsigned().references('id').inTable('subscriptions').onDelete('SET NULL');
      
      // Stripe payment details
      table.string('stripe_payment_intent_id').notNullable();
      table.string('stripe_invoice_id').nullable();
      
      // Payment details
      table.decimal('amount', 10, 2).notNullable();
      table.string('currency', 3).defaultTo('usd');
      table.string('status').notNullable();
      
      // Billing details
      table.string('billing_email').nullable();
      
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('payments'),
    knex.schema.dropTableIfExists('subscriptions'),
    knex.schema.dropTableIfExists('subscription_plans'),
    knex.schema.table('users', function(table) {
      table.dropColumn('stripe_customer_id');
      table.dropColumn('subscription_status');
      table.dropColumn('subscription_ends_at');
    })
  ]);
};
