import { useState, useEffect } from 'react';
import { reviewsAPI, restaurantsAPI } from '../../services/api';
import {
  Star, ThumbsUp, Loader, MessageSquare, Send, X,
  TrendingUp, TrendingDown, Filter, SortDesc,
  Heart, Award, Users, Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

const demoReviews = [
  { id: 'r1', reviewer: { name: 'Ahmed Khan', avatar: null }, rating: 5, comment: 'Absolutely incredible experience! The Italian Night was perfectly organized. The handmade pasta was divine and the host made everyone feel welcome. Will definitely be coming back!', foodRating: 5, serviceRating: 5, ambianceRating: 5, valueRating: 4, helpfulCount: 12, isVerified: true, createdAt: new Date(Date.now() - 2*86400000).toISOString(), ownerResponse: null },
  { id: 'r2', reviewer: { name: 'Sara Ali', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' }, rating: 4, comment: 'Great food and wonderful company. The sushi was fresh and beautifully presented. Only giving 4 stars because the venue was a bit cramped.', foodRating: 5, serviceRating: 4, ambianceRating: 3, valueRating: 4, helpfulCount: 8, isVerified: true, createdAt: new Date(Date.now() - 5*86400000).toISOString(), ownerResponse: null },
  { id: 'r3', reviewer: { name: 'Bilal Ahmed', avatar: null }, rating: 5, comment: 'Best BBQ dinner in town! The brisket was fall-off-the-bone tender. The rooftop views were stunning. Met some amazing food lovers here.', foodRating: 5, serviceRating: 5, ambianceRating: 5, valueRating: 5, helpfulCount: 15, isVerified: true, createdAt: new Date(Date.now() - 10*86400000).toISOString(), ownerResponse: 'Thank you so much Bilal! We\'re thrilled you enjoyed the BBQ evening. Looking forward to hosting you again!' },
  { id: 'r4', reviewer: { name: 'Fatima Noor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face' }, rating: 3, comment: 'Decent food but portions were quite small for the price. The avocado toast was great though! Nice atmosphere.', foodRating: 3, serviceRating: 4, ambianceRating: 4, valueRating: 2, helpfulCount: 3, isVerified: false, createdAt: new Date(Date.now() - 15*86400000).toISOString(), ownerResponse: null },
  { id: 'r5', reviewer: { name: 'Usman Tariq', avatar: null }, rating: 5, comment: 'The Mediterranean Feast was outstanding! Every course was perfectly prepared. The wine pairings were spot on. Highly recommend!', foodRating: 5, serviceRating: 5, ambianceRating: 5, valueRating: 5, helpfulCount: 20, isVerified: true, createdAt: new Date(Date.now() - 20*86400000).toISOString(), ownerResponse: 'Thank you Usman! Your kind words mean the world to our team. See you at the next dinner!' },
];

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    restaurantsAPI.getMy().then(restRes => {
      const restId = restRes.data?.data?.id;
      if (restId) return reviewsAPI.getAll({ restaurant: restId, limit: 50 });
      throw new Error('No restaurant');
    }).then(res => {
      const items = res.data?.data || [];
      setReviews(items.length > 0 ? items : demoReviews);
    }).catch(() => {
      setReviews(demoReviews);
    }).finally(() => setLoading(false));
  }, []);

  const handleRespond = async (reviewId) => {
    if (!responseText.trim()) return;
    setSubmitting(true);
    try {
      await reviewsAPI.respond(reviewId, { response: responseText });
      toast.success('Response posted!');
      setRespondingTo(null);
      setResponseText('');
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ownerResponse: responseText } : r));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';
  const fiveStar = reviews.filter(r => r.rating === 5).length;
  const fourStar = reviews.filter(r => r.rating === 4).length;
  const responded = reviews.filter(r => r.ownerResponse).length;
  const recommendRate = reviews.length > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) : 0;

  const filtered = reviews.filter(r => {
    if (filter === '5') return r.rating === 5;
    if (filter === '4') return r.rating === 4;
    if (filter === '3') return r.rating <= 3;
    if (filter === 'unresponded') return !r.ownerResponse;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length > 0 ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={13} className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-charcoal-200'} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal-900">Reviews & Ratings</h1>
        <p className="text-charcoal-400 text-sm mt-1">See what diners are saying about your restaurant.</p>
      </div>

      {/* Rating Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Overall */}
        <div className="card p-6 text-center">
          <p className="text-5xl font-bold text-charcoal-900 mb-1">{avgRating}</p>
          <div className="flex justify-center mb-2">{renderStars(Math.round(avgRating))}</div>
          <p className="text-sm text-charcoal-400">{reviews.length} reviews</p>
          <div className="mt-4 pt-4 border-t border-charcoal-100">
            <p className="text-sm font-semibold text-green-600">{recommendRate}% recommend</p>
          </div>
        </div>

        {/* Distribution */}
        <div className="card p-6">
          <h3 className="font-semibold text-charcoal-900 text-sm mb-4">Rating Distribution</h3>
          <div className="space-y-2.5">
            {ratingDistribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-charcoal-500 w-4">{star}</span>
                <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-charcoal-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-medium text-charcoal-600 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-charcoal-900 text-sm mb-2">Response Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal-500">Responded</span>
              <span className="text-sm font-semibold text-charcoal-900">{responded}/{reviews.length}</span>
            </div>
            <div className="w-full h-2 bg-charcoal-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${reviews.length > 0 ? (responded / reviews.length) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-charcoal-400">
              {reviews.length - responded > 0 ? `${reviews.length - responded} reviews need your response` : 'All reviews responded!'}
            </p>
          </div>
          <div className="pt-4 border-t border-charcoal-100 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal-500">Avg Food Rating</span>
              <span className="font-semibold text-charcoal-900">{reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.foodRating || r.rating), 0) / reviews.length).toFixed(1) : '—'}/5</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal-500">Avg Service Rating</span>
              <span className="font-semibold text-charcoal-900">{reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.serviceRating || r.rating), 0) / reviews.length).toFixed(1) : '—'}/5</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal-500">Avg Ambiance Rating</span>
              <span className="font-semibold text-charcoal-900">{reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.ambianceRating || r.rating), 0) / reviews.length).toFixed(1) : '—'}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All' },
            { id: '5', label: '5★' },
            { id: '4', label: '4★' },
            { id: '3', label: '3★ & below' },
            { id: 'unresponded', label: 'Needs Response' },
          ].map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f.id ? 'bg-brand-500 text-white' : 'bg-white border border-charcoal-100 text-charcoal-500 hover:border-charcoal-300'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          <SortDesc size={14} className="text-charcoal-400" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm bg-white border border-charcoal-100 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-300 text-charcoal-600">
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0 overflow-hidden">
                  {review.reviewer?.avatar ? (
                    <img src={review.reviewer.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    review.reviewer?.name?.charAt(0)?.toUpperCase() || 'R'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-charcoal-900 text-sm">{review.reviewer?.name}</p>
                      {review.isVerified && <span className="text-[10px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full">Verified</span>}
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-[10px] text-charcoal-400 mb-2">{new Date(review.createdAt).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  {review.comment && <p className="text-sm text-charcoal-600 leading-relaxed mb-3">{review.comment}</p>}

                  {/* Sub-ratings */}
                  {(review.foodRating || review.serviceRating || review.ambianceRating) && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {review.foodRating && <span className="text-[10px] text-charcoal-500 bg-cream-50 px-2 py-0.5 rounded-full">Food: {review.foodRating}/5</span>}
                      {review.serviceRating && <span className="text-[10px] text-charcoal-500 bg-cream-50 px-2 py-0.5 rounded-full">Service: {review.serviceRating}/5</span>}
                      {review.ambianceRating && <span className="text-[10px] text-charcoal-500 bg-cream-50 px-2 py-0.5 rounded-full">Ambiance: {review.ambianceRating}/5</span>}
                      {review.valueRating && <span className="text-[10px] text-charcoal-500 bg-cream-50 px-2 py-0.5 rounded-full">Value: {review.valueRating}/5</span>}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-charcoal-400">
                    <span className="flex items-center gap-1"><ThumbsUp size={12} /> {review.helpfulCount} helpful</span>
                    {!review.ownerResponse && (
                      <button onClick={() => { setRespondingTo(review.id); setResponseText(''); }} className="text-brand-500 font-medium hover:underline flex items-center gap-1 ml-auto">
                        <MessageSquare size={12} /> Respond
                      </button>
                    )}
                  </div>

                  {/* Owner Response */}
                  {review.ownerResponse && (
                    <div className="mt-3 p-3 bg-brand-50 rounded-xl border-l-2 border-brand-500">
                      <p className="text-[10px] font-bold text-brand-700 mb-1">Your Response</p>
                      <p className="text-sm text-charcoal-600">{review.ownerResponse}</p>
                    </div>
                  )}

                  {/* Response Form */}
                  {respondingTo === review.id && (
                    <div className="mt-3 p-3 bg-cream-50 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-charcoal-700">Write a Response</p>
                        <button onClick={() => setRespondingTo(null)} className="text-charcoal-400 hover:text-charcoal-600"><X size={14} /></button>
                      </div>
                      <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} className="input-field text-sm" rows={3} placeholder="Thank the reviewer for their feedback..." />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setRespondingTo(null)} className="btn-ghost text-xs">Cancel</button>
                        <button onClick={() => handleRespond(review.id)} disabled={submitting || !responseText.trim()} className="btn-primary text-xs flex items-center gap-1">
                          {submitting ? <Loader size={12} className="animate-spin" /> : <Send size={12} />}
                          Post Response
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Star size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">{filter !== 'all' ? 'No reviews match this filter' : 'No reviews yet'}</p>
          <p className="text-charcoal-400 text-sm mt-1">{filter !== 'all' ? 'Try a different filter.' : 'Reviews from diners will appear here.'}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
