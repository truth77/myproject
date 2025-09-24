exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.enum('role', ['user', 'admin', 'superadmin']).defaultTo('user').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('role');
  });
};
