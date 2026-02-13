const express = require('express');
const router = express.Router();
const {
    getOpportunities, getOpportunityById, createOpportunity, updateOpportunity, deleteOpportunity,
    getContactRoles, addContactRole,
    getLineItems, addLineItem
} = require('../controllers/opportunityController');

const { validate, schemas } = require('../middleware/validate');

router.get('/', getOpportunities);
router.get('/:id', getOpportunityById);
router.post('/', validate(schemas.opportunity), createOpportunity);
router.patch('/:id', validate(schemas.opportunityUpdate), updateOpportunity); // Use PATCH for partial updates
router.delete('/:id', deleteOpportunity);

// Related Routes
// Note: In a stricter REST API these might be nested, but keeping flat query params for consistency with frontend
router.get('/roles', getContactRoles); // client calls /api/opportunities/roles?opportunityId=...
router.post('/roles', addContactRole);

router.get('/products', getLineItems);
router.post('/products', addLineItem);

module.exports = router;
