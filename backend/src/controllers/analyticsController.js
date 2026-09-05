const { Reservation, Dinner, Restaurant, User, sequelize } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

const getRestaurantAnalytics = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.restaurantId);
  if (!restaurant) throw new AppError('Restaurant not found.', 404);

  if (restaurant.ownerId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized.', 403);
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  const totalReservations = await Reservation.count({ where: { restaurantId: restaurant.id } });
  const recentReservations = await Reservation.count({
    where: { restaurantId: restaurant.id, createdAt: { [Op.gte]: thirtyDaysAgo } },
  });

  // Revenue
  const revenueResult = await Reservation.findOne({
    where: { restaurantId: restaurant.id, paymentStatus: 'paid' },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('totalPrice')), 'total'],
      [sequelize.fn('COUNT', 'id'), 'count'],
    ],
    raw: true,
  });

  const recentRevenueResult = await Reservation.findOne({
    where: { restaurantId: restaurant.id, paymentStatus: 'paid', createdAt: { [Op.gte]: thirtyDaysAgo } },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('totalPrice')), 'total'],
      [sequelize.fn('COUNT', 'id'), 'count'],
    ],
    raw: true,
  });

  const totalDinners = await Dinner.count({ where: { restaurantId: restaurant.id } });

  // Occupancy
  const occupancyResult = await Dinner.findOne({
    where: { restaurantId: restaurant.id },
    attributes: [
      [sequelize.fn('AVG', sequelize.literal('CASE WHEN "maxGuests" > 0 THEN "currentGuests"::float / "maxGuests" ELSE 0 END')), 'avgOccupancy'],
      [sequelize.fn('SUM', sequelize.col('maxGuests')), 'totalCapacity'],
      [sequelize.fn('SUM', sequelize.col('currentGuests')), 'totalBooked'],
    ],
    raw: true,
  });

  // Status breakdown
  const statusBreakdown = await Reservation.findAll({
    where: { restaurantId: restaurant.id },
    attributes: [
      'status',
      [sequelize.fn('COUNT', 'id'), 'count'],
    ],
    group: ['status'],
    raw: true,
  });

  // Monthly revenue trend
  const monthlyRevenue = await Reservation.findAll({
    where: {
      restaurantId: restaurant.id,
      paymentStatus: 'paid',
      createdAt: { [Op.gte]: sixMonthsAgo },
    },
    attributes: [
      [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
      [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue'],
      [sequelize.fn('COUNT', 'id'), 'bookings'],
    ],
    group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
    order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']],
    raw: true,
  });

  res.status(200).json({
    success: true,
    data: {
      totalReservations,
      recentReservations,
      totalRevenue: parseFloat(revenueResult?.total) || 0,
      recentRevenue: parseFloat(recentRevenueResult?.total) || 0,
      totalDinners,
      avgOccupancy: Math.round((parseFloat(occupancyResult?.avgOccupancy) || 0) * 100),
      totalCapacity: parseInt(occupancyResult?.totalCapacity) || 0,
      totalBooked: parseInt(occupancyResult?.totalBooked) || 0,
      statusBreakdown: statusBreakdown.reduce((acc, s) => ({ ...acc, [s.status]: parseInt(s.count) }), {}),
      monthlyRevenue,
    },
  });
});

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.count();
  const totalDinners = await Dinner.count();
  const totalReservations = await Reservation.count();
  const totalRestaurants = await Restaurant.count({ where: { isActive: true } });

  const recentDinners = await Dinner.findAll({
    include: [
      { model: User, as: 'host', attributes: ['id', 'name'] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
    ],
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  res.status(200).json({
    success: true,
    data: { totalUsers, totalDinners, totalReservations, totalRestaurants, recentDinners },
  });
});

module.exports = { getRestaurantAnalytics, getDashboardAnalytics };
