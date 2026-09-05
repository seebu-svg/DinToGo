const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM(
      'dinner_invite', 'dinner_reminder', 'reservation_confirmed',
      'reservation_cancelled', 'new_follower', 'new_review',
      'new_message', 'offer_available', 'influencer_collab',
      'system', 'welcome'
    ),
    defaultValue: 'system',
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  link: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['recipientId', 'isRead'] },
  ],
});

module.exports = Notification;
