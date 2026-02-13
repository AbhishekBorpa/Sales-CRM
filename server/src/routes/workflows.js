const express = require('express');
const router = express.Router();
const { getWorkflows, createWorkflow, updateWorkflow, deleteWorkflow } = require('../controllers/workflowController');

router.get('/', getWorkflows);
router.post('/', createWorkflow);
router.patch('/:id', updateWorkflow);
router.delete('/:id', deleteWorkflow);

module.exports = router;
