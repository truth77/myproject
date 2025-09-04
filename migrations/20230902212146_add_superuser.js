const bcrypt = require('bcryptjs');

// Generate a secure password hash
const SALT_ROUNDS = 10;
const SUPERUSER_EMAIL = 'admin@example.com';
const SUPERUSER_PASSWORD = 'ChangeMe123!'; // This should be changed after first login

exports.up = async function(knex) {
  try {
    // Check if superuser already exists
    const existingAdmin = await knex('users')
      .where('username', SUPERUSER_EMAIL)
      .orWhere('email', SUPERUSER_EMAIL)
      .first();

    if (!existingAdmin) {
      // Hash the password
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(SUPERUSER_PASSWORD, salt);
      
      // Insert the superuser
      await knex('users').insert({
        username: SUPERUSER_EMAIL,
        email: SUPERUSER_EMAIL,
        password: hashedPassword,
        admin: true,
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Add any other required fields based on your schema
        profile_id: `admin_${Date.now()}`,
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=random'
      });
      
      console.log('Superuser created successfully');
      console.log('Email:', SUPERUSER_EMAIL);
      console.log('Password:', SUPERUSER_PASSWORD);
      console.log('IMPORTANT: Change this password after first login!');
    } else {
      console.log('Superuser already exists');
    }
  } catch (error) {
    console.error('Error creating superuser:', error);
    throw error;
  }
};

exports.down = async function(knex) {
  // Remove the superuser (be careful with this in production)
  await knex('users')
    .where('email', SUPERUSER_EMAIL)
    .orWhere('username', SUPERUSER_EMAIL)
    .del();
};
