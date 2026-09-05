const { Dinner, ChatGroup, User, Restaurant } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { Op } = require('sequelize');
const crypto = require('crypto');

const getDinners = asyncHandler(async (req, res) => {
  const {
    page = 1, limit = 12, sort = '-createdAt', type, status, category,
    cuisine, city, search, dateFrom, dateTo, minPrice, maxPrice,
  } = req.query;

  const where = {};
  if (type) where.type = type;
  if (status) where.status = status;
  else where.status = { [Op.in]: ['scheduled', 'active'] };
  if (category) where.category = category;
  if (city) where.city = { [Op.iLike]: `%${city}%` };

  if (cuisine) {
    const cuisines = Array.isArray(cuisine) ? cuisine : [cuisine];
    where.cuisine = { [Op.overlap]: cuisines };
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date[Op.gte] = new Date(dateFrom);
    if (dateTo) where.date[Op.lte] = new Date(dateTo);
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }

  // Parse sort
  const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
  const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count: total, rows: dinners } = await Dinner.findAndCountAll({
    where,
    include: [
      { model: User, as: 'host', attributes: ['id', 'name', 'avatar'] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'images', 'rating'] },
      { model: User, as: 'influencerHost', attributes: ['id', 'name', 'avatar', 'influencerData'] },
    ],
    order: [[sortField, sortOrder]],
    limit: parseInt(limit),
    offset,
  });

  res.status(200).json({
    success: true, data: dinners,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  });
});

const getDinner = asyncHandler(async (req, res) => {
  const dinner = await Dinner.findByPk(req.params.id, {
    include: [
      { model: User, as: 'host', attributes: ['id', 'name', 'avatar', 'bio'] },
      { model: Restaurant, as: 'restaurant' },
      { model: User, as: 'influencerHost', attributes: ['id', 'name', 'avatar', 'influencerData'] },
      { model: ChatGroup, as: 'chatGroup' },
    ],
  });

  if (!dinner) throw new AppError('Dinner not found.', 404);
  res.status(200).json({ success: true, data: dinner });
});

const createDinner = asyncHandler(async (req, res) => {
  const dinnerData = { ...req.body, hostId: req.user.id };

  if (dinnerData.type === 'private') {
    dinnerData.inviteCode = crypto.randomBytes(6).toString('hex');
  }

  if (req.user.role === 'influencer') {
    dinnerData.isInfluencerHosted = true;
    dinnerData.influencerHostId = req.user.id;
    dinnerData.category = 'influencer';
  }

  const dinner = await Dinner.create(dinnerData);

  const chatGroup = await ChatGroup.create({
    name: dinner.title,
    dinnerId: dinner.id,
    members: [{ userId: req.user.id, role: 'admin' }],
  });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  await dinner.update({
    chatGroupId: chatGroup.id,
    inviteLink: `${clientUrl}/dinners/${dinner.id}?invite=${dinner.inviteCode || ''}`,
  });

  const populated = await Dinner.findByPk(dinner.id, {
    include: [
      { model: User, as: 'host', attributes: ['id', 'name', 'avatar'] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'images'] },
    ],
  });

  res.status(201).json({ success: true, data: populated });
});

const updateDinner = asyncHandler(async (req, res) => {
  const dinner = await Dinner.findByPk(req.params.id);
  if (!dinner) throw new AppError('Dinner not found.', 404);

  if (dinner.hostId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this dinner.', 403);
  }

  await dinner.update(req.body);

  const populated = await Dinner.findByPk(dinner.id, {
    include: [
      { model: User, as: 'host', attributes: ['id', 'name', 'avatar'] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'images'] },
    ],
  });

  res.status(200).json({ success: true, data: populated });
});

const deleteDinner = asyncHandler(async (req, res) => {
  const dinner = await Dinner.findByPk(req.params.id);
  if (!dinner) throw new AppError('Dinner not found.', 404);

  if (dinner.hostId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this dinner.', 403);
  }

  await dinner.update({ status: 'cancelled' });
  res.status(200).json({ success: true, message: 'Dinner cancelled successfully.' });
});

