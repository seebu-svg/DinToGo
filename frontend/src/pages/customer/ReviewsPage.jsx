import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Star, Loader, ThumbsUp, Camera, Calendar, MapPin,
  UtensilsCrossed, Filter, SortDesc, Heart, MessageCircle,
  Users,
} from 'lucide-react';

const demoReviews = [
  {
    id: 'r1',
    dinnerTitle: 'Italian Night at La Terrazza',
    restaurant: 'La Terrazza',
    restaurantAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=80&h=80&fit=crop',
    date: 'Aug 28, 2026',
    rating: 5,
    title: 'Absolutely magical evening!',
    comment: 'The pasta was handmade, the ambiance was perfect, and the host did an incredible job bringing everyone together. Already looking forward to the next one!',
    helpful: 12,
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
    ],
    attendees: 8,
    wouldRecommend: true,
  },
  {
    id: 'r2',
    dinnerTitle: 'Sushi & Sake Night',
    restaurant: 'Miyabi Sushi',
    restaurantAvatar: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=80&h=80&fit=crop',
    date: 'Aug 15, 2026',
    rating: 4,
    title: 'Great food, wonderful company',
    comment: 'The sushi was fresh and beautifully presented. The sake pairing was a nice touch. Only giving 4 stars because the venue was a bit cramped, but overall a fantastic experience.',
    helpful: 8,
    images: [],
    attendees: 6,
    wouldRecommend: true,
  },
  {
    id: 'r3',
    dinnerTitle: 'Rooftop BBQ Evening',
    restaurant: 'The Grill House',
    restaurantAvatar: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80&h=80&fit=crop',
    date: 'Jul 30, 2026',
    rating: 5,
    title: 'Best BBQ in town!',
    comment: 'The brisket was fall-off-the-bone tender, and the rooftop views were stunning. Met some amazing food lovers here. The host was super friendly and made sure everyone was having a great time.',
    helpful: 15,
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
    ],
    attendees: 12,
    wouldRecommend: true,
  },
  {
    id: 'r4',
    dinnerTitle: 'Vegan Brunch Club',
    restaurant: 'Green Bowl',
    restaurantAvatar: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=80&h=80&fit=crop',
    date: 'Jul 10, 2026',
    rating: 3,
    title: 'Decent food, small portions',
    comment: 'The food was tasty but portions were quite small for the price. The avocado toast was great though! Nice atmosphere and friendly staff.',
    helpful: 3,
    images: [],
    attendees: 5,
    wouldRecommend: false,
  },
];

const sortOptions = [
  { id: 'recent', label: 'Most Recent' },
  { id: 'highest', label: 'Highest Rated' },
  { id: 'lowest', label: 'Lowest Rated' },
  { id: 'helpful', label: 'Most Helpful' },
];

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('recent');
  const [filter, setFilter] = useState('all');
  const [helpfulClicked, setHelpfulClicked] = useState(new Set());

  useEffect(() => {
    setTimeout(() => {
      setReviews(demoReviews);
      setLoading(false);
    }, 500);
  }, []);

  const handleHelpful = (id) => {
    setHelpfulClicked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setReviews(prev => prev.map(r =>
      r.id === id
        ? { ...r, helpful: r.helpful + (helpfulClicked.has(id) ? -1 : 1) }
        : r
    ));
  };

  const sorted = [...reviews].sort((a, b) => {
    if (sort === 'highest') return b.rating - a.rating;
    if (sort === 'lowest') return a.rating - b.rating;
    if (sort === 'helpful') return b.helpful - a.helpful;
    return 0;
  });

  const filtered = filter === 'all' ? sorted : sorted.filter(r => r.rating === parseInt(filter));

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';
  const recommendRate = reviews.length > 0 ? Math.round((reviews.filter(r => r.wouldRecommend).length / reviews.length) * 100) : 0;

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-1.5">My Reviews</h1>
        <p className="text-charcoal-400 text-sm">Your dining experiences and reviews shared with the community.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-charcoal-900">{reviews.length}</p>
          <p className="text-xs text-charcoal-400 mt-0.5">Reviews Written</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Star size={18} className="text-amber-400 fill-amber-400" />
            <p className="text-2xl font-bold text-charcoal-900">{avgRating}</p>
          </div>
          <p className="text-xs text-charcoal-400 mt-0.5">Avg Rating</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-charcoal-900">{reviews.reduce((s, r) => s + r.attendees, 0)}</p>
          <p className="text-xs text-charcoal-400 mt-0.5">Dinners Attended</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-brand-600">{recommendRate}%</p>
          <p className="text-xs text-charcoal-400 mt-0.5">Recommend Rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {[{ id: 'all', label: 'All' }, { id: '5', label: '5★' }, { id: '4', label: '4★' }, { id: '3', label: '3★' }].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-white border border-charcoal-100 text-charcoal-500 hover:border-charcoal-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          <SortDesc size={14} className="text-charcoal-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm bg-white border border-charcoal-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300 text-charcoal-600"
          >
            {sortOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div key={review.id} className="card p-5">
              {/* Restaurant Header */}
              <div className="flex items-start gap-3 mb-4">
                <img src={review.restaurantAvatar} alt={review.restaurant} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-charcoal-900 text-sm">{review.dinnerTitle}</h3>
                  <p className="text-xs text-charcoal-400 mt-0.5">{review.restaurant} · {review.date}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-charcoal-200'} />
                    ))}
                    {review.wouldRecommend && (
                      <span className="ml-2 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Recommended</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <h4 className="font-semibold text-charcoal-900 text-sm mb-1.5">{review.title}</h4>
              <p className="text-sm text-charcoal-500 leading-relaxed">{review.comment}</p>

              {/* Images */}
              {review.images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {review.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-20 h-20 rounded-xl object-cover border border-charcoal-100" />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-charcoal-50">
                <button
                  onClick={() => handleHelpful(review.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    helpfulClicked.has(review.id)
                      ? 'text-brand-500'
                      : 'text-charcoal-400 hover:text-charcoal-600'
                  }`}
                >
                  <ThumbsUp size={13} className={helpfulClicked.has(review.id) ? 'fill-brand-500' : ''} />
                  Helpful ({review.helpful})
                </button>
                <span className="flex items-center gap-1.5 text-xs text-charcoal-400">
                  <Users size={13} /> {review.attendees} attendees
                </span>
                <Link to={`/dinners/${review.id}`} className="ml-auto text-xs font-semibold text-brand-500 hover:text-brand-700">
                  View Dinner →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Star size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">
            {filter !== 'all' ? 'No reviews with this rating' : 'No reviews yet'}
          </p>
          <p className="text-charcoal-400 text-sm mt-1">
            {filter !== 'all' ? 'Try a different filter.' : 'Join a dinner and share your experience!'}
          </p>
          <Link to="/discover" className="inline-block mt-4 text-sm font-semibold text-brand-500 hover:text-brand-700">
            Explore Dinners →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
