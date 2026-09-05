const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false,
    validate: { notEmpty: true },
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
    validate: { len: [0, 2000] },
  },
  cuisine: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  coverImage: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  logo: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  street: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  city: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  state: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  zipCode: {
    type: DataTypes.STRING(20),
    defaultValue: '',
  },
  country: {
    type: DataTypes.STRING(50),
    defaultValue: 'US',
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(30),
    defaultValue: '',
  },
  email: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  website: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  hours: {
    type: DataTypes.JSONB,
    defaultValue: {
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '23:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '10:00', close: '23:00', closed: false },
      sunday: { open: '10:00', close: '21:00', closed: false },
    },
  },
  seatingCapacity: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  priceRange: {
    type: DataTypes.ENUM('$', '$$', '$$$', '$$$$'),
    defaultValue: '$$',
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: { min: 0, max: 5 },
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalDinners: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalReservations: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  menuItems: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  dietaryOptions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  totalRevenue: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  monthlyRevenue: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  avgOccupancy: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalBookings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['ownerId'] },
    { fields: ['city'] },
    { fields: ['rating'] },
  ],
});

module.exports = Restaurant;
