import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dinnersAPI, usersAPI, offersAPI } from '../../services/api';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import {
  Home, Compass, UtensilsCrossed, Users, Star, MapPin, Bell, MessageCircle,
  Search, Plus, Heart, ChevronRight, ChevronDown, Moon, Calendar, Flame, UserPlus,
  Award, Gift, Wine, Bookmark, Sparkles, Megaphone, ArrowRight,
  UserCheck, Send, LogOut, Settings,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/dinners', label: 'Dinners', icon: UtensilsCrossed },
  { to: '/people', label: 'People', icon: Users },
  { to: '/influencers', label: 'Influencers', icon: Star },
  { to: '/restaurants', label: 'Restaurants', icon: MapPin },
];

const quickFilters = [
  { label: 'Tonight', icon: Moon },
  { label: 'This Weekend', icon: Calendar },
  { label: 'Foodies', icon: Flame },
  { label: 'New People', icon: UserPlus },
  { label: 'Top Influencers', icon: Award },
];

const popularInfluencers = [
  { id: 1, name: 'Foodieshehryar', role: 'Food Blogger', followers: '96K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', verified: true },
  { id: 2, name: 'Bites By Sana', role: 'Food Creator', followers: '82K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', verified: true },
  { id: 3, name: 'Hungry Traveller', role: 'Travel & Food', followers: '128K', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', verified: true },
  { id: 4, name: 'ChefsOfPakistan', role: 'Chef', followers: '54K', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', verified: true },
];

const exclusiveOffers = [
  { title: '20% OFF', desc: 'For groups of 4+ people', venue: 'Mamma Mia, Gulberg', icon: Gift, validTill: '31 May 2024' },
  { title: 'Free Dessert', desc: 'For first-time DinToGo users', venue: 'The Forest Bistro, DHA', icon: Gift, validTill: '15 Jun 2024' },
  { title: 'Happy Hours', desc: '15% OFF on all drinks', venue: 'Café Botanica, DHA', icon: Wine, validTill: 'Everyday 4–7 PM' },
];

const HomePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dinners, setDinners] = useState([]);
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    dinnersAPI.getAll({ limit: 8 }).then(res => {
      const items = res.data?.data;
      setDinners(Array.isArray(items) ? items : []);
    }).catch(() => {});
  }, []);

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

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const getDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    if (isToday(d)) return 'Tonight';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'EEE, d MMM');
  };

  const getTimeStr = (dateStr) => format(new Date(dateStr), 'h:mm a');

  const upcomingDinners = dinners.filter(d => new Date(d.date) >= new Date()).slice(0, 4);
  const trendingDinners = [...dinners].sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0)).slice(0, 4);

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* ── Top Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-charcoal-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
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
            {isAuthenticated && (
              <Link to="/dinners/create" className="hidden sm:flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 lg:px-5 py-2.5 rounded-full shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all duration-200">
                <Plus size={15} /> Create Dinner
              </Link>
            )}
            <button className="relative p-2.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-50 rounded-full transition-colors">
              <MessageCircle size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">3</span>
            </button>
            <button className="relative p-2.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">3</span>
            </button>

            <div className="hidden sm:block w-px h-6 bg-charcoal-100 mx-0.5" />

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-1.5 p-1 pr-2 rounded-full hover:bg-cream-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-brand-100 ring-2 ring-white shadow-sm flex items-center justify-center text-brand-600 font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown size={14} className="text-charcoal-400" />
                </button>
                <div className="absolute right-0 pt-3 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-card-hover border border-charcoal-100 py-2">
                    <div className="px-4 py-2.5 border-b border-charcoal-50 mb-1">
                      <p className="text-sm font-semibold text-charcoal-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-charcoal-400 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-600 hover:bg-cream-50 hover:text-charcoal-900 transition-colors"><Settings size={15} /> View Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"><LogOut size={15} /> Log Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-semibold text-charcoal-600 hover:text-charcoal-900 px-3 py-2.5 transition-colors">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm px-4 lg:px-5 py-2.5 rounded-full">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Main 3-Column Layout ──────────────────────────────── */}
      <div className="flex-1 flex">
        {/* ── Left Sidebar ──────────────────────────────────────── */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-charcoal-100 bg-white p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-1 flex-1">
            {navItems.map(({ to, label, icon: Icon, exact }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  to === '/' ? 'bg-brand-50 text-brand-600' : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50'
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

          {/* Sidebar CTA */}
          <div className="mt-auto">
            <div className="bg-gradient-to-br from-brand-50 to-cream-100 rounded-2xl p-4 text-center">
              <UtensilsCrossed size={28} className="text-brand-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-charcoal-700 mb-2">Host your own dinner</p>
              <Link to="/dinners/create" className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
                Create Dinner
              </Link>
            </div>

            {isAuthenticated && (
              <div className="flex items-center gap-3 mt-4 px-2">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-charcoal-900 truncate">{user?.name}</p>
                  <Link to="/profile" className="text-xs text-brand-500 hover:underline">View Profile</Link>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── Center Content ────────────────────────────────────── */}
        <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-6 space-y-8 overflow-y-auto">
          {/* Hero Banner */}
          <section className="relative rounded-3xl overflow-hidden bg-charcoal-900">
            <img
              src="https://images.unsplash.com/photo-1529543544006-1b1b5015e899?w=1200&h=400&fit=crop"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-10">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight mb-2">
                  Good Food Is Better<br />Together.
                </h1>
                <p className="text-charcoal-300 text-sm mb-4">Find people. Share tables. Create memories.</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {quickFilters.map(({ label, icon: Icon }) => (
                    <button key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-medium rounded-full transition-colors">
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Featured Dinner Card */}
              {upcomingDinners[0] && (
                <div className="w-full md:w-72 bg-white rounded-2xl p-4 shrink-0">
                  <div className="flex items-center gap-2 text-xs text-charcoal-400 mb-2">
                    <Calendar size={12} /> {getDateLabel(upcomingDinners[0].date)} • {getTimeStr(upcomingDinners[0].date)}
                  </div>
                  <h3 className="font-bold text-charcoal-900 text-sm mb-1">{upcomingDinners[0].title}</h3>
                  <p className="text-xs text-charcoal-400 mb-3">{upcomingDinners[0].venue || upcomingDinners[0].city}</p>
                  <Link to={`/dinners/${upcomingDinners[0].id}`} className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2 rounded-xl text-center transition-colors">
                    Join Dinner
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Near You */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-charcoal-900">Upcoming Near You</h2>
              <Link to="/dinners" className="text-brand-500 text-sm font-medium hover:underline flex items-center gap-1">View All <ChevronRight size={14} /></Link>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {upcomingDinners.map((d) => {
                const spotsLeft = (d.maxGuests || 0) - (d.currentGuests || 0);
                return (
                  <Link key={d.id} to={`/dinners/${d.id}`} className="card p-4 group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
                        <Calendar size={20} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-charcoal-400 font-medium uppercase tracking-wide">{getDateLabel(d.date)}</span>
                        <h3 className="font-semibold text-charcoal-900 text-sm leading-tight truncate">{d.title}</h3>
                        <p className="text-xs text-charcoal-400 mt-0.5">{getTimeStr(d.date)} • {d.venue || d.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-charcoal-500">{spotsLeft > 0 ? `${spotsLeft} Seats Left` : 'Full'} • ${d.price || 0}</span>
                      <div className="flex -space-x-2">
                        {Array.from({ length: Math.min(3, d.currentGuests || 1) }).map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-brand-600 text-[8px] font-bold">
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Trending Dinners */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-charcoal-900">Trending Dinners</h2>
              <Link to="/dinners" className="text-brand-500 text-sm font-medium hover:underline flex items-center gap-1">View All <ChevronRight size={14} /></Link>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {trendingDinners.map((d, idx) => (
                <Link key={d.id} to={`/dinners/${d.id}`} className="card group relative overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={d.coverImage || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop'}
                      alt={d.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 left-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-xs font-bold text-charcoal-800">{idx + 1}</span>
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart size={14} className="text-charcoal-500" />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-white text-sm leading-tight truncate">{d.title}</h3>
                      <div className="flex items-center justify-between text-xs text-white/80 mt-1">
                        <span className="flex items-center gap-1"><Star size={12} className="text-brand-400 fill-brand-400" /> {d.ratingAverage || '0'}</span>
                        <span className="font-semibold">${d.price || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs">
                    <div className="text-charcoal-400">
                      <span>{format(new Date(d.date), 'EEE, d MMM')} • {format(new Date(d.date), 'h:mm a')}</span>
                      <p className="truncate">{d.venue || d.city}</p>
                    </div>
                    <div className="flex -space-x-2 shrink-0">
                      {Array.from({ length: Math.min(3, Math.max(1, d.currentGuests || 1)) }).map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-brand-600 text-[8px] font-bold">
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Bottom Invite Banner */}
          <div className="bg-brand-50 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                <Gift size={20} className="text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal-900">Invite your friends and get rewards!</p>
                <p className="text-xs text-charcoal-400">You get $2 when they join their first dinner.</p>
              </div>
            </div>
            <button className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors shrink-0">
              Invite Friends
            </button>
          </div>
        </main>

        {/* ── Right Sidebar ─────────────────────────────────────── */}
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
              <h3 className="text-sm font-bold text-charcoal-900">Exclusive Restaurant Offers</h3>
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

          {/* Your Upcoming Dinners */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal-900">Your Upcoming Dinners</h3>
              <Link to="/dinners" className="text-brand-500 text-xs font-medium hover:underline">View All</Link>
            </div>
            {upcomingDinners.slice(0, 2).map(d => (
              <Link key={d.id} to={`/dinners/${d.id}`} className="flex items-start gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors mb-1">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-charcoal-900 truncate">{d.title}</p>
                  <p className="text-xs text-charcoal-400">{getDateLabel(d.date)} • {getTimeStr(d.date)} • {d.venue || d.city}</p>
                </div>
                <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">Joined</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
