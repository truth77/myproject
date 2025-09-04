const knex = require('knex');
const config = require('../knexfile.js');

// Initialize knex
const db = knex(config.development);

// List all admin users
async function listAdmins() {
  try {
    console.log('Listing all admin users...');
    const admins = await db('users').where('admin', true).select('id', 'username', 'email', 'created_at');
    
    if (admins.length === 0) {
      console.log('No admin users found.');
    } else {
      console.log('Admin users:');
      console.table(admins);
      console.log(`\nTotal admin users: ${admins.length}`);
    }
  } catch (error) {
    console.error('Error listing admin users:', error);
  } finally {
    // Close the database connection
    await db.destroy();
  }
}

// Run the function
listAdmins();
