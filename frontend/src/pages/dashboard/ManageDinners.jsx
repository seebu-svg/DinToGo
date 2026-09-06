import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dinnersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  UtensilsCrossed, Plus, Loader, Calendar, Users, MapPin,
  Clock, Eye, Edit, Trash2, Copy, MoreHorizontal, TrendingUp,
  DollarSign, Star, ChevronRight, Search, Filter, Sparkles,
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, isFuture } from 'date-fns';

const tabs = [
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'draft', label: 'Drafts', icon: Edit },
  { id: 'past', label: 'Past', icon: Clock },
  { id: 'all', label: 'All', icon: UtensilsCrossed },
];

const demoDinners = [
  {
    id: 'd1', title: 'Italian Night at La Terrazza', status: 'scheduled',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    date: new Date(Date.now() + 2 * 86400000).toISOString(), time: '7:00 PM',
    location: 'La Terrazza, Gulberg', currentGuests: 6, maxGuests: 10,
    price: 3500, revenue: 21000, rating: null,
  },
  {
    id: 'd2', title: 'Sushi & Sake Experience', status: 'scheduled',
    coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop',
    date: new Date(Date.now() + 5 * 86400000).toISOString(), time: '8:00 PM',
    location: 'Miyabi Sushi, DHA', currentGuests: 4, maxGuests: 8,
    price: 5500, revenue: 22000, rating: null,
  },
  {
    id: 'd3', title: 'Rooftop BBQ Evening', status: 'active',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    date: new Date(Date.now() + 1 * 86400000).toISOString(), time: '6:30 PM',
    location: 'The Grill House, Johar Town', currentGuests: 10, maxGuests: 12,
    price: 2800, revenue: 28000, rating: null,
  },
  {
    id: 'd4', title: 'Wine & Cheese Social', status: 'draft',
    coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
    date: new Date(Date.now() + 10 * 86400000).toISOString(), time: '7:30 PM',
    location: 'The Vault Cafe, Cantt', currentGuests: 0, maxGuests: 8,
    price: 4000, revenue: 0, rating: null,
  },
  {
    id: 'd5', title: 'Pasta Making Masterclass', status: 'draft',
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    date: new Date(Date.now() + 14 * 86400000).toISOString(), time: '5:00 PM',
    location: 'La Terrazza, Gulberg', currentGuests: 0, maxGuests: 6,
    price: 6000, revenue: 0, rating: null,
  },
  {
    id: 'd6', title: 'Mediterranean Feast', status: 'completed',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop',
    date: new Date(Date.now() - 3 * 86400000).toISOString(), time: '7:00 PM',
    location: 'La Terrazza, Gulberg', currentGuests: 8, maxGuests: 8,
    price: 3200, revenue: 25600, rating: 4.8,
  },
  {
    id: 'd7', title: 'Asian Fusion Night', status: 'completed',
    coverImage: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&h=400&fit=crop',
    date: new Date(Date.now() - 10 * 86400000).toISOString(), time: '7:30 PM',
    location: 'Sushiya, MM Alam Road', currentGuests: 6, maxGuests: 8,
    price: 4500, revenue: 27000, rating: 4.5,
  },
  {
    id: 'd8', title: 'Sunday Brunch Special', status: 'completed',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    date: new Date(Date.now() - 17 * 86400000).toISOString(), time: '11:00 AM',
    location: 'Green Bowl, Cantt', currentGuests: 10, maxGuests: 12,
    price: 2500, revenue: 25000, rating: 4.6,
  },
];

