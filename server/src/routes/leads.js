const express = require('express');
const router = express.Router();
const { getLeads, getLead, createLead, convertLead, deleteLead } = require('../controllers/leadController');

router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.delete('/:id', deleteLead);
router.post('/:id/convert', convertLead);

module.exports = router;
