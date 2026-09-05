const { Notification, User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const where = { recipientId: req.user.id };
  if (unreadOnly === 'true') where.isRead = false;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count: total, rows: notifications } = await Notification.findAndCountAll({
    where,
    include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset,
  });

  const unreadCount = await Notification.count({
    where: { recipientId: req.user.id, isRead: false },
  });

  res.status(200).json({
    success: true, data: notifications, unreadCount,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  await Notification.update({ isRead: true }, { where: { id: req.params.id } });
  res.status(200).json({ success: true, message: 'Notification marked as read.' });
});

const markAllRead = asyncHandler(async (req, res) => {
  await Notification.update(
    { isRead: true },
    { where: { recipientId: req.user.id, isRead: false } }
  );
  res.status(200).json({ success: true, message: 'All notifications marked as read.' });
});

module.exports = { getNotifications, markAsRead, markAllRead };
