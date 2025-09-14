const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register route
router.post('/', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  try {
    console.log('=== NEW REGISTRATION REQUEST ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Raw body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));
    
    // Parse JSON body if needed
    let body = req.body;
    if (typeof body === 'string' || body === undefined) {
      try {
        body = JSON.parse(body || '{}');
      } catch (e) {
        console.error('Error parsing JSON body:', e);
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    }
    
    const { username, email, password } = body;

    // Validate input
    if (!username || !email || !password) {
      console.log('Missing required fields:', { username, email, password: password ? '***' : 'missing' });
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await db('users').where({ email }).orWhere({ username }).first();
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({ 
        error: `User with this ${field} already exists` 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with all required fields
    const now = new Date().toISOString();
    const [user] = await db('users')
      .insert({
        username,
        email,
        password_hash: hashedPassword,
        created_at: now,
        updated_at: now,
        stripe_customer_id: null,
        subscription_status: 'inactive',
        subscription_ends_at: null
      })
      .returning(['id', 'username', 'email', 'subscription_status', 'subscription_ends_at']);

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Return user info and token
    res.status(201).json({
      user,
      token
    });

  } catch (error) {
    console.error('Registration error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: error.code
    });
  }
});

module.exports = router;
