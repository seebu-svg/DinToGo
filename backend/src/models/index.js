const User = require('./User');
const Dinner = require('./Dinner');
const Restaurant = require('./Restaurant');
const Reservation = require('./Reservation');
const Review = require('./Review');
const Offer = require('./Offer');
const Collaboration = require('./Collaboration');
const Notification = require('./Notification');
const ChatGroup = require('./ChatGroup');
const Follow = require('./Follow');

// ── User ↔ Dinner ──────────────────────────────────────────────
User.hasMany(Dinner, { foreignKey: 'hostId', as: 'hostedDinners' });
Dinner.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

User.hasMany(Dinner, { foreignKey: 'influencerHostId', as: 'influencerDinners' });
Dinner.belongsTo(User, { foreignKey: 'influencerHostId', as: 'influencerHost' });

// ── Restaurant ↔ Dinner ────────────────────────────────────────
Restaurant.hasMany(Dinner, { foreignKey: 'restaurantId', as: 'dinners' });
Dinner.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// ── User ↔ Restaurant ──────────────────────────────────────────
User.hasOne(Restaurant, { foreignKey: 'ownerId', as: 'restaurant' });
Restaurant.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// ── Reservation associations ───────────────────────────────────
Reservation.belongsTo(Dinner, { foreignKey: 'dinnerId', as: 'dinner' });
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Reservation.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Dinner.hasMany(Reservation, { foreignKey: 'dinnerId', as: 'reservations' });
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
Restaurant.hasMany(Reservation, { foreignKey: 'restaurantId', as: 'reservations' });

// ── Review associations ────────────────────────────────────────
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
Review.belongsTo(Dinner, { foreignKey: 'dinnerId', as: 'dinner' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Dinner.hasMany(Review, { foreignKey: 'dinnerId', as: 'reviews' });
Restaurant.hasMany(Review, { foreignKey: 'restaurantId', as: 'reviews' });

// ── Offer associations ─────────────────────────────────────────
Offer.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
Offer.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

Restaurant.hasMany(Offer, { foreignKey: 'restaurantId', as: 'offers' });

// ── Collaboration associations ─────────────────────────────────
Collaboration.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
Collaboration.belongsTo(User, { foreignKey: 'influencerId', as: 'influencer' });
Collaboration.belongsTo(Dinner, { foreignKey: 'dinnerId', as: 'dinner' });

// ── Notification associations ──────────────────────────────────
Notification.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });
Notification.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// ── ChatGroup ↔ Dinner ────────────────────────────────────────
ChatGroup.belongsTo(Dinner, { foreignKey: 'dinnerId', as: 'dinner' });
Dinner.belongsTo(ChatGroup, { foreignKey: 'chatGroupId', as: 'chatGroup' });

// ── Follow (many-to-many) ─────────────────────────────────────
User.belongsToMany(User, {
  through: Follow,
  as: 'followers',
  foreignKey: 'followingId',
  otherKey: 'followerId',
});

User.belongsToMany(User, {
  through: Follow,
  as: 'following',
  foreignKey: 'followerId',
  otherKey: 'followingId',
});

module.exports = {
  User,
  Dinner,
  Restaurant,
  Reservation,
  Review,
  Offer,
  Collaboration,
  Notification,
  ChatGroup,
  Follow,
};
