const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesPipeline, getLeadSources } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all stat routes

router.get('/dashboard', getDashboardStats);
router.get('/pipeline', getSalesPipeline);
router.get('/sources', getLeadSources);

module.exports = router;
