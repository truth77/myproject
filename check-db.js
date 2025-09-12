const knex = require('knex');
const config = require('./knexfile');

async function checkDatabase() {
  const db = knex(config.development);
  
  try {
    console.log('Checking database connection...');
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful');
    
    console.log('\nChecking users table...');
    const hasUsersTable = await db.schema.hasTable('users');
    console.log(`Users table exists: ${hasUsersTable ? '✅' : '❌'}`);
    
    if (hasUsersTable) {
      console.log('\nUsers table columns:');
      const columns = await db('users').columnInfo();
      console.log(columns);
      
      console.log('\nFirst 5 users:');
      const users = await db('users').select('*').limit(5);
      console.log(users);
    }
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await db.destroy();
  }
}

checkDatabase();
