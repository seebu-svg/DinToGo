const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/restaurant/:restaurantId', protect, authorize('restaurant', 'admin'), analyticsController.getRestaurantAnalytics);
router.get('/dashboard', protect, authorize('admin'), analyticsController.getDashboardAnalytics);

module.exports = router;
