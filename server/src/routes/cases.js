const express = require('express');
const router = express.Router();
const { getCases, createCase, updateCase, deleteCase } = require('../controllers/caseController');

router.get('/', getCases);
router.post('/', createCase);
router.patch('/:id', updateCase);
router.delete('/:id', deleteCase);

module.exports = router;
