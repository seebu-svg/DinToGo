import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dinnersAPI, reviewsAPI, chatAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Calendar, MapPin, Users, Star, Clock, ChefHat, Share2, Heart,
  ArrowLeft, MessageCircle, Loader, Link2, Copy, Check, Send,
  ExternalLink, Tag, Gift, Lock, Globe, UserCheck, ThumbsUp,
} from 'lucide-react';

const DinnerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [dinner, setDinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [showChat, setShowChat] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchDinner();
    fetchReviews();
  }, [id]);

  const fetchDinner = async () => {
    try {
      const { data } = await dinnersAPI.getById(id);
      setDinner(data.data);
    } catch {
      toast.error('Failed to load dinner');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await reviewsAPI.getAll({ dinnerId: id, limit: 10 });
      setReviews(data.data || []);
    } catch {
      // no reviews yet
    }
  };

  const fetchChat = async () => {
    if (!dinner?.chatGroup?.id) return;
    try {
      const { data } = await chatAPI.getById(dinner.chatGroup.id);
      setChatMessages(data.data?.messages || []);
    } catch {
      // chat not available
    }
  };

  const handleJoin = async () => {
    if (!isAuthenticated) { toast.error('Please log in to join'); return; }
    setJoining(true);
    try {
      await dinnersAPI.join(id, { partySize: 1 });
      toast.success('You joined the dinner!');
      fetchDinner();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not join');
    } finally { setJoining(false); }
  };

  const handleLeave = async () => {
    setJoining(true);
    try {
      await dinnersAPI.leave(id);
      toast.success('You left the dinner.');
      fetchDinner();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not leave');
    } finally { setJoining(false); }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/dinners/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Invite link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: dinner.title, text: `Join me at ${dinner.title}!`, url: `${window.location.origin}/dinners/${id}` });
      } catch { /* cancelled */ }
    } else {
      handleCopyLink();
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !dinner?.chatGroup?.id) return;
    try {
      await chatAPI.sendMessage(dinner.chatGroup.id, { content: newMessage });
      setNewMessage('');
      fetchChat();
    } catch {
      toast.error('Could not send message');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await reviewsAPI.create({ dinnerId: id, ...reviewForm });
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!dinner) {
    return (
      <div className="page-container text-center py-20">
        <h2 className="text-2xl font-bold text-charcoal-900 mb-4">Dinner not found</h2>
        <Link to="/dinners" className="btn-primary">Browse Dinners</Link>
      </div>
    );
  }

  const isHost = user?.id === dinner.host?.id;
  const isAttending = dinner.attendees?.some((a) => a.userId === user?.id);
  const spotsLeft = dinner.maxGuests - dinner.currentGuests;
  const isFull = spotsLeft <= 0;
  const placeholderImg = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop';
  const progressPercent = dinner.maxGuests > 0 ? (dinner.currentGuests / dinner.maxGuests) * 100 : 0;

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'guests', label: `Guests (${dinner.currentGuests}/${dinner.maxGuests})` },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  return (
    <div>
      {/* Hero Image */}
      <div className="relative h-72 md:h-[28rem]">
        <img src={dinner.coverImage || placeholderImg} alt={dinner.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2.5 rounded-xl transition-colors">
              <Share2 size={18} />
            </button>
            <button onClick={handleCopyLink} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2.5 rounded-xl transition-colors">
              {copied ? <Check size={18} /> : <Link2 size={18} />}
            </button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {dinner.type === 'private' && (
                <span className="flex items-center gap-1 badge bg-white/90 text-charcoal-800 backdrop-blur-sm"><Lock size={10} /> Private</span>
              )}
              {dinner.isInfluencerHosted && (
                <span className="flex items-center gap-1 badge bg-brand-500/90 text-white backdrop-blur-sm"><UserCheck size={10} /> Influencer Hosted</span>
              )}
              <span className="badge bg-white/80 text-charcoal-700 backdrop-blur-sm capitalize">{dinner.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{dinner.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5"><Calendar size={15} /> {format(new Date(dinner.date), 'EEEE, MMMM d, yyyy')}</span>
              <span className="flex items-center gap-1.5"><Clock size={15} /> {format(new Date(dinner.date), 'h:mm a')} ({dinner.duration || 120} min)</span>
              {dinner.location?.venue && (
                <span className="flex items-center gap-1.5"><MapPin size={15} /> {dinner.location.venue}{dinner.location.city ? `, ${dinner.location.city}` : ''}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-soft">
              {tabs.map(({ id: tId, label }) => (
                <button
                  key={tId}
                  onClick={() => setActiveTab(tId)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tId ? 'bg-brand-500 text-white' : 'text-charcoal-500 hover:bg-cream-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Description */}
                <div className="card p-8">
                  <h3 className="font-semibold text-charcoal-800 mb-3">About This Dinner</h3>
                  <p className="text-charcoal-600 leading-relaxed">{dinner.description || 'No description provided.'}</p>

                  {dinner.cuisine?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-charcoal-700 mb-2">Cuisine</h4>
                      <div className="flex flex-wrap gap-2">
                        {dinner.cuisine.map((c) => <span key={c} className="badge-orange">{c}</span>)}
                      </div>
                    </div>
                  )}

                  {dinner.tags?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-charcoal-700 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {dinner.tags.map((t) => <span key={t} className="badge-charcoal">#{t}</span>)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Menu */}
                {dinner.menu?.length > 0 && (
                  <div className="card p-8">
                    <h3 className="font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
                      <ChefHat size={18} className="text-brand-500" /> Menu
                    </h3>
                    <div className="space-y-3">
                      {dinner.menu.map((item, i) => (
                        <div key={i} className="flex justify-between items-start py-3 border-b border-charcoal-50 last:border-0">
                          <div className="flex-1">
                            <p className="font-medium text-charcoal-800">{item.name}</p>
                            {item.description && <p className="text-xs text-charcoal-400 mt-0.5">{item.description}</p>}
                          </div>
                          {item.price > 0 && (
                            <span className="text-brand-600 font-semibold ml-4">${item.price}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Invite Link Card */}
                {isAttending && (
                  <div className="card p-6 bg-gradient-to-r from-brand-50 to-cream-50 border-brand-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Link2 size={18} className="text-brand-500" />
                      <h3 className="font-semibold text-charcoal-800">Invite Friends</h3>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white border border-charcoal-100 rounded-xl px-4 py-2.5 text-sm text-charcoal-600 truncate">
                        {window.location.origin}/dinners/{id}
                      </div>
                      <button onClick={handleCopyLink} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Guests Tab */}
            {activeTab === 'guests' && (
              <div className="card p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-charcoal-800 flex items-center gap-2">
                    <Users size={18} className="text-brand-500" /> Guests
                  </h3>
                  <span className={`text-sm font-semibold ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                    {isFull ? 'Full' : `${spotsLeft} spots left`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-charcoal-400 mb-1.5">
                    <span>{dinner.currentGuests} of {dinner.maxGuests} seats filled</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="h-3 bg-charcoal-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-400' : 'bg-brand-500'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {dinner.attendees?.length > 0 ? (
                  <div className="space-y-3">
                    {dinner.attendees.map((a) => (
                      <Link key={a.userId} to={`/profile/${a.userId}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold shrink-0">
                          {a.user?.avatar ? (
                            <img src={a.user.avatar} alt={a.user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            a.user?.name?.charAt(0)?.toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-charcoal-900">{a.user?.name}</p>
                          <p className="text-xs text-charcoal-400">
                            {a.partySize > 1 ? `${a.partySize} guests` : '1 guest'}
                            {a.joinedAt && ` • Joined ${format(new Date(a.joinedAt), 'MMM d')}`}
                          </p>
                        </div>
                        {a.userId === dinner.host?.id && (
                          <span className="text-[10px] font-bold text-brand-500 bg-brand-50 px-2 py-0.5 rounded-full">HOST</span>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-charcoal-400">No guests yet. Be the first to join!</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Leave a Review (if attended) */}
                {isAttending && !isHost && (
                  <div className="card p-6">
                    <h3 className="font-semibold text-charcoal-800 mb-4">Leave a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-xs text-charcoal-400 mb-2">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                            >
                              <Star
                                size={24}
                                className={s <= reviewForm.rating ? 'text-brand-500 fill-brand-500' : 'text-charcoal-200'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="input-field min-h-[80px]"
                        placeholder="Share your experience..."
                      />
                      <button type="submit" disabled={submittingReview} className="btn-primary text-sm">
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="card p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                            {r.user?.name?.charAt(0)?.toUpperCase() || 'R'}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-charcoal-900 text-sm">{r.user?.name || 'Reviewer'}</p>
                            <p className="text-xs text-charcoal-400">{r.createdAt && format(new Date(r.createdAt), 'MMM d, yyyy')}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < r.rating ? 'text-brand-500 fill-brand-500' : 'text-charcoal-200'}
                              />
                            ))}
                          </div>
                        </div>
                        {r.comment && <p className="text-sm text-charcoal-600">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <Star size={32} className="mx-auto text-charcoal-200 mb-3" />
                    <p className="text-charcoal-400">No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            )}

            {/* Group Chat Section */}
            {isAttending && (
              <div className="card p-6">
                <button
                  onClick={() => { setShowChat(!showChat); if (!showChat) fetchChat(); }}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                      <MessageCircle size={18} className="text-brand-500" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-charcoal-800">Group Chat</h3>
                      <p className="text-xs text-charcoal-400">Chat with other guests attending this dinner</p>
                    </div>
                  </div>
                  <span className="text-charcoal-300">{showChat ? '▼' : '▶'}</span>
                </button>

                {showChat && (
                  <div className="mt-4 border-t border-charcoal-100 pt-4">
                    <div className="bg-cream-50 rounded-xl p-4 max-h-64 overflow-y-auto space-y-3 mb-4">
                      {chatMessages.length === 0 ? (
                        <p className="text-sm text-charcoal-400 text-center py-4">No messages yet. Say hello!</p>
                      ) : (
                        chatMessages.map((msg, i) => (
                          <div key={i} className={`flex gap-2 ${msg.userId === user?.id ? 'flex-row-reverse' : ''}`}>
                            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-[10px] font-bold shrink-0">
                              {msg.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                              msg.userId === user?.id ? 'bg-brand-500 text-white' : 'bg-white text-charcoal-700'
                            }`}>
                              <p>{msg.content}</p>
                              <p className={`text-[10px] mt-0.5 ${msg.userId === user?.id ? 'text-white/60' : 'text-charcoal-400'}`}>
                                {msg.createdAt && format(new Date(msg.createdAt), 'h:mm a')}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 input-field text-sm"
                        placeholder="Type a message..."
                      />
                      <button onClick={handleSendMessage} className="bg-brand-500 hover:bg-brand-600 text-white p-2.5 rounded-xl transition-colors">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-5">
                {dinner.price > 0 ? (
                  <>
                    <p className="text-3xl font-bold text-charcoal-900">${dinner.price}</p>
                    <p className="text-sm text-charcoal-400">per person</p>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-brand-600">Free</p>
                )}
              </div>

              {/* Availability */}
              <div className="bg-cream-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-charcoal-500">Availability</span>
                  <span className={`font-semibold ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                    {isFull ? 'Full' : `${spotsLeft} spots left`}
                  </span>
                </div>
                <div className="h-2.5 bg-charcoal-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isFull ? 'bg-red-400' : 'bg-brand-500'}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isAttending ? (
                <div className="space-y-3">
                  <div className="text-center text-green-600 font-semibold text-sm flex items-center justify-center gap-1.5 mb-1">
                    <Check size={14} /> You're attending!
                  </div>
                  <button onClick={handleShare} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Share2 size={14} /> Invite Friends
                  </button>
                  {!isHost && (
                    <button
                      onClick={handleLeave}
                      disabled={joining}
                      className="btn-outline w-full text-center text-red-500 border-red-200 hover:bg-red-50"
                    >
                      Leave Dinner
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={joining || isFull || !isAuthenticated}
                  className="btn-primary w-full text-center"
                >
                  {joining ? 'Joining...' : isFull ? 'Dinner Full' : 'Join This Dinner'}
                </button>
              )}

              {/* Host Info */}
              {dinner.host && (
                <div className="mt-6 pt-6 border-t border-charcoal-100">
                  <p className="text-xs text-charcoal-400 mb-3">Hosted by</p>
                  <Link to={`/profile/${dinner.host.id}`} className="flex items-center gap-3 hover:bg-cream-50 rounded-xl p-2 -mx-2 transition-all">
                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                      {dinner.host.avatar ? (
                        <img src={dinner.host.avatar} alt={dinner.host.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        dinner.host.name?.charAt(0)?.toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-charcoal-900">{dinner.host.name}</p>
                        {dinner.host.influencerData && <UserCheck size={12} className="text-blue-500" />}
                      </div>
                      {dinner.host.bio && <p className="text-xs text-charcoal-400 line-clamp-1">{dinner.host.bio}</p>}
                    </div>
                  </Link>
                </div>
              )}

              {/* Rating */}
              {dinner.ratings?.average > 0 && (
                <div className="mt-4 pt-4 border-t border-charcoal-100">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.round(dinner.ratings.average) ? 'text-brand-500 fill-brand-500' : 'text-charcoal-200'}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-charcoal-900">{dinner.ratings.average.toFixed(1)}</span>
                    <span className="text-sm text-charcoal-400">({dinner.ratings.count} reviews)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DinnerDetailPage;
