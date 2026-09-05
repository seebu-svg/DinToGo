const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { reviewRules } = require('../utils/validators');

router.get('/', reviewController.getReviews);
router.post('/', protect, reviewRules, reviewController.createReview);
router.post('/:id/helpful', protect, reviewController.toggleHelpful);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
