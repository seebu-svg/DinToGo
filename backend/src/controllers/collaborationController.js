const { Collaboration, Restaurant, User, Dinner } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification } = require('../utils/createNotification');

const getCollaborations = asyncHandler(async (req, res) => {
  let where = {};
  if (req.user.role === 'restaurant') {
    const restaurant = await Restaurant.findOne({ where: { ownerId: req.user.id } });
    if (restaurant) where.restaurantId = restaurant.id;
  } else if (req.user.influencerData) {
    // User is a creator (has influencerData)
    where.influencerId = req.user.id;
  }

  const { status } = req.query;
  if (status) where.status = status;

  const collabs = await Collaboration.findAll({
    where,
    include: [
      { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'images'] },
      { model: User, as: 'influencer', attributes: ['id', 'name', 'avatar', 'influencerData'] },
      { model: Dinner, as: 'dinner', attributes: ['id', 'title', 'date'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({ success: true, data: collabs });
});

const createCollaboration = asyncHandler(async (req, res) => {
  // Allow restaurant owners OR creators to initiate collaborations
  const isRestaurantOwner = req.user.role === 'restaurant' || req.user.role === 'admin';
  const isCreator = !!req.user.influencerData;

  if (!isRestaurantOwner && !isCreator) {
    throw new AppError('Only restaurant partners or creators can initiate collaborations.', 403);
  }

  let restaurant;
  if (isRestaurantOwner) {
    restaurant = await Restaurant.findOne({ where: { ownerId: req.user.id } });
    if (!restaurant) throw new AppError('Restaurant not found.', 404);
  } else {
    // Creator initiating — restaurant must be specified
    restaurant = await Restaurant.findByPk(req.body.restaurantId);
    if (!restaurant) throw new AppError('Restaurant not found.', 404);
  }

  // The influencer is either the requesting creator or a specified user
  const influencerId = req.body.influencer || req.user.id;
  const influencer = await User.findByPk(influencerId);
  if (!influencer || (!influencer.influencerData && influencer.role !== 'restaurant')) {
    throw new AppError('Valid creator not found.', 404);
  }

  const collab = await Collaboration.create({
    restaurantId: restaurant.id,
    influencerId: influencer.id || req.user.id,
    dinnerId: req.body.dinner || null,
    terms: req.body.terms,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  // Notify the influencer about the collaboration invite
  await createNotification({
    recipientId: influencer.id,
    senderId: req.user.id,
    type: 'influencer_collab',
    title: 'New Collaboration Invite',
    message: `${restaurant.name} wants to collaborate with you!`,
    data: { collaborationId: collab.id, restaurantId: restaurant.id },
  });

  res.status(201).json({ success: true, data: collab });
});

const updateCollaboration = asyncHandler(async (req, res) => {
  const collab = await Collaboration.findByPk(req.params.id);
  if (!collab) throw new AppError('Collaboration not found.', 404);

  const { status } = req.body;
  if (status) {
    if (['accepted', 'declined'].includes(status) && collab.influencerId !== req.user.id) {
      throw new AppError('Only the influencer can accept or decline.', 403);
    }
    collab.status = status;
  }

  if (req.body.terms) collab.terms = { ...collab.terms, ...req.body.terms };
  if (req.body.results) collab.results = { ...collab.results, ...req.body.results };

  await collab.save();
  res.status(200).json({ success: true, data: collab });
});

module.exports = { getCollaborations, createCollaboration, updateCollaboration };
