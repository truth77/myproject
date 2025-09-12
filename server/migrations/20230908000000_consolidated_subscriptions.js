const TABLE = {
  SUBSCRIPTION_PLANS: 'subscription_plans',
  SUBSCRIPTIONS: 'subscriptions',
  PAYMENTS: 'payments',
  USERS: 'users',
};

exports.up = async function (knex) {
  // First, add any missing columns to users table
  await knex.schema.table(TABLE.USERS, (table) => {
    table.string('stripe_customer_id').nullable();
    table.string('subscription_status').defaultTo('inactive');
    table.timestamp('subscription_ends_at').nullable();
  });

  // Create subscription_plans table
  await knex.schema.createTable(TABLE.SUBSCRIPTION_PLANS, (table) => {
    table.increments('id').primary();
    table.string('stripe_price_id').notNullable().unique();
    table.string('stripe_product_id').notNullable();
    table.string('name').notNullable();
    table.string('description').nullable();
    table.integer('amount').notNullable(); // in cents
    table.string('currency', 3).notNullable().defaultTo('usd');
    table.string('interval').notNullable(); // day, week, month, year, one_time
    table.integer('interval_count').notNullable().defaultTo(1);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.jsonb('features').defaultTo('[]');
    table.timestamps(true, true);
  });

  // Create subscriptions table
  await knex.schema.createTable(TABLE.SUBSCRIPTIONS, (table) => {
    table.increments('id').primary();
    table.string('stripe_subscription_id').unique();
    table.integer('user_id').unsigned().notNullable();
    table.integer('plan_id').unsigned().notNullable();
    table.string('status').notNullable();
    
    // Billing cycle details
    table.timestamp('current_period_start').notNullable();
    table.timestamp('current_period_end').notNullable();
    table.boolean('cancel_at_period_end').defaultTo(false);
    
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
  });

  // Create payments table
  await knex.schema.createTable(TABLE.PAYMENTS, (table) => {
    table.increments('id').primary();
    table.string('stripe_payment_intent_id').notNullable().unique();
    table.string('stripe_invoice_id').nullable();
    table.integer('subscription_id').unsigned().nullable();
    table.integer('user_id').unsigned().notNullable();
    
    // Payment details
    table.integer('amount').notNullable(); // in cents
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
  });

  // Add initial subscription plans
  const plans = [
    // Weekly Plans
    { 
      stripe_price_id: 'price_1S4jwdEWSKGO1T0LMSYVqKjj',
      stripe_product_id: 'prod_weekly_5',
      name: 'Weekly Partner $5',
      description: 'Weekly subscription at $5/week',
      amount: 500,
      currency: 'usd',
      interval: 'week',
      interval_count: 1,
      is_active: true
    },
    { 
      stripe_price_id: 'price_1S4jzbEWSKGO1T0LS4mjP92Z',
      stripe_product_id: 'prod_weekly_10',
      name: 'Weekly Partner $10',
      description: 'Weekly subscription at $10/week',
      amount: 1000,
      currency: 'usd',
      interval: 'week',
      interval_count: 1,
      is_active: true
    },
    { 
      stripe_price_id: 'price_1S4k0oEWSKGO1T0LLSF7oSOh',
      stripe_product_id: 'prod_weekly_20',
      name: 'Weekly Partner $20',
      description: 'Weekly subscription at $20/week',
      amount: 2000,
      currency: 'usd',
      interval: 'week',
      interval_count: 1,
      is_active: true
    },
    
    // Monthly Plans
    { 
      stripe_price_id: 'price_1S4btNEWSKGO1T0L4nxuQXQO',
      stripe_product_id: 'prod_monthly_5',
      name: 'Monthly Partner $5',
      description: 'Monthly subscription at $5/month',
      amount: 500,
      currency: 'usd',
      interval: 'month',
      interval_count: 1,
      is_active: true
    },
    { 
      stripe_price_id: 'price_1S4btNEWSKGO1T0LPBNf1ZKS',
      stripe_product_id: 'prod_monthly_10',
      name: 'Monthly Partner $10',
      description: 'Monthly subscription at $10/month',
      amount: 1000,
      currency: 'usd',
      interval: 'month',
      interval_count: 1,
      is_active: true
    },
    { 
      stripe_price_id: 'price_1S4btNEWSKGO1T0LeFnqu24a',
      stripe_product_id: 'prod_monthly_20',
      name: 'Monthly Partner $20',
      description: 'Monthly subscription at $20/month',
      amount: 2000,
      currency: 'usd',
      interval: 'month',
      interval_count: 1,
      is_active: true
    },
    
    // Yearly Plans
    { 
      stripe_price_id: 'price_1S4cMSEWSKGO1T0LPkSzUdBB',
      stripe_product_id: 'prod_yearly_60',
      name: 'Yearly Partner $60',
      description: 'Yearly subscription at $60/year',
      amount: 6000,
      currency: 'usd',
      interval: 'year',
      interval_count: 1,
      is_active: true
    },
    { 
      stripe_price_id: 'price_1S4cMSEWSKGO1T0LdKqEoIf2',
      stripe_product_id: 'prod_yearly_100',
      name: 'Yearly Partner $100',
      description: 'Yearly subscription at $100/year',
      amount: 10000,
      currency: 'usd',
      interval: 'year',
      interval_count: 1,
      is_active: true
    },
    { 
      stripe_price_id: 'price_1S4cMSEWSKGO1T0Lh8vbNRDu',
      stripe_product_id: 'prod_yearly_200',
      name: 'Yearly Partner $200',
      description: 'Yearly subscription at $200/year',
      amount: 20000,
      currency: 'usd',
      interval: 'year',
      interval_count: 1,
      is_active: true
    },
    
    // Donations (one-time)
    { 
      stripe_price_id: 'price_1S4cVwEWSKGO1T0LHaVfPzFb',
      stripe_product_id: 'prod_donation_5',
      name: 'One-Time Donation $5',
      description: 'One-time donation of $5',
      amount: 500,
      currency: 'usd',
      interval: 'one_time',
      interval_count: 1,
      is_active: true
    },
    { 
      stripe_price_id: 'price_1S4caSEWSKGO1T0Lll7tXk9o',
      stripe_product_id: 'prod_donation_10',
      name: 'One-Time Donation $10',
      description: 'One-time donation of $10',
      amount: 1000,
      currency: 'usd',
      interval: 'one_time',
      interval_count: 1,
      is_active: true
    }
  ];

  // Insert the plans
  await knex(TABLE.SUBSCRIPTION_PLANS).insert(plans);
};

exports.down = async function (knex) {
  // Drop tables in reverse order
  await knex.schema.dropTableIfExists(TABLE.PAYMENTS);
  await knex.schema.dropTableIfExists(TABLE.SUBSCRIPTIONS);
  await knex.schema.dropTableIfExists(TABLE.SUBSCRIPTION_PLANS);
  
  // Remove columns from users table
  await knex.schema.table(TABLE.USERS, (table) => {
    table.dropColumn('stripe_customer_id');
    table.dropColumn('subscription_status');
    table.dropColumn('subscription_ends_at');
  });
};
