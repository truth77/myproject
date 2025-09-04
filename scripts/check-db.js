const knex = require('knex');
const config = require('../knexfile.js');

// Initialize knex with development config
const db = knex(config.development);

async function checkDatabase() {
  try {
    console.log('Checking database connection...');
    
    // Check if users table exists
    const hasUsersTable = await db.schema.hasTable('users');
    console.log(`Users table exists: ${hasUsersTable}`);
    
    if (hasUsersTable) {
      // Get table structure
      const columns = await db('users').columnInfo();
      console.log('\nUsers table columns:');
      console.log(Object.keys(columns).join(', '));
      
      // Count users
      const userCount = await db('users').count('* as count').first();
      console.log(`\nTotal users: ${userCount.count}`);
      
      // List admin users
      const admins = await db('users').where('admin', true).select('id', 'username', 'email');
      console.log('\nAdmin users:');
      console.table(admins);
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    // Close the database connection
    await db.destroy();
    process.exit(0);
  }
}

// Run the function
checkDatabase();
