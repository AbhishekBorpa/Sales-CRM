const express = require('express');
const router = express.Router();
const { getLeads, getLead, createLead, convertLead, deleteLead } = require('../controllers/leadController');

const { validate, schemas } = require('../middleware/validate');

router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', validate(schemas.lead), createLead);
router.delete('/:id', deleteLead);
router.post('/:id/convert', convertLead);

module.exports = router;
