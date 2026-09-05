const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { protect, authorize } = require('../middleware/auth');
const { offerRules } = require('../utils/validators');

router.get('/', offerController.getOffers);
router.get('/my', protect, authorize('restaurant', 'admin'), offerController.getRestaurantOffers);
router.get('/:id', offerController.getOffer);
router.post('/', protect, offerRules, offerController.createOffer);
router.put('/:id', protect, offerController.updateOffer);
router.delete('/:id', protect, offerController.deleteOffer);

module.exports = router;
