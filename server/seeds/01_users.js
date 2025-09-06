const bcrypt = require('bcryptjs');

// Hash for 'password'
const hashedPassword = bcrypt.hashSync('password', 10);

exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        // Super Admin
        {
          username: 'superadmin',
          email: 'superadmin@example.com',
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        },
        // Subscriber (Premium)
        {
          username: 'subscriber',
          email: 'subscriber@example.com',
          password_hash: hashedPassword,
          role: 'user',
          subscription_status: 'active',
          created_at: new Date(),
          updated_at: new Date()
        },
        // Regular User (Free Tier)
        {
          username: 'testuser',
          email: 'test@example.com',
          password_hash: hashedPassword,
          role: 'user',
          subscription_status: 'inactive',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    });
};
