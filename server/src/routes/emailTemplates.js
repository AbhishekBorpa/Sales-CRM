const express = require('express');
const router = express.Router();
const { getTemplates, createTemplate, updateTemplate, deleteTemplate, previewTemplate } = require('../controllers/emailTemplateController');

router.get('/', getTemplates);
router.post('/', createTemplate);
router.patch('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);
router.get('/:id/preview', previewTemplate);

module.exports = router;
