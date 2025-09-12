const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await db('posts').select('*');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await db('posts').where({ id: req.params.id }).first();
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
