/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // First, create the enum type if it doesn't exist
    await knex.raw(`
      DO $$
      BEGIN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');
      EXCEPTION WHEN duplicate_object THEN
        -- Type already exists, do nothing
        NULL;
      END
      $$;
    `);
  
    // Then add the role column with a default value of 'user'
    await knex.schema.alterTable('users', (table) => {
      table.specificType('role', 'user_role')
        .notNullable()
        .defaultTo('user');
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function(knex) {
    // First remove the column
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('role');
    });
  
    // Then drop the enum type if no longer used
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