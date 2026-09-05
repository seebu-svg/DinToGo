import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dinnersAPI, collaborationsAPI, notificationsAPI } from '../../services/api';
import { format, isToday, isTomorrow } from 'date-fns';
import {
  Users, UtensilsCrossed, CalendarCheck, TrendingUp, Calendar,
  ArrowUpRight, ArrowDownRight, Heart, MessageCircle, Star,
  ChevronRight, Sparkles, Eye, UserPlus, Megaphone,
} from 'lucide-react';

const InfluencerHome = () => {
  const { user } = useAuth();
  const [hostedDinners, setHostedDinners] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dinnersRes] = await Promise.all([
          dinnersAPI.myHostedDinners().catch(() => ({ data: { data: [] } })),
        ]);
        setHostedDinners(Array.isArray(dinnersRes.data?.data) ? dinnersRes.data.data : []);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const infData = user?.influencerData || {};
  const followers = user?.followerCount || 0;
  const upcoming = hostedDinners.filter(d => new Date(d.date) >= new Date());
  const completed = hostedDinners.filter(d => new Date(d.date) < new Date());
  const totalBookings = hostedDinners.reduce((acc, d) => acc + (d.currentGuests || 0), 0);

  const kpis = [
    { label: 'Followers', value: followers.toLocaleString(), icon: Users, color: 'brand', change: '+12%', up: true },
    { label: 'Upcoming Dinners', value: upcoming.length, icon: UtensilsCrossed, color: 'blue', change: '+3', up: true },
    { label: 'Total Bookings', value: totalBookings, icon: CalendarCheck, color: 'green', change: '+28%', up: true },
    { label: 'Engagement Rate', value: infData.engagementRate || '4.8%', icon: TrendingUp, color: 'purple', change: '+0.6%', up: true },
  ];

  const pendingInvites = [
    { id: 1, restaurant: 'Mamma Mia', title: 'Italian Night Collaboration', date: 'Sep 15', status: 'pending', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=80&h=80&fit=crop' },
    { id: 2, restaurant: 'The Forest Bistro', title: 'Chef\'s Table Experience', date: 'Sep 20', status: 'pending', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=80&fit=crop' },
  ];

  const recentActivity = [
    { type: 'follow', text: '12 new followers today', time: '2h ago', icon: UserPlus, color: 'blue' },
    { type: 'booking', text: 'Italian Night reached 20 bookings', time: '5h ago', icon: CalendarCheck, color: 'green' },
    { type: 'review', text: 'New 5-star review on Sushi Night', time: '1d ago', icon: Star, color: 'brand' },
    { type: 'message', text: 'Mamma Mia sent you a message', time: '2d ago', icon: MessageCircle, color: 'purple' },
  ];

  const colorMap = {
    brand: { bg: 'bg-brand-50', text: 'text-brand-600', ring: 'ring-brand-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-charcoal-400 text-sm mt-1">Here's what's happening with your creator journey.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, change, up }) => {
          const c = colorMap[color];
          return (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <Icon size={20} className={c.text} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-500'}`}>
                  {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {change}
                </span>
              </div>
              <p className="text-2xl font-bold text-charcoal-900">{value}</p>
              <p className="text-xs text-charcoal-400 mt-0.5">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Two-column: Upcoming Dinners + Invitations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Dinners */}
        <div className="bg-white rounded-2xl shadow-card">
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="font-bold text-charcoal-900">Upcoming Dinners</h2>
            <Link to="/influencer/dinners" className="text-brand-500 text-xs font-medium hover:underline flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="p-5 pt-3 space-y-3">
            {upcoming.length === 0 && (
              <div className="text-center py-8">
                <UtensilsCrossed size={32} className="text-charcoal-200 mx-auto mb-2" />
                <p className="text-sm text-charcoal-400">No upcoming dinners.</p>
                <Link to="/influencer/create-dinner" className="text-brand-500 text-sm font-medium hover:underline">Create your first dinner</Link>
              </div>
            )}
            {upcoming.slice(0, 4).map(d => {
              const spotsLeft = (d.maxGuests || 0) - (d.currentGuests || 0);
              const pct = d.maxGuests ? Math.round((d.currentGuests / d.maxGuests) * 100) : 0;
              return (
                <div key={d.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream-50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal-900 truncate">{d.title}</p>
                    <p className="text-xs text-charcoal-400">
                      {format(new Date(d.date), 'EEE, d MMM • h:mm a')} • {d.venue || d.city}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-charcoal-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-charcoal-400 shrink-0">{d.currentGuests}/{d.maxGuests}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Invitations */}
        <div className="bg-white rounded-2xl shadow-card">
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="font-bold text-charcoal-900">Collaboration Invites</h2>
            <Link to="/influencer/invitations" className="text-brand-500 text-xs font-medium hover:underline flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="p-5 pt-3 space-y-3">
            {pendingInvites.length === 0 && (
              <div className="text-center py-8">
                <Megaphone size={32} className="text-charcoal-200 mx-auto mb-2" />
                <p className="text-sm text-charcoal-400">No pending invitations.</p>
              </div>
            )}
            {pendingInvites.map(inv => (
              <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50">
                <img src={inv.img} alt={inv.restaurant} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-charcoal-900 truncate">{inv.title}</p>
                  <p className="text-xs text-charcoal-400">{inv.restaurant} • {inv.date}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors">
                    <CalendarCheck size={16} />
                  </button>
                  <button className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-card">
        <h2 className="font-bold text-charcoal-900 p-5 pb-3">Recent Activity</h2>
        <div className="px-5 pb-5 space-y-1">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors">
              <div className={`w-9 h-9 rounded-xl ${colorMap[a.color].bg} flex items-center justify-center shrink-0`}>
                <a.icon size={16} className={colorMap[a.color].text} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-charcoal-700">{a.text}</p>
              </div>
              <span className="text-[10px] text-charcoal-400 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/influencer/create-dinner" className="card p-5 text-center group hover:border-brand-200">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-100 transition-colors">
            <UtensilsCrossed size={22} className="text-brand-500" />
          </div>
          <p className="text-sm font-semibold text-charcoal-900">Create Dinner</p>
          <p className="text-xs text-charcoal-400 mt-1">Schedule a new dining experience</p>
        </Link>
        <Link to="/influencer/restaurants" className="card p-5 text-center group hover:border-brand-200">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
            <Megaphone size={22} className="text-blue-500" />
          </div>
          <p className="text-sm font-semibold text-charcoal-900">Find Collaborations</p>
          <p className="text-xs text-charcoal-400 mt-1">Partner with restaurants</p>
        </Link>
        <Link to="/influencer/analytics" className="card p-5 text-center group hover:border-brand-200">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-100 transition-colors">
            <Eye size={22} className="text-purple-500" />
          </div>
          <p className="text-sm font-semibold text-charcoal-900">View Analytics</p>
          <p className="text-xs text-charcoal-400 mt-1">Track your performance</p>
        </Link>
      </div>
    </div>
  );
};

export default InfluencerHome;
