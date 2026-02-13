const express = require('express');
const router = express.Router();
const { getArticles, createArticle, updateArticle, deleteArticle, incrementView } = require('../controllers/articleController');

router.get('/', getArticles);
router.post('/', createArticle);
router.patch('/:id', updateArticle);
router.delete('/:id', deleteArticle);
router.post('/:id/view', incrementView);

module.exports = router;
