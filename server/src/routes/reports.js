const express = require('express');
const router = express.Router();
const { getRevenueByIndustry, getLeadsBySource, getSalesVelocity, getPipelineStages, getTopSellingProducts } = require('../controllers/reportController');

router.get('/pipeline-stages', getPipelineStages);
router.get('/top-products', getTopSellingProducts);
router.get('/revenue-by-industry', getRevenueByIndustry);
router.get('/leads-by-source', getLeadsBySource);
router.get('/sales-velocity', getSalesVelocity);

module.exports = router;
