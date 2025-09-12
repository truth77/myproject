const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users (protected route)
router.get('/', async (req, res) => {
  try {
    const users = await db('users').select('id', 'username', 'email', 'subscription_status', 'subscription_ends_at');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID (protected route)
router.get('/:id', async (req, res) => {
  try {
    const user = await db('users')
      .where({ id: req.params.id })
      .select('id', 'username', 'email', 'subscription_status', 'subscription_ends_at')
      .first();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
