const { Collaboration, Restaurant, User, Dinner } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getCollaborations = asyncHandler(async (req, res) => {
  let where = {};
  if (req.user.role === 'restaurant') {
    const restaurant = await Restaurant.findOne({ where: { ownerId: req.user.id } });
    if (restaurant) where.restaurantId = restaurant.id;
  } else if (req.user.role === 'influencer') {
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
  if (req.user.role !== 'restaurant') {
    throw new AppError('Only restaurant partners can initiate collaborations.', 403);
  }

  const restaurant = await Restaurant.findOne({ where: { ownerId: req.user.id } });
  if (!restaurant) throw new AppError('Restaurant not found.', 404);

  const influencer = await User.findByPk(req.body.influencer);
  if (!influencer || influencer.role !== 'influencer') {
    throw new AppError('Valid influencer not found.', 404);
  }

  const collab = await Collaboration.create({
    restaurantId: restaurant.id,
    influencerId: influencer.id,
    dinnerId: req.body.dinner || null,
    terms: req.body.terms,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
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
