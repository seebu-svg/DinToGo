const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Collaboration = sequelize.define('Collaboration', {
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  influencerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dinnerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  terms: {
    type: DataTypes.JSONB,
    defaultValue: {
      compensation: 0,
      commission: 0,
      deliverables: [],
      notes: '',
    },
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  results: {
    type: DataTypes.JSONB,
    defaultValue: {
      reach: 0,
      bookings: 0,
      revenue: 0,
    },
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['restaurantId'] },
    { fields: ['influencerId'] },
    { fields: ['status'] },
  ],
});

module.exports = Collaboration;
