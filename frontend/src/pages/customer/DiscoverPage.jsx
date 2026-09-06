import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { dinnersAPI, restaurantsAPI, usersAPI, resolveImageUrl } from '../../services/api';
import RestaurantCard from '../../components/RestaurantCard';
import InfluencerCard from '../../components/InfluencerCard';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import {
  Search, Compass, UtensilsCrossed, ChefHat, Users, Loader, MapPin,
  Tag, Star, Bookmark,
  Wine, Gift, Calendar, UserCheck, SlidersHorizontal,
  DollarSign, Sparkles, MoreHorizontal,
  LayoutGrid, List, ChevronDown,
} from 'lucide-react';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';

const tabs = [
  { id: 'dinners', label: 'Dinners' },
  { id: 'people', label: 'People' },
  { id: 'restaurants', label: 'Restaurants' },
  { id: 'influencers', label: 'Influencers' },
];

const demoDinners = [
  {
    id: 'd1', title: 'Italian Night Out', tag: 'Trending', tagColor: 'orange',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    host: { name: 'foodieshehryar', verified: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
    coHosts: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'],
    extraGuests: 6, location: { venue: 'Mamma Mia', city: 'Gulberg' },
    date: addDays(new Date(), 5).toISOString(), seatsLeft: 24,
    price: 2000, currency: 'Rs.', rating: 4.8,
  },
  {
    id: 'd2', title: "Chef's Table Experience", tag: 'Tomorrow', tagColor: 'orange',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    host: { name: 'chefusana', verified: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' },
    coHosts: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'],
    extraGuests: 4, location: { venue: 'The Forest Bistro', city: 'DHA' },
    date: addDays(new Date(), 1).toISOString(), seatsLeft: 18,
    price: 3500, currency: 'Rs.', rating: 4.9,
  },
  {
    id: 'd3', title: 'Sunday Brunch Club', tag: format(addDays(new Date(), 2), 'EEE, d MMM'), tagColor: 'green',
    coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop',
    host: { name: 'hungrytraveller', verified: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face' },
    coHosts: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'],
    extraGuests: 7, location: { venue: 'Café Botanica', city: 'DHA' },
    date: addDays(new Date(), 2).toISOString(), seatsLeft: 12,
    price: 1800, currency: 'Rs.', rating: 4.7,
  },
  {
    id: 'd4', title: 'Sushi & Sake Night', tag: 'Influencer Hosted', tagColor: 'purple',
    coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop',
    host: { name: 'bitesby.sana', verified: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face' },
    coHosts: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face'],
    extraGuests: 5, location: { venue: 'Sakura', city: 'Bahria Town' },
    date: addDays(new Date(), 4).toISOString(), seatsLeft: 16,
    price: 2500, currency: 'Rs.', rating: 4.8,
  },
  {
    id: 'd5', title: 'Global Cuisine Night', tag: 'Popular', tagColor: 'orange',
    coverImage: 'https://images.unsplash.com/photo-1529543544006-1b1b5015e899?w=600&h=400&fit=crop',
    host: { name: 'foodieshehryar', verified: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
    coHosts: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'],
    extraGuests: 9, location: { venue: 'Spice Bazaar', city: 'Lahore' },
    date: addDays(new Date(), 5).toISOString(), seatsLeft: 20,
    price: 2200, currency: 'Rs.', rating: 4.6,
  },
  {
    id: 'd6', title: 'BBQ & Beats', tag: 'Next Week', tagColor: 'green',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    host: { name: 'chefsofpakistan', verified: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' },
    coHosts: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face'],
    extraGuests: 9, location: { venue: 'The Patio', city: 'Lahore' },
    date: addDays(new Date(), 10).toISOString(), seatsLeft: 24,
    price: 2000, currency: 'Rs.', rating: 4.7,
  },
];

const popularInfluencers = [
  { id: 1, name: 'Foodieshehryar', role: 'Food Blogger', followers: '96K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', verified: true },
  { id: 2, name: 'Bites By Sana', role: 'Food Creator', followers: '82K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', verified: true },
  { id: 3, name: 'Hungry Traveller', role: 'Travel & Food', followers: '128K', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', verified: true },
  { id: 4, name: 'ChefsOfPakistan', role: 'Chef', followers: '54K', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', verified: true },
];

const exclusiveOffers = [
  { title: '20% OFF', desc: 'For groups of 4+ people', venue: 'Mamma Mia, Gulberg', icon: Tag, validTill: '31 May 2024' },
  { title: 'Free Dessert', desc: 'For first-time DinToGo users', venue: 'The Forest Bistro, DHA', icon: Gift, validTill: '15 Jun 2024' },
  { title: 'Happy Hours', desc: '15% OFF on all drinks', venue: 'Café Botanica, DHA', icon: Wine, validTill: 'Everyday 4–7 PM' },
];

const trendingCuisines = [
  { label: 'Italian', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=80&h=80&fit=crop' },
  { label: 'Asian', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=80&h=80&fit=crop' },
  { label: 'Middle Eastern', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80&h=80&fit=crop' },
  { label: 'Mexican', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=80&h=80&fit=crop' },
];

const tagColorMap = {
  orange: 'bg-brand-500 text-white',
  green: 'bg-green-500 text-white',
  purple: 'bg-purple-500 text-white',
  blue: 'bg-blue-500 text-white',
};

const DiscoverPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('dinners');
  const [dinners, setDinners] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter states
  const [filterLocation, setFilterLocation] = useState('Lahore, Pakistan');
  const [filterDate, setFilterDate] = useState('Anytime');
  const [filterCuisine, setFilterCuisine] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterGroup, setFilterGroup] = useState('2+ People');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { limit: 24 };
      if (tab === 'dinners') {
        const { data } = await dinnersAPI.getAll(params);
        const items = data.data || [];
        setDinners(items.length > 0 ? items : []);
      } else if (tab === 'restaurants') {
        const { data } = await restaurantsAPI.getAll({ limit: 24 });
        setRestaurants(data.data || []);
      } else if (tab === 'influencers') {
        const { data } = await usersAPI.getInfluencers({ limit: 24 });
        setInfluencers(data.data || []);
      } else if (tab === 'people') {
        const { data } = await usersAPI.getAll({ limit: 24 });
        setPeople(data.data || []);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  // Use API dinners if available, else fall back to demo data
  const displayDinners = dinners.length > 0 ? dinners.map(d => ({
    id: d.id,
    title: d.title,
    tag: d.isInfluencerHosted ? 'Influencer Hosted' : d.category === 'fine-dining' ? 'Trending' : d.category === 'themed' ? 'Popular' : null,
    tagColor: d.isInfluencerHosted ? 'purple' : d.category === 'fine-dining' ? 'orange' : 'orange',
    coverImage: d.coverImage || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    host: { name: d.host?.name || 'Host', verified: !!d.host?.influencerData, avatar: d.host?.avatar },
    guestAvatars: d.guestAvatars || [],
    coHosts: [],
    extraGuests: Math.max(0, (d.currentGuests || 1) - 4),
    location: d.location || { venue: 'TBA', city: '' },
    date: d.date,
    seatsLeft: (d.maxGuests || 0) - (d.currentGuests || 0),
    price: d.price || 0,
    currency: 'Rs.',
    rating: d.ratings?.average || d.ratingAverage || 4.5,
    type: d.type,
    category: d.category,
    maxGuests: d.maxGuests,
    currentGuests: d.currentGuests,
    isInfluencerHosted: d.isInfluencerHosted,
    ratings: d.ratings,
  })) : demoDinners;

  const FilterDropdown = ({ value, onChange, options, icon: Icon }) => (
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none" />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none bg-white border border-charcoal-100 rounded-xl text-sm font-medium text-charcoal-700 py-2 ${Icon ? 'pl-8' : 'pl-3'} pr-8 focus:outline-none focus:ring-2 focus:ring-brand-300 cursor-pointer hover:border-charcoal-300 transition-colors`}
      >
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6">
      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6 border-b border-charcoal-100">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              tab === id
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

          {/* Filters Row */}
          {tab === 'dinners' && (
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <FilterDropdown value={filterLocation} onChange={setFilterLocation} options={['Lahore, Pakistan', 'Karachi, Pakistan', 'Islamabad, Pakistan']} icon={MapPin} />
              <FilterDropdown value={filterDate} onChange={setFilterDate} options={['Anytime', 'Tonight', 'This Weekend', 'Next Week', 'This Month']} icon={Calendar} />
              <FilterDropdown value={filterCuisine} onChange={setFilterCuisine} options={['All', 'Italian', 'Asian', 'Middle Eastern', 'Mexican', 'Continental']} icon={ChefHat} />
              <FilterDropdown value={filterPrice} onChange={setFilterPrice} options={['All', 'Under Rs. 1,000', 'Rs. 1,000–3,000', 'Rs. 3,000+']} icon={DollarSign} />
              <FilterDropdown value={filterGroup} onChange={setFilterGroup} options={['2+ People', '4+ People', '6+ People', '10+ People']} icon={Users} />
              <FilterDropdown value={filterType} onChange={setFilterType} options={['All', 'Public', 'Private']} />
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-charcoal-500 bg-white border border-charcoal-100 rounded-xl hover:border-charcoal-300 transition-colors">
                <SlidersHorizontal size={14} /> More Filters
              </button>
              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-charcoal-500">
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="font-semibold text-charcoal-800 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option>Recommended</option>
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Highest Rated</option>
                  </select>
                </div>
                <div className="flex items-center border border-charcoal-100 rounded-lg overflow-hidden">
                  <button className="p-1.5 bg-brand-50 text-brand-600"><LayoutGrid size={14} /></button>
                  <button className="p-1.5 text-charcoal-400 hover:text-charcoal-600"><List size={14} /></button>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* ── Dinners Tab ── */}
              {tab === 'dinners' && (
                <div>
                  {displayDinners.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {displayDinners.slice(0, visibleCount).map((d) => (
                          <Link key={d.id} to={`/dinners/${d.id}`} className="card group block overflow-hidden">
                            {/* Image */}
                            <div className="relative aspect-[3/2] overflow-hidden">
                              <img
                                src={d.coverImage}
                                alt={d.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                              {/* Top row: Tag + Bookmark */}
                              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                {d.tag && (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${tagColorMap[d.tagColor] || tagColorMap.orange}`}>
                                    {d.tag}
                                  </span>
                                )}
                              </div>
                              <button
                                className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                onClick={(e) => e.preventDefault()}
                              >
                                <Bookmark size={13} className="text-charcoal-600" />
                              </button>

                              {/* Price pill */}
                              {d.price > 0 && (
                                <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                  <span className="text-xs font-bold text-charcoal-900">{d.currency || 'Rs.'} {d.price?.toLocaleString()}</span>
                                </div>
                              )}

                              {/* Guest avatar stack on image */}
                              <div className="absolute bottom-2.5 left-2.5 flex items-center -space-x-1.5">
                                {(d.guestAvatars?.length > 0 ? d.guestAvatars : d.host?.avatar ? [{ avatar: d.host.avatar }] : []).slice(0, 3).map((g, i) => (
                                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-brand-100 flex items-center justify-center">
                                    {g.avatar ? (
                                      <img src={resolveImageUrl(g.avatar)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-brand-600 text-[7px] font-bold">{g.name?.charAt(0)?.toUpperCase()}</span>
                                    )}
                                  </div>
                                ))}
                                {d.extraGuests > 0 && (
                                  <span className="ml-2 text-white text-[10px] font-semibold drop-shadow-md">+{d.extraGuests}</span>
                                )}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="px-3.5 pt-3 pb-3.5">
                              <h3 className="font-semibold text-charcoal-900 text-sm leading-tight mb-1.5 line-clamp-1 group-hover:text-brand-600 transition-colors">{d.title}</h3>

                              <div className="flex items-center gap-1 text-charcoal-400 text-xs mb-1.5">
                                <MapPin size={11} className="shrink-0" />
                                <span className="line-clamp-1">{d.location?.venue}{d.location?.city ? `, ${d.location.city}` : ''}</span>
                              </div>

                              <div className="flex items-center gap-1 text-charcoal-400 text-xs mb-3">
                                <Calendar size={11} className="shrink-0" />
                                <span>{format(new Date(d.date), 'EEE, d MMM')} &middot; {format(new Date(d.date), 'h:mm a')}</span>
                              </div>

                              {/* Bottom row: Seats + Rating */}
                              <div className="flex items-center justify-between pt-2.5 border-t border-charcoal-50">
                                <span className={`text-xs font-medium ${d.seatsLeft <= 5 ? 'text-red-500' : 'text-charcoal-500'}`}>
                                  {d.seatsLeft} {d.seatsLeft === 1 ? 'seat' : 'seats'} left
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <Star size={12} className="text-brand-500 fill-brand-500" />
                                  <span className="text-xs font-semibold text-charcoal-700">{d.rating}</span>
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Load More */}
                      {visibleCount < displayDinners.length && (
                        <div className="text-center mt-8">
                          <button
                            onClick={() => setVisibleCount(v => v + 6)}
                            className="text-brand-500 text-sm font-semibold hover:text-brand-700 flex items-center gap-1 mx-auto"
                          >
                            Load More Dinners <ChevronDown size={16} />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <EmptyState icon={UtensilsCrossed} title="No dinners found" description="Try adjusting your filters or check back later." />
                  )}
                </div>
              )}

              {/* ── People Tab ── */}
              {tab === 'people' && (
                people.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {people.map((u) => (
                      <Link key={u.id} to={`/profile/${u.id}`} className="card group p-5 text-center">
                        <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-2xl font-bold mx-auto mb-3 group-hover:scale-110 transition-transform">
                          {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" /> : u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <h3 className="font-semibold text-charcoal-900">{u.name}</h3>
                        {u.bio && <p className="text-xs text-charcoal-400 mt-1 line-clamp-2">{u.bio}</p>}
                        <div className="flex items-center justify-center gap-3 mt-3 text-xs text-charcoal-500">
                          <span>{u.followerCount || 0} followers</span>
                          {u.influencerData && <span className="badge-orange text-[10px]">Creator</span>}
                        </div>
                        <button className="mt-3 w-full text-brand-500 text-xs font-semibold py-2 rounded-xl border border-brand-200 hover:bg-brand-50 transition-colors">View Profile</button>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={Users} title="No people found" description="Try a different search term." />
                )
              )}

              {/* ── Restaurants Tab ── */}
              {tab === 'restaurants' && (
                restaurants.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
                  </div>
                ) : (
                  <EmptyState icon={ChefHat} title="No restaurants found" description="Try a different search term." />
                )
              )}

              {/* ── Influencers Tab ── */}
              {tab === 'influencers' && (
                <>
                  <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-6 mb-6 flex items-center gap-6">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-1">Top Influencers</h2>
                      <p className="text-brand-100 text-sm mb-3">Discover food influencers hosting exclusive dinners near you.</p>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Sparkles size={14} /> <span>Influencer-hosted dinners & invite-only events</span>
                      </div>
                    </div>
                  </div>
                  {influencers.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {influencers.map((u) => <InfluencerCard key={u.id} user={u} />)}
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {popularInfluencers.map((inf) => (
                        <div key={inf.id} className="card group block text-center p-6">
                          <img src={inf.avatar} alt={inf.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 group-hover:scale-110 transition-transform" />
                          <h3 className="font-semibold text-charcoal-900 text-lg">{inf.name}</h3>
                          <span className="badge-orange mt-2 inline-block">{inf.role}</span>
                          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-charcoal-500">
                            <div className="flex items-center gap-1"><Users size={14} /><span>{inf.followers} Followers</span></div>
                            {inf.verified && <UserCheck size={14} className="text-blue-500" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
    </div>
  );
};

export default DiscoverPage;