const joinDinner = asyncHandler(async (req, res) => {
  const dinner = await Dinner.findByPk(req.params.id);
  if (!dinner) throw new AppError('Dinner not found.', 404);

  if (dinner.status !== 'scheduled' && dinner.status !== 'active') {
    throw new AppError('This dinner is no longer accepting guests.', 400);
  }

  if (dinner.getIsFull()) {
    throw new AppError('This dinner is full.', 400);
  }

  const alreadyJoined = dinner.attendees.some((a) => a.userId === req.user.id);
  if (alreadyJoined) {
    throw new AppError('You have already joined this dinner.', 400);
  }

  if (dinner.type === 'private') {
    if (req.query.inviteCode !== dinner.inviteCode) {
      if (dinner.allowedGuests.length > 0) {
        if (!dinner.allowedGuests.includes(req.user.id)) {
          throw new AppError('You are not invited to this private dinner.', 403);
        }
      } else {
        throw new AppError('This is a private dinner. You need an invite code.', 403);
      }
    }
  }

  const partySize = parseInt(req.body.partySize) || 1;
  if (dinner.currentGuests + partySize > dinner.maxGuests) {
    throw new AppError(`Only ${dinner.maxGuests - dinner.currentGuests} spots available.`, 400);
  }

  const attendees = [...dinner.attendees, { userId: req.user.id, partySize, status: 'confirmed' }];
  const currentGuests = dinner.currentGuests + partySize;
  const status = currentGuests >= dinner.maxGuests ? 'full' : dinner.status;

  await dinner.update({ attendees, currentGuests, status });

  if (dinner.chatGroupId) {
    const chatGroup = await ChatGroup.findByPk(dinner.chatGroupId);
    if (chatGroup) {
      const members = [...chatGroup.members];
      if (!members.some((m) => m.userId === req.user.id)) {
        members.push({ userId: req.user.id, role: 'member' });
        await chatGroup.update({ members });
      }
    }
  }

  const updated = await Dinner.findByPk(dinner.id, {
    include: [
      { model: User, as: 'host', attributes: ['id', 'name', 'avatar'] },
    ],
  });

  res.status(200).json({ success: true, data: updated });
});

const leaveDinner = asyncHandler(async (req, res) => {
  const dinner = await Dinner.findByPk(req.params.id);
  if (!dinner) throw new AppError('Dinner not found.', 404);

  const attendeeIndex = dinner.attendees.findIndex((a) => a.userId === req.user.id);
  if (attendeeIndex === -1) {
    throw new AppError('You are not attending this dinner.', 400);
  }

  const partySize = dinner.attendees[attendeeIndex].partySize;
  const attendees = dinner.attendees.filter((_, i) => i !== attendeeIndex);
  const currentGuests = Math.max(0, dinner.currentGuests - partySize);
  const status = dinner.status === 'full' ? 'scheduled' : dinner.status;

  await dinner.update({ attendees, currentGuests, status });

  res.status(200).json({ success: true, message: 'You have left the dinner.' });
});

const getMyHostedDinners = asyncHandler(async (req, res) => {
  const dinners = await Dinner.findAll({
    where: { hostId: req.user.id },
    include: [
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'images'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.status(200).json({ success: true, data: dinners });
});

const getMyAttendingDinners = asyncHandler(async (req, res) => {
  const dinners = await Dinner.findAll({
    include: [
      { model: User, as: 'host', attributes: ['id', 'name', 'avatar'] },
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'images'] },
    ],
    order: [['date', 'DESC']],
  });

  // Filter dinners where user is an attendee (JSONB array)
  const myDinners = dinners.filter((d) =>
    d.attendees.some((a) => a.userId === req.user.id)
  );

  res.status(200).json({ success: true, data: myDinners });
});

module.exports = {
  getDinners, getDinner, createDinner, updateDinner,
  deleteDinner, joinDinner, leaveDinner, getMyHostedDinners, getMyAttendingDinners,
};
