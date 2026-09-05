import { useState, useEffect } from 'react';
import { reviewsAPI, restaurantsAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { Star, ThumbsUp, Loader } from 'lucide-react';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const { data: restData } = await restaurantsAPI.getMy();
      const { data } = await reviewsAPI.getAll({ restaurant: restData.data.id, limit: 50 });
      setReviews(data.data || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={14} className={s <= rating ? 'text-brand-500 fill-brand-500' : 'text-charcoal-200'} />
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3">
          <Star className="text-brand-500" /> Reviews & Ratings
        </h1>
        <p className="text-charcoal-400 mt-1">See what diners are saying about your restaurant.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
                  {review.reviewer?.name?.charAt(0)?.toUpperCase() || 'R'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-charcoal-900">{review.reviewer?.name}</p>
                      <p className="text-xs text-charcoal-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  {review.comment && <p className="text-charcoal-600 text-sm mb-3">{review.comment}</p>}

                  {/* Sub-ratings */}
                  <div className="flex flex-wrap gap-4 text-xs text-charcoal-500">
                    {review.foodRating && <span>Food: {review.foodRating}/5</span>}
                    {review.serviceRating && <span>Service: {review.serviceRating}/5</span>}
                    {review.ambianceRating && <span>Ambiance: {review.ambianceRating}/5</span>}
                    {review.valueRating && <span>Value: {review.valueRating}/5</span>}
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <ThumbsUp size={14} className="text-charcoal-400" />
                    <span className="text-xs text-charcoal-400">{review.helpfulCount} found helpful</span>
                    {review.isVerified && <span className="badge bg-green-50 text-green-600 text-xs">Verified</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Star} title="No reviews yet" description="Reviews from diners will appear here." />
      )}
    </div>
  );
};

export default ReviewsPage;
