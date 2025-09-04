const knex = require('knex');
const config = require('../knexfile.js');

async function checkDatabase() {
  let db;
  try {
    db = knex(config.development);
    
    // Test connection
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful!');
    
    // List all tables
    const tables = await db.raw(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    console.log('\n📋 Database Tables:');
    console.table(tables.rows.map(t => ({ 'Table Name': t.table_name })));
    
    // Check if subscriptions table exists
    const subscriptionsTable = tables.rows.some(t => t.table_name === 'subscriptions');
    if (subscriptionsTable) {
      console.log('\n✅ Subscriptions table exists');
      
      // Check if there are any subscriptions
      const subscriptions = await db('subscriptions').select('*');
      console.log(`\n📊 Found ${subscriptions.length} subscriptions`);
      
      if (subscriptions.length > 0) {
        console.table(subscriptions);
      }
    } else {
      console.log('\n❌ Subscriptions table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    if (db) await db.destroy();
  }
}

checkDatabase();
