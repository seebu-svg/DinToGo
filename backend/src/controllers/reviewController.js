const { Review, Dinner, Restaurant, Reservation, User, sequelize } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { Op } = require('sequelize');

const getReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, dinner, restaurant, sort = '-createdAt' } = req.query;
  const where = {};
  if (dinner) where.dinnerId = dinner;
  if (restaurant) where.restaurantId = restaurant;

  const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
  const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count: total, rows: reviews } = await Review.findAndCountAll({
    where,
    include: [
      { model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar'] },
      { model: Dinner, as: 'dinner', attributes: ['id', 'title'] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
    ],
    order: [[sortField, sortOrder]],
    limit: parseInt(limit),
    offset,
  });

  res.status(200).json({
    success: true, data: reviews,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  });
});

const createReview = asyncHandler(async (req, res) => {
  const { dinner, restaurant, rating, comment, images, foodRating, serviceRating, ambianceRating, valueRating } = req.body;

  if (!dinner && !restaurant) {
    throw new AppError('Review must reference a dinner or restaurant.', 400);
  }

  if (dinner) {
    const attended = await Reservation.findOne({
      where: {
        dinnerId: dinner, userId: req.user.id,
        status: { [Op.in]: ['completed', 'confirmed', 'seated'] },
      },
    });
    if (!attended) throw new AppError('You can only review dinners you attended.', 403);
  }

  const existingWhere = { reviewerId: req.user.id };
  if (dinner) existingWhere.dinnerId = dinner;
  if (restaurant) existingWhere.restaurantId = restaurant;
  const existing = await Review.findOne({ where: existingWhere });
  if (existing) throw new AppError('You already reviewed this.', 409);

  const review = await Review.create({
    reviewerId: req.user.id, dinnerId: dinner || null, restaurantId: restaurant || null,
    rating, comment, images, foodRating, serviceRating, ambianceRating, valueRating, isVerified: true,
  });

  // Update aggregate ratings
  if (dinner) {
    const stats = await Review.findOne({
      where: { dinnerId: dinner },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
        [sequelize.fn('COUNT', 'id'), 'count'],
      ],
      raw: true,
    });
    if (stats) {
      await Dinner.update(
        { ratingAverage: Math.round(stats.avgRating * 10) / 10, ratingCount: parseInt(stats.count) },
        { where: { id: dinner } }
      );
    }
  }
  if (restaurant) {
    const stats = await Review.findOne({
      where: { restaurantId: restaurant },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
        [sequelize.fn('COUNT', 'id'), 'count'],
      ],
      raw: true,
    });
    if (stats) {
      await Restaurant.update(
        { rating: Math.round(stats.avgRating * 10) / 10, totalReviews: parseInt(stats.count) },
        { where: { id: restaurant } }
      );
    }
  }

  res.status(201).json({ success: true, data: review });
});

const toggleHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) throw new AppError('Review not found.', 404);

  const helpful = [...review.helpful];
  const idx = helpful.indexOf(req.user.id);
  if (idx > -1) {
    helpful.splice(idx, 1);
  } else {
    helpful.push(req.user.id);
  }

  await review.update({ helpful, helpfulCount: helpful.length });
  res.status(200).json({ success: true, data: review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) throw new AppError('Review not found.', 404);

  if (review.reviewerId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized.', 403);
  }

  await review.destroy();
  res.status(200).json({ success: true, message: 'Review deleted.' });
});

const respondToReview = asyncHandler(async (req, res) => {
  const { response } = req.body;
  const review = await Review.findByPk(req.params.id);
  if (!review) throw new AppError('Review not found.', 404);

  // Verify user owns the restaurant this review is for
  if (review.restaurantId) {
    const restaurant = await Restaurant.findOne({
      where: { id: review.restaurantId, ownerId: req.user.id },
    });
    if (!restaurant && req.user.role !== 'admin') {
      throw new AppError('Not authorized to respond to this review.', 403);
    }
  } else if (review.dinnerId) {
    const dinner = await Dinner.findOne({
      where: { id: review.dinnerId, hostId: req.user.id },
    });
    if (!dinner && req.user.role !== 'admin') {
      throw new AppError('Not authorized to respond to this review.', 403);
    }
  }

  review.ownerResponse = response;
  review.respondedAt = new Date();
  await review.save();

  res.status(200).json({ success: true, data: review });
});

module.exports = { getReviews, createReview, toggleHelpful, deleteReview, respondToReview };
