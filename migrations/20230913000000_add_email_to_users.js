exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    table.string('email').unique().notNullable().after('username');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('email');
  });
};
