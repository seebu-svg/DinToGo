const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const { sequelize } = require('../config/database');
const { User, Restaurant, Dinner, Offer, Follow } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');

    // Sync tables (force drop and recreate)
    await sequelize.sync({ force: true });
    console.log('Cleared existing data');

    // Create users — 'user' is the default role; influencers are users who've earned trust
    const regularUsers = await User.bulkCreate([
      { name: 'Alice Johnson', email: 'alice@dintogo.com', password: 'password123', role: 'user', bio: 'Food lover and travel enthusiast', location: { city: 'New York', country: 'US' }, dietaryPreferences: ['Vegetarian'] },
      { name: 'Bob Chen', email: 'bob@dintogo.com', password: 'password123', role: 'user', bio: 'Always looking for the next great meal', location: { city: 'San Francisco', country: 'US' } },
      { name: 'Carla Smith', email: 'carla@dintogo.com', password: 'password123', role: 'user', location: { city: 'Miami', country: 'US' } },
    ], { individualHooks: true });

    // Dining Creators — users who've built audience & trust (influencerData tracks their status)
    const creators = await User.bulkCreate([
      { name: 'FoodieJane', email: 'jane@dintogo.com', password: 'password123', role: 'user', bio: 'Food & travel content creator with 200K followers', location: { city: 'Los Angeles', country: 'US' }, influencerData: { niche: 'Food & Travel', platform: 'Instagram', audienceSize: 200000, verified: true, inviteCode: 'jane2026', hostedDinners: 12 } },
      { name: 'ChefMikeReviews', email: 'mike@dintogo.com', password: 'password123', role: 'user', bio: 'Professional chef reviewing restaurants worldwide', location: { city: 'New York', country: 'US' }, influencerData: { niche: 'Fine Dining', platform: 'YouTube', audienceSize: 500000, verified: true, inviteCode: 'mike2026', hostedDinners: 8 } },
    ], { individualHooks: true });

    // Restaurant partners — keep 'restaurant' role for venue management
    const restaurantOwners = await User.bulkCreate([
      { name: 'Marco Rossi', email: 'marco@dintogo.com', password: 'password123', role: 'restaurant', bio: 'Owner of Osteria Bella — authentic Italian in SF', location: { city: 'San Francisco', country: 'US' }, restaurantData: { businessName: 'Osteria Bella', cuisine: ['Italian', 'Mediterranean'], address: '456 Mission St, San Francisco', verified: true, rating: 4.7 } },
      { name: 'SkyLounge NYC', email: 'skylounge@dintogo.com', password: 'password123', role: 'restaurant', bio: 'Rooftop dining with stunning Manhattan views', location: { city: 'New York', country: 'US' }, restaurantData: { businessName: 'SkyLounge NYC', cuisine: ['American', 'Fusion'], verified: true, rating: 4.8 } },
    ], { individualHooks: true });

    const admin = await User.create(
      { name: 'Admin', email: 'admin@dintogo.com', password: 'password123', role: 'admin' }
    );

    // Create restaurants
    const restaurants = await Restaurant.bulkCreate([
      { ownerId: restaurantOwners[0].id, name: 'Osteria Bella', description: 'Authentic Italian cuisine with a modern twist. Farm-to-table ingredients in a warm, inviting atmosphere.', cuisine: ['Italian', 'Mediterranean'], street: '456 Mission St', city: 'San Francisco', state: 'CA', zipCode: '94105', country: 'US', phone: '(415) 555-0100', email: 'hello@osteriabella.com', priceRange: '$$$', seatingCapacity: 80, rating: 4.7, totalReviews: 142, featured: true, amenities: ['Outdoor Seating', 'Private Dining', 'Wine Bar'], dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-Free'] },
      { ownerId: restaurantOwners[1].id, name: 'SkyLounge NYC', description: 'Premium rooftop dining experience with panoramic views of Manhattan skyline.', cuisine: ['American', 'Fusion', 'Cocktails'], street: '1 World Trade Center', city: 'New York', state: 'NY', zipCode: '10007', country: 'US', phone: '(212) 555-0200', email: 'events@skyloungenyc.com', priceRange: '$$$$', seatingCapacity: 120, rating: 4.8, totalReviews: 287, featured: true, amenities: ['Rooftop', 'Live Music', 'Private Events', 'Valet Parking'], dietaryOptions: ['Vegetarian', 'Keto', 'Halal'] },
    ]);

    // Create dinners
    await Dinner.bulkCreate([
      { title: 'Sunset Rooftop Dinner Experience', description: 'Join us for an unforgettable evening dining under the stars. Five-course tasting menu paired with craft cocktails and live jazz.', coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop', hostId: restaurantOwners[1].id, restaurantId: restaurants[1].id, date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), duration: 180, venue: 'SkyLounge NYC', address: '1 WTC, New York', city: 'New York', type: 'public', status: 'scheduled', category: 'fine-dining', cuisine: ['American', 'Fusion'], maxGuests: 30, currentGuests: 22, price: 85, tags: ['rooftop', 'sunset', 'jazz', 'cocktails'], ratingAverage: 4.8, ratingCount: 45 },
      { title: 'Influencer Food Crawl — Miami Edition', description: 'Join FoodieJane on an exclusive culinary tour through Miami\'s hottest restaurants.', coverImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop', hostId: creators[0].id, date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), duration: 240, venue: 'The Bazaar', address: '1701 Collins Ave', city: 'Miami', type: 'public', status: 'scheduled', category: 'influencer', cuisine: ['Spanish', 'Latin', 'Fusion'], maxGuests: 50, currentGuests: 38, price: 65, isInfluencerHosted: true, influencerHostId: creators[0].id, tags: ['influencer', 'food-crawl', 'miami', 'social'], ratingAverage: 4.9, ratingCount: 67 },
      { title: 'Farm-to-Table Italian Night', description: 'Experience the essence of Tuscany in San Francisco. Chef Marco prepares a six-course dinner using locally-sourced organic ingredients.', coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', hostId: restaurantOwners[0].id, restaurantId: restaurants[0].id, date: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000), duration: 150, venue: 'Osteria Bella', address: '456 Mission St', city: 'San Francisco', type: 'public', status: 'scheduled', category: 'themed', cuisine: ['Italian', 'Mediterranean'], maxGuests: 20, currentGuests: 14, price: 55, tags: ['italian', 'farm-to-table', 'organic', 'wine-pairing'], dietaryOptions: ['Vegetarian', 'Gluten-Free'], ratingAverage: 4.7, ratingCount: 28 },
      { title: 'Networking Dinner for Founders', description: 'An intimate evening connecting tech founders over exceptional food. Invite-only — limited to 16 guests.', coverImage: 'https://images.unsplash.com/photo-1530062845289-9109b2c9c846?w=800&h=600&fit=crop', hostId: restaurantOwners[1].id, restaurantId: restaurants[1].id, date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), duration: 120, venue: 'The Private Club', address: '88 Greenwich St', city: 'New York', type: 'private', status: 'scheduled', category: 'networking', maxGuests: 16, currentGuests: 16, price: 45, tags: ['networking', 'founders', 'tech', 'private'], ratingAverage: 4.6, ratingCount: 12 },
      { title: 'Sushi Masterclass with Chef Tanaka', description: 'Learn the art of sushi from a master chef. Hands-on workshop followed by an omakase dinner.', coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop', hostId: creators[1].id, date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), duration: 180, venue: 'Nobu Downtown', address: '195 Broadway', city: 'New York', type: 'public', status: 'scheduled', category: 'fine-dining', cuisine: ['Japanese', 'Sushi'], maxGuests: 12, currentGuests: 8, price: 120, isInfluencerHosted: true, influencerHostId: creators[1].id, tags: ['sushi', 'masterclass', 'omakase', 'sake'], ratingAverage: 5.0, ratingCount: 8 },
      { title: 'Casual Taco Tuesday Hangout', description: 'Laid-back evening with authentic street tacos, craft beer, and good vibes.', coverImage: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop', hostId: regularUsers[0].id, date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), duration: 120, venue: 'Casa de Tacos', address: '1234 Sunset Blvd', city: 'Los Angeles', type: 'public', status: 'scheduled', category: 'casual', cuisine: ['Mexican', 'Street Food'], maxGuests: 40, currentGuests: 25, price: 25, tags: ['casual', 'tacos', 'craft-beer', 'social'], dietaryOptions: ['Vegetarian', 'Vegan'], ratingAverage: 4.4, ratingCount: 34 },
    ]);

    // Create offers
    await Offer.bulkCreate([
      { restaurantId: restaurants[0].id, createdById: restaurantOwners[0].id, title: 'Early Bird 20% Off', description: 'Book before 5pm and enjoy 20% off your entire meal.', discountType: 'percentage', discountPercent: 20, validFrom: new Date(), validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), status: 'active', targetAudience: 'all' },
      { restaurantId: restaurants[1].id, createdById: restaurantOwners[1].id, title: 'New Guest Welcome Offer', description: 'First-time guests receive a complimentary appetizer.', discountType: 'special', validFrom: new Date(), validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), status: 'active', targetAudience: 'new-customers' },
    ]);

    // Create follow relationships
    for (const user of regularUsers) {
      for (const creator of creators) {
        await Follow.create({ followerId: user.id, followingId: creator.id });
        await User.increment('followingCount', { where: { id: user.id } });
        await User.increment('followerCount', { where: { id: creator.id } });
      }
    }

    console.log('Seed data created successfully!');
    console.log('\nTest accounts:');
    console.log('  User:        alice@dintogo.com / password123');
    console.log('  Creator:     jane@dintogo.com / password123');
    console.log('  Restaurant:  marco@dintogo.com / password123');
    console.log('  Admin:       admin@dintogo.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
