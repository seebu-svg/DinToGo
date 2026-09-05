const { Offer, Restaurant, User } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { Op } = require('sequelize');

const getOffers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, status = 'active', restaurant, city } = req.query;
  const where = {};
  if (status) where.status = status;
  if (restaurant) where.restaurantId = restaurant;
  if (status === 'active') where.validUntil = { [Op.gte]: new Date() };

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count: total, rows: offers } = await Offer.findAndCountAll({
    where,
    include: [
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'images', 'city'] },
      { model: User, as: 'createdBy', attributes: ['id', 'name'] },
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset,
  });

  res.status(200).json({
    success: true, data: offers,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  });
});

const getOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByPk(req.params.id, {
    include: [
      { model: Restaurant, as: 'restaurant' },
      { model: User, as: 'createdBy', attributes: ['id', 'name'] },
    ],
  });
  if (!offer) throw new AppError('Offer not found.', 404);
  res.status(200).json({ success: true, data: offer });
});

const createOffer = asyncHandler(async (req, res) => {
  if (!['restaurant', 'admin'].includes(req.user.role)) {
    throw new AppError('Only restaurant partners can create offers.', 403);
  }
  const restaurant = await Restaurant.findOne({ where: { ownerId: req.user.id } });
  if (!restaurant) throw new AppError('Restaurant profile not found.', 404);

  const offer = await Offer.create({ ...req.body, restaurantId: restaurant.id, createdById: req.user.id });
  res.status(201).json({ success: true, data: offer });
});

const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) throw new AppError('Offer not found.', 404);

  const restaurant = await Restaurant.findByPk(offer.restaurantId);
  if (restaurant.ownerId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized.', 403);
  }

  await offer.update(req.body);
  res.status(200).json({ success: true, data: offer });
});

const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) throw new AppError('Offer not found.', 404);

  const restaurant = await Restaurant.findByPk(offer.restaurantId);
  if (restaurant.ownerId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized.', 403);
  }

  await offer.update({ status: 'cancelled' });
  res.status(200).json({ success: true, message: 'Offer cancelled.' });
});

const getRestaurantOffers = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ where: { ownerId: req.user.id } });
  if (!restaurant) throw new AppError('Restaurant not found.', 404);

  const offers = await Offer.findAll({
    where: { restaurantId: restaurant.id },
    order: [['createdAt', 'DESC']],
  });
  res.status(200).json({ success: true, data: offers });
});

module.exports = { getOffers, getOffer, createOffer, updateOffer, deleteOffer, getRestaurantOffers };
