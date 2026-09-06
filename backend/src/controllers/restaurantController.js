const { Restaurant, User, Reservation, Dinner, sequelize } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { Op } = require('sequelize');

const getRestaurants = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, sort = '-rating', cuisine, city, search, priceRange, featured } = req.query;

  const where = { isActive: true };
  if (city) where.city = { [Op.iLike]: `%${city}%` };
  if (priceRange) where.priceRange = priceRange;
  if (featured === 'true') where.featured = true;

  if (cuisine) {
    const cuisines = Array.isArray(cuisine) ? cuisine : [cuisine];
    where.cuisine = { [Op.overlap]: cuisines };
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
  const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count: total, rows: restaurants } = await Restaurant.findAndCountAll({
    where,
    include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'avatar'] }],
    order: [[sortField, sortOrder]],
    limit: parseInt(limit),
    offset,
  });

  res.status(200).json({
    success: true, data: restaurants,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  });
});

const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id, {
    include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'avatar', 'email'] }],
  });
  if (!restaurant) throw new AppError('Restaurant not found.', 404);
  res.status(200).json({ success: true, data: restaurant });
});

const createRestaurant = asyncHandler(async (req, res) => {
  if (req.user.role !== 'restaurant' && req.user.role !== 'admin') {
    throw new AppError('Only restaurant partners can create restaurants.', 403);
  }

  const existing = await Restaurant.findOne({ where: { ownerId: req.user.id } });
  if (existing) {
    throw new AppError('You already have a restaurant profile.', 409);
  }

  const restaurant = await Restaurant.create({ ...req.body, ownerId: req.user.id });
  res.status(201).json({ success: true, data: restaurant });
});

const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id);
  if (!restaurant) throw new AppError('Restaurant not found.', 404);

  if (restaurant.ownerId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this restaurant.', 403);
  }

  await restaurant.update(req.body);
  res.status(200).json({ success: true, data: restaurant });
});

const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id);
  if (!restaurant) throw new AppError('Restaurant not found.', 404);

  if (restaurant.ownerId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this restaurant.', 403);
  }

  await restaurant.update({ isActive: false });
  res.status(200).json({ success: true, message: 'Restaurant deactivated.' });
});

const getMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ where: { ownerId: req.user.id } });
  if (!restaurant) throw new AppError('No restaurant profile found.', 404);
  res.status(200).json({ success: true, data: restaurant });
});

const getRestaurantCustomers = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ where: { ownerId: req.user.id } });
  if (!restaurant) throw new AppError('No restaurant profile found.', 404);

  // Get unique users who have reserved at this restaurant
  const reservations = await Reservation.findAll({
    where: { restaurantId: restaurant.id },
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'email'] },
      { model: Dinner, as: 'dinner', attributes: ['id', 'title', 'date'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  // Aggregate by user
  const customerMap = {};
  reservations.forEach((r) => {
    if (!r.user) return;
    const uid = r.user.id;
    if (!customerMap[uid]) {
      customerMap[uid] = {
        user: r.user,
        totalBookings: 0,
        totalSpent: 0,
        lastVisit: null,
        firstVisit: r.createdAt,
      };
    }
    customerMap[uid].totalBookings += 1;
    customerMap[uid].totalSpent += r.totalPrice || 0;
    if (!customerMap[uid].lastVisit || r.createdAt > customerMap[uid].lastVisit) {
      customerMap[uid].lastVisit = r.createdAt;
    }
  });

  const customers = Object.values(customerMap).sort(
    (a, b) => new Date(b.lastVisit) - new Date(a.lastVisit)
  );

  res.status(200).json({ success: true, data: customers });
});

const updateMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ where: { ownerId: req.user.id } });
  if (!restaurant) throw new AppError('No restaurant profile found.', 404);

  await restaurant.update(req.body);
  res.status(200).json({ success: true, data: restaurant });
});

module.exports = { getRestaurants, getRestaurant, createRestaurant, updateRestaurant, deleteRestaurant, getMyRestaurant, updateMyRestaurant, getRestaurantCustomers };
