import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import {
  Star, MessageCircle, ThumbsUp, Camera, Filter, Loader,
  UtensilsCrossed, Calendar, TrendingUp, Award,
} from 'lucide-react';

const demoReviews = [
  { id: 1, rating: 5, comment: 'Absolutely incredible dining experience! The pasta was handmade and the ambiance was perfect for a content shoot.', createdAt: '2025-09-01T18:30:00Z', helpfulCount: 24, images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=150&fit=crop'], dinner: { title: 'Italian Night', date: '2025-08-30' }, restaurant: { name: 'Mamma Mia' }, ownerResponse: { text: 'Thank you so much! We loved hosting you.', respondedAt: '2025-09-02T10:00:00Z' } },
  { id: 2, rating: 4, comment: 'Great sushi selection and the omakase was beautifully presented. Lighting could be better for photos.', createdAt: '2025-08-25T20:00:00Z', helpfulCount: 18, images: [], dinner: { title: 'Sushi Omakase', date: '2025-08-24' }, restaurant: { name: 'Sakura' }, ownerResponse: null },
  { id: 3, rating: 5, comment: 'The chef\'s table experience was phenomenal. Every course was a work of art. My followers are going to love this spot!', createdAt: '2025-08-18T19:15:00Z', helpfulCount: 31, images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=150&fit=crop', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop'], dinner: { title: "Chef's Table", date: '2025-08-17' }, restaurant: { name: 'The Forest Bistro' }, ownerResponse: { text: 'We always pour our heart into every dish. Come back soon!', respondedAt: '2025-08-19T14:00:00Z' } },
  { id: 4, rating: 4, comment: 'Lovely brunch spot. The avocado toast was next level. Service was a bit slow but the food made up for it.', createdAt: '2025-08-10T11:00:00Z', helpfulCount: 12, images: [], dinner: { title: 'Weekend Brunch', date: '2025-08-09' }, restaurant: { name: 'Café Botanica' }, ownerResponse: null },
  { id: 5, rating: 5, comment: 'Best BBQ in the city! The smoked brisket was melt-in-your-mouth. Already planning my next visit for content.', createdAt: '2025-08-02T19:45:00Z', helpfulCount: 42, images: ['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200&h=150&fit=crop'], dinner: { title: 'BBQ Masters', date: '2025-08-01' }, restaurant: { name: 'Smokehouse & Co' }, ownerResponse: { text: 'Appreciate the love! Next time try our new ribs.', respondedAt: '2025-08-03T09:00:00Z' } },
];

const ratingFilters = [
  { stars: 0, label: 'All' },
  { stars: 5, label: '5 Stars' },
  { stars: 4, label: '4 Stars' },
  { stars: 3, label: '3 Stars' },
  { stars: 2, label: '2 Stars' },
  { stars: 1, label: '1 Star' },
];

const InfluencerReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    reviewsAPI.getAll({ limit: 50 }).then(res => {
      const items = Array.isArray(res.data?.data) ? res.data.data : [];
      setReviews(items.length > 0 ? items : demoReviews);
    }).catch(() => {
      setReviews(demoReviews);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = reviews.filter(r => {
    if (ratingFilter === 0) return true;
    return r.rating === ratingFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return 0;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';
  const totalHelpful = reviews.reduce((sum, r) => sum + (r.helpfulCount || 0), 0);
  const withResponse = reviews.filter(r => r.ownerResponse).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={28} className="text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900">My Reviews</h1>
        <p className="text-charcoal-400 text-sm mt-1">Your dining reviews and their impact.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-5 text-center">
          <p className="text-2xl font-bold text-charcoal-900">{reviews.length}</p>
          <p className="text-xs text-charcoal-400 mt-0.5">Reviews Written</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5 text-center">
          <div className="flex items-center justify-center gap-1">
            <Star size={18} className="text-brand-500 fill-brand-500" />
            <p className="text-2xl font-bold text-charcoal-900">{avgRating}</p>
          </div>
          <p className="text-xs text-charcoal-400 mt-0.5">Avg Rating Given</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5 text-center">
          <p className="text-2xl font-bold text-brand-500">{totalHelpful}</p>
          <p className="text-xs text-charcoal-400 mt-0.5">Helpful Votes</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5 text-center">
          <p className="text-2xl font-bold text-charcoal-900">{withResponse}</p>
          <p className="text-xs text-charcoal-400 mt-0.5">Owner Responses</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-card">
          {ratingFilters.map(({ stars, label }) => (
            <button
              key={stars}
              onClick={() => setRatingFilter(stars)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                ratingFilter === stars ? 'bg-brand-500 text-white' : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-white border border-charcoal-100 rounded-xl px-3 py-2 text-xs font-medium text-charcoal-600 focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews List */}
      {sorted.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-card">
          <Star size={48} className="text-charcoal-200 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-charcoal-900 mb-1">No reviews yet</h3>
          <p className="text-sm text-charcoal-400 mb-4">Attend dinners and share your experience!</p>
          <Link to="/influencer/dinners" className="btn-primary text-sm">Browse Dinners</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map(r => (
            <div key={r.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? 'text-brand-500 fill-brand-500' : 'text-charcoal-200'} />
                    ))}
                  </div>
                  <h3 className="font-bold text-charcoal-900 text-sm">{r.dinner?.title || 'Dinner Experience'}</h3>
                  <p className="text-xs text-charcoal-400">
                    {r.restaurant?.name} • {format(new Date(r.createdAt), 'd MMM yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-charcoal-400">
                  <ThumbsUp size={12} /> {r.helpfulCount || 0}
                </div>
              </div>
              <p className="text-sm text-charcoal-600 leading-relaxed mb-3">{r.comment}</p>
              {r.images && r.images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {r.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-20 h-20 rounded-xl object-cover" />
                  ))}
                </div>
              )}
              {r.ownerResponse && (
                <div className="bg-cream-50 rounded-xl p-3 border-l-3 border-brand-500">
                  <p className="text-xs font-semibold text-charcoal-700 mb-1">Owner Response</p>
                  <p className="text-xs text-charcoal-500">{r.ownerResponse.text}</p>
                  <p className="text-[10px] text-charcoal-400 mt-1">
                    {format(new Date(r.ownerResponse.respondedAt), 'd MMM yyyy')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfluencerReviews;
