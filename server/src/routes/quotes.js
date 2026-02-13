const express = require('express');
const router = express.Router();
const { getQuotes, createQuote } = require('../controllers/quoteController');

router.get('/', getQuotes);
router.post('/', createQuote);

module.exports = router;
