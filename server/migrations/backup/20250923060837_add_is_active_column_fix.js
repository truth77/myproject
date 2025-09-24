/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('users', 'is_active');
  if (!hasColumn) {
    await knex.schema.table('users', table => {
      table.boolean('is_active').notNullable().defaultTo(true);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('users', 'is_active');
  if (hasColumn) {
    await knex.schema.table('users', table => {
      table.dropColumn('is_active');
    });
  }
};
