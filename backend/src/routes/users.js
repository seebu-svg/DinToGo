const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), userController.getUsers);
router.get('/influencers', userController.getInfluencers);
router.get('/:id', userController.getUser);
router.post('/:id/follow', protect, userController.followUser);
router.post('/:id/unfollow', protect, userController.unfollowUser);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

module.exports = router;
