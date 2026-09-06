const express = require('express');
const router = express.Router();
const collaborationController = require('../controllers/collaborationController');
const { protect, authorize, authorizeRolesOrCreator } = require('../middleware/auth');

router.get('/', protect, authorizeRolesOrCreator('restaurant', 'admin'), collaborationController.getCollaborations);
router.post('/', protect, authorizeRolesOrCreator('restaurant', 'admin'), collaborationController.createCollaboration);
router.put('/:id', protect, collaborationController.updateCollaboration);

module.exports = router;
