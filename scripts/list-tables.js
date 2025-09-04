const { Pool } = require('pg');
require('dotenv').config();

async function listTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/bible'
  });

  try {
    const client = await pool.connect();
    console.log('Connected to the database!');
    
    // List all tables
    const result = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    console.log('\nTables in the database:');
    console.table(result.rows);
    
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

listTables();
