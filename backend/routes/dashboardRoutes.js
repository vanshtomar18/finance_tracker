const express = require('express');
const {protect} = require('../middleware/authMiddleware');
const {getDashboardData, getAnalyticsData} = require('../controllers/dashboardController');

const router =express.Router();

router.get("/",protect,getDashboardData);
router.get("/analytics",protect,getAnalyticsData);

module.exports = router;