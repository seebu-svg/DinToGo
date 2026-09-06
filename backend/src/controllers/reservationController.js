const { Reservation, Dinner, User, Restaurant } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification } = require('../utils/createNotification');
const { Op } = require('sequelize');

const createReservation = asyncHandler(async (req, res) => {
  const { dinner, partySize, specialRequests, dietaryNeeds } = req.body;

  const dinnerDoc = await Dinner.findByPk(dinner);
  if (!dinnerDoc) throw new AppError('Dinner not found.', 404);

  if (dinnerDoc.status !== 'scheduled' && dinnerDoc.status !== 'active') {
    throw new AppError('This dinner is not accepting reservations.', 400);
  }

  if (dinnerDoc.currentGuests + partySize > dinnerDoc.maxGuests) {
    throw new AppError(`Only ${dinnerDoc.maxGuests - dinnerDoc.currentGuests} spots available.`, 400);
  }

  const existing = await Reservation.findOne({
    where: {
      dinnerId: dinner,
      userId: req.user.id,
      status: { [Op.in]: ['pending', 'confirmed'] },
    },
  });
  if (existing) {
    throw new AppError('You already have a reservation for this dinner.', 409);
  }

  const reservation = await Reservation.create({
    dinnerId: dinner,
    userId: req.user.id,
    restaurantId: dinnerDoc.restaurantId,
    partySize,
    specialRequests,
    dietaryNeeds,
    totalPrice: dinnerDoc.price * partySize,
    status: 'confirmed',
  });

  // Update dinner guest count
  const attendees = [...dinnerDoc.attendees, { userId: req.user.id, partySize, status: 'confirmed' }];
  const currentGuests = dinnerDoc.currentGuests + partySize;
  const status = currentGuests >= dinnerDoc.maxGuests ? 'full' : dinnerDoc.status;
  await dinnerDoc.update({ attendees, currentGuests, status });

  const populated = await Reservation.findByPk(reservation.id, {
    include: [
      { model: Dinner, as: 'dinner', attributes: ['id', 'title', 'date', 'coverImage'] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'images'] },
    ],
  });

  // Notify the dinner host about the new reservation
  if (dinnerDoc.hostId && dinnerDoc.hostId !== req.user.id) {
    await createNotification({
      recipientId: dinnerDoc.hostId,
      senderId: req.user.id,
      type: 'reservation_confirmed',
      title: 'New Reservation',
      message: `${req.user.name} reserved ${partySize} spot${partySize > 1 ? 's' : ''} for "${dinnerDoc.title}"`,
      data: { dinnerId: dinnerDoc.id, reservationId: reservation.id },
    });
  }

  res.status(201).json({ success: true, data: populated });
});

const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.findAll({
    where: { userId: req.user.id },
    include: [
      { model: Dinner, as: 'dinner', attributes: ['id', 'title', 'date', 'coverImage', 'city'] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'images', 'city'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.status(200).json({ success: true, data: reservations });
});

const getRestaurantReservations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, date } = req.query;
  const where = { restaurantId: req.params.restaurantId };
  if (status) where.status = status;
  if (date) {
    const start = new Date(date); start.setHours(0, 0, 0, 0);
    const end = new Date(date); end.setHours(23, 59, 59, 999);
    where.createdAt = { [Op.between]: [start, end] };
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count: total, rows: reservations } = await Reservation.findAndCountAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'email', 'phone'] },
      { model: Dinner, as: 'dinner', attributes: ['id', 'title', 'date'] },
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset,
  });

  res.status(200).json({
    success: true, data: reservations,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  });
});

const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) throw new AppError('Reservation not found.', 404);

  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['seated', 'cancelled', 'no-show'],
    seated: ['completed', 'no-show'],
  };

  if (!validTransitions[reservation.status]?.includes(status)) {
    throw new AppError(`Cannot transition from '${reservation.status}' to '${status}'.`, 400);
  }

  const updates = { status };
  if (status === 'seated') updates.checkInTime = new Date();
  if (status === 'cancelled') {
    updates.paymentStatus = 'refunded';
    const dinner = await Dinner.findByPk(reservation.dinnerId);
    if (dinner) {
      await dinner.update({
        currentGuests: Math.max(0, dinner.currentGuests - reservation.partySize),
        status: dinner.status === 'full' ? 'scheduled' : dinner.status,
      });
    }
  }

  await reservation.update(updates);
  res.status(200).json({ success: true, data: reservation });
});

const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) throw new AppError('Reservation not found.', 404);

  if (reservation.userId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized.', 403);
  }

  if (['completed', 'cancelled'].includes(reservation.status)) {
    throw new AppError('Cannot cancel this reservation.', 400);
  }

  await reservation.update({ status: 'cancelled', paymentStatus: 'refunded' });

  const dinner = await Dinner.findByPk(reservation.dinnerId);
  if (dinner) {
    const attendees = dinner.attendees.filter((a) => a.userId !== req.user.id);
    await dinner.update({
      currentGuests: Math.max(0, dinner.currentGuests - reservation.partySize),
      attendees,
      status: dinner.status === 'full' ? 'scheduled' : dinner.status,
    });
  }

  res.status(200).json({ success: true, message: 'Reservation cancelled.' });
});

module.exports = { createReservation, getMyReservations, getRestaurantReservations, updateReservationStatus, cancelReservation };
