const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING(80),
    allowNull: false,
    validate: { notEmpty: true },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
    set(val) {
      this.setDataValue('email', val.toLowerCase());
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { len: [8, 255] },
  },
  role: {
    type: DataTypes.ENUM('user', 'restaurant', 'admin'),
    defaultValue: 'user',
  },
  avatar: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  bio: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  location: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  phone: {
    type: DataTypes.STRING(30),
    defaultValue: '',
  },
  dietaryPreferences: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  followerCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  followingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  influencerData: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  restaurantData: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passwordResetExpire: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['role'] },
  ],
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: {},
    },
  },
});

// Hash password before create/update
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

// Instance method
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get safe JSON
User.prototype.toSafeJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
