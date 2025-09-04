const { Pool } = require('pg');
require('dotenv').config();

async function checkConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('Attempting to connect to the database...');
    const client = await pool.connect();
    console.log('Successfully connected to the database!');
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    // Check if users table exists
    const tableCheck = await client.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );
    console.log('Users table exists:', tableCheck.rows[0].exists);
    
    client.release();
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    console.error('Connection string used:', process.env.DATABASE_URL);
  } finally {
    await pool.end();
  }
}

checkConnection();
