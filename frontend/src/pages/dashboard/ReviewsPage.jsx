import { useState, useEffect } from 'react';
import { reviewsAPI, restaurantsAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { Star, ThumbsUp, Loader, MessageSquare, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const { data: restData } = await restaurantsAPI.getMy();
      const { data } = await reviewsAPI.getAll({ restaurant: restData.data.id, limit: 50 });
      setReviews(data.data || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const handleRespond = async (reviewId) => {
    if (!responseText.trim()) return;
    setSubmitting(true);
    try {
      await reviewsAPI.respond(reviewId, { response: responseText });
      toast.success('Response posted!');
      setRespondingTo(null);
      setResponseText('');
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post response');
    } finally {
      setSubmitting(false);
    }
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
                    {!review.ownerResponse && (
                      <button
                        onClick={() => { setRespondingTo(review.id); setResponseText(''); }}
                        className="text-xs text-brand-500 font-medium hover:underline flex items-center gap-1 ml-auto"
                      >
                        <MessageSquare size={12} /> Respond
                      </button>
                    )}
                  </div>

                  {/* Owner Response */}
                  {review.ownerResponse && (
                    <div className="mt-3 p-3 bg-brand-50 rounded-xl border-l-2 border-brand-500">
                      <p className="text-xs font-semibold text-brand-700 mb-1">Your Response</p>
                      <p className="text-sm text-charcoal-600">{review.ownerResponse}</p>
                      {review.respondedAt && (
                        <p className="text-xs text-charcoal-400 mt-1">{new Date(review.respondedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  )}

                  {/* Response Form */}
                  {respondingTo === review.id && (
                    <div className="mt-3 p-3 bg-cream-50 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-charcoal-700">Write a Response</p>
                        <button onClick={() => setRespondingTo(null)} className="text-charcoal-400 hover:text-charcoal-600">
                          <X size={14} />
                        </button>
                      </div>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        className="input-field text-sm"
                        rows={3}
                        placeholder="Thank the reviewer for their feedback..."
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setRespondingTo(null)} className="btn-ghost text-xs">Cancel</button>
                        <button
                          onClick={() => handleRespond(review.id)}
                          disabled={submitting || !responseText.trim()}
                          className="btn-primary text-xs flex items-center gap-1"
                        >
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
        <EmptyState icon={Star} title="No reviews yet" description="Reviews from diners will appear here." />
      )}
    </div>
  );
};

export default ReviewsPage;
