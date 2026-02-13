const express = require('express');
const router = express.Router();
const { getDeletedItems, restoreItem, permanentDelete } = require('../controllers/recycleBinController');

router.get('/', getDeletedItems);
router.post('/restore', restoreItem);
router.post('/delete-permanent', permanentDelete);

module.exports = router;
