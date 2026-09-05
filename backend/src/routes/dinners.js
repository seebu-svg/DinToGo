const express = require('express');
const router = express.Router();
const dinnerController = require('../controllers/dinnerController');
const { protect, authorize } = require('../middleware/auth');
const { dinnerRules } = require('../utils/validators');

router.get('/', dinnerController.getDinners);
router.get('/my/hosted', protect, dinnerController.getMyHostedDinners);
router.get('/my/attending', protect, dinnerController.getMyAttendingDinners);
router.get('/:id', dinnerController.getDinner);
router.post('/', protect, dinnerRules, dinnerController.createDinner);
router.put('/:id', protect, dinnerController.updateDinner);
router.delete('/:id', protect, dinnerController.deleteDinner);
router.post('/:id/join', protect, dinnerController.joinDinner);
router.post('/:id/leave', protect, dinnerController.leaveDinner);

module.exports = router;
