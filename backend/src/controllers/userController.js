const { User, Follow } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { Op } = require('sequelize');

const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const where = { isActive: true };
  if (role) where.role = role;
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count: total, rows: users } = await User.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset,
  });

  res.status(200).json({
    success: true, data: users,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new AppError('User not found.', 404);
  res.status(200).json({ success: true, data: user });
});

const followUser = asyncHandler(async (req, res) => {
  if (parseInt(req.params.id) === req.user.id) {
    throw new AppError('You cannot follow yourself.', 400);
  }

  const target = await User.findByPk(req.params.id);
  if (!target) throw new AppError('User not found.', 404);

  const [follow, created] = await Follow.findOrCreate({
    where: { followerId: req.user.id, followingId: target.id },
  });

  if (created) {
    await User.increment('followingCount', { where: { id: req.user.id } });
    await User.increment('followerCount', { where: { id: target.id } });
  }

  const updatedUser = await User.findByPk(req.user.id);
  res.status(200).json({ success: true, message: 'Following.', followingCount: updatedUser.followingCount });
});

const unfollowUser = asyncHandler(async (req, res) => {
  const target = await User.findByPk(req.params.id);
  if (!target) throw new AppError('User not found.', 404);

  const deleted = await Follow.destroy({
    where: { followerId: req.user.id, followingId: target.id },
  });

  if (deleted) {
    await User.decrement('followingCount', { where: { id: req.user.id } });
    await User.decrement('followerCount', { where: { id: target.id } });
  }

  const updatedUser = await User.findByPk(req.user.id);
  res.status(200).json({ success: true, message: 'Unfollowed.', followingCount: updatedUser.followingCount });
});

const getFollowers = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [{
      model: User, as: 'followers',
      attributes: ['id', 'name', 'avatar', 'bio'],
      through: { attributes: [] },
    }],
  });
  if (!user) throw new AppError('User not found.', 404);
  res.status(200).json({ success: true, data: user.followers });
});

const getFollowing = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [{
      model: User, as: 'following',
      attributes: ['id', 'name', 'avatar', 'bio'],
      through: { attributes: [] },
    }],
  });
  if (!user) throw new AppError('User not found.', 404);
  res.status(200).json({ success: true, data: user.following });
});

const getInfluencers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, niche } = req.query;
  const where = { role: 'influencer', isActive: true };

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count: total, rows: influencers } = await User.findAndCountAll({
    where,
    order: [['followerCount', 'DESC']],
    limit: parseInt(limit),
    offset,
  });

  res.status(200).json({
    success: true, data: influencers,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  });
});

module.exports = { getUsers, getUser, followUser, unfollowUser, getFollowers, getFollowing, getInfluencers };
