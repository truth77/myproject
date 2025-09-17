exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    // Add is_active column with default true
    table.boolean('is_active').defaultTo(true).notNullable();
    
    // Add last_login_at column, nullable
    table.timestamp('last_login_at').nullable();
    
    // Add subscription_status column, nullable
    table.string('subscription_status', 50).nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.dropColumn('is_active');
    table.dropColumn('last_login_at');
    table.dropColumn('subscription_status');
  });
};
