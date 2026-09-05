import { useState, useEffect } from 'react';
import { restaurantsAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { Users, UserPlus, Calendar, DollarSign, Loader, Search, Filter, UserCheck, Clock } from 'lucide-react';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, new, returning

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await restaurantsAPI.getCustomers();
      setCustomers(data.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter((c) => {
    const matchesSearch = c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                          c.user?.email?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'new') return c.totalBookings === 1;
    if (filter === 'returning') return c.totalBookings > 1;
    return true;
  });

  const newCount = customers.filter(c => c.totalBookings === 1).length;
  const returningCount = customers.filter(c => c.totalBookings > 1).length;
  const totalSpent = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3">
          <Users className="text-brand-500" /> Customer Management
        </h1>
        <p className="text-charcoal-400 mt-1">Track guest history, new and returning customers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-charcoal-100/50">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
            <Users size={20} className="text-brand-600" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900">{customers.length}</p>
          <p className="text-xs text-charcoal-400">Total Customers</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-charcoal-100/50">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
            <UserPlus size={20} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900">{newCount}</p>
          <p className="text-xs text-charcoal-400">New Customers</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-charcoal-100/50">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
            <UserCheck size={20} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900">{returningCount}</p>
          <p className="text-xs text-charcoal-400">Returning</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-charcoal-100/50">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center mb-3">
            <DollarSign size={20} className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900">${totalSpent.toLocaleString()}</p>
          <p className="text-xs text-charcoal-400">Total Revenue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Search by name or email..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-charcoal-400" />
          {['all', 'new', 'returning'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-brand-500 text-white'
                  : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-500 uppercase">Bookings</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-500 uppercase">Spent</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-500 uppercase">Last Visit</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-50">
                {filtered.map((c) => (
                  <tr key={c.user.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                          {c.user.avatar ? (
                            <img src={c.user.avatar} alt={c.user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            c.user.name?.charAt(0)?.toUpperCase() || 'C'
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-charcoal-900">{c.user.name}</p>
                          <p className="text-xs text-charcoal-400">{c.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-charcoal-900">{c.totalBookings}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-charcoal-900">${(c.totalSpent || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-charcoal-600">
                        <Clock size={14} />
                        {c.lastVisit ? new Date(c.lastVisit).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${c.totalBookings > 1 ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}`}>
                        {c.totalBookings > 1 ? 'Returning' : 'New'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Customers who book dinners at your restaurant will appear here."
        />
      )}
    </div>
  );
};

export default CustomersPage;
