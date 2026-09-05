const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatGroup = sequelize.define('ChatGroup', {
  name: {
    type: DataTypes.STRING(120),
    defaultValue: '',
  },
  dinnerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  members: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  messages: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  isGroupChat: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  lastMessage: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['dinnerId'] },
  ],
});

module.exports = ChatGroup;
