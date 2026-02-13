const express = require('express');
const router = express.Router();
const { getFeed, createPost, deletePost } = require('../controllers/feedController');

// Get feed for a specific record
router.get('/:recordId', getFeed);
router.post('/', createPost);
router.delete('/:id', deletePost);

module.exports = router;
