import { useState, useEffect } from 'react';
import { restaurantsAPI } from '../../services/api';
import {
  Users, UserPlus, Calendar, DollarSign, Loader, Search,
  Filter, UserCheck, Clock, Crown, Star, Mail, Phone,
  TrendingUp, Award, ChevronRight, Heart,
} from 'lucide-react';

const demoCustomers = [
  { id: 1, user: { id: 'u1', name: 'Ahmed Khan', email: 'ahmed@email.com', avatar: null }, totalBookings: 12, totalSpent: 84000, lastVisit: new Date(Date.now() - 2*86400000).toISOString(), avgPartySize: 3.2, favoriteDinner: 'Italian Night' },
  { id: 2, user: { id: 'u2', name: 'Sara Ali', email: 'sara@email.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' }, totalBookings: 8, totalSpent: 56000, lastVisit: new Date(Date.now() - 5*86400000).toISOString(), avgPartySize: 2.5, favoriteDinner: 'Sushi & Sake' },
  { id: 3, user: { id: 'u3', name: 'Bilal Ahmed', email: 'bilal@email.com', avatar: null }, totalBookings: 5, totalSpent: 42000, lastVisit: new Date(Date.now() - 1*86400000).toISOString(), avgPartySize: 4.0, favoriteDinner: 'Rooftop BBQ' },
  { id: 4, user: { id: 'u4', name: 'Fatima Noor', email: 'fatima@email.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face' }, totalBookings: 1, totalSpent: 3500, lastVisit: new Date(Date.now() - 10*86400000).toISOString(), avgPartySize: 2.0, favoriteDinner: null },
  { id: 5, user: { id: 'u5', name: 'Usman Tariq', email: 'usman@email.com', avatar: null }, totalBookings: 1, totalSpent: 2800, lastVisit: new Date(Date.now() - 15*86400000).toISOString(), avgPartySize: 1.0, favoriteDinner: null },
  { id: 6, user: { id: 'u6', name: 'Ayesha Malik', email: 'ayesha@email.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face' }, totalBookings: 15, totalSpent: 120000, lastVisit: new Date(Date.now() - 0*86400000).toISOString(), avgPartySize: 3.8, favoriteDinner: 'Mediterranean Feast' },
  { id: 7, user: { id: 'u7', name: 'Zain Ul Abideen', email: 'zain@email.com', avatar: null }, totalBookings: 3, totalSpent: 18000, lastVisit: new Date(Date.now() - 7*86400000).toISOString(), avgPartySize: 2.0, favoriteDinner: 'Asian Fusion' },
];

const getTier = (bookings) => {
  if (bookings >= 10) return { label: 'VIP', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Crown };
  if (bookings >= 5) return { label: 'Gold', color: 'bg-brand-50 text-brand-700 border-brand-200', icon: Award };
  if (bookings >= 2) return { label: 'Regular', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: Star };
  return { label: 'New', color: 'bg-green-50 text-green-600 border-green-200', icon: UserPlus };
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('bookings');

  useEffect(() => {
    restaurantsAPI.getCustomers().then(res => {
      const items = res.data?.data || [];
      setCustomers(items.length > 0 ? items : demoCustomers);
    }).catch(() => {
      setCustomers(demoCustomers);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    const matchesSearch = c.user?.name?.toLowerCase().includes(search.toLowerCase()) || c.user?.email?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'new') return c.totalBookings <= 1;
    if (filter === 'returning') return c.totalBookings >= 2 && c.totalBookings < 10;
    if (filter === 'vip') return c.totalBookings >= 10;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'bookings') return b.totalBookings - a.totalBookings;
    if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
    if (sortBy === 'recent') return new Date(b.lastVisit) - new Date(a.lastVisit);
    return 0;
  });

  const totalCustomers = customers.length;
  const newCount = customers.filter(c => c.totalBookings <= 1).length;
  const vipCount = customers.filter(c => c.totalBookings >= 10).length;
  const totalSpent = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal-900">Customer Management</h1>
        <p className="text-charcoal-400 text-sm mt-1">Track guest history, loyalty, and engagement.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Users size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{totalCustomers}</p>
            <p className="text-xs text-charcoal-400">Total Customers</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <UserPlus size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{newCount}</p>
            <p className="text-xs text-charcoal-400">New Customers</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Crown size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{vipCount}</p>
            <p className="text-xs text-charcoal-400">VIP Members</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <DollarSign size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">Rs. {totalSpent.toLocaleString()}</p>
            <p className="text-xs text-charcoal-400">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'Everyone' },
            { id: 'new', label: 'New' },
            { id: 'returning', label: 'Regulars' },
            { id: 'vip', label: 'VIP' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f.id ? 'bg-brand-500 text-white' : 'bg-white border border-charcoal-100 text-charcoal-500 hover:border-charcoal-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs sm:ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2 bg-white border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 w-full" placeholder="Search by name or email..." />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm bg-white border border-charcoal-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300 text-charcoal-600 shrink-0">
          <option value="bookings">Most Bookings</option>
          <option value="spent">Most Spent</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-charcoal-100">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Tier</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Bookings</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Spent</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Last Visit</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Favorite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-50">
                {filtered.map((c) => {
                  const tier = getTier(c.totalBookings);
                  const TierIcon = tier.icon;
                  return (
                    <tr key={c.user.id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0 overflow-hidden">
                            {c.user.avatar ? (
                              <img src={c.user.avatar} alt={c.user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              c.user.name?.charAt(0)?.toUpperCase() || 'C'
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-charcoal-900">{c.user.name}</p>
                            <p className="text-[10px] text-charcoal-400">{c.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${tier.color}`}>
                          <TierIcon size={10} /> {tier.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-charcoal-900">{c.totalBookings}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-charcoal-900">Rs. {(c.totalSpent || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 text-sm text-charcoal-600">
                          <Clock size={13} className="text-charcoal-400" />
                          {c.lastVisit ? new Date(c.lastVisit).toLocaleDateString() : '—'}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-charcoal-500">{c.favoriteDinner || '—'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Users size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">No customers found</p>
          <p className="text-charcoal-400 text-sm mt-1">Customers who book dinners will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
