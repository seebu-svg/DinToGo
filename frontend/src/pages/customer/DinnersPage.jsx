import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dinnersAPI } from '../../services/api';
import DinnerCard from '../../components/DinnerCard';
import EmptyState from '../../components/EmptyState';
import {
  UtensilsCrossed, Filter, Loader, Plus, Calendar, MapPin,
  Users, Star, Flame, ChevronDown, Search, SlidersHorizontal,
  Grid, List, X, Clock,
} from 'lucide-react';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';

const categories = [
  { label: 'All', value: '', icon: UtensilsCrossed },
  { label: 'Casual', value: 'casual', icon: UtensilsCrossed },
  { label: 'Fine Dining', value: 'fine-dining', icon: Star },
  { label: 'Themed', value: 'themed', icon: Flame },
  { label: 'Networking', value: 'networking', icon: Users },
  { label: 'Influencer', value: 'influencer', icon: Star },
  { label: 'Pop-Up', value: 'pop-up', icon: UtensilsCrossed },
  { label: 'Celebration', value: 'celebration', icon: Flame },
];

const timeFilters = [
  { label: 'Any Time', value: '' },
  { label: 'Tonight', value: 'tonight' },
  { label: 'This Weekend', value: 'weekend' },
  { label: 'Next Week', value: 'nextweek' },
  { label: 'This Month', value: 'month' },
];

const sortOptions = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Date (Earliest)', value: 'date' },
  { label: 'Date (Latest)', value: '-date' },
  { label: 'Price (Low to High)', value: 'price' },
  { label: 'Price (High to Low)', value: '-price' },
  { label: 'Most Popular', value: '-currentGuests' },
];

const DinnersPage = () => {
  const [dinners, setDinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', category: '', sort: '-createdAt' });
  const [timeFilter, setTimeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDinners();
  }, [filters, page, timeFilter, search]);

  const fetchDinners = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      if (search) params.search = search;

      // Time-based filters
      const now = new Date();
      if (timeFilter === 'tonight') {
        params.dateFrom = startOfDay(now).toISOString();
        params.dateTo = endOfDay(now).toISOString();
      } else if (timeFilter === 'weekend') {
        const daysUntilSat = (6 - now.getDay()) % 7 || 7;
        const sat = startOfDay(addDays(now, daysUntilSat));
        const sun = endOfDay(addDays(sat, 1));
        params.dateFrom = sat.toISOString();
        params.dateTo = sun.toISOString();
      } else if (timeFilter === 'nextweek') {
        params.dateFrom = startOfDay(addDays(now, 1)).toISOString();
        params.dateTo = endOfDay(addDays(now, 7)).toISOString();
      } else if (timeFilter === 'month') {
        params.dateFrom = startOfDay(now).toISOString();
        params.dateTo = endOfDay(addDays(now, 30)).toISOString();
      }

      Object.keys(params).forEach((k) => { if (!params[k] && params[k] !== 0) delete params[k]; });
      const { data } = await dinnersAPI.getAll(params);
      setDinners(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const activeFiltersCount = [filters.type, filters.category, timeFilter].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3 mb-2">
            <UtensilsCrossed className="text-brand-500" /> All Dinners
          </h1>
          <p className="text-charcoal-400">{total} experiences available</p>
        </div>
        <Link
          to="/dinners/create"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Create Dinner
        </Link>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search dinners by name, cuisine, or location..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-500">
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${
            showFilters || activeFiltersCount > 0
              ? 'bg-brand-50 border-brand-200 text-brand-600'
              : 'bg-white border-charcoal-100 text-charcoal-600 hover:border-charcoal-300'
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {/* Time Filters (pill row) */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {timeFilters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => { setTimeFilter(value); setPage(1); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              timeFilter === value
                ? 'bg-brand-500 text-white'
                : 'bg-white text-charcoal-500 border border-charcoal-100 hover:border-brand-300'
            }`}
          >
            {value === 'tonight' && <Flame size={12} />}
            {value === 'weekend' && <Calendar size={12} />}
            {value === 'nextweek' && <Clock size={12} />}
            {label}
          </button>
        ))}
      </div>

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-charcoal-100 rounded-2xl p-5 mb-6 shadow-soft space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wide mb-1.5">Type</label>
              <select
                value={filters.type}
                onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                <option value="">All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wide mb-1.5">Category</label>
              <select
                value={filters.category}
                onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                {categories.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wide mb-1.5">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="w-full px-3 py-2 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                {sortOptions.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Clear All */}
            <div className="flex items-end">
              <button
                onClick={() => { setFilters({ type: '', category: '', sort: '-createdAt' }); setTimeFilter(''); setSearch(''); setPage(1); }}
                className="text-sm text-brand-500 hover:text-brand-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => { setFilters({ ...filters, category: value }); setPage(1); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filters.category === value
                ? 'bg-charcoal-900 text-white'
                : 'bg-white text-charcoal-500 border border-charcoal-100 hover:border-charcoal-300'
            }`}
          >
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : dinners.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dinners.map((d) => <DinnerCard key={d.id} dinner={d} />)}
          </div>

          {/* Pagination */}
          {total > 12 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-outline text-sm px-5 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(total / 12)) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === page ? 'bg-brand-500 text-white' : 'text-charcoal-500 hover:bg-cream-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(page + 1)}
                disabled={dinners.length < 12}
                className="btn-outline text-sm px-5 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={UtensilsCrossed}
          title="No dinners found"
          description="Try adjusting your filters or search terms."
        />
      )}
    </div>
  );
};

export default DinnersPage;
