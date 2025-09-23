/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('users').then(exists => {
    if (exists) {
      return knex.schema.table('users', table => {
        table.boolean('is_active').notNullable().defaultTo(true);
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.hasTable('users').then(exists => {
    if (exists) {
      return knex.schema.table('users', table => {
        table.dropColumn('is_active');
      });
    }
  });
};