const ManageDinners = () => {
  const { user } = useAuth();
  const [dinners, setDinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    dinnersAPI.myHostedDinners().then(res => {
      const items = res.data?.data || [];
      setDinners(items.length > 0 ? items : demoDinners);
    }).catch(() => {
      setDinners(demoDinners);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = dinners.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeTab === 'upcoming') return isFuture(new Date(d.date)) && (d.status === 'scheduled' || d.status === 'active');
    if (activeTab === 'draft') return d.status === 'draft';
    if (activeTab === 'past') return d.status === 'completed' || isPast(new Date(d.date));
    return true;
  });

  const stats = {
    upcoming: dinners.filter(d => isFuture(new Date(d.date)) && d.status !== 'draft' && d.status !== 'completed').length,
    drafts: dinners.filter(d => d.status === 'draft').length,
    totalRevenue: dinners.reduce((s, d) => s + (d.revenue || 0), 0),
    avgOccupancy: dinners.length > 0
      ? Math.round(dinners.reduce((s, d) => s + (d.currentGuests / d.maxGuests * 100), 0) / dinners.length)
      : 0,
  };

  const getDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'EEE, MMM d');
  };

  const statusConfig = {
    scheduled: { label: 'Scheduled', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    active: { label: 'Live', color: 'bg-green-50 text-green-600 border-green-200' },
    draft: { label: 'Draft', color: 'bg-charcoal-50 text-charcoal-500 border-charcoal-200' },
    completed: { label: 'Completed', color: 'bg-charcoal-100 text-charcoal-600 border-charcoal-200' },
    full: { label: 'Full', color: 'bg-brand-50 text-brand-600 border-brand-200' },
    cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-500 border-red-200' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900">Manage Dinners</h1>
          <p className="text-charcoal-400 text-sm mt-1">Create, schedule, and manage your dining events.</p>
        </div>
        <Link to="/dinners/create" className="btn-primary flex items-center gap-2 shrink-0">
          <Plus size={18} /> Create Dinner
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{stats.upcoming}</p>
            <p className="text-xs text-charcoal-400">Upcoming</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <DollarSign size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">Rs. {stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-charcoal-400">Total Revenue</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Users size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{stats.avgOccupancy}%</p>
            <p className="text-xs text-charcoal-400">Avg Occupancy</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Edit size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{stats.drafts}</p>
            <p className="text-xs text-charcoal-400">Drafts</p>
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-1 bg-white border border-charcoal-100 rounded-xl p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dinners..."
            className="pl-9 pr-4 py-2 bg-white border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Dinner List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((dinner) => {
            const sc = statusConfig[dinner.status] || statusConfig.scheduled;
            const occupancy = Math.round((dinner.currentGuests / dinner.maxGuests) * 100);
            return (
              <div key={dinner.id} className="card overflow-hidden group">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 h-32 sm:h-auto relative overflow-hidden shrink-0">
                    <img
                      src={dinner.coverImage || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop'}
                      alt={dinner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {dinner.rating && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-charcoal-700">{dinner.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="font-semibold text-charcoal-900 truncate">{dinner.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-400 mt-1.5">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {getDateLabel(dinner.date)}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {dinner.time || 'TBD'}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {dinner.location}</span>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        {/* Occupancy */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs">
                            <Users size={13} className="text-charcoal-400" />
                            <span className="text-charcoal-700 font-medium">{dinner.currentGuests}/{dinner.maxGuests}</span>
                          </div>
                          <div className="w-20 h-1.5 bg-charcoal-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${occupancy >= 90 ? 'bg-green-500' : occupancy >= 50 ? 'bg-brand-500' : 'bg-charcoal-300'}`}
                              style={{ width: `${occupancy}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-charcoal-700">Rs. {dinner.price?.toLocaleString()}</span>
                        {dinner.revenue > 0 && (
                          <span className="text-xs text-green-600 font-medium">Rs. {dinner.revenue.toLocaleString()} earned</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center gap-2 shrink-0">
                      <Link
                        to={`/dinners/${dinner.id}`}
                        className="flex items-center gap-1.5 text-xs font-medium text-brand-500 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-xl transition-colors"
                      >
                        <Eye size={13} /> View
                      </Link>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-charcoal-500 hover:text-charcoal-700 bg-charcoal-50 hover:bg-charcoal-100 px-3 py-2 rounded-xl transition-colors">
                        <Edit size={13} /> Edit
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <UtensilsCrossed size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">
            {activeTab === 'upcoming' ? 'No upcoming dinners' : activeTab === 'draft' ? 'No draft dinners' : 'No dinners found'}
          </p>
          <p className="text-charcoal-400 text-sm mt-1">
            {activeTab === 'upcoming' ? 'Create a new dinner event to start accepting reservations.' : 'Try a different tab or search term.'}
          </p>
          <Link to="/dinners/create" className="inline-flex items-center gap-2 mt-4 btn-primary text-sm">
            <Plus size={16} /> Create Dinner
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManageDinners;
