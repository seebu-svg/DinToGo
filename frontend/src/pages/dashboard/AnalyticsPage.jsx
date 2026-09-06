import { useState, useEffect } from 'react';
import { analyticsAPI, restaurantsAPI } from '../../services/api';
import {
  BarChart3, DollarSign, CalendarCheck, Users, Loader, TrendingUp,
  TrendingDown, ArrowUpRight, ArrowDownRight, Eye, Star,
  UtensilsCrossed, Percent, Clock, ChefHat,
} from 'lucide-react';

const demoMonthlyRevenue = [
  { month: '2026-03-01', revenue: 45000 },
  { month: '2026-04-01', revenue: 62000 },
  { month: '2026-05-01', revenue: 38000 },
  { month: '2026-06-01', revenue: 78000 },
  { month: '2026-07-01', revenue: 95000 },
  { month: '2026-08-01', revenue: 112000 },
];

const demoTopDinners = [
  { title: 'Italian Night', guests: 48, revenue: 168000, rating: 4.8 },
  { title: 'Sushi & Sake Experience', guests: 32, revenue: 176000, rating: 4.7 },
  { title: 'Rooftop BBQ Evening', guests: 56, revenue: 156800, rating: 4.9 },
  { title: 'Mediterranean Feast', guests: 40, revenue: 128000, rating: 4.6 },
  { title: 'Wine & Cheese Social', guests: 28, revenue: 112000, rating: 4.5 },
];

const demoPeakHours = [
  { hour: '5 PM', bookings: 8 },
  { hour: '6 PM', bookings: 18 },
  { hour: '7 PM', bookings: 32 },
  { hour: '8 PM', bookings: 28 },
  { hour: '9 PM', bookings: 15 },
  { hour: '10 PM', bookings: 6 },
];

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('6m');

  useEffect(() => {
    restaurantsAPI.getMy().then(restRes => {
      const restId = restRes.data?.data?.id;
      if (restId) return analyticsAPI.getRestaurant(restId);
      throw new Error('No restaurant');
    }).then(res => {
      setAnalytics(res.data?.data);
    }).catch(() => {
      // Use demo data
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Revenue', value: `Rs. ${(analytics?.totalRevenue || 630000).toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-600', change: '+18%', up: true },
    { label: 'Total Bookings', value: (analytics?.totalReservations || 284).toString(), icon: CalendarCheck, color: 'bg-blue-50 text-blue-600', change: '+12%', up: true },
    { label: 'Avg Occupancy', value: `${analytics?.avgOccupancy || 78}%`, icon: Users, color: 'bg-brand-50 text-brand-600', change: '+5%', up: true },
    { label: 'Avg Rating', value: (analytics?.avgRating || 4.7).toString(), icon: Star, color: 'bg-amber-50 text-amber-600', change: '-0.1', up: false },
  ];

  const maxRevenue = Math.max(...demoMonthlyRevenue.map(m => m.revenue));
  const maxBookings = Math.max(...demoPeakHours.map(h => h.bookings));

  if (loading) {
    return <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900">Analytics</h1>
          <p className="text-charcoal-400 text-sm mt-1">Revenue, bookings, and performance insights.</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-charcoal-100 rounded-xl p-1">
          {['1m', '3m', '6m', '1y'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                period === p ? 'bg-brand-500 text-white' : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              {p === '1m' ? '1 Month' : p === '3m' ? '3 Months' : p === '6m' ? '6 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, change, up }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-500'}`}>
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-charcoal-900">{value}</p>
            <p className="text-xs text-charcoal-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-charcoal-900">Revenue Trend</h3>
            <p className="text-xs text-charcoal-400 mt-0.5">Monthly revenue over the selected period</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-charcoal-500">
            <div className="w-3 h-3 rounded-sm bg-brand-500" /> Revenue
          </div>
        </div>
        <div className="flex items-end gap-3 h-52">
          {demoMonthlyRevenue.map((month, i) => {
            const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
            const isLast = i === demoMonthlyRevenue.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-charcoal-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  Rs. {month.revenue.toLocaleString()}
                </span>
                <div className="w-full relative rounded-t-xl overflow-hidden" style={{ height: `${Math.max(height, 4)}%` }}>
                  <div className={`absolute inset-0 rounded-t-xl transition-colors ${isLast ? 'bg-brand-500' : 'bg-brand-300 group-hover:bg-brand-400'}`} />
                </div>
                <span className="text-[10px] text-charcoal-400">
                  {new Date(month.month).toLocaleDateString('en', { month: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <div className="card p-6">
          <h3 className="font-semibold text-charcoal-900 mb-1">Peak Hours</h3>
          <p className="text-xs text-charcoal-400 mb-4">Most popular dining times</p>
          <div className="space-y-3">
            {demoPeakHours.map(({ hour, bookings }) => (
              <div key={hour} className="flex items-center gap-3">
                <span className="text-xs text-charcoal-500 w-12 shrink-0">{hour}</span>
                <div className="flex-1 h-6 bg-charcoal-50 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-brand-400 rounded-lg flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${(bookings / maxBookings) * 100}%` }}
                  >
                    {bookings > 10 && <span className="text-[10px] font-bold text-white">{bookings}</span>}
                  </div>
                </div>
                {bookings <= 10 && <span className="text-[10px] text-charcoal-400 w-6">{bookings}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="card p-6">
          <h3 className="font-semibold text-charcoal-900 mb-1">Reservation Status</h3>
          <p className="text-xs text-charcoal-400 mb-4">Breakdown by current status</p>
          <div className="space-y-3">
            {[
              { status: 'Confirmed', count: 42, color: 'bg-blue-500', pct: 35 },
              { status: 'Completed', count: 58, color: 'bg-green-500', pct: 48 },
              { status: 'Pending', count: 12, color: 'bg-yellow-500', pct: 10 },
              { status: 'Cancelled', count: 8, color: 'bg-red-500', pct: 7 },
            ].map(({ status, count, color, pct }) => (
              <div key={status} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${color} shrink-0`} />
                <span className="text-xs text-charcoal-600 w-20">{status}</span>
                <div className="flex-1 h-2 bg-charcoal-100 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-charcoal-700 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-charcoal-100 flex items-center justify-between">
            <span className="text-xs text-charcoal-400">Total Reservations</span>
            <span className="text-sm font-bold text-charcoal-900">120</span>
          </div>
        </div>
      </div>

      {/* Top Performing Dinners */}
      <div className="card p-6">
        <h3 className="font-semibold text-charcoal-900 mb-1">Top Performing Dinners</h3>
        <p className="text-xs text-charcoal-400 mb-4">Best sellers by revenue and ratings</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100">
                <th className="text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider pb-3">Dinner</th>
                <th className="text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider pb-3">Guests</th>
                <th className="text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider pb-3">Revenue</th>
                <th className="text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider pb-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {demoTopDinners.map((d, i) => (
                <tr key={i} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-charcoal-300 w-5">#{i + 1}</span>
                      <span className="text-sm font-medium text-charcoal-900">{d.title}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-charcoal-600 flex items-center gap-1"><Users size={13} /> {d.guests}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm font-semibold text-charcoal-900">Rs. {d.revenue.toLocaleString()}</span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-sm">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="font-medium text-charcoal-700">{d.rating}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
