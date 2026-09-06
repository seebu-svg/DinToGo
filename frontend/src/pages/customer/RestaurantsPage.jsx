import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Star, Clock, Search, Filter, Loader, Verified,
  Tag, ChevronRight, UtensilsCrossed, X, Gift, Navigation,
} from 'lucide-react';

const demoRestaurants = [
  {
    id: 'rest1', name: 'La Terrazza', verified: true,
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    cuisine: 'Italian, Mediterranean',
    location: 'Gulberg III, Lahore',
    rating: 4.8, reviewCount: 234, priceRange: '$$$',
    upcomingDinners: 5,
    offer: { title: '20% OFF', desc: 'For groups of 4+' },
    tags: ['Rooftop', 'Fine Dining', 'Wine Bar'],
    openNow: true,
  },
  {
    id: 'rest2', name: 'Miyabi Sushi', verified: true,
    coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop',
    cuisine: 'Japanese, Sushi',
    location: 'DHA Phase 5, Lahore',
    rating: 4.7, reviewCount: 189, priceRange: '$$$$',
    upcomingDinners: 3,
    offer: null,
    tags: ['Omakase', 'Sake Bar', 'Private Dining'],
    openNow: true,
  },
  {
    id: 'rest3', name: 'The Grill House', verified: false,
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    cuisine: 'BBQ, Steakhouse',
    location: 'Johar Town, Lahore',
    rating: 4.5, reviewCount: 312, priceRange: '$$',
    upcomingDinners: 8,
    offer: { title: 'Free Dessert', desc: 'On orders above Rs. 5000' },
    tags: ['Outdoor', 'Live Music', 'Family Friendly'],
    openNow: true,
  },
  {
    id: 'rest4', name: 'Mamma Mia Pizzeria', verified: true,
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    cuisine: 'Italian, Pizza',
    location: 'Gulberg III, Lahore',
    rating: 4.6, reviewCount: 456, priceRange: '$$',
    upcomingDinners: 4,
    offer: { title: '20% OFF', desc: 'For groups of 4+' },
    tags: ['Casual', 'Wood-Fired Oven', 'BYOB'],
    openNow: false,
  },
  {
    id: 'rest5', name: 'Sushiya', verified: true,
    coverImage: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&h=400&fit=crop',
    cuisine: 'Japanese, Asian Fusion',
    location: 'MM Alam Road, Lahore',
    rating: 4.9, reviewCount: 167, priceRange: '$$$$',
    upcomingDinners: 2,
    offer: null,
    tags: ['Omakase', 'Chef\'s Table', 'Sake Collection'],
    openNow: true,
  },
  {
    id: 'rest6', name: 'Green Bowl', verified: false,
    coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop',
    cuisine: 'Vegan, Healthy',
    location: 'Cantt, Lahore',
    rating: 4.3, reviewCount: 98, priceRange: '$$',
    upcomingDinners: 1,
    offer: { title: '15% OFF', desc: 'First order' },
    tags: ['Plant-Based', 'Organic', 'Gluten-Free Options'],
    openNow: true,
  },
  {
    id: 'rest7', name: 'The Vault Cafe', verified: true,
    coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
    cuisine: 'Cafe, Wine Bar',
    location: 'Cantt, Lahore',
    rating: 4.4, reviewCount: 201, priceRange: '$$$',
    upcomingDinners: 6,
    offer: null,
    tags: ['Wine & Cheese', 'Live Jazz', 'Art Gallery'],
    openNow: false,
  },
  {
    id: 'rest8', name: 'Spice Kingdom', verified: false,
    coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop',
    cuisine: 'Pakistani, Mughlai',
    location: 'Anarkali, Lahore',
    rating: 4.6, reviewCount: 389, priceRange: '$',
    upcomingDinners: 3,
    offer: { title: 'Free Delivery', desc: 'Within 5km radius' },
    tags: ['Traditional', 'Buffet', 'Large Groups'],
    openNow: true,
  },
];

const cuisineFilters = ['All', 'Italian', 'Japanese', 'BBQ', 'Vegan', 'Pakistani', 'Cafe'];

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const [sort, setSort] = useState('rating');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRestaurants(demoRestaurants);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = restaurants
    .filter(r => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase());
      const matchCuisine = cuisine === 'All' || r.cuisine.toLowerCase().includes(cuisine.toLowerCase());
      return matchSearch && matchCuisine;
    })
    .sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'reviews') return b.reviewCount - a.reviewCount;
      if (sort === 'dinners') return b.upcomingDinners - a.upcomingDinners;
      return 0;
    });

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-1.5">Restaurants</h1>
        <p className="text-charcoal-400 text-sm">Discover top restaurants, browse their upcoming dinners, and find exclusive offers.</p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants by name, cuisine, or location..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-500">
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Cuisine Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {cuisineFilters.map((c) => (
              <button
                key={c}
                onClick={() => setCuisine(c)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  cuisine === c
                    ? 'bg-brand-500 text-white'
                    : 'bg-white border border-charcoal-100 text-charcoal-500 hover:border-charcoal-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm bg-white border border-charcoal-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300 text-charcoal-600 sm:ml-auto shrink-0"
          >
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviews</option>
            <option value="dinners">Most Dinners</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-charcoal-400">{filtered.length} restaurants found</p>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((rest) => (
            <div key={rest.id} className="card overflow-hidden group">
              {/* Cover */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={rest.coverImage}
                  alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {rest.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">
                      <Verified size={10} /> Verified
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rest.openNow ? 'bg-green-500 text-white' : 'bg-charcoal-600/80 text-white backdrop-blur-sm'}`}>
                    {rest.openNow ? 'Open Now' : 'Closed'}
                  </span>
                </div>
                {/* Offer */}
                {rest.offer && (
                  <span className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-bold bg-green-500 text-white px-2.5 py-1 rounded-full">
                    <Gift size={10} /> {rest.offer.title}
                  </span>
                )}
                {/* Price Range */}
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/90 backdrop-blur-sm text-charcoal-700 px-2 py-0.5 rounded-full">
                  {rest.priceRange}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-charcoal-900 text-sm">{rest.name}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-charcoal-700">{rest.rating}</span>
                    <span className="text-[10px] text-charcoal-400">({rest.reviewCount})</span>
                  </div>
                </div>

                <p className="text-xs text-charcoal-400 mb-1">{rest.cuisine}</p>
                <div className="flex items-center gap-1 text-xs text-charcoal-400 mb-2">
                  <MapPin size={11} /> {rest.location}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {rest.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] font-medium bg-cream-50 text-charcoal-500 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>

                {/* Upcoming Dinners */}
                {rest.upcomingDinners > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-500 font-medium mb-3">
                    <UtensilsCrossed size={12} />
                    {rest.upcomingDinners} upcoming dinners
                  </div>
                )}

                {/* Offer description */}
                {rest.offer && (
                  <p className="text-[10px] text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg mb-3">{rest.offer.desc}</p>
                )}

                {/* Action */}
                <Link
                  to="/discover"
                  className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                >
                  View Dinners <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <MapPin size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">No restaurants found</p>
          <p className="text-charcoal-400 text-sm mt-1">Try a different search or cuisine filter.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
