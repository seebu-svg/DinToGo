const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Dinner = sequelize.define('Dinner', {
  title: {
    type: DataTypes.STRING(120),
    allowNull: false,
    validate: { notEmpty: true },
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
    validate: { len: [0, 2000] },
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  coverImage: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  hostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 120,
  },
  venue: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  address: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  city: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('public', 'private'),
    defaultValue: 'public',
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'active', 'full', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
  },
  category: {
    type: DataTypes.ENUM('casual', 'fine-dining', 'themed', 'networking', 'celebration', 'influencer', 'pop-up'),
    defaultValue: 'casual',
  },
  menu: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  cuisine: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  maxGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 500 },
  },
  currentGuests: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: { min: 0 },
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'USD',
  },
  isInfluencerHosted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  influencerHostId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  inviteCode: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  inviteLink: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  allowedGuests: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  attendees: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  dietaryOptions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  ratingAverage: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: { min: 0, max: 5 },
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  chatGroupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['date'] },
    { fields: ['status', 'date'] },
    { fields: ['hostId'] },
    { fields: ['restaurantId'] },
  ],
});

// Virtual: availableSpots
Dinner.prototype.getAvailableSpots = function () {
  return this.maxGuests - this.currentGuests;
};

Dinner.prototype.getIsFull = function () {
  return this.currentGuests >= this.maxGuests;
};

module.exports = Dinner;
