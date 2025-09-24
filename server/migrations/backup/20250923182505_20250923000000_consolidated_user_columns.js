/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Create enum type if it doesn't exist
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');
      END IF;
    END
    $$;
  `);

  // Add role column if it doesn't exist
  const hasRoleColumn = await knex.schema.hasColumn('users', 'role');
  if (!hasRoleColumn) {
    await knex.schema.alterTable('users', table => {
      table.specificType('role', 'user_role').notNullable().defaultTo('user');
    });
  }

  // Add is_active column if it doesn't exist
  const hasIsActiveColumn = await knex.schema.hasColumn('users', 'is_active');
  if (!hasIsActiveColumn) {
    await knex.schema.alterTable('users', table => {
      table.boolean('is_active').notNullable().defaultTo(true);
    });
  }

  // Add last_login_at column if it doesn't exist
  const hasLastLoginColumn = await knex.schema.hasColumn('users', 'last_login_at');
  if (!hasLastLoginColumn) {
    await knex.schema.alterTable('users', table => {
      table.timestamp('last_login_at').nullable();
    });
  }

  // Add subscription_status column if it doesn't exist
  const hasSubscriptionStatusColumn = await knex.schema.hasColumn('users', 'subscription_status');
  if (!hasSubscriptionStatusColumn) {
    await knex.schema.alterTable('users', table => {
      table.string('subscription_status', 50).nullable();
    });
  }

  // Add created_at and updated_at if they don't exist
  const hasCreatedAt = await knex.schema.hasColumn('users', 'created_at');
  if (!hasCreatedAt) {
    await knex.schema.alterTable('users', table => {
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }

  const hasUpdatedAt = await knex.schema.hasColumn('users', 'updated_at');
  if (!hasUpdatedAt) {
    await knex.schema.alterTable('users', table => {
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Drop columns in reverse order of creation
  const columnsToDrop = [
    'subscription_status',
    'last_login_at',
    'is_active',
    'role',
    'updated_at',
    'created_at'
  ];

  for (const column of columnsToDrop) {
    if (await knex.schema.hasColumn('users', column)) {
      await knex.schema.alterTable('users', table => {
        table.dropColumn(column);
      });
    }
  }

  // Drop the enum type if no longer used
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 
        FROM pg_attribute 
        WHERE atttypid = 'user_role'::regtype
      ) THEN
        DROP TYPE IF EXISTS user_role;
      END IF;
    END
    $$;
  `);
};
