const { Notification } = require('../models');

/**
 * Create a notification for a user.
 * @param {Object} opts
 * @param {number} opts.recipientId - User who receives the notification
 * @param {number} [opts.senderId] - User who triggered it
 * @param {string} opts.type - Notification type (must match model ENUM)
 * @param {string} opts.title - Short title
 * @param {string} opts.message - Descriptive message
 * @param {Object} [opts.data] - Extra JSONB data
 * @param {string} [opts.link] - Deep link
 */
const createNotification = async ({ recipientId, senderId, type, title, message, data, link }) => {
  try {
    // Don't notify yourself
    if (recipientId === senderId) return null;

    return await Notification.create({
      recipientId,
      senderId: senderId || null,
      type: type || 'system',
      title: title || message,
      message,
      data: data || null,
      link: link || '',
    });
  } catch (err) {
    // Notifications should never break the main flow
    console.error('Notification creation failed:', err.message);
    return null;
  }
};

/**
 * Bulk-create notifications for multiple recipients.
 */
const createBulkNotifications = async (recipients, opts) => {
  const results = [];
  for (const recipientId of recipients) {
    const result = await createNotification({ ...opts, recipientId });
    if (result) results.push(result);
  }
  return results;
};

module.exports = { createNotification, createBulkNotifications };
