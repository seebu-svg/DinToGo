const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  dinnerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  partySize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 20 },
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'),
    defaultValue: 'pending',
  },
  specialRequests: {
    type: DataTypes.STRING(500),
    defaultValue: '',
    validate: { len: [0, 500] },
  },
  dietaryNeeds: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
    defaultValue: 'unpaid',
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['dinnerId'] },
    { fields: ['userId'] },
    { fields: ['restaurantId', 'status'] },
  ],
});

module.exports = Reservation;
