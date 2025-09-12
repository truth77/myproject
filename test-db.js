const knex = require('knex');
const config = require('./knexfile');

const db = knex(config.development);

async function testConnection() {
  try {
    // Test database connection
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Get users table info
    const columns = await db('information_schema.columns')
      .where({ table_name: 'users' })
      .select('column_name', 'data_type', 'is_nullable', 'column_default')
      .orderBy('ordinal_position');
    
    console.log('\n📋 Users table columns:');
    console.table(columns);
    
    // Try to insert a test user
    console.log('\n🔍 Testing user insertion...');
    try {
      const now = new Date().toISOString();
      const [user] = await db('users').insert({
        username: 'testuser_' + Math.random().toString(36).substring(2, 8),
        email: `test_${Math.random().toString(36).substring(2, 8)}@example.com`,
        password: 'test123',
        created_at: now,
        updated_at: now
      }).returning('*');
      
      console.log('✅ Successfully inserted test user:', user);
    } catch (insertError) {
      console.error('❌ Error inserting test user:');
      console.error(insertError);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await db.destroy();
    process.exit(0);
  }
}

testConnection();
