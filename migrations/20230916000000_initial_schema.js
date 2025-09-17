exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('username', 255).notNullable().unique();
      table.string('email', 255).notNullable().unique();
      table.string('password_hash', 255).notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.string('stripe_customer_id', 255);
      table.string('subscription_status', 255).defaultTo('inactive');
      table.timestamp('subscription_ends_at');
      table.enum('role', ['user', 'admin', 'subscriber', 'superadmin']).notNullable().defaultTo('user');
    })
    .createTable('subscription_plans', table => {
      table.increments('id').primary();
      table.string('stripe_price_id', 255).notNullable().unique();
      table.string('stripe_product_id', 255).notNullable();
      table.string('name', 255).notNullable();
      table.string('description', 255);
      table.integer('amount').notNullable();
      table.string('currency', 3).notNullable().defaultTo('usd');
      table.string('interval', 255).notNullable();
      table.integer('interval_count').notNullable().defaultTo(1);
      table.boolean('is_active').notNullable().defaultTo(true);
      table.jsonb('features').defaultTo('[]');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .createTable('subscriptions', table => {
      table.increments('id').primary();
      table.string('stripe_subscription_id', 255).unique();
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('plan_id').notNullable().references('id').inTable('subscription_plans');
      table.string('status', 255).notNullable();
      table.timestamp('current_period_start').notNullable();
      table.timestamp('current_period_end').notNullable();
      table.boolean('cancel_at_period_end').defaultTo(false);
      table.timestamp('trial_start');
      table.timestamp('trial_end');
      table.timestamp('canceled_at');
      table.timestamp('ended_at');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .createTable('payments', table => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('id').inTable('users');
      table.integer('subscription_id').references('id').inTable('subscriptions').onDelete('SET NULL');
      table.string('stripe_payment_intent_id', 255);
      table.integer('amount').notNullable();
      table.string('currency', 3).notNullable().defaultTo('usd');
      table.string('status', 50).notNullable();
      table.jsonb('metadata').defaultTo('{}');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .createTable('posts', table => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('id').inTable('users');
      table.string('title', 255).notNullable();
      table.text('content').notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('payments')
    .dropTableIfExists('subscriptions')
    .dropTableIfExists('posts')
    .dropTableIfExists('subscription_plans')
    .dropTableIfExists('users');
};
