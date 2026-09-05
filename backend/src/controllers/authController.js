const { User } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendTokenResponse } = require('../utils/token');
const crypto = require('crypto');
const { Op } = require('sequelize');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, bio, location, phone } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const userData = { name, email, password, bio, location, phone };

  // Restaurant partners get their own role; everyone else is a 'user'
  if (role === 'restaurant') {
    userData.role = 'restaurant';
  } else {
    userData.role = 'user';
  }

  const user = await User.create(userData);
  sendTokenResponse(user, 201, res);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.scope('withPassword').findOne({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated.', 403);
  }

  sendTokenResponse(user, 200, res);
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.status(200).json({ success: true, data: user });
});

const updateMe = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'bio', 'phone', 'avatar', 'location', 'dietaryPreferences'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  await User.update(updates, { where: { id: req.user.id } });
  const user = await User.findByPk(req.user.id);

  res.status(200).json({ success: true, data: user });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Please provide current and new password.', 400);
  }

  const user = await User.scope('withPassword').findByPk(req.user.id);
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect.', 401);
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    throw new AppError('No user found with that email.', 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  await User.update(
    {
      passwordResetToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
      passwordResetExpire: new Date(Date.now() + 30 * 60 * 1000),
    },
    { where: { id: user.id } }
  );

  res.status(200).json({
    success: true,
    message: 'Password reset token generated.',
    ...(process.env.NODE_ENV === 'development' && { resetToken }),
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpire: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token.', 400);
  }

  user.password = req.body.password;
  user.passwordResetToken = null;
  user.passwordResetExpire = null;
  await user.save();

  sendTokenResponse(user, 200, res);
});

const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
};
