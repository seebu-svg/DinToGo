const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');
const { reservationRules } = require('../utils/validators');

router.post('/', protect, reservationRules, reservationController.createReservation);
router.get('/my', protect, reservationController.getMyReservations);
router.get('/restaurant/:restaurantId', protect, authorize('restaurant', 'admin'), reservationController.getRestaurantReservations);
router.put('/:id/status', protect, authorize('restaurant', 'admin'), reservationController.updateReservationStatus);
router.delete('/:id', protect, reservationController.cancelReservation);

module.exports = router;
