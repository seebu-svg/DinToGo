const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/dinners', require('./dinners'));
router.use('/restaurants', require('./restaurants'));
router.use('/reservations', require('./reservations'));
router.use('/offers', require('./offers'));
router.use('/reviews', require('./reviews'));
router.use('/chat', require('./chat'));
router.use('/users', require('./users'));
router.use('/collaborations', require('./collaborations'));
router.use('/notifications', require('./notifications'));
router.use('/analytics', require('./analytics'));

module.exports = router;
