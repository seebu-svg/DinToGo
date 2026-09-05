import { useState, useEffect } from 'react';
import { analyticsAPI, restaurantsAPI } from '../../services/api';
import StatCard from '../../components/StatCard';
import { BarChart3, DollarSign, CalendarCheck, Users, Loader, TrendingUp } from 'lucide-react';

const AnalyticsPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data: restData } = await restaurantsAPI.getMy();
      setRestaurant(restData.data);
      const { data } = await analyticsAPI.getRestaurant(restData.data.id);
      setAnalytics(data.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3">
          <BarChart3 className="text-brand-500" /> Analytics
        </h1>
        <p className="text-charcoal-400 mt-1">Revenue, bookings, and occupancy insights.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${(analytics?.totalRevenue || 0).toLocaleString()}`} color="brand" />
        <StatCard icon={TrendingUp} label="30-Day Revenue" value={`$${(analytics?.recentRevenue || 0).toLocaleString()}`} color="green" />
        <StatCard icon={CalendarCheck} label="Total Bookings" value={analytics?.totalReservations || 0} color="blue" />
        <StatCard icon={Users} label="Avg Occupancy" value={`${analytics?.avgOccupancy || 0}%`} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="font-semibold text-charcoal-900 mb-4">Capacity Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-charcoal-500">Total Capacity</span>
                <span className="font-semibold">{analytics?.totalCapacity || 0} seats</span>
              </div>
              <div className="h-3 bg-charcoal-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${analytics?.avgOccupancy || 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-charcoal-500">Booked</span>
                <span className="font-semibold">{analytics?.totalBooked || 0} seats</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-charcoal-900 mb-4">Reservation Status Breakdown</h3>
          {analytics?.statusBreakdown ? (
            <div className="space-y-3">
              {Object.entries(analytics.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-charcoal-600 capitalize">{status}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-charcoal-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-400 rounded-full" style={{ width: `${(count / (analytics?.totalReservations || 1)) * 100}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-charcoal-800 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-charcoal-400 text-sm text-center py-8">No data yet</p>
          )}
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="card p-6">
        <h3 className="font-semibold text-charcoal-900 mb-4">Monthly Revenue (Last 6 Months)</h3>
        {analytics?.monthlyRevenue?.length > 0 ? (
          <div className="flex items-end gap-4 h-48">
            {analytics.monthlyRevenue.map((month, i) => {
              const maxRev = Math.max(...analytics.monthlyRevenue.map((m) => m.revenue));
              const height = maxRev > 0 ? (month.revenue / maxRev) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-charcoal-500">${month.revenue.toLocaleString()}</span>
                  <div className="w-full bg-brand-100 rounded-t-xl relative" style={{ height: `${Math.max(height, 4)}%` }}>
                    <div className="absolute inset-0 bg-brand-500 rounded-t-xl" style={{ opacity: 0.7 + (i / analytics.monthlyRevenue.length) * 0.3 }} />
                  </div>
                  <span className="text-xs text-charcoal-400">{new Date(month.month).toLocaleDateString('en', { month: 'short', year: '2-digit' })}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-charcoal-400 text-sm text-center py-12">No revenue data available yet</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
