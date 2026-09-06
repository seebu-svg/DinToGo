import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dinnersAPI } from '../../services/api';
import {
  Plus, Calendar, MapPin, Users, Star, Clock,
  ChevronRight, Share2, MoreHorizontal, Eye, Settings,
  TrendingUp, Award, UserCheck, Sparkles, Loader,
  Heart, MessageCircle, Bookmark,
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

const tabs = [
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'hosted', label: 'Hosted', icon: Award },
  { id: 'joined', label: 'Joined', icon: UserCheck },
  { id: 'past', label: 'Past', icon: Clock },
];

// Demo data for high-fidelity mockup
const demoUpcoming = [
  {
    id: 'd1',
    title: 'Sunset Dining Experience',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
    restaurant: { name: 'The Sky Garden', verified: true, cuisine: 'Modern European', type: 'Fine Dining' },
    date: '2025-09-14T19:00:00',
    location: { venue: 'The Sky Garden', city: 'Islamabad, F-6' },
    host: { name: 'Ahsan Khan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', verified: true },
    attendees: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face',
    ],
    maxGuests: 8,
    currentGuests: 5,
    status: 'confirmed',
    offer: '20% OFF',
    description: 'An exclusive dining experience with amazing food, good vibes and great people. Limited seats!',
    type: 'public',
    price: 3500,
  },
  {
    id: 'd2',
    title: 'Italian Night at La Terrazza',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    restaurant: { name: 'La Terrazza', verified: true, cuisine: 'Italian', type: 'Mediterranean' },
    date: '2025-09-21T20:00:00',
    location: { venue: 'La Terrazza', city: 'Lahore, Gulberg' },
    host: { name: 'Ahsan Khan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', verified: true },
    attendees: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    ],
    maxGuests: 6,
    currentGuests: 4,
    status: 'confirmed',
    offer: '15% OFF',
    type: 'public',
    price: 2800,
  },
  {
    id: 'd3',
    title: 'BBQ & Beats',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    restaurant: { name: 'The Grill House', verified: true, cuisine: 'BBQ', type: 'Steakhouse' },
    date: '2025-09-27T19:30:00',
    location: { venue: 'The Grill House', city: 'Karachi, DHA' },
    host: { name: 'Ahsan Khan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', verified: true },
    attendees: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    ],
    maxGuests: 8,
    currentGuests: 3,
    status: 'pending',
    offer: '10% OFF',
    type: 'public',
    price: 2200,
  },
  {
    id: 'd4',
    title: 'Wine & Dine Experience',
    coverImage: 'https://images.unsplash.com/photo-1529543544006-1b1b5015e899?w=600&h=400&fit=crop',
    restaurant: { name: 'Olive & Oak', verified: true, cuisine: 'Continental', type: 'Fusion' },
    date: '2025-10-05T19:00:00',
    location: { venue: 'Olive & Oak', city: 'Islamabad, F-7' },
    host: { name: 'Ahsan Khan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', verified: true },
    attendees: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face',
    ],
    maxGuests: 8,
    currentGuests: 6,
    status: 'confirmed',
    offer: null,
    type: 'public',
    price: 4000,
  },
];

const demoPast = [
  {
    id: 'p1',
    title: 'Community Food Meetup',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    restaurant: { name: 'The Urban Bistro', cuisine: 'Continental' },
    date: '2025-08-12T19:00:00',
    location: { venue: 'The Urban Bistro', city: 'Lahore, MM Alam' },
    rating: 4.8,
    reviewCount: 6,
    attendees: 6,
    maxGuests: 8,
  },
  {
    id: 'p2',
    title: 'Sushi & Sake Night',
    coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    restaurant: { name: 'Sakura', cuisine: 'Japanese' },
    date: '2025-07-28T20:00:00',
    location: { venue: 'Sakura', city: 'Islamabad, Blue Area' },
    rating: 4.9,
    reviewCount: 8,
    attendees: 8,
    maxGuests: 8,
  },
  {
    id: 'p3',
    title: 'Rooftop Brunch Club',
    coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    restaurant: { name: 'Café Botanica', cuisine: 'Café' },
    date: '2025-07-14T11:00:00',
    location: { venue: 'Café Botanica', city: 'Lahore, DHA' },
    rating: 4.6,
    reviewCount: 4,
    attendees: 5,
    maxGuests: 6,
  },
];

const MyDinnersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try API first, fall back to demo data
    dinnersAPI.getAll({ limit: 20 }).then(res => {
      const items = res.data?.data || [];
      if (items.length > 0) {
        const now = new Date();
        setUpcoming(items.filter(d => new Date(d.date) >= now));
        setPast(items.filter(d => new Date(d.date) < now));
      } else {
        setUpcoming(demoUpcoming);
        setPast(demoPast);
      }
    }).catch(() => {
      setUpcoming(demoUpcoming);
      setPast(demoPast);
    }).finally(() => setLoading(false));
  }, []);

  const featuredDinner = upcoming[0];
  const regularUpcoming = upcoming.slice(1);

  const getDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'EEE, d MMM yyyy');
  };

  const getTimeStr = (dateStr) => format(new Date(dateStr), 'h:mm a');

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-8">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-1.5">My Dinners</h1>
          <p className="text-charcoal-400 text-sm max-w-lg">
            Manage your hosted and joined dinners, create new experiences and make unforgettable dining moments.
          </p>
        </div>
        <Link
          to="/dinners/create"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all duration-200 shrink-0"
        >
          <Plus size={16} /> Create Dinner
        </Link>
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-charcoal-100 p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-50'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* ── Upcoming Tab ──────────────────────────────────── */}
          {activeTab === 'upcoming' && (
            <div className="space-y-8">
              {/* Featured Dinner Card */}
              {featuredDinner && (
                <section className="card overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="relative lg:w-[45%] aspect-[4/3] lg:aspect-auto overflow-hidden">
                      <img
                        src={featuredDinner.coverImage}
                        alt={featuredDinner.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r" />
                      {/* Next Up Badge */}
                      <span className="absolute top-4 left-4 bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        Next Up
                      </span>
                      {/* Offer Badge */}
                      {featuredDinner.offer && (
                        <span className="absolute top-4 right-4 bg-white/95 text-brand-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          {featuredDinner.offer}
                        </span>
                      )}
                      {/* Bottom info on mobile */}
                      <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                        <h2 className="text-xl font-bold text-white mb-1">{featuredDinner.title}</h2>
                        <p className="text-white/80 text-sm">{featuredDinner.restaurant?.name || 'Restaurant'}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-6 lg:p-8 flex flex-col">
                      <div className="hidden lg:block mb-4">
                        <h2 className="text-2xl font-display font-bold text-charcoal-900 mb-1">{featuredDinner.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-charcoal-500">
                          <span className="font-medium text-charcoal-700">{featuredDinner.restaurant?.name || 'Restaurant'}</span>
                          {featuredDinner.restaurant?.verified && <UserCheck size={14} className="text-blue-500" />}
                          {featuredDinner.restaurant?.cuisine && (
                            <>
                              <span className="text-charcoal-300">•</span>
                              <span>{featuredDinner.restaurant.cuisine}</span>
                            </>
                          )}
                          {featuredDinner.restaurant?.type && (
                            <>
                              <span className="text-charcoal-300">•</span>
                              <span>{featuredDinner.restaurant.type}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                            <Calendar size={16} className="text-brand-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-charcoal-900">{getDateLabel(featuredDinner.date)}</p>
                            <p className="text-xs text-charcoal-400">{getTimeStr(featuredDinner.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                            <MapPin size={16} className="text-brand-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-charcoal-900">{featuredDinner.location?.venue || 'Location TBA'}</p>
                            <p className="text-xs text-charcoal-400">{featuredDinner.location?.city || ''}</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {featuredDinner.description && (
                        <p className="text-sm text-charcoal-500 mb-6 leading-relaxed">{featuredDinner.description}</p>
                      )}

                      {/* Host + Attendees Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pt-4 border-t border-charcoal-100">
                        {/* Host */}
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-brand-100">
                            <img src={featuredDinner.host.avatar} alt={featuredDinner.host.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-[10px] text-charcoal-400 uppercase tracking-wide font-medium">Hosted by</p>
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-semibold text-charcoal-900">{featuredDinner.host.name}</p>
                              {featuredDinner.host.verified && <UserCheck size={12} className="text-blue-500" />}
                            </div>
                          </div>
                        </div>

                        {/* Attendees */}
                        <div className="flex items-center gap-3 sm:ml-auto">
                          <div className="flex -space-x-2">
                            {featuredDinner.attendees.slice(0, 4).map((a, i) => (
                              <img key={i} src={a} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                            ))}
                            {featuredDinner.currentGuests > 4 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-charcoal-100 flex items-center justify-center text-[10px] font-bold text-charcoal-600">
                                +{featuredDinner.currentGuests - 4}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-charcoal-900">
                              {featuredDinner.currentGuests}/{featuredDinner.maxGuests} seats filled
                            </p>
                            <div className="w-24 h-1.5 bg-charcoal-100 rounded-full mt-1">
                              <div
                                className="h-full bg-brand-500 rounded-full transition-all"
                                style={{ width: `${(featuredDinner.currentGuests / featuredDinner.maxGuests) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2.5 mt-auto">
                        <Link
                          to={`/dinners/${featuredDinner.id}`}
                          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/25 transition-all duration-200"
                        >
                          <Eye size={15} /> View Details
                        </Link>
                        <button className="flex items-center gap-2 bg-white border border-charcoal-200 hover:border-charcoal-300 text-charcoal-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                          <Settings size={15} /> Manage
                        </button>
                        <button className="flex items-center gap-2 bg-white border border-charcoal-200 hover:border-charcoal-300 text-charcoal-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                          <Share2 size={15} /> Share
                        </button>
                        <button className="p-2.5 bg-white border border-charcoal-200 hover:border-charcoal-300 text-charcoal-400 rounded-xl transition-colors">
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Upcoming Dinners Grid */}
              {regularUpcoming.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-charcoal-900">Upcoming Dinners</h2>
                    <Link to="/dinners" className="text-brand-500 text-sm font-medium hover:underline flex items-center gap-1">
                      View All <ChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {regularUpcoming.map((d) => {
                      const spotsLeft = d.maxGuests - d.currentGuests;
                      return (
                        <div key={d.id} className="card group overflow-hidden flex flex-col">
                          {/* Image */}
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                              src={d.coverImage}
                              alt={d.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            {d.offer && (
                              <span className="absolute top-3 right-3 bg-white/95 text-brand-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                                {d.offer}
                              </span>
                            )}
                            <div className="absolute bottom-3 left-3 right-3">
                              <h3 className="font-bold text-white text-sm leading-tight line-clamp-1">{d.title}</h3>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="flex items-center gap-1.5 text-charcoal-500 text-xs mb-2">
                              <span className="font-semibold text-charcoal-700">{d.restaurant?.name || 'Restaurant'}</span>
                              {d.restaurant?.verified && <UserCheck size={11} className="text-blue-500" />}
                              {d.restaurant?.cuisine && (
                                <>
                                  <span className="text-charcoal-300">•</span>
                                  <span>{d.restaurant.cuisine}</span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-charcoal-400 text-xs mb-1">
                              <Calendar size={11} />
                              <span>{getDateLabel(d.date)} • {getTimeStr(d.date)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-charcoal-400 text-xs mb-3">
                              <MapPin size={11} />
                              <span className="truncate">{d.location?.city || d.location?.venue || 'Location TBA'}</span>
                            </div>

                            {/* Attendees + Status */}
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-charcoal-50">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-1.5">
                                  {d.attendees.slice(0, 3).map((a, i) => (
                                    <img key={i} src={a} alt="" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                                  ))}
                                </div>
                                <span className="text-xs text-charcoal-500 font-medium">
                                  {d.currentGuests}/{d.maxGuests}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                {d.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-3">
                              <Link
                                to={`/dinners/${d.id}`}
                                className="flex-1 text-center bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                              >
                                View
                              </Link>
                              <button className="flex-1 text-center bg-white border border-charcoal-200 hover:border-charcoal-300 text-charcoal-600 text-xs font-medium py-2 rounded-lg transition-colors">
                                Manage
                              </button>
                              <button className="p-2 bg-white border border-charcoal-200 hover:border-charcoal-300 text-charcoal-400 rounded-lg transition-colors">
                                <Share2 size={13} />
                              </button>
                              <button className="p-2 bg-white border border-charcoal-200 hover:border-charcoal-300 text-charcoal-400 rounded-lg transition-colors">
                                <MoreHorizontal size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ── Hosted Tab ────────────────────────────────────── */}
          {activeTab === 'hosted' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-charcoal-900">Dinners You've Hosted</h2>
                <span className="text-sm text-charcoal-400">{upcoming.length} total</span>
              </div>
              {upcoming.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcoming.map((d) => (
                    <div key={d.id} className="card group overflow-hidden flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img src={d.coverImage} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 bg-brand-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">Host</span>
                        {d.offer && (
                          <span className="absolute top-3 right-3 bg-white/95 text-brand-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow">{d.offer}</span>
                        )}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-bold text-white text-sm leading-tight line-clamp-1">{d.title}</h3>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5 text-charcoal-500 text-xs mb-2">
                          <span className="font-semibold text-charcoal-700">{d.restaurant?.name || 'Restaurant'}</span>
                          {d.restaurant?.cuisine && (
                            <>
                              <span className="text-charcoal-300">•</span>
                              <span>{d.restaurant.cuisine}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-charcoal-400 text-xs mb-1">
                          <Calendar size={11} />
                          <span>{getDateLabel(d.date)} • {getTimeStr(d.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-charcoal-400 text-xs mb-3">
                          <MapPin size={11} />
                          <span className="truncate">{d.location?.city || d.location?.venue || 'Location TBA'}</span>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-charcoal-50">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                              {d.attendees.slice(0, 3).map((a, i) => (
                                <img key={i} src={a} alt="" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                              ))}
                            </div>
                            <span className="text-xs text-charcoal-500 font-medium">{d.currentGuests}/{d.maxGuests}</span>
                          </div>
                          <span className="text-xs font-bold text-charcoal-900">Rs. {d.price?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <Award size={40} className="text-charcoal-200 mx-auto mb-3" />
                  <p className="text-charcoal-500 font-medium">You haven't hosted any dinners yet.</p>
                  <p className="text-charcoal-400 text-sm mt-1">Create your first dinner and start building your community.</p>
                  <Link to="/dinners/create" className="inline-flex items-center gap-2 mt-4 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                    <Plus size={15} /> Create Dinner
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ── Joined Tab ───────────────────────────────────── */}
          {activeTab === 'joined' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-charcoal-900">Dinners You've Joined</h2>
                <span className="text-sm text-charcoal-400">{upcoming.length} total</span>
              </div>
              {upcoming.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcoming.map((d) => (
                    <div key={d.id} className="card group overflow-hidden flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img src={d.coverImage} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">Joined</span>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-bold text-white text-sm leading-tight line-clamp-1">{d.title}</h3>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5 text-charcoal-500 text-xs mb-2">
                          <span className="font-semibold text-charcoal-700">{d.restaurant?.name || 'Restaurant'}</span>
                          {d.restaurant?.cuisine && (
                            <>
                              <span className="text-charcoal-300">•</span>
                              <span>{d.restaurant.cuisine}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-charcoal-400 text-xs mb-1">
                          <Calendar size={11} />
                          <span>{getDateLabel(d.date)} • {getTimeStr(d.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-charcoal-400 text-xs mb-3">
                          <MapPin size={11} />
                          <span className="truncate">{d.location?.city || d.location?.venue || 'Location TBA'}</span>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-charcoal-50">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                              {d.attendees.slice(0, 3).map((a, i) => (
                                <img key={i} src={a} alt="" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                              ))}
                            </div>
                            <span className="text-xs text-charcoal-500 font-medium">{d.currentGuests}/{d.maxGuests}</span>
                          </div>
                          <Link to={`/dinners/${d.id}`} className="text-brand-500 text-xs font-semibold hover:underline">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <UserCheck size={40} className="text-charcoal-200 mx-auto mb-3" />
                  <p className="text-charcoal-500 font-medium">You haven't joined any dinners yet.</p>
                  <p className="text-charcoal-400 text-sm mt-1">Browse upcoming dinners and join your first experience.</p>
                  <Link to="/discover" className="inline-flex items-center gap-2 mt-4 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                    <Sparkles size={15} /> Discover Dinners
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ── Past Tab ──────────────────────────────────────── */}
          {activeTab === 'past' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-charcoal-900">Past Dinners</h2>
                <span className="text-sm text-charcoal-400">{past.length} total</span>
              </div>
              {past.length > 0 ? (
                <div className="space-y-4">
                  {past.map((d) => (
                    <div key={d.id} className="card group overflow-hidden flex flex-col sm:flex-row">
                      {/* Thumbnail */}
                      <div className="relative sm:w-56 aspect-[16/10] sm:aspect-auto overflow-hidden shrink-0">
                        <img src={d.coverImage} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:bg-gradient-to-r" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-charcoal-900 text-base mb-1">{d.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-2">
                            <span className="font-medium text-charcoal-700">{d.restaurant?.name || 'Restaurant'}</span>
                            <span className="text-charcoal-300">•</span>
                            <span>{d.restaurant.cuisine}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-400">
                            <span className="flex items-center gap-1"><Calendar size={11} /> {getDateLabel(d.date)}</span>
                            <span className="flex items-center gap-1"><MapPin size={11} /> {d.location?.city || d.location?.venue || 'Location TBA'}</span>
                            <span className="flex items-center gap-1"><Users size={11} /> {d.attendees}/{d.maxGuests} attendees</span>
                          </div>
                        </div>

                        {/* Rating + Actions */}
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-center">
                            <div className="flex items-center gap-1 justify-center">
                              <Star size={16} className="text-brand-500 fill-brand-500" />
                              <span className="text-lg font-bold text-charcoal-900">{d.rating}</span>
                            </div>
                            <p className="text-[10px] text-charcoal-400">{d.reviewCount} reviews</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/dinners/${d.id}`}
                              className="text-xs font-semibold text-brand-500 hover:text-brand-700 border border-brand-200 hover:border-brand-300 px-3 py-2 rounded-lg transition-colors"
                            >
                              View Details
                            </Link>
                            <button className="p-2 text-charcoal-400 hover:text-charcoal-600 border border-charcoal-100 hover:border-charcoal-200 rounded-lg transition-colors">
                              <MoreHorizontal size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <Clock size={40} className="text-charcoal-200 mx-auto mb-3" />
                  <p className="text-charcoal-500 font-medium">No past dinners yet.</p>
                  <p className="text-charcoal-400 text-sm mt-1">Your completed dinner experiences will appear here.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyDinnersPage;
