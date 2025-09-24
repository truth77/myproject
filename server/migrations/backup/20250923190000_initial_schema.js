/**
 * Initial Database Schema Setup
 * This migration creates all necessary tables and relationships
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Create user_roles enum type
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');
      END IF;
    EXCEPTION WHEN duplicate_object THEN
      -- Type already exists, do nothing
      NULL;
    END
    $$;
  `);

  // Create users table if it doesn't exist
  const hasUsersTable = await knex.schema.hasTable('users');
  if (!hasUsersTable) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username', 100).unique().notNullable();
      table.string('email', 255).unique().notNullable();
      table.string('password_hash').notNullable();
      table.specificType('role', 'user_role').notNullable().defaultTo('user');
      table.boolean('is_active').notNullable().defaultTo(true);
      table.timestamp('last_login_at').nullable();
      table.string('subscription_status', 50).nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }

  // Create subscriptions table if it doesn't exist
  const hasSubscriptionsTable = await knex.schema.hasTable('subscriptions');
  if (!hasSubscriptionsTable) {
    await knex.schema.createTable('subscriptions', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE');
      table.string('stripe_subscription_id', 255).unique();
      table.string('stripe_customer_id', 255);
      table.string('stripe_price_id', 255);
      table.string('status', 50);
      table.timestamp('current_period_start').notNullable();
      table.timestamp('current_period_end').notNullable();
      table.timestamp('canceled_at').nullable();
      table.timestamp('ended_at').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }

  // Create subscription_plans table if it doesn't exist
  const hasSubscriptionPlansTable = await knex.schema.hasTable('subscription_plans');
  if (!hasSubscriptionPlansTable) {
    await knex.schema.createTable('subscription_plans', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.string('stripe_price_id', 255).unique().notNullable();
      table.string('stripe_product_id', 255).notNullable();
      table.enum('interval', ['day', 'week', 'month', 'year']).notNullable();
      table.integer('interval_count').notNullable().defaultTo(1);
      table.integer('amount').notNullable(); // in cents
      table.string('currency', 3).notNullable().defaultTo('usd');
      table.boolean('active').notNullable().defaultTo(true);
      table.jsonb('features').defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Drop tables in reverse order of creation
  await knex.schema.dropTableIfExists('subscriptions');
  await knex.schema.dropTableIfExists('subscription_plans');
  await knex.schema.dropTableIfExists('users');
  
  // Drop the enum type if no longer used
  await knex.raw(`
    DO $$
    BEGIN
      DROP TYPE IF EXISTS user_role;
    EXCEPTION WHEN dependent_objects_still_exist THEN
      -- Type is still in use, don't drop
      NULL;
    END
    $$;
  `);
};
