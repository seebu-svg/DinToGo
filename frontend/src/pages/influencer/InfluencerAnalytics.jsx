import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, dinnersAPI } from '../../services/api';
import {
  BarChart3, Users, UtensilsCrossed, TrendingUp, Eye, Heart,
  ArrowUpRight, ArrowDownRight, Calendar, Star, DollarSign,
  MapPin, Award, Target, Sparkles,
} from 'lucide-react';

const monthlyData = [
  { month: 'Apr', dinners: 3, bookings: 42, revenue: 1260, followers: 1200 },
  { month: 'May', dinners: 5, bookings: 68, revenue: 2040, followers: 1450 },
  { month: 'Jun', dinners: 4, bookings: 55, revenue: 1650, followers: 1680 },
  { month: 'Jul', dinners: 7, bookings: 98, revenue: 3136, followers: 2100 },
  { month: 'Aug', dinners: 6, bookings: 84, revenue: 2520, followers: 2580 },
  { month: 'Sep', dinners: 8, bookings: 112, revenue: 3584, followers: 3100 },
];

const topDinners = [
  { id: 1, title: 'Italian Night', bookings: 28, revenue: 840, rating: 4.9, restaurant: 'Mamma Mia' },
  { id: 2, title: 'Sushi Omakase', bookings: 22, revenue: 1100, rating: 4.8, restaurant: 'Sakura' },
  { id: 3, title: "Chef's Table", bookings: 18, revenue: 900, rating: 4.7, restaurant: 'The Forest Bistro' },
  { id: 4, title: 'BBQ Masters', bookings: 35, revenue: 700, rating: 4.9, restaurant: 'Smokehouse & Co' },
];

const audienceBreakdown = [
  { label: 'Food Enthusiasts', pct: 42, color: 'bg-brand-500' },
  { label: 'Casual Diners', pct: 28, color: 'bg-blue-500' },
  { label: 'Fine Dining', pct: 18, color: 'bg-purple-500' },
  { label: 'Brunch Lovers', pct: 12, color: 'bg-green-500' },
];

const InfluencerAnalytics = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('3m');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const infData = user?.influencerData || {};
  const followers = user?.followerCount || 0;
  const maxBookings = Math.max(...monthlyData.map(d => d.bookings));
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  const kpis = [
    { label: 'Total Bookings', value: '459', icon: Users, change: '+28%', up: true, color: 'brand' },
    { label: 'Revenue Generated', value: '$14,190', icon: DollarSign, change: '+34%', up: true, color: 'green' },
    { label: 'Dinners Hosted', value: '33', icon: UtensilsCrossed, change: '+12%', up: true, color: 'blue' },
    { label: 'Avg Rating', value: infData.avgRating || '4.8', icon: Star, change: '+0.2', up: true, color: 'purple' },
  ];

  const colorMap = {
    brand: { bg: 'bg-brand-50', text: 'text-brand-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Analytics</h1>
          <p className="text-charcoal-400 text-sm mt-1">Track your creator performance and growth.</p>
        </div>
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-card">
          {['1m', '3m', '6m', '1y'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                period === p ? 'bg-brand-500 text-white' : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, change, up, color }) => {
          const c = colorMap[color];
          return (
            <div key={label} className="bg-white rounded-2xl shadow-card p-5">
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

      {/* Bookings Chart */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h2 className="font-bold text-charcoal-900 mb-4">Bookings Over Time</h2>
        <div className="flex items-end gap-3 h-48">
          {monthlyData.map(d => {
            const pct = (d.bookings / maxBookings) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-charcoal-500">{d.bookings}</span>
                <div className="w-full relative" style={{ height: `${pct}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-500 to-brand-400 rounded-t-lg" />
                </div>
                <span className="text-[10px] text-charcoal-400 font-medium">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue + Audience */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-bold text-charcoal-900 mb-4">Revenue Generated</h2>
          <div className="space-y-3">
            {monthlyData.map(d => {
              const pct = (d.revenue / maxRevenue) * 100;
              return (
                <div key={d.month} className="flex items-center gap-3">
                  <span className="text-xs text-charcoal-400 w-8 shrink-0">{d.month}</span>
                  <div className="flex-1 h-6 bg-charcoal-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${pct}%` }}
                    >
                      <span className="text-[10px] font-bold text-white">${d.revenue}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audience Breakdown */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-bold text-charcoal-900 mb-4">Audience Interests</h2>
          <div className="space-y-4">
            {audienceBreakdown.map(a => (
              <div key={a.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-charcoal-700">{a.label}</span>
                  <span className="text-xs font-semibold text-charcoal-500">{a.pct}%</span>
                </div>
                <div className="h-2 bg-charcoal-50 rounded-full overflow-hidden">
                  <div className={`h-full ${a.color} rounded-full`} style={{ width: `${a.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-charcoal-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal-500">Total Reach</span>
              <span className="text-lg font-bold text-charcoal-900">{followers.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Dinners */}
      <div className="bg-white rounded-2xl shadow-card">
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 className="font-bold text-charcoal-900">Top Performing Dinners</h2>
          <Link to="/influencer/dinners" className="text-brand-500 text-xs font-medium hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100">
                <th className="text-left text-xs font-semibold text-charcoal-400 px-5 py-3">Dinner</th>
                <th className="text-left text-xs font-semibold text-charcoal-400 px-5 py-3">Restaurant</th>
                <th className="text-right text-xs font-semibold text-charcoal-400 px-5 py-3">Bookings</th>
                <th className="text-right text-xs font-semibold text-charcoal-400 px-5 py-3">Revenue</th>
                <th className="text-right text-xs font-semibold text-charcoal-400 px-5 py-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {topDinners.map(d => (
                <tr key={d.id} className="border-b border-charcoal-50 hover:bg-cream-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold text-charcoal-900">{d.title}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-charcoal-500">{d.restaurant}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-sm font-semibold text-charcoal-700">{d.bookings}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-sm font-semibold text-green-600">${d.revenue}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Star size={12} className="text-brand-500 fill-brand-500" />
                      <span className="text-sm font-semibold text-charcoal-700">{d.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Growth Milestones */}
      <div className="bg-gradient-to-br from-brand-50 to-cream-100 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award size={24} className="text-brand-500" />
          <h2 className="font-bold text-charcoal-900">Growth Milestones</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white/80 rounded-xl p-4 text-center">
            <Sparkles size={20} className="text-brand-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-charcoal-900">1K Followers</p>
            <p className="text-xs text-green-600 font-medium">Achieved!</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4 text-center">
            <Target size={20} className="text-blue-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-charcoal-900">5K Followers</p>
            <p className="text-xs text-charcoal-400">1,900 to go</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4 text-center">
            <Award size={20} className="text-purple-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-charcoal-900">Top Creator</p>
            <p className="text-xs text-charcoal-400">Keep growing!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerAnalytics;
