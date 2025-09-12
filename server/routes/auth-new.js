const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Register page (GET)
router.get('/register', (req, res) => {
  res.json({ message: 'Registration page' });
});

// Handle registration (POST)
router.post('/register', async (req, res) => {
  try {
    console.log('Register request received:', {
      body: req.body,
      headers: req.headers,
      url: req.originalUrl,
      method: req.method
    });
    
    const { username, email, password } = req.body;
    
    // Check if user exists
    const userExists = await db('users').where({ email }).first();
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      // Create user with all required fields
      const now = new Date().toISOString();
      const [user] = await db('users')
        .insert({
          username,
          email,
          password: hashedPassword,
          admin: false,
          created_at: now,
          updated_at: now,
          email_verified: false,
          profile_id: null,
          avatar: null
        })
        .returning(['id', 'username', 'email']);

      // Create token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '1d'
      });

      return res.status(201).json({ user, token });
    } catch (dbError) {
      console.error('Database error during registration:', {
        message: dbError.message,
        code: dbError.code,
        detail: dbError.detail,
        table: dbError.table,
        column: dbError.column,
        constraint: dbError.constraint,
        stack: dbError.stack
      });
      
      return res.status(500).json({
        error: 'Database error during registration',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined,
        code: dbError.code
      });
    }
  } catch (error) {
    console.error('Unexpected error during registration:', {
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Export the router
module.exports = router;
