const knex = require('knex');
const bcrypt = require('bcryptjs');
const config = require('../knexfile.js');

// Superuser credentials
const SUPERUSER_EMAIL = 'admin@example.com';
const SUPERUSER_PASSWORD = 'ChangeMe123!'; // Change this after first login

// Initialize knex with development config
const db = knex(config.development);

async function createSuperuser() {
  try {
    console.log('Creating superuser...');
    
    // Check if superuser already exists
    const existingAdmin = await db('users')
      .where('email', SUPERUSER_EMAIL)
      .orWhere('username', SUPERUSER_EMAIL)
      .first();

    if (existingAdmin) {
      console.log(`Superuser with email ${SUPERUSER_EMAIL} already exists.`);
      console.log('Updating to admin...');
      
      // Update existing user to admin
      await db('users')
        .where('id', existingAdmin.id)
        .update({
          admin: true,
          updated_at: new Date()
        });
      
      console.log('Existing user updated to admin.');
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(SUPERUSER_PASSWORD, salt);
      
      // Insert the superuser
      await db('users').insert({
        username: SUPERUSER_EMAIL,
        email: SUPERUSER_EMAIL,
        password: hashedPassword,
        admin: true,
        created_at: new Date(),
        updated_at: new Date(),
        profile_id: `admin_${Date.now()}`
      });
      
      console.log('Superuser created successfully!');
    }
    
    // Display the superuser info
    const admin = await db('users')
      .where('email', SUPERUSER_EMAIL)
      .first();
    
    console.log('\nSuperuser details:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${SUPERUSER_PASSWORD} (Change this after first login!)`);
    console.log('Admin status:', admin.admin ? '✅ Yes' : '❌ No');
    
  } catch (error) {
    console.error('Error creating superuser:', error);
  } finally {
    // Close the database connection
    await db.destroy();
    process.exit(0);
  }
}

// Run the function
createSuperuser();
