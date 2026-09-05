import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { notificationsAPI, dinnersAPI } from '../services/api';
import {
  LayoutDashboard, Compass, UtensilsCrossed, Plus, Users, Store,
  MessageCircle, Mail, Star, BarChart3, User, Bell, Settings,
  LogOut, ChevronDown, Search, Heart, Calendar, UserCheck,
  TrendingUp, Sparkles, MapPin, Bookmark,
} from 'lucide-react';

const navItems = [
  { to: '/influencer', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/influencer/discover', label: 'Discover', icon: Compass },
  { to: '/influencer/dinners', label: 'My Dinners', icon: UtensilsCrossed },
  { to: '/influencer/create-dinner', label: 'Create Dinner', icon: Plus },
  { to: '/influencer/people', label: 'People', icon: Users },
  { to: '/influencer/restaurants', label: 'Restaurants', icon: Store },
  { to: '/influencer/messages', label: 'Messages', icon: MessageCircle },
  { to: '/influencer/invitations', label: 'Invitations', icon: Mail },
  { to: '/influencer/reviews', label: 'Reviews', icon: Star },
  { to: '/influencer/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/influencer/profile', label: 'Profile', icon: User },
  { to: '/influencer/notifications', label: 'Notifications', icon: Bell },
  { to: '/influencer/settings', label: 'Settings', icon: Settings },
];

const suggestedRestaurants = [
  { id: 1, name: 'Mamma Mia', cuisine: 'Italian', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=80&h=80&fit=crop', followers: '2.1K' },
  { id: 2, name: 'The Forest Bistro', cuisine: 'Continental', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=80&fit=crop', followers: '1.8K' },
  { id: 3, name: 'Café Botanica', cuisine: 'Café & Brunch', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=80&h=80&fit=crop', followers: '3.4K' },
];

const trendingCuisines = [
  { label: 'Italian', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=60&h=60&fit=crop' },
  { label: 'Japanese', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=60&h=60&fit=crop' },
  { label: 'Mexican', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=60&h=60&fit=crop' },
  { label: 'BBQ & Grill', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=60&h=60&fit=crop' },
];

const InfluencerDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [upcomingDinners, setUpcomingDinners] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await notificationsAPI.getAll({ limit: 1, unreadOnly: 'true' });
        setUnreadCount(data.unreadCount || 0);
      } catch { /* silent */ }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dinnersAPI.myHostedDinners().then(res => {
      const items = res.data?.data;
      if (Array.isArray(items)) {
        setUpcomingDinners(
          items.filter(d => new Date(d.date) >= new Date()).slice(0, 3)
        );
      }
    }).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const followerCount = user?.followerCount || 0;
  const infData = user?.influencerData || {};

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* ── Fixed Top Bar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-charcoal-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3 lg:gap-5 h-16 px-4 lg:px-8">
          {/* Logo */}
          <Link to="/influencer" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <div className="hidden lg:block">
              <span className="text-lg font-display font-bold text-charcoal-900 leading-none tracking-tight">DinToGo</span>
              <p className="text-[10px] text-brand-500 font-medium leading-tight mt-0.5">Creator Studio</p>
            </div>
          </Link>

          <div className="hidden lg:block h-8 w-px bg-charcoal-100 shrink-0" />

          {/* Location */}
          <button className="hidden md:flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50 px-3 py-2 rounded-full transition-colors shrink-0">
            <MapPin size={15} className="text-brand-500" />
            <span>{user?.location?.city || 'Lahore, Pakistan'}</span>
            <ChevronDown size={12} className="rotate-0 text-charcoal-300" />
          </button>

          {/* Search */}
          <div className="flex-1 min-w-0 relative group">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300 group-focus-within:text-brand-500 transition-colors" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search dinners, restaurants, people..."
              className="w-full pl-11 pr-14 py-2.5 bg-cream-50 border border-charcoal-100 rounded-full text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10 transition-all duration-200"
            />
            <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center text-[10px] font-semibold text-charcoal-400 bg-white border border-charcoal-100 rounded-md px-1.5 py-0.5 shadow-sm pointer-events-none">⌘K</kbd>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
            <Link to="/influencer/create-dinner" className="hidden sm:flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 lg:px-5 py-2.5 rounded-full shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all duration-200">
              <Plus size={15} /> Create Dinner
            </Link>
            <Link to="/influencer/messages" className="relative p-2.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-50 rounded-full transition-colors">
              <MessageCircle size={20} />
            </Link>
            <Link to="/influencer/notifications" className="relative p-2.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-50 rounded-full transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="hidden sm:block w-px h-6 bg-charcoal-100 mx-0.5" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 p-1 pr-2 rounded-full hover:bg-cream-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-brand-100 ring-2 ring-white shadow-sm flex items-center justify-center text-brand-600 font-bold text-sm overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <ChevronDown size={14} className="text-charcoal-400" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-card-hover border border-charcoal-100 py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-charcoal-50 mb-1">
                      <p className="text-sm font-semibold text-charcoal-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-charcoal-400 truncate">{user?.email}</p>
                      <p className="text-[10px] text-brand-500 font-medium mt-0.5">Creator • {followerCount.toLocaleString()} followers</p>
                    </div>
                    <Link to="/influencer/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-600 hover:bg-cream-50 hover:text-charcoal-900 transition-colors">
                      <User size={15} /> My Profile
                    </Link>
                    <Link to="/influencer/analytics" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-600 hover:bg-cream-50 hover:text-charcoal-900 transition-colors">
                      <BarChart3 size={15} /> Analytics
                    </Link>
                    <Link to="/influencer/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-600 hover:bg-cream-50 hover:text-charcoal-900 transition-colors">
                      <Settings size={15} /> Settings
                    </Link>
                    <div className="border-t border-charcoal-100 my-1" />
                    <Link to="/" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-600 hover:bg-cream-50 hover:text-charcoal-900 transition-colors">
                      <Compass size={15} /> Browse as User
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={15} /> Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main 3-Column Body ─────────────────────────────────────── */}
      <div className="flex-1 flex">
        {/* ── Fixed Left Sidebar ─────────────────────────────────────── */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-charcoal-100 bg-white sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-0.5 flex-1 p-4">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50'
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
                {label === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar CTA */}
          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-br from-brand-50 to-cream-100 rounded-2xl p-4 text-center">
              <Sparkles size={28} className="text-brand-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-charcoal-700 mb-1">Boost Your Reach</p>
              <p className="text-[10px] text-charcoal-400 mb-3">Collaborate with restaurants to grow your audience.</p>
              <Link to="/influencer/restaurants" className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
                Find Partners
              </Link>
            </div>

            {/* User card */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-charcoal-900 truncate">{user?.name}</p>
                <Link to="/influencer/profile" className="text-xs text-brand-500 hover:underline">View Profile</Link>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Dynamic Center Content ───────────────────────────────── */}
        <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* ── Fixed Right Sidebar ────────────────────────────────────── */}
        <aside className="hidden xl:block w-80 shrink-0 border-l border-charcoal-100 bg-white p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto space-y-6">
          {/* Creator Stats */}
          <div>
            <h3 className="text-sm font-bold text-charcoal-900 mb-3">Your Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-cream-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-charcoal-900">{followerCount.toLocaleString()}</p>
                <p className="text-[10px] text-charcoal-400 font-medium">Followers</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-charcoal-900">{user?.followingCount || 0}</p>
                <p className="text-[10px] text-charcoal-400 font-medium">Following</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-charcoal-900">{upcomingDinners.length}</p>
                <p className="text-[10px] text-charcoal-400 font-medium">Upcoming</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-charcoal-900">{infData.avgRating || '—'}</p>
                <p className="text-[10px] text-charcoal-400 font-medium">Avg Rating</p>
              </div>
            </div>
          </div>

          {/* Suggested Restaurants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal-900">Suggested Restaurants</h3>
              <Link to="/influencer/restaurants" className="text-brand-500 text-xs font-medium hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {suggestedRestaurants.map(r => (
                <div key={r.id} className="flex items-center gap-3">
                  <img src={r.img} alt={r.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal-900 truncate">{r.name}</p>
                    <p className="text-[11px] text-charcoal-400">{r.cuisine} • {r.followers}</p>
                  </div>
                  <button className="text-brand-500 text-xs font-semibold px-3 py-1 rounded-full border border-brand-200 hover:bg-brand-50 transition-colors">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Dinners */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal-900">Your Upcoming</h3>
              <Link to="/influencer/dinners" className="text-brand-500 text-xs font-medium hover:underline">View All</Link>
            </div>
            {upcomingDinners.length === 0 && (
              <div className="text-center py-6">
                <Calendar size={24} className="text-charcoal-200 mx-auto mb-2" />
                <p className="text-xs text-charcoal-400">No upcoming dinners.</p>
                <Link to="/influencer/create-dinner" className="text-brand-500 text-xs font-medium hover:underline">Create one</Link>
              </div>
            )}
            {upcomingDinners.map(d => {
              const spotsLeft = (d.maxGuests || 0) - (d.currentGuests || 0);
              return (
                <Link key={d.id} to={`/influencer/dinners`} className="flex items-start gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors mb-1">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal-900 truncate">{d.title}</p>
                    <p className="text-xs text-charcoal-400">{new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {d.venue || d.city}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                    {spotsLeft} left
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Trending Cuisines */}
          <div>
            <h3 className="text-sm font-bold text-charcoal-900 mb-3">Trending Cuisines</h3>
            <div className="flex flex-wrap gap-2">
              {trendingCuisines.map(c => (
                <div key={c.label} className="flex items-center gap-2 bg-cream-50 rounded-full px-3 py-1.5 hover:bg-cream-100 transition-colors cursor-pointer">
                  <img src={c.img} alt={c.label} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-medium text-charcoal-700">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Banner */}
          <div className="bg-brand-50 rounded-2xl p-4 text-center">
            <Heart size={20} className="text-brand-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-charcoal-700 mb-1">Invite Your Audience</p>
            <p className="text-[10px] text-charcoal-400 mb-2">Share your invite link and earn rewards.</p>
            <Link to="/influencer/invitations" className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
              Get Invite Link
            </Link>
          </div>
        </aside>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full p-4 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
                <UtensilsCrossed size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-charcoal-900">DinToGo</span>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-brand-50 text-brand-600' : 'text-charcoal-500 hover:bg-cream-50'
                    }`
                  }
                >
                  <Icon size={18} /> {label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
};

export default InfluencerDashboardLayout;
