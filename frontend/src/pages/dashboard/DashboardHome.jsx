import { useState, useEffect } from 'react';
import { restaurantsAPI, analyticsAPI, dinnersAPI, offersAPI, collaborationsAPI, reviewsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import {
  CalendarCheck, UserPlus, UtensilsCrossed, DollarSign, TrendingUp,
  ChevronRight, ArrowUpRight, ArrowDownRight, Star, Megaphone,
  Loader, Gift,
} from 'lucide-react';

/* ── SVG Mini Line Chart ─────────────────────────────────── */
const MiniLineChart = ({ data, color = '#F97316' }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 320, h = 100, pad = 8;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  const pathD = `M${points.join(' L')}`;
  const areaD = `${pathD} L${w - pad},${h - pad} L${pad},${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#chartGrad)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r="3" fill="white" stroke={color} strokeWidth="2" />;
      })}
    </svg>
  );
};

/* ── KPI Card ────────────────────────────────────────────── */
const KPICard = ({ icon: Icon, label, value, change, color = 'brand' }) => {
  const colors = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-charcoal-100/50">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-charcoal-900">{value}</p>
      <p className="text-xs text-charcoal-400 mt-0.5">{label}</p>
      {change !== undefined && (
        <p className="text-[10px] text-charcoal-400 mt-1">{change >= 0 ? '+' : ''}{change}% vs yesterday</p>
      )}
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────── */
const DashboardHome = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [dinners, setDinners] = useState([]);
  const [offers, setOffers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data: restData } = await restaurantsAPI.getMy();
      setRestaurant(restData.data);

      const [analyticsRes, dinnersRes, offersRes, reviewsRes] = await Promise.allSettled([
        analyticsAPI.getRestaurant(restData.data.id),
        dinnersAPI.getAll({ restaurantId: restData.data.id, limit: 10 }),
        offersAPI.getMy(),
        reviewsAPI.getAll({ restaurantId: restData.data.id, limit: 5 }),
      ]);

      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data.data);
      if (dinnersRes.status === 'fulfilled') {
        const d = dinnersRes.value.data?.data;
        setDinners(Array.isArray(d) ? d : []);
      }
      if (offersRes.status === 'fulfilled') {
        const o = offersRes.value.data?.data;
        setOffers(Array.isArray(o) ? o : []);
      }
      if (reviewsRes.status === 'fulfilled') {
        const r = reviewsRes.value.data?.data;
        setReviews(Array.isArray(r) ? r : []);
      }
    } catch {
      // restaurant might not exist yet
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  const today = format(new Date(), 'EEEE, d MMMM yyyy');
  const upcomingDinners = dinners.filter(d => new Date(d.date) >= new Date()).slice(0, 3);
  const topDinners = [...dinners].sort((a, b) => (b.currentGuests / b.maxGuests) - (a.currentGuests / a.maxGuests)).slice(0, 3);
  const totalRevenue = restaurant?.totalRevenue || 0;
  const occupancy = restaurant?.avgOccupancy || 0;

  // Demo chart data
  const chartData = [45000, 62000, 58000, 71000, 95000, 88000, 72000];

  // Demo influencers
  const influencers = [
    { name: '@foodieshehryar', followers: '96K', bookings: 32, revenue: '24K', tag: 'Dinner • 25 May', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
    { name: '@bites.by.sana', followers: '82K', bookings: 26, revenue: '18K', tag: 'Brunch • 18 May', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' },
    { name: '@hungry.traveller', followers: '128K', bookings: 28, revenue: '20K', tag: 'Tasting • 30 May', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face' },
  ];

  // Demo reviews
  const demoReviews = reviews.length > 0 ? reviews : [
    { id: 1, reviewer: { name: 'Ayesha Khan' }, rating: 5, comment: 'Amazing ambiance and delicious food!', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 2, reviewer: { name: 'Usman Ali' }, rating: 4, comment: 'Great experience, loved the service.', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, reviewer: { name: 'Sana Mir' }, rating: 5, comment: 'The brunch was perfect!', createdAt: new Date(Date.now() - 172800000).toISOString() },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-sm text-charcoal-400">Here's what's happening with your restaurant today.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-charcoal-100 rounded-xl text-sm text-charcoal-600 hover:bg-cream-50 transition-colors shrink-0">
          <CalendarCheck size={14} /> {today} <ChevronRight size={12} className="rotate-90" />
        </button>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard icon={CalendarCheck} label="Today's Reservations" value={analytics?.totalReservations || 12} change={20} color="brand" />
        <KPICard icon={UserPlus} label="New Customers" value={analytics?.newCustomers || 32} change={18} color="green" />
        <KPICard icon={UtensilsCrossed} label="Upcoming Dinners" value={upcomingDinners.length || 3} color="purple" />
        <KPICard icon={DollarSign} label="Revenue Today" value={`$${(totalRevenue || 78500).toLocaleString()}`} change={25} color="yellow" />
        <KPICard icon={TrendingUp} label="Occupancy Rate" value={`${occupancy || 68}%`} change={15} color="blue" />
      </div>

      {/* ── Three Column Grid ───────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Dinners */}
        <div className="bg-white rounded-2xl p-5 border border-charcoal-100/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal-900">Upcoming Dinners</h3>
          </div>
          <div className="space-y-4">
            {upcomingDinners.length > 0 ? upcomingDinners.map(d => {
              const pct = Math.round((d.currentGuests / d.maxGuests) * 100);
              return (
                <div key={d.id} className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                    <img src={d.coverImage || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-charcoal-400 uppercase">{format(new Date(d.date), 'EEE')} • {format(new Date(d.date), 'h:mm a')}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-charcoal-900 truncate">{d.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-charcoal-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-charcoal-400 shrink-0">{pct}% Booked</span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-charcoal-400">{d.currentGuests}/{d.maxGuests} Seats</span>
                      <button className="text-[10px] font-semibold text-brand-500 hover:underline">Manage</button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-charcoal-400 text-center py-6">No upcoming dinners</p>
            )}
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="bg-white rounded-2xl p-5 border border-charcoal-100/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-charcoal-900">Revenue Overview</h3>
            <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight size={12} /> 24% vs last week
            </span>
          </div>
          <p className="text-2xl font-bold text-charcoal-900 mb-1">${(totalRevenue || 456800).toLocaleString()}</p>
          <p className="text-[10px] text-charcoal-400 mb-3">This Week</p>
          <MiniLineChart data={chartData} />
          <div className="flex justify-between mt-2 text-[10px] text-charcoal-400">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Top Performing Dinners */}
        <div className="bg-white rounded-2xl p-5 border border-charcoal-100/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal-900">Top Performing Dinners</h3>
            <button className="text-xs text-brand-500 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {topDinners.length > 0 ? topDinners.map(d => {
              const pct = Math.round((d.currentGuests / d.maxGuests) * 100);
              return (
                <div key={d.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream-50 transition-colors cursor-pointer">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                    <img src={d.coverImage || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-charcoal-900 truncate">{d.title}</h4>
                    <p className="text-[10px] text-charcoal-400">{format(new Date(d.date), 'd MMM')} • {format(new Date(d.date), 'h:mm a')}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-semibold text-charcoal-700">${((d.price || 0) * (d.currentGuests || 0)).toLocaleString()}</span>
                      <span className="text-[10px] text-charcoal-400">{pct}% Booked</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-charcoal-300 shrink-0" />
                </div>
              );
            }) : (
              <p className="text-sm text-charcoal-400 text-center py-6">No dinners yet</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Three Column Grid ────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Offers */}
        <div className="bg-white rounded-2xl p-5 border border-charcoal-100/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal-900">Active Offers</h3>
            <button className="text-xs text-brand-500 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {(offers.length > 0 ? offers : [
              { id: 1, title: '20% OFF', description: 'For groups of 4+ people', validUntil: '2024-12-31', currentRedemptions: 48, maxRedemptions: 64 },
              { id: 2, title: 'Free Dessert', description: 'For first-time DinToGo users', validUntil: '2024-12-15', currentRedemptions: 36, maxRedemptions: 60 },
              { id: 3, title: 'Happy Hour', description: '15% OFF on all drinks', validUntil: '2024-12-31', currentRedemptions: 22, maxRedemptions: 55 },
            ]).slice(0, 3).map(o => {
              const pct = Math.round((o.currentRedemptions / Math.max(o.maxRedemptions, 1)) * 100);
              return (
                <div key={o.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <Gift size={14} className="text-brand-500 shrink-0" />
                    <span className="text-sm font-semibold text-charcoal-900">{o.title}</span>
                  </div>
                  <p className="text-[10px] text-charcoal-400 mb-2">{o.description} • Valid till {format(new Date(o.validUntil), 'd MMM yyyy')}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-charcoal-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-charcoal-400 shrink-0">Used {o.currentRedemptions} times</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Influencer Collaborations */}
        <div className="bg-white rounded-2xl p-5 border border-charcoal-100/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal-900">Influencer Collaborations</h3>
            <button className="text-xs text-brand-500 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {influencers.map((inf, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream-50 transition-colors">
                <img src={inf.avatar} alt={inf.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-charcoal-900">{inf.name}</p>
                    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-blue-500 fill-blue-500"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1.5 14.5l-4-4 1.41-1.41L8.5 11.67l5.59-5.58L15.5 7.5l-7 7z"/></svg>
                  </div>
                  <p className="text-[10px] text-charcoal-400">{inf.followers} Followers</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px]">
                    <span className="text-charcoal-600 font-medium">{inf.bookings} Bookings</span>
                    <span className="text-green-600 font-medium">${inf.revenue} Revenue</span>
                    <span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-medium">{inf.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl p-5 border border-charcoal-100/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal-900">Recent Reviews</h3>
            <button className="text-xs text-brand-500 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {demoReviews.slice(0, 3).map(r => (
              <div key={r.id} className="p-3 rounded-xl bg-cream-50">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-charcoal-900">{r.reviewer?.name || r.reviewerId}</p>
                  <span className="text-[10px] text-charcoal-400">{format(new Date(r.createdAt), 'd MMM')}</span>
                </div>
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={10} className={i < (r.rating || 0) ? 'text-brand-500 fill-brand-500' : 'text-charcoal-200'} />
                  ))}
                </div>
                <p className="text-xs text-charcoal-500 line-clamp-2">{r.comment || 'Great experience!'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Promote Banner ───────────────────────────────── */}
      <div className="bg-brand-50 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            <Megaphone size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal-900">Want to reach more diners?</p>
            <p className="text-xs text-charcoal-400">Promote your next dinner or create a special offer to attract more guests.</p>
          </div>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shrink-0">
          Promote Now
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;
