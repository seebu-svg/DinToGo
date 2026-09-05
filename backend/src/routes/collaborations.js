const express = require('express');
const router = express.Router();
const collaborationController = require('../controllers/collaborationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('restaurant', 'influencer', 'admin'), collaborationController.getCollaborations);
router.post('/', protect, authorize('restaurant', 'admin'), collaborationController.createCollaboration);
router.put('/:id', protect, collaborationController.updateCollaboration);

module.exports = router;
