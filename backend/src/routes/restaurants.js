const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', restaurantController.getRestaurants);
router.get('/my/profile', protect, authorize('restaurant', 'admin'), restaurantController.getMyRestaurant);
router.get('/:id', restaurantController.getRestaurant);
router.post('/', protect, authorize('restaurant', 'admin'), restaurantController.createRestaurant);
router.put('/:id', protect, restaurantController.updateRestaurant);
router.delete('/:id', protect, restaurantController.deleteRestaurant);

module.exports = router;
