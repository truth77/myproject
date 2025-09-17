const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/yourdb',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000
});

// Test route to verify authentication and admin access
router.get('/test', authenticateToken, requireAdmin, (req, res) => {
  res.json({ 
    success: true,
    message: 'Admin access granted',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint - requires admin
router.get('/db-status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    client.release();
    
    res.json({
      success: true,
      version: result.rows[0].version,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database backup endpoint - requires admin
router.get('/backup', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // TODO: Implement proper database backup logic
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', `attachment; filename=backup-${new Date().toISOString()}.sql`);
    res.send(`-- Database Backup
-- Generated at: ${new Date().toISOString()}
-- This is a placeholder backup. Implement actual backup logic.`);
  } catch (error) {
    console.error('Backup failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create backup: ' + error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Admin dashboard route - requires admin
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get database status
    let dbStatus;
    try {
      const client = await pool.connect();
      const dbResult = await client.query('SELECT version()');
      client.release();
      dbStatus = {
        connected: true,
        version: dbResult.rows[0].version
      };
    } catch (dbError) {
      dbStatus = {
        connected: false,
        error: dbError.message
      };
    }

    // Get admin stats
    const userCount = await req.db('users').count('id as count').first();
    const activeSubscriptions = await req.db('subscriptions')
      .where('status', 'active')
      .count('id as count')
      .first();

    res.json({
      success: true,
      data: {
        database: dbStatus,
        stats: {
          users: userCount.count,
          activeSubscriptions: activeSubscriptions.count,
          serverTime: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load admin dashboard',
      details: error.message
    });
  }
});

module.exports = router;
