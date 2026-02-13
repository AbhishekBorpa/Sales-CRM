const express = require('express');
const router = express.Router();
const { findDuplicates, mergeDuplicates } = require('../services/duplicateService');

router.get('/', findDuplicates);
router.post('/merge', mergeDuplicates);

module.exports = router;
