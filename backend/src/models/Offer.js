const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Offer = sequelize.define('Offer', {
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(120),
    allowNull: false,
    validate: { notEmpty: true },
  },
  description: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  image: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed', 'bogo', 'special'),
    defaultValue: 'percentage',
  },
  discountPercent: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: { min: 0, max: 100 },
  },
  discountAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: { min: 0 },
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  daysOfWeek: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  timeWindow: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  minPartySize: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  maxRedemptions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  currentRedemptions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  code: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  autoApply: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  targetAudience: {
    type: DataTypes.ENUM('all', 'new-customers', 'followers', 'influencers'),
    defaultValue: 'all',
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'expired', 'cancelled'),
    defaultValue: 'active',
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['restaurantId', 'status'] },
    { fields: ['validUntil'] },
  ],
});

module.exports = Offer;
