const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/', protect, chatController.getMyChats);
router.get('/:id', protect, chatController.getChat);
router.post('/:id/messages', protect, chatController.sendMessage);
router.put('/:id/read', protect, chatController.markRead);

module.exports = router;
