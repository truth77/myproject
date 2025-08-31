exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      // Hash for 'password123'
      return knex('users').insert([
        {
          username: 'testuser',
          email: 'test@example.com',
          password_hash: '$2a$10$XFDq3wLx.sU1pl3p2KTAp.1jQQS5v5eJd0k1ZJ5y5X5R1JQ5X5X5W',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    });
};
