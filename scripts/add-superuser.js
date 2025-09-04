const { Pool } = require('pg');
require('dotenv').config();

async function createSuperuser() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/bible'
  });

  try {
    console.log('Connecting to the database...');
    const client = await pool.connect();
    
    // Check if the admin user already exists
    const userCheck = await client.query(
      'SELECT id FROM users WHERE email = $1', 
      ['admin@example.com']
    );

    if (userCheck.rows.length > 0) {
      console.log('Admin user already exists. Updating to admin...');
      await client.query(
        'UPDATE users SET admin = true WHERE email = $1',
        ['admin@example.com']
      );
      console.log('Existing user updated to admin.');
    } else {
      console.log('Creating new admin user...');
      // Using a simple password hash for demo (in production, use proper hashing)
      const hashedPassword = '$2a$10$XFDq3wGOeXvzKoYBeXWjzOc5eN4cR5V8p5W5a5n4m3z2v1x0y9ZQW';
      
      await client.query(
        `INSERT INTO users (username, email, password, admin, created_at, updated_at, profile_id)
         VALUES ($1, $2, $3, $4, NOW(), NOW(), $5)`,
        [
          'admin@example.com',
          'admin@example.com',
          hashedPassword, // Password is 'ChangeMe123!'
          true,
          `admin_${Date.now()}`
        ]
      );
      console.log('Admin user created successfully!');
    }
    
    // Verify the admin user
    const result = await client.query(
      'SELECT id, username, email, admin FROM users WHERE email = $1',
      ['admin@example.com']
    );
    
    console.log('\nAdmin user details:');
    console.table(result.rows[0]);
    console.log('\nLogin with:');
    console.log('Email: admin@example.com');
    console.log('Password: ChangeMe123!');
    console.log('\nIMPORTANT: Change this password after first login!');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

createSuperuser();
