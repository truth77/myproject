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
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('users');
};
