import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { dinnersAPI, restaurantsAPI, usersAPI } from '../../services/api';
import RestaurantCard from '../../components/RestaurantCard';
import InfluencerCard from '../../components/InfluencerCard';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import {
  Search, Home, Compass, UtensilsCrossed, ChefHat, Users, Loader, MapPin,
  Tag, ChevronRight, ChevronDown, Star, Bookmark,
  Wine, Gift, Calendar, UserCheck, SlidersHorizontal,
  DollarSign, Sparkles, Plus, MessageCircle, Bell,
  LayoutGrid, List, MoreHorizontal,
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
  const [search, setSearch] = useState('');
  const [dinners, setDinners] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const searchRef = useRef(null);

  // ⌘K / Ctrl+K focuses the search bar
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
  }, [tab, search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { search, limit: 24 };
      if (tab === 'dinners') {
        const { data } = await dinnersAPI.getAll(params);
        const items = data.data || [];
        setDinners(items.length > 0 ? items : []);
      } else if (tab === 'restaurants') {
        const { data } = await restaurantsAPI.getAll({ search, limit: 24 });
        setRestaurants(data.data || []);
      } else if (tab === 'influencers') {
        const { data } = await usersAPI.getInfluencers({ search, limit: 24 });
        setInfluencers(data.data || []);
      } else if (tab === 'people') {
        const { data } = await usersAPI.getAll({ search, limit: 24 });
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
    host: { name: d.host?.name || 'Host', verified: d.host?.role === 'influencer', avatar: d.host?.avatar },
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
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-charcoal-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)] shrink-0">
        <div className="flex items-center gap-3 lg:gap-5 h-16 px-4 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <div className="hidden lg:block">
              <span className="text-lg font-display font-bold text-charcoal-900 leading-none tracking-tight">DinToGo</span>
              <p className="text-[10px] text-brand-500 font-medium leading-tight mt-0.5">Good Food Is Better Together.</p>
            </div>
          </Link>

          <div className="hidden lg:block h-8 w-px bg-charcoal-100 shrink-0" />

          {/* Location */}
          <button className="hidden md:flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50 px-3 py-2 rounded-full transition-colors shrink-0">
            <MapPin size={15} className="text-brand-500" /> <span>Lahore, Pakistan</span> <ChevronRight size={12} className="rotate-90 text-charcoal-300" />
          </button>

          {/* Full-width Search */}
          <div className="flex-1 min-w-0 relative group">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300 group-focus-within:text-brand-500 transition-colors" />
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dinners, restaurants, people, influencers..."
              className="w-full pl-11 pr-14 md:pr-20 py-2.5 bg-cream-50 border border-charcoal-100 rounded-full text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10 transition-all duration-200"
            />
            <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center text-[10px] font-semibold text-charcoal-400 bg-white border border-charcoal-100 rounded-md px-1.5 py-0.5 shadow-sm pointer-events-none">⌘K</kbd>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
            <Link to="/dinners/create" className="hidden sm:flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 lg:px-5 py-2.5 rounded-full shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all duration-200">
              <Plus size={15} /> Create Dinner
            </Link>
            <Link to="/messages" className="relative p-2.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-50 rounded-full transition-colors">
              <MessageCircle size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">3</span>
            </Link>
            <Link to="/notifications" className="relative p-2.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">3</span>
            </Link>

            <div className="hidden sm:block w-px h-6 bg-charcoal-100 mx-0.5" />

            <Link to="/profile" className="flex items-center gap-2 p-1 pr-2.5 rounded-full hover:bg-cream-50 transition-colors shrink-0">
              <div className="w-9 h-9 rounded-full bg-brand-100 ring-2 ring-white shadow-sm overflow-hidden flex items-center justify-center text-brand-600 text-sm font-bold">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'A'
                )}
              </div>
              <span className="hidden md:block text-sm font-semibold text-charcoal-700 max-w-[120px] truncate">{user?.name || 'Ali Raza'}</span>
              <ChevronDown size={14} className="hidden md:block text-charcoal-400" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── 3-Column Layout ── */}
      <div className="flex-1 flex min-h-0">
        {/* ── Left Sidebar ── */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-charcoal-100 bg-white p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-1 flex-1">
            {[
              { to: '/', label: 'Home', icon: Home },
              { to: '/discover', label: 'Discover', icon: Compass },
              { to: '/dinners', label: 'Dinners', icon: UtensilsCrossed },
              { to: '/people', label: 'People', icon: Users },
              { to: '/influencers', label: 'Influencers', icon: Star },
              { to: '/restaurants', label: 'Restaurants', icon: MapPin },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  to === '/discover' ? 'bg-brand-50 text-brand-600' : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50'
                }`}
              >
                <Icon size={18} /> {label}
              </Link>
            ))}
            <div className="border-t border-charcoal-100 my-3" />
            <Link to="/messages" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50 transition-colors">
              <MessageCircle size={18} /> Messages
              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">5</span>
            </Link>
            <Link to="/notifications" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50 transition-colors">
              <Bell size={18} /> Notifications
              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </Link>
            <Link to="/saved" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50 transition-colors">
              <Bookmark size={18} /> Saved
            </Link>
            <Link to="/reviews" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50 transition-colors">
              <Star size={18} /> Reviews
            </Link>
            <Link to="/invite" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50 transition-colors">
              <Sparkles size={18} /> Invite & Earn
            </Link>
          </nav>

          <div className="mt-auto space-y-4">
            {/* User Card */}
            <div className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-brand-100 overflow-hidden shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-600 text-sm font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-charcoal-900 truncate">{user?.name || 'Ali Raza'}</p>
                <Link to="/profile" className="text-xs text-brand-500 font-medium hover:underline">View Profile</Link>
              </div>
              <button className="text-charcoal-400 hover:text-charcoal-600">
                <MoreHorizontal size={16} />
              </button>
            </div>

            <div className="bg-gradient-to-br from-brand-50 to-cream-100 rounded-2xl p-4 text-center">
              <Gift size={20} className="text-brand-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-charcoal-700 mb-1">Invite your friends</p>
              <p className="text-[10px] text-charcoal-400 mb-3">Get PKR 200 when they join their first dinner.</p>
              <button className="w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
                Invite Friends
              </button>
            </div>
          </div>
        </aside>

        {/* ── Center Content ── */}
        <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-6 overflow-y-auto">
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
                      <div className="grid sm:grid-cols-2 gap-5">
                        {displayDinners.slice(0, visibleCount).map((d) => (
                          <Link key={d.id} to={`/dinners/${d.id}`} className="card group block">
                            {/* Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={d.coverImage}
                                alt={d.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                              {/* Tag */}
                              {d.tag && (
                                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold ${tagColorMap[d.tagColor] || tagColorMap.orange}`}>
                                  {d.tag}
                                </span>
                              )}
                              {/* Bookmark */}
                              <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                <Bookmark size={14} className="text-charcoal-500" />
                              </button>
                              {/* Avatar stack */}
                              <div className="absolute bottom-3 left-3 flex items-center">
                                {d.host?.avatar && (
                                  <img src={d.host.avatar} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                                )}
                                {d.coHosts?.slice(0, 3).map((a, i) => (
                                  <img key={i} src={a} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover -ml-2" />
                                ))}
                                {d.extraGuests > 0 && (
                                  <span className="ml-1 text-white text-[11px] font-semibold drop-shadow-md">+{d.extraGuests}</span>
                                )}
                              </div>
                            </div>
                            {/* Info */}
                            <div className="p-4">
                              <h3 className="font-semibold text-charcoal-900 text-base mb-1.5 line-clamp-1">{d.title}</h3>
                              <div className="flex items-center gap-1.5 text-charcoal-400 text-sm mb-2">
                                <MapPin size={13} />
                                <span>{d.location?.venue}{d.location?.city ? `, ${d.location.city}` : ''}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-charcoal-400 text-xs mb-3">
                                <Calendar size={12} />
                                <span>{format(new Date(d.date), 'EEE, d MMM')} • {format(new Date(d.date), 'h:mm a')}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-charcoal-500 font-medium">{d.seatsLeft} Seats Left</span>
                                <span className="font-bold text-charcoal-900">{d.currency || 'Rs.'} {d.price?.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-charcoal-50">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-charcoal-400">Hosted by</span>
                                  <span className="text-xs font-semibold text-charcoal-700">@{d.host?.name}</span>
                                  {d.host?.verified && <UserCheck size={11} className="text-blue-500" />}
                                </div>
                                <span className="flex items-center gap-1">
                                  <Star size={13} className="text-brand-500 fill-brand-500" />
                                  <span className="font-semibold text-charcoal-800 text-sm">{d.rating}</span>
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
                          {u.role === 'influencer' && <span className="badge-orange text-[10px]">Influencer</span>}
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
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="hidden xl:block w-80 shrink-0 border-l border-charcoal-100 bg-white p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto space-y-6">
          {/* Popular Influencers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal-900">Popular Influencers</h3>
              <Link to="/influencers" className="text-brand-500 text-xs font-medium hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {popularInfluencers.map((inf) => (
                <div key={inf.id} className="flex items-center gap-3">
                  <img src={inf.avatar} alt={inf.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-semibold text-charcoal-900 truncate">{inf.name}</p>
                      {inf.verified && <UserCheck size={12} className="text-blue-500 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-charcoal-400">{inf.role} • {inf.followers} Followers</p>
                  </div>
                  <button className="text-brand-500 text-xs font-semibold px-3 py-1 rounded-full border border-brand-200 hover:bg-brand-50 transition-colors">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusive Offers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal-900">Exclusive Offers For You</h3>
              <Link to="/discover" className="text-brand-500 text-xs font-medium hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {exclusiveOffers.map((o, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-cream-50 rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                    <o.icon size={16} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-charcoal-900">{o.title}</p>
                    <p className="text-xs text-charcoal-500">{o.desc}</p>
                    <p className="text-[10px] text-charcoal-400 mt-0.5">{o.venue} • Valid till {o.validTill}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Cuisines */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal-900">Trending Cuisines</h3>
            </div>
            <div className="flex items-center gap-4">
              {trendingCuisines.map(c => (
                <button key={c.label} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-charcoal-100 group-hover:border-brand-400 transition-colors">
                    <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-medium text-charcoal-500 group-hover:text-brand-600 transition-colors">{c.label}</span>
                </button>
              ))}
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-full bg-charcoal-50 border-2 border-charcoal-100 group-hover:border-brand-400 flex items-center justify-center transition-colors">
                  <span className="text-charcoal-400 text-lg font-bold">···</span>
                </div>
                <span className="text-[11px] font-medium text-charcoal-500">More</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DiscoverPage;
