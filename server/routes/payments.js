const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all payments (protected route)
router.get('/', async (req, res) => {
  try {
    const payments = await db('payments').select('*');
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get payments by user ID (protected route)
router.get('/user/:userId', async (req, res) => {
  try {
    const payments = await db('payments')
      .where({ user_id: req.params.userId })
      .orderBy('created_at', 'desc');
    
    res.json(payments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
